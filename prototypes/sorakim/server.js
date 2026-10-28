const express = require('express');
const OpenAI = require('openai').default;
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// OpenAI 클라이언트 초기화
let openai = null;

function initializeOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.warn('⚠️ OPENAI_API_KEY is not set. API calls will fail.');
    return false;
  }
  openai = new OpenAI({ apiKey });
  return true;
}

// API 엔드포인트: 시술 정보 추출
app.post('/api/extract', async (req, res) => {
  const { user_input } = req.body;

  if (!user_input || user_input.trim() === '') {
    return res.status(400).json({
      success: false,
      error: '입력이 비어있습니다.'
    });
  }

  // API 키 확인
  if (!openai) {
    return res.status(503).json({
      success: false,
      error: 'AI 서버가 설정되지 않았습니다. 관리자에게 문의해주세요.',
      hint: 'API 키를 .env 파일에 설정하세요.'
    });
  }

  try {
    const systemPrompt = `당신은 피부 미용 시술 경험을 기록하는 AI 어시스턴트입니다.

사용자의 자연어 입력에서 시술 정보를 추출하세요.

각 시술에 대해 다음 정보를 추출하세요:
- treatment_name: 시술명 (예: 보톡스, 필러, 레이저 등) - null일 수 있음
- treatment_date: 시술 시기 ('2025년 여름', '작년 초' 등 원문 그대로) - null일 수 있음
- cost: 시술 비용 (숫자 또는 null)
- pain_level: 통증 수준 ('없음', '약함', '중간', '강함' 또는 숫자 1-10, 또는 null)
- effect: 시술 효과 (예: '주름 개선', '피부 톤 밝아짐' 등) - null일 수 있음
- satisfaction: 만족도 (1-5 숫자 또는 null)

중요 규칙:
1. 확실하지 않은 정보는 null로 설정하세요. 절대 추측하지 마세요.
2. 시술 시기는 '2025년 여름', '작년 초' 등 사용자가 말한 그대로 보존하세요.
3. 여러 시술이 언급되면 각각 별도의 객체로 추출하세요.
4. 의료적 판단이나 추천은 하지 마세요.

응답은 다음 JSON 형식으로 반환하세요:
{
  "success": true,
  "treatments": [
    {
      "treatment_name": "문자열 또는 null",
      "treatment_date": "문자열 또는 null",
      "cost": "숫자 또는 null",
      "pain_level": "문자열/숫자 또는 null",
      "effect": "문자열 또는 null",
      "satisfaction": "숫자(1-5) 또는 null"
    }
  ],
  "missing_required": [
    {
      "treatment_index": 0,
      "missing_field": "treatment_name",
      "suggested_question": "어떤 시술이었나요?"
    }
  ]
}

missing_required는 treatment_name 또는 treatment_date가 null인 경우만 포함하세요.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: user_input
        }
      ],
      temperature: 0.3,
      max_tokens: 1500
    });

    // 응답 파싱
    const content = response.choices[0].message.content;
    let parsedResponse;

    try {
      // JSON 추출 (마크다운 코드 블록 제거)
      let jsonStr = content;
      if (content.includes('```json')) {
        jsonStr = content.split('```json')[1].split('```')[0].trim();
      } else if (content.includes('```')) {
        jsonStr = content.split('```')[1].split('```')[0].trim();
      }

      parsedResponse = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error('JSON 파싱 오류:', parseError);
      return res.status(500).json({
        success: false,
        error: 'AI 응답 처리 오류'
      });
    }

    // 응답 검증
    if (!parsedResponse.success || !Array.isArray(parsedResponse.treatments)) {
      return res.status(500).json({
        success: false,
        error: 'AI 응답 형식 오류'
      });
    }

    // 필수 항목 검증 (서버 측)
    const validTreatments = [];
    const missingRequired = [];

    parsedResponse.treatments.forEach((treatment, index) => {
      if (!treatment.treatment_name || !treatment.treatment_date) {
        if (!treatment.treatment_name) {
          missingRequired.push({
            treatment_index: index,
            missing_field: 'treatment_name',
            suggested_question: '어떤 시술이었나요?'
          });
        }
        if (!treatment.treatment_date) {
          missingRequired.push({
            treatment_index: index,
            missing_field: 'treatment_date',
            suggested_question: '대략적으로 언제쯤 받으셨나요?'
          });
        }
      }
      validTreatments.push(treatment);
    });

    res.json({
      success: true,
      treatments: validTreatments,
      missing_required: missingRequired
    });

  } catch (error) {
    console.error('API 오류:', error.message);

    // API 오류 종류별 처리
    let errorMessage = 'AI 서버 연결 실패';
    let retryable = true;

    if (error.status === 401) {
      errorMessage = 'API 키 인증 실패. 관리자에게 문의해주세요.';
      retryable = false;
    } else if (error.status === 429) {
      errorMessage = 'AI 서버 요청 한도 초과. 잠시 후 다시 시도해주세요.';
      retryable = true;
    } else if (error.status === 500) {
      errorMessage = 'AI 서버 오류. 잠시 후 다시 시도해주세요.';
      retryable = true;
    }

    res.status(500).json({
      success: false,
      error: errorMessage,
      retryable: retryable
    });
  }
});

// 헬스 체크 엔드포인트
app.get('/api/health', (req, res) => {
  const apiKeySet = !!process.env.OPENAI_API_KEY;
  res.json({
    status: 'ok',
    apiKeyConfigured: apiKeySet,
    model: 'gpt-4o-mini'
  });
});

// 정적 파일 제공
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 에러 핸들러
app.use((err, req, res, next) => {
  console.error('서버 에러:', err);
  res.status(500).json({
    success: false,
    error: '서버 오류가 발생했습니다.'
  });
});

// 서버 시작
const isApiConfigured = initializeOpenAI();

app.listen(PORT, () => {
  console.log(`🚀 서버가 포트 ${PORT}에서 실행 중입니다.`);
  if (isApiConfigured) {
    console.log('✅ OpenAI API 설정됨');
  } else {
    console.log('⚠️ OpenAI API 미설정 (API 호출 불가)');
  }
  console.log(`📍 http://localhost:${PORT}`);
});
