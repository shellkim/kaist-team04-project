// 상태 관리
const state = {
  currentInput: '',
  extractedTreatments: [],
  missingRequired: [],
  selectedForSave: new Set(),
  editingIndex: null,
  savedRecords: []
};

// DOM 요소
const userInputEl = document.getElementById('user-input');
const extractBtnEl = document.getElementById('extract-btn');
const errorMessageEl = document.getElementById('error-message');
const reaskSectionEl = document.getElementById('reask-section');
const resultSectionEl = document.getElementById('result-section');
const tableBodyEl = document.getElementById('table-body');
const saveBtnEl = document.getElementById('save-btn');
const resetBtnEl = document.getElementById('reset-btn');
const editModalEl = document.getElementById('edit-modal');
const editForm = document.getElementById('edit-form');
const saveResultEl = document.getElementById('save-result');
const recordsListEl = document.getElementById('records-list');
const tabBtnsEl = document.querySelectorAll('.tab-btn');
const apiStatusEl = document.getElementById('api-status');
const apiStatusTextEl = document.getElementById('api-status-text');

// 초기화
document.addEventListener('DOMContentLoaded', async () => {
  await checkApiStatus();
  loadSavedRecords();
  setupEventListeners();
});

// 이벤트 리스너 설정
function setupEventListeners() {
  extractBtnEl.addEventListener('click', handleExtract);
  saveBtnEl.addEventListener('click', handleSave);
  resetBtnEl.addEventListener('click', resetForm);

  // 탭 전환
  tabBtnsEl.forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  // 모달
  document.querySelector('.modal-close').addEventListener('click', closeEditModal);
  document.getElementById('edit-cancel-btn').addEventListener('click', closeEditModal);
  document.getElementById('edit-save-btn').addEventListener('click', handleEditSave);

  // 재질문
  document.getElementById('proceed-to-table-btn').addEventListener('click', proceedToTable);
}

// API 상태 확인
async function checkApiStatus() {
  try {
    const response = await fetch('/api/health');
    const data = await response.json();

    if (data.apiKeyConfigured) {
      apiStatusEl.classList.add('connected');
      apiStatusTextEl.textContent = '✅ API 준비 완료';
    } else {
      apiStatusEl.classList.add('disconnected');
      apiStatusTextEl.textContent = '⚠️ API 미설정';
      showError('API 키가 설정되지 않았습니다. 관리자에게 문의해주세요.');
    }
  } catch (error) {
    apiStatusEl.classList.add('disconnected');
    apiStatusTextEl.textContent = '❌ 연결 오류';
    console.error('헬스 체크 오류:', error);
  }
}

// AI 추출 처리
async function handleExtract() {
  const input = userInputEl.value.trim();

  if (!input) {
    showError('시술 경험을 입력해주세요.');
    return;
  }

  state.currentInput = input;
  setButtonLoading(true);
  clearMessages();
  hideAllSections();

  try {
    const response = await fetch('/api/extract', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_input: input })
    });

    const data = await response.json();

    if (!response.ok) {
      handleApiError(data);
      return;
    }

    state.extractedTreatments = data.treatments || [];
    state.missingRequired = data.missing_required || [];

    if (state.missingRequired.length > 0) {
      showReaskSection();
    } else {
      showResultSection();
    }
  } catch (error) {
    showError('AI 서버 연결 실패. 잠시 후 다시 시도해주세요.');
    console.error('추출 오류:', error);
  } finally {
    setButtonLoading(false);
  }
}

// API 오류 처리
function handleApiError(data) {
  let errorMsg = data.error || 'AI 서버 오류가 발생했습니다.';

  if (data.hint) {
    errorMsg += `\n\n${data.hint}`;
  }

  if (data.retryable) {
    errorMsg += '\n\n다시 시도해주세요.';
  } else {
    errorMsg += '\n\n관리자에게 문의해주세요.';
  }

  showError(errorMsg);
}

// 재질문 섹션 표시
function showReaskSection() {
  const container = document.getElementById('reask-questions');
  container.innerHTML = '';

  state.missingRequired.forEach((missing, idx) => {
    const treatment = state.extractedTreatments[missing.treatment_index];
    const div = document.createElement('div');
    div.className = 'reask-question';

    const label = document.createElement('label');
    label.textContent = `${missing.suggested_question}`;

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = missing.suggested_question;
    input.dataset.treatmentIndex = missing.treatment_index;
    input.dataset.field = missing.missing_field;

    div.appendChild(label);
    div.appendChild(input);
    container.appendChild(div);
  });

  reaskSectionEl.style.display = 'block';
}

// 재질문 응답 후 결과 테이블로 진행
function proceedToTable() {
  const inputs = document.querySelectorAll('.reask-question input');

  // 정보 부재를 나타내는 키워드 (대소문자 구분 안 함)
  const noInfoKeywords = [
    '기억나지 않아', '기억 안 나', '기억이 안 나', '생각 안 나',
    '모르겠어', '모르는데', '모를 것 같은데', '잘 모르겠어',
    '까먹었어', '다 까먹었어', '어떤 것인지 기억 안 나',
    '뭐였는지 모르겠어', '뭐였는지 기억 안 나'
  ];

  // 정보 부재 여부 판단
  function isNoInfoResponse(text) {
    const lowerText = text.toLowerCase();
    return noInfoKeywords.some(keyword => lowerText.includes(keyword));
  }

  inputs.forEach(input => {
    const treatmentIdx = parseInt(input.dataset.treatmentIndex);
    const field = input.dataset.field;
    const value = input.value.trim();

    // 사용자가 실제 정보를 제공한 경우만 업데이트
    // 정보를 모른다는 응답이면 해당 필드는 미입력 상태로 유지
    if (value && !isNoInfoResponse(value)) {
      state.extractedTreatments[treatmentIdx][field] = value;
    }
    // else: 정보 부재 응답이거나 빈 응답 → 필드는 업데이트하지 않음 (미입력 유지)
  });

  state.missingRequired = [];
  reaskSectionEl.style.display = 'none';
  showResultSection();
}

// 결과 섹션 표시
function showResultSection() {
  state.selectedForSave.clear();
  renderTreatmentsTable();
  resultSectionEl.style.display = 'block';
}

// 치료 목록 테이블 렌더링
function renderTreatmentsTable() {
  tableBodyEl.innerHTML = '';

  state.extractedTreatments.forEach((treatment, index) => {
    const row = document.createElement('tr');

    const checkboxCell = document.createElement('td');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = state.selectedForSave.has(index);
    checkbox.addEventListener('change', (e) => {
      if (e.target.checked) {
        state.selectedForSave.add(index);
      } else {
        state.selectedForSave.delete(index);
      }
    });
    checkboxCell.appendChild(checkbox);

    const nameCell = document.createElement('td');
    nameCell.className = 'cell-required';
    nameCell.textContent = treatment.treatment_name || '(미입력)';
    if (!treatment.treatment_name) nameCell.className += ' cell-empty';

    const dateCell = document.createElement('td');
    dateCell.className = 'cell-required';
    dateCell.textContent = treatment.treatment_date || '(미입력)';
    if (!treatment.treatment_date) dateCell.className += ' cell-empty';

    const costCell = document.createElement('td');
    costCell.textContent = treatment.cost ? `${treatment.cost}원` : '(미입력)';
    if (!treatment.cost) costCell.className = 'cell-empty';

    const painCell = document.createElement('td');
    painCell.textContent = treatment.pain_level || '(미입력)';
    if (!treatment.pain_level) painCell.className = 'cell-empty';

    const effectCell = document.createElement('td');
    effectCell.textContent = treatment.effect || '(미입력)';
    if (!treatment.effect) effectCell.className = 'cell-empty';

    const satisfactionCell = document.createElement('td');
    satisfactionCell.textContent = treatment.satisfaction ? `${treatment.satisfaction}/5` : '(미입력)';
    if (!treatment.satisfaction) satisfactionCell.className = 'cell-empty';

    const actionCell = document.createElement('td');
    const editBtn = document.createElement('button');
    editBtn.textContent = '수정';
    editBtn.className = 'btn btn-small btn-secondary';
    editBtn.addEventListener('click', () => openEditModal(index));
    actionCell.appendChild(editBtn);

    row.appendChild(checkboxCell);
    row.appendChild(nameCell);
    row.appendChild(dateCell);
    row.appendChild(costCell);
    row.appendChild(painCell);
    row.appendChild(effectCell);
    row.appendChild(satisfactionCell);
    row.appendChild(actionCell);

    tableBodyEl.appendChild(row);
  });
}

// 수정 모달 오픈
function openEditModal(index) {
  state.editingIndex = index;
  const treatment = state.extractedTreatments[index];

  document.getElementById('edit-treatment-name').value = treatment.treatment_name || '';
  document.getElementById('edit-treatment-date').value = treatment.treatment_date || '';
  document.getElementById('edit-cost').value = treatment.cost || '';
  document.getElementById('edit-pain-level').value = treatment.pain_level || '';
  document.getElementById('edit-effect').value = treatment.effect || '';
  document.getElementById('edit-satisfaction').value = treatment.satisfaction || '';

  document.getElementById('edit-error').style.display = 'none';
  editModalEl.style.display = 'flex';
}

// 수정 모달 닫기
function closeEditModal() {
  editModalEl.style.display = 'none';
  state.editingIndex = null;
  editForm.reset();
  document.getElementById('edit-error').style.display = 'none';
}

// 수정 저장
function handleEditSave() {
  const name = document.getElementById('edit-treatment-name').value.trim();
  const date = document.getElementById('edit-treatment-date').value.trim();

  // 필수 항목 검증
  if (!name || !date) {
    document.getElementById('edit-error').textContent = '시술명과 시술 시기는 필수입니다.';
    document.getElementById('edit-error').style.display = 'block';
    return;
  }

  const treatment = state.extractedTreatments[state.editingIndex];
  treatment.treatment_name = name;
  treatment.treatment_date = date;
  treatment.cost = document.getElementById('edit-cost').value || null;
  treatment.pain_level = document.getElementById('edit-pain-level').value || null;
  treatment.effect = document.getElementById('edit-effect').value || null;

  const satisfaction = document.getElementById('edit-satisfaction').value;
  treatment.satisfaction = satisfaction ? parseInt(satisfaction) : null;

  renderTreatmentsTable();
  closeEditModal();
}

// 저장 처리
function handleSave() {
  if (state.selectedForSave.size === 0) {
    showSaveResult('저장할 항목을 선택해주세요.', 'error');
    return;
  }

  const treatmentsToSave = [];

  state.selectedForSave.forEach(index => {
    const treatment = state.extractedTreatments[index];

    // 필수 항목 재검증
    if (!treatment.treatment_name || !treatment.treatment_date) {
      showSaveResult(
        `"${treatment.treatment_name || '(시술명 미입력)'}" 기록에 필수 정보가 부족합니다.`,
        'error'
      );
      return;
    }

    treatmentsToSave.push({
      record_id: `record_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      treatment_name: treatment.treatment_name,
      treatment_date: treatment.treatment_date,
      cost: treatment.cost,
      pain_level: treatment.pain_level,
      effect: treatment.effect,
      satisfaction: treatment.satisfaction,
      created_at: new Date().toISOString()
    });
  });

  if (treatmentsToSave.length === 0) return;

  // localStorage에 저장
  let records = JSON.parse(localStorage.getItem('treatment_records') || '[]');
  records.push(...treatmentsToSave);
  localStorage.setItem('treatment_records', JSON.stringify(records));

  // 상태 업데이트
  state.savedRecords = records;
  const count = treatmentsToSave.length;
  showSaveResult(`✅ ${count}개의 시술 기록이 저장되었습니다.`, 'success');

  // UI 초기화
  setTimeout(() => {
    resetForm();
    loadSavedRecords();
  }, 1500);
}

// 저장 결과 메시지 표시
function showSaveResult(message, type) {
  saveResultEl.textContent = message;
  saveResultEl.className = `save-result ${type}`;
  saveResultEl.style.display = 'block';
}

// 폼 초기화
function resetForm() {
  userInputEl.value = '';
  state.currentInput = '';
  state.extractedTreatments = [];
  state.missingRequired = [];
  state.selectedForSave.clear();
  state.editingIndex = null;

  hideAllSections();
  clearMessages();
}

// 모든 섹션 숨기기
function hideAllSections() {
  reaskSectionEl.style.display = 'none';
  resultSectionEl.style.display = 'none';
  saveResultEl.style.display = 'none';
}

// 메시지 모두 지우기
function clearMessages() {
  errorMessageEl.style.display = 'none';
  errorMessageEl.textContent = '';
}

// 오류 메시지 표시
function showError(message) {
  errorMessageEl.textContent = message;
  errorMessageEl.style.display = 'block';
}

// 버튼 로딩 상태 설정
function setButtonLoading(isLoading) {
  extractBtnEl.disabled = isLoading;
  document.querySelector('.btn-text').style.display = isLoading ? 'none' : 'inline';
  document.querySelector('.btn-loading').style.display = isLoading ? 'inline' : 'none';
}

// 탭 전환
function switchTab(tabName) {
  // 탭 버튼 업데이트
  tabBtnsEl.forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');

  // 탭 콘텐츠 업데이트
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.remove('active');
  });
  document.getElementById(`${tabName}-tab`).classList.add('active');

  if (tabName === 'records') {
    loadSavedRecords();
  }
}

// 저장된 기록 로드 및 표시
function loadSavedRecords() {
  const records = JSON.parse(localStorage.getItem('treatment_records') || '[]');
  state.savedRecords = records;

  if (records.length === 0) {
    recordsListEl.innerHTML = '<p class="empty-message">저장된 기록이 없습니다.</p>';
    return;
  }

  recordsListEl.innerHTML = '';
  records.forEach((record, idx) => {
    const card = document.createElement('div');
    card.className = 'record-card';

    const header = document.createElement('div');
    header.className = 'record-card-header';

    const title = document.createElement('div');
    title.className = 'record-card-title';
    title.textContent = record.treatment_name;

    const date = document.createElement('div');
    date.className = 'record-card-date';
    date.textContent = new Date(record.created_at).toLocaleDateString('ko-KR');

    header.appendChild(title);
    header.appendChild(date);

    const fields = document.createElement('div');
    fields.className = 'record-card-fields';

    const fieldData = [
      { label: '시술 시기', value: record.treatment_date },
      { label: '비용', value: record.cost ? `${record.cost}원` : '미입력' },
      { label: '통증', value: record.pain_level || '미입력' },
      { label: '효과', value: record.effect || '미입력' },
      { label: '만족도', value: record.satisfaction ? `${record.satisfaction}/5` : '미입력' }
    ];

    fieldData.forEach(data => {
      const field = document.createElement('div');
      field.className = 'record-field';

      const label = document.createElement('div');
      label.className = 'record-field-label';
      label.textContent = data.label;

      const value = document.createElement('div');
      value.className = 'record-field-value';
      value.textContent = data.value;

      field.appendChild(label);
      field.appendChild(value);
      fields.appendChild(field);
    });

    card.appendChild(header);
    card.appendChild(fields);
    recordsListEl.appendChild(card);
  });
}
