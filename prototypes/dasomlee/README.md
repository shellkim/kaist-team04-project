# 효과 감소 시점 알림 — P0 프로토타입

Spec: `docs/specs/dasomlee-effect-alert.md`

## 실행

`index.html`을 브라우저(Chrome 권장)로 연다. 서버, 빌드, API 키, 설치 모두 필요 없다.

## 구조

- `index.html` 하나에 HTML, CSS, vanilla JS가 모두 있다.
- 데이터는 localStorage에 저장된다: `effect_alert_records`(시술 기록 배열), `effect_alert_today`(시뮬레이터 날짜).
- 알림은 저장하지 않고 기록 + 응답 + 오늘 날짜로 매번 계산한다 (Spec §2.3).
- 처음부터 다시 하려면 개발자 도구 콘솔에서 `localStorage.clear()` 후 새로고침한다.

## 확인 방법

Spec §6의 손으로 확인하는 검사 3개를 따른다.
