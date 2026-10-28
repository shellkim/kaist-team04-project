# PREMORTEM.md

Team: 4조 [임사이드 아웃]
Members: Solbi Kim, Eunhye Hyun, 이다솜, 김소라
Merged on: 2026-10-07
Last updated: 2026-10-07

> **Order matters, and here it is the entire method.**
> Every member first writes their own list in `docs/premortem/<name>.md`, alone.
> Only then does the team fill in this file.
>
> If you brainstorm as a group first, the first risk named anchors everyone else, and the quiet member's risk, which is usually the real one, never gets written down.
>
> Write content in Korean or English.
> Keep the headings exactly as they are.

---

## 1. Individual lists

| Member | File | Written on | Causes listed |
|---|---|---|---|
| Solbi Kim | `docs/premortem/solbi Kim.md` | 2026-10-07 | 6 |
| Eunhye Hyun | `docs/premortem/eunhyehyun.md` | 2026-10-07 | 5 |
| 이다솜 | `docs/premortem/dasomlee.md` | 2026-10-07 | 5 |
| 김소라 | `docs/premortem/sorakim.md` | 2026-10-07 | 7 |

## 2. Read-out

Go around the table.
One cause each, in turn, until every list is exhausted.
No debating during the read-out, and nobody reads their whole list at once.
People have to feel safe saying the awkward one, so the only allowed response is writing it down.

## 3. The merged list

Every cause from every list goes here.
Stack the repeats into one row and keep the sharpest wording, not the most diplomatic one.
Cluster by problem, never by role or department: once a cluster is called "development", half the team decides it is somebody else's problem.

Sort by how many members raised it, most first.
The repeats are your priority signal, and you get it for free.
Break ties by expected damage.

Mark a cause with **(us)** when it exists because of who is on this team, not because of the software.
At least two rows must carry that mark: skill asymmetry, time asymmetry, who will actually debug the code the artificial intelligence (AI) wrote, who has a product launch at work in November, who agrees in meetings and then goes quiet.
A premortem with no **(us)** rows is a premortem about software, not about this team.

| # | Failure cause (past tense, specific) | Problem cluster | Raised by | How many |
|---|---|---|---|---|
| 1 | (*us*) 12월까지 팀 밖 사용자를 제대로 만나지 못했다. 인터뷰 담당을 "팀 전원"으로 정해서 실제로 연락을 돌린 사람이 없었고, 얼굴 사진과 시술 이력을 물어봐야 해서 지인에게 부탁하기도 민망했다. 데모에서 근거로 내놓은 건 팀원들 경험담과 지인 몇 명의 이야기가 전부였다. 팀 안에서는 다들 필요하다고 했지만 외부에 보여주자 반응이 훨씬 약했다. | 사용자 검증 | Solbi Kim, 이다솜, 김소라 | 3 |
| 2 | 폰 셀카로는 스킨부스터·리쥬란처럼 결과 광만 미묘하게 달라지는 변화를 잡지 못했다. 같은 날 찍은 사진끼리도 점수가 흔들렸고, AI는 시술 효과보다 조명·각도·화장·표정 차이를 더 크게 잡았다. 정확도가 왜 이렇게 나오는지 설명할 수 있는 사람도, 파인튜닝할 기술·도메인 지식을 가진 사람도 팀에 없었다. 데모에서 "그럼 뭘 측정한 거냐"는 질문이 나왔다. | 사진 측정 | Solbi Kim, Eunhye Hyun, 김소라 | 3 |
| 3 | 데이터가 쌓이지 않아 해자가 없었다. 모은 데이터는 20개 남짓이었고, 시술 주기 추천은 누구에게나 나올 법한 결과만 보여줬다. '또래 시술 현황' 화면에는 직접 만든 가짜 숫자를 넣었는데, 데모에서 출처를 묻자 가짜라고 답할 수밖에 없었다. | 데이터와 차별점 | Solbi Kim, Eunhye Hyun, 김소라 | 3 |
| 4 | 사용자는 붓기가 심한 시술 후 2~3일 동안만 사진을 찍었고, 붓기가 빠지자 기록을 멈췄다. 매일 같은 각도와 조명으로 찍는 건 야근 후 지친 사람에게 숙제였고, 얼굴 사진이 계속 쌓이는 것 자체를 부담스러워한 사람도 있었다. 회복이 끝난 뒤 다음 시술까지 몇 달 동안 앱을 다시 열 이유가 없었다. 우리가 핵심 구간으로 본 시술 2주~3개월 차 데이터가 비어 버렸다. | 지속 사용 | 이다솜, 김소라 | 2 |
| 5 | (*us*) 팀원 스스로 서비스의 핵심 가치에 확신이 없었다. 한 명은 재정 문제로 피부과를 그만 다니면서 사후 관리가 필요 없어졌고, 외모에 집착했던 자신을 돌아보며 이 서비스를 해야 하는 이유를 의심하게 됐다. 다른 한 명은 직접 스킨부스터를 받아보니 이걸 사진으로 트래킹하고 싶은지부터 의문이었고, '내 리즈시절'의 기준점을 어디에 찍어야 할지 답할 수 없었다. 둘 다 회의에서 강하게 말하지 않았다. | 핵심 가치 | Solbi Kim, Eunhye Hyun | 2 |
| 6 | 다음 시술 알림은 아무도 누르지 않았다. "이전 보톡스 효과가 40% 줄었으니 다음 주에 예약하세요" 같은 알림은 무시됐고, 실제 예약은 이벤트를 봤을 때, 친구 얘기를 들었을 때, 월급날, 중요한 약속 직전에 충동적으로 일어났다. 주기에 맞춰 계획해서 시술받는 건 팀 헤비 유저의 습관이었다. | 계획 vs 충동 | Solbi Kim, 이다솜 | 2 |
| 7 | 사용자는 AI 분석보다 거울과 주변 반응을 더 믿었다. AI가 "효과가 나타나고 있다"고 해도 본인이 못 느끼면 믿지 않았다. 데모 Q&A에서 "그냥 친구한테 '나 좀 달라졌어?' 물어보면 되는 거 아니에요? 돈 내고 쓸 것 같아요?"라는 질문에 답하지 못했다. 결제 의향은 랜딩 페이지 하나로 확인할 수 있었는데 만들지 않았다. | AI 판정의 신뢰 | Solbi Kim, 김소라 | 2 |
| 8 | 회복 tracking에서 시작해 효과 분석, 또래 비교, 적정 시술 주기, 다음 시술 추천까지 다 넣으려다 데모 때까지 하나도 제대로 완성하지 못했다. 11월 중순 카메라 정확도가 안 나오자 범위를 다시 논의했지만, 각자 필요한 게 달라 마지막까지 충돌했다. 기능을 빼자고 하면 다른 팀원 아이디어를 버리자는 말처럼 들려서 아무도 먼저 꺼내지 않았다. | 범위 결정 | Eunhye Hyun, 김소라 | 2 |
| 9 | (*us*)학점, 정식 출시, 과제로 끝내기 중 무엇이 최선인지 각자 기준이 달라 팀 안에 불화가 생겼다. 중간고사 이후 다들 지친 상태에서 가장 바쁜 팀원의 입장에 맞춰 기준이 내려갔고, 서로 손해 보지 않으려다 모두가 최소한의 일만 했다. 일부 팀원끼리는 감정 공유가 전혀 없었다. | 팀 목표와 기여 | Eunhye Hyun | 1 |
| 10 | (*us*)이다솜이 10월 말 회사에서 '광고성 정보 수신 동의율 증대' 프로젝트(11월 안에 동의율 10% 이상)를 맡으면서, 담당이던 커뮤니케이션 전략을 11월 말 마감까지 만들지 못했다. 백업 담당자가 없었고, 본인도 "괜찮다"며 진행 상황을 공유하지 않았다. | 팀 목표와 기여 | 이다솜 | 1 |
| 11 | 누적 시술 비용 대시보드를 본 사용자는 "합리적으로 관리하고 있다"가 아니라 "얼굴에 돈을 이렇게나 썼구나" 하는 죄책감을 느꼈고, 조용히 앱을 지웠다. 시술은 드러내기보다 숨기고 싶은 소비라는 점을 설계에 반영하지 않았다. | 감정과 프레이밍 | 이다솜 | 1 |

Add rows until every individual list is used up.

## 4. What only one person saw

Look again at every row above that a single member raised.

| Cause | Raised by | What we decided to do about it |
|---|---|---|
| #9 학점·출시·과제 중 기준이 달라 불화가 생겼고, 모두가 최소한의 일만 했다 | Eunhye Hyun | [팀 논의 후 기입] |
| #10 회사 프로젝트로 커뮤니케이션 전략이 멈췄고, 백업도 공유도 없었다 | 이다솜 | [팀 논의 후 기입] |
| #11 누적 비용 대시보드가 죄책감을 불러 앱을 지웠다 | 이다솜 | [팀 논의 후 기입] |

A cause only one person saw is not a weak signal.
It is usually the one the rest of the team is structurally unable to see.

## 5. The three we act on

Pick at most three.
More than three is a list, not a plan.

The top of the merged list is where you start looking, not an automatic answer.
If a cause only one person saw is the one that would end the project, pick it.

| # | Failure cause | Early warning signal — what we would actually observe, and when | Countermeasure — the action | Owner | By when |
|---|---|---|---|---|---|
| 1 | (*us*)  사용자 인터뷰 수집이 미비했다. 인터뷰 담당을 "팀 전원"으로 정해서 실제로 연락을 돌린 사람이 없었고, 얼굴 사진과 시술 이력을 물어봐야 해서 지인에게 부탁하기도 민망했다. 데모에서 근거로 내놓은 건 팀원들 경험담과 지인 몇 명의 이야기가 전부였다. 팀 안에서는 다들 필요하다고 했지만 외부에 보여주자 반응이 훨씬 약했다. |12월까지 팀 밖 사용자를 제대로 만나지 못했다.| IMMS 14기,13기가 모여있는 Slack 에서 #피부 시술/미용방 을 개설하여 일찍부터 시술에 대한 정보를 나누는 환경을 조성하도록 한다| 김솔비| 10월 31일 | 
| 2 | (*us*)학점, 정식 출시, 과제로 끝내기 중 무엇이 최선인지 각자 기준이 달라 팀 안에 불화가 생겼다. 중간고사 이후 다들 지친 상태에서 가장 바쁜 팀원의 입장에 맞춰 기준이 내려갔고, 서로 손해 보지 않으려다 모두가 최소한의 일만 했다. 일부 팀원끼리는 감정 공유가 전혀 없었다. | 중간고사를 치를때까지도 R&R 과 프로젝트의 기대 수준에 대한 alignment 가 되지 않았다.| RACI 차트 만들기, 의무적으로 bad cop의견을 제시하도록 한다. | 이다솜 | RACI 만들기 (~중간고사), bad cop play (ASAP) |     


Three tests every row must pass:

- **The signal is observable.** "We notice we are falling behind" is not a signal. "Two members have not opened the project in seven days" is.
- **The countermeasure is an action, not a posture.** "열심히 하기", "우선순위 관리", and "we will be careful" are intentions. "Call three potential users and write down what they say" is an action. If it has no verb, rewrite it.
- **The owner is one named person, and there is a date.** "The team" owns nothing. A countermeasure with no date is a countermeasure with no week: it never lands on anyone's calendar.

> Example of a finished row. Delete this block before you send.
>
> - **Failure cause:** Nobody outside the team ever used it. We demoed to ourselves for ten weeks. **(us)**
> - **Early warning signal:** On October 24, no one outside the team has touched a working screen.
> - **Countermeasure:** Show a clickable first screen to three people who have the problem, and write down the first thing each of them does.
> - **Owner:** [one name]
> - **By when:** October 24

You do not need a 1-to-5 likelihood and impact matrix, and we would rather you did not add one.
It makes every risk look equally considered whether or not it was.

Everything in section 3 that is not in this table is a risk you are knowingly leaving alone for now.
That is a decision, and it is fine.

---

## Revision log

Any change of direction needs a new row here within one week.
A premortem that analyzes a product you no longer build is worse than none, because it reads as covered.

| Date | What changed and why |
|---|---|
| 2026-10-07 | 개인 premortem 4개를 취합해 3절, 4절 작성 |
| [YYYY-MM-DD] | Revised after consultation on [date]: [what changed] |

---

Method note: Gary Klein, "Performing a Project Premortem", Harvard Business Review, September 2007.
