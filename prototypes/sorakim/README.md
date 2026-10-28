# AI 피부 시술 이력 기록 - P0 프로토타입

KAIST IMMS HW6 과제 - sorakim 개인 과제

## 개요

사용자가 AI와 자연스러운 대화를 통해 피부 미용 시술 경험을 기록하고, AI가 시술 정보를 구조화하여 저장할 수 있는 프로토타입입니다.

**관련 문서**: `docs/specs/sorakim-treatment-log.md`

## 기술 스택

- **프론트엔드**: HTML / CSS / JavaScript
- **백엔드**: Node.js + Express
- **AI**: OpenAI API (gpt-4o-mini)
- **데이터 저장**: localStorage (브라우저)

## P0 구현 기능

- ✅ AI 대화 기반 시술 정보 추출
- ✅ 필수 항목(시술명, 시술 시기) 누락 시 재질문
- ✅ 추출 결과 테이블 표시 및 검토
- ✅ 행별 수정 폼
- ✅ 필드 검증
- ✅ 체크박스 기반 선택적 저장
- ✅ localStorage에 저장
- ✅ 저장된 시술 이력 조회
- ✅ API 오류 처리 및 재시도

## 설치 및 실행

### 1. 의존성 설치

```bash
cd prototypes/sorakim
npm install
```

### 2. API 키 설정

`.env` 파일 생성:

```bash
# .env
OPENAI_API_KEY=sk_your_openai_api_key_here
PORT=3000
NODE_ENV=development
```

**API 키 획득 방법**:
1. https://platform.openai.com에서 계정 생성
2. API 키 생성
3. 위의 `.env` 파일에 입력

### 3. 서버 실행

```bash
npm start
```

서버가 http://localhost:3000에서 시작됩니다.

## 사용자 흐름

```
1. 사용자가 자연어로 시술 경험 입력
   ↓
2. AI가 정보 추출 (OpenAI API)
   ↓
3. 필수 항목 검증
   - 시술명 또는 시술 시기 누락 → 재질문
   - 모든 필수 항목 있음 → 다음 단계
   ↓
4. 추출 결과 테이블 표시
   - "수정" 버튼으로 개별 항목 수정 가능
   ↓
5. 저장할 시술 선택 (체크박스)
   ↓
6. 저장 실행
   - localStorage에 저장
   - 저장된 기록 목록 업데이트
   ↓
7. 새로운 대화 시작 가능
```

## 파일 구조

```
prototypes/sorakim/
├── server.js           # Express 서버 + OpenAI API
├── package.json        # 의존성 정의
├── .env.example        # 환경 변수 예시
├── .gitignore          # Git 제외 파일
├── README.md           # 이 파일
└── public/
    ├── index.html      # UI
    ├── styles.css      # 스타일
    └── app.js          # 프론트엔드 로직
```

## API 엔드포인트

### POST /api/extract

시술 정보 추출

**요청**:
```json
{
  "user_input": "2025년 여름에 보톡스 맞고, 작년 초에는 필러..."
}
```

**응답**:
```json
{
  "success": true,
  "treatments": [
    {
      "treatment_name": "보톡스",
      "treatment_date": "2025년 여름",
      "cost": null,
      "pain_level": null,
      "effect": "주름 개선",
      "satisfaction": null
    }
  ],
  "missing_required": []
}
```

### GET /api/health

API 상태 확인

## 오류 처리

- **API 키 미설정**: 화면에 경고, API 호출 불가
- **API 호출 실패**: 오류 메시지 + "다시 시도" 버튼
- **JSON 파싱 오류**: 오류 메시지 표시
- **필수 항목 누락**: 재질문 또는 수동 입력

## 데이터 저장

### localStorage 구조

```javascript
// localStorage 키: "treatment_records"
[
  {
    "record_id": "record_1698470400000_abc123",
    "treatment_name": "보톡스",
    "treatment_date": "2025년 여름",
    "cost": null,
    "pain_level": null,
    "effect": "주름 개선",
    "satisfaction": null,
    "created_at": "2026-10-28T10:30:00.000Z"
  }
]
```

### 저장소 제약

- 브라우저 localStorage 용량: 보통 5-10MB
- P0에서는 약 100개 시술 기록까지 저장 가능

## P1에서 추가될 기능

- 대화 원문 영구 저장 (서버 데이터베이스)
- 저장된 기록 재수정
- 저장된 기록 삭제
- 저장 완료 후 같은 대화에서 추가 시술 기록
- 중복 판단 불확실 시 AI 추가 확인

## 주의사항

⚠️ **이것은 프로토타입입니다**:
- 실제 의료 기록으로 사용하지 마세요
- 테스트 데이터만 사용하세요
- localStorage는 브라우저마다 독립적입니다
- 브라우저 캐시 삭제 시 데이터가 소실됩니다

## 개발 노트

### 모델 선택: gpt-4o-mini

- **이유**: 
  - Structured Outputs 지원 (JSON 응답 보장)
  - 최신 모델 (2024년)
  - 자연어 이해도 우수
  - 비용 효율적 (gpt-3.5-turbo의 1/5)
  
- **대안 검토**:
  - gpt-4: 더 정확하지만 비용이 15배 높음
  - gpt-3.5-turbo: 더 저렴하지만 JSON 응답 신뢰도 낮음

### 보안

- API 키는 서버 측 `.env` 파일에서 관리
- 브라우저에 API 키 노출 안 함
- `.env` 파일은 Git에 포함 안 함 (`.gitignore`)

## 테스트

### 수동 테스트 시나리오

**시나리오 1**: 여러 시술 일부 저장
```
입력: "2025년 여름에 보톡스, 작년 초에는 필러"
→ 두 개의 시술 추출
→ 보톡스만 선택
→ 저장 완료
```

**시나리오 2**: 필수 항목 재질문
```
입력: "작년에 어떤 시술을 받았는데..."
→ 시술명 미입력 감지
→ "어떤 시술이었나요?" 재질문
→ 사용자가 직접 입력
→ 저장 완료
```

**시나리오 3**: API 오류 처리
```
API 키 미설정 상태에서 추출 시도
→ "API 미설정" 경고 표시
→ "다시 시도" 버튼 제공
```

## 문제 해결

### 포트 3000이 이미 사용 중인 경우

```bash
# 포트 변경
PORT=3001 npm start
```

### API 키 오류

```
OPENAI_API_KEY is not set
```

→ `.env` 파일을 생성하고 유효한 API 키를 입력하세요

### 의존성 설치 오류

```bash
rm -rf node_modules package-lock.json
npm install
```

## 연락처

작성자: sorakim  
작성일: 2026-10-28  
과제: KAIST IMMS HW6 - AI 피부 미용 시술 이력 기록
