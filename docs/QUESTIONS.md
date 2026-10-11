# QUESTIONS.md

Team: [4조 and 임사이드아웃]
Last updated: [2026-10-07]

Your biggest open questions about this project.
Write this together, after the premortem merge.

At most five, most important first.
The consultation opens with question 1, so put the one you are least sure about there, not the one that is easiest to ask.

Write in Korean or English.
Keep the headings exactly as they are.

---

## What counts as an open question

- **The answer would change what you do next.** If every possible answer leaves your next two weeks the same, it is curiosity, not an open question.
- **It is specific to this project.** "Is our idea good?" cannot be answered in 30 minutes. "We assume the person in `PROJECT.md` will enter data by hand every day, and none of us has asked one. How do we test that in a week?" can.
- **You have already tried something.** Say what you think the answer is today, even if it is a guess. A question with a guess attached gets a much better answer than a bare one.

Two good places to look for questions:

- `docs/PREMORTEM.md` — a cause of failure you could not find a countermeasure for is a question.
- `docs/PROJECT.md` — the section you argued about longest, or the one where you wrote "nobody yet".

## Our questions

### 1. 사용자가 굳이 인센티브 없이 시술후 사진 기록을 우리 서비스에 제공 하려고 할까? 
- **Why it matters:** 사용자가 사진 기록을 중단하면 장기적인 시술 효과를 추적할 수 없고, 개인별 시술 주기나 또래 비교 등 장기 데이터 축적을 전제로 한 서비스의 핵심 가치도 구현하기 어렵다.
- **What we think today:** 시술 직후에는 붓기나 부작용을 확인하기 위해 사진을 기록할 이유가 있지만, 회복 이후에는 매번 사진을 찍는 번거로움을 감수할 만큼 명확한 사용 이유가 부족할 수 있다고 생각한다.
- **Who could answer it:** 반복적인 피부 시술 경험이 있는 실제 타깃 사용자 / 실제 사용 테스트
### 2. 일반적인 스마트폰 셀카만으로 시술 전후의 미세한 변화를 사용자가 신뢰할 수 있을 정도로 측정할 수 있을까?
- **Why it matters:** 사진 기반 변화 측정이 충분히 정확하지 않다면 서비스의 핵심인 시술 효과 tracking 자체가 성립하기 어렵기 때문에, 기술적으로 어렵다면 사진 분석의 역할을 축소하거나 다른 방식으로 전환해야 한다.
- **What we think today:** 조명, 각도, 화장 등 촬영 조건의 영향을 크게 받고, 특히 스킨부스터·리쥬란처럼 미세한 변화를 일반적인 스마트폰 셀카로 안정적으로 측정하는 것은 어려울 수 있다고 생각한다. 아직 실제 기술 검증은 진행하지 않았다.
- **Who could answer it:** AI/Computer Vision 관련 전문가 / 실제 프로토타입 테스트
### 3. 사용자 데이터가 충분히 쌓이지 않은 초기 단계에서도 사용자가 이 서비스를 선택할 만한 차별적 가치를 만들 수 있을까?
- **Why it matters:** 개인별 시술 주기나 또래 비교 등 우리가 생각하는 차별적 가치는 충분한 데이터가 쌓여야 제공할 수 있다. 초기 데이터가 없는 상태에서도 사용자를 유입시킬 가치가 없다면 사용자와 데이터 모두 확보하기 어려워진다.
- **What we think today:** 시술 직후의 회복 관리와 개인의 시술 이력 tracking은 데이터가 많지 않아도 제공할 수 있는 초기 가치라고 생각한다. 다만 이것만으로 기존 병원 안내나 검색·커뮤니티와 차별화될 만큼 충분한지는 확신하지 못하고 있다.
- **Who could answer it:** 실제 타깃 사용자 / 업계 전문가 / 초기 MVP 테스트

[Add up to two more.
Stop at five.]

## Where we disagree

[Optional, and often the most useful part.
If two members would answer one of the questions above differently, write both answers here, without deciding who is right.]

---

## After the consultation

Fill this in within a week of your slot.

| # | What we heard | What we will do about it | Owner | By when |
|---|---|---|---|---|
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |

## Revision log

| Date | What changed and why |
|---|---|
| [YYYY-MM-DD] | Draft for consultation |
| [YYYY-MM-DD] | Revised after consultation on [date]: [what changed] |
