# Premortem — [Solbi Kim]

Team: [Team 4, solbi Kim]
Written on: 2026-10-07
I wrote this before reading anyone else's list: [yes]

Copy this file, rename it after yourself (for example `gildong.md`), and fill it in alone.
Do this before your team meets to merge, and do not read anyone else's list first.
Write your own list before you ask any artificial intelligence (AI).
An AI list anchors you the same way a teammate's would, and an AI does not know your team, so it can only give you the list every team would get.

Write in Korean or English, whichever you think in.
Keep the headings exactly as they are.

---

## The premise

It is December 19, 2026.
Demo Day.
Your team's project failed.
Not "went okay" - failed, visibly, in front of the class.

You are writing the explanation of why.

Write in the past tense, as fact.
This is not a hedge-your-bets risk survey.
Asserting the failure is what makes the honest answers come out, and that is the whole reason the technique works.

## My list

Four minutes.
At least five causes.
Include the uncomfortable one.
In class you wrote three in four minutes, about yourself; this one is about the project, and you have longer.

| # | What happened (past tense, specific) | When it started | Why nobody stopped it |
|---|---|---|---|
| 1 | 데모에서 테스터의 시술 전후 사진을 AI로 비교해 보여줬는데, 화면에 나온 차이는 시술 효과가 아니라 조명과 각도 차이였다. 스킨부스터나 리쥬란처럼 결,광 정도만 미묘하게 달라지는 시술을 사용자가 직접 찍는 폰 셀카로 비교하고자 한 것이 통하지 않았다. 청중 질문에 "그럼 뭘 측정한 거냐"는 말이 나왔다. | 10월 첫 프로토타입에서 팀원 사진으로 처음 돌려봤을 때. 그때부터 점수가 같은 날 찍은 사진끼리도 흔들렸다. | 다들 시술받고 거울로는 차이를 느꼈으니 카메라도 잡을 거라고 믿었다. 시술 전후 사진을 섞어서 맞혀보는 테스트를 하자는 얘기는 나왔지만 "기능 먼저 만들고"로 미뤘다. 또 너무 근본적인 요소였기에 통째로 걷어낼 생각은 할 수 없었다.| 
| 2 | 앱의 핵심을 '나만의 적정 시술 주기'와 다음 시술 알림으로 잡았는데, 데모 전에 써본 외부 사람들은 앱 푸시를 아무도 눌러보지 않았다. 다들 이벤트 보고, 친구 만나서 얘기 듣고, 월급날 충동적으로 예약한다고 했다. 계획해서 시술 받는 사람은 생각보다 일부였다. | 9월 PROJECT.md에서 페르소나를 "일상의 D-Day를 관리하는 사람"으로 정했을 때. | 그 페르소나가 팀 헤비 유저의 실제 습관이었다. 우리 안에서는 다 맞는 말이라 반박할 사람이 없었다. |
| 3 | 데모 Q&A에서 "이거 그냥 친구한테 '나 좀 달라졌어?' 물어보면 되는 거 아니에요? 돈 내고 쓸 것 같아요?"라는 질문을 받고 제대로 답하지 못했다. 시술 효과를 확신하는 순간은 AI 분석이 아니라 누가 "너 뭐 했어?" 하고 알아봐 줄 때라는 걸 우리도 알고 있었다. | 기능을 정할 때. '확인받고 싶다'는 니즈를 AI 분석 기능으로 바로 옮겼다. | 누구한테 확인받고 싶은지는 아무도 묻지 않았다. 실제로 사용자가 AI 가 분석한 결과를 buy in 하는지에 대해서는, 추천 시술에 대한 결제 의향은 랜딩 페이지 하나면 확인할 수 있었는데 만들지 않았다. |
| 4 | 12월까지 팀 밖 사용자를 인터뷰하지 못했다. 데모에서 근거로 보여준 건 팀원들의 경험담이 전부였다. | 9월 PROJECT.md에 "아직 팀 외부 인터뷰는 진행하지 않았다"라고 쓴 날. 그 문장이 12월까지 그대로였다. | 얼굴 사진과 시술 이력을 물어봐야 해서 지인에게 부탁하기가 민망했다. 각자 "누가 하겠지" 하고 넘겼고, 인터뷰를 맡은 사람이 정해지지 않았다. |
| 5 | '또래의 실제 시술 현황' 화면을 만들었는데, 실제 데이터가 없어서 직접 만든 가짜 숫자를 넣었다. 데모에서 출처를 묻자 가짜 데이터라고 말할 수밖에 없었고, 서비스가 소구하는 설득력이 떨어졌다. | 데모 화면 목록을 확정할 때. 사진 분석, 주기 추천, 또래 통계를 다 넣기로 했다. | 기능을 하나 빼자고 말하는 게 다른 팀원 아이디어를 버리자는 말처럼 들려서 아무도 꺼내지 않았다. |
| 6 | 내 리즈시절을 관리한다 라는 핵심 가치에 있어 사용자 설득에 실패했다. | 프리모텀 진행하는 중에 나도 스킨부스터 시술을 받았다. 받고 보니, 내가 이걸 사진을 찍어서 트래킹을 하고싶은가? 에 대한 근본적인 회의가 올라왔다. 또, 나의 리즈시절을 관리한다고 한다면, 그 리즈시절에 대한 기준점을 무엇으로 잡아야 하는가 에 대해서도 고민이 되었다. 그냥 오늘이 가장 예쁘다는 것에서 착안해야 하는가? 아니면 시술을 하고 특정 시점이 지나서가 가장 예쁘다는 것에서 착안해야하나? 사실 시술은 여러개를 받게 되고 주기가 다 다를진데 , 그 모든 최적의 주기가 수렴하는 내 리즈시절값을 어떤 것으로 앵커를 찍어야 하는지, 우리는 사용자에게 어떻게 그 가치를 구체적으로 제안할 수 있을지 , 나스스로도 buy in 이 되지 않는다는 생각이 들었다. | 팀원들끼리 논의할때엔 잘 통할 것 같은 합의가 이루어졌었다. 나랑 생각이 다를 수 있겠다 정도로 치부하고 강하게 말하는 것을 주저했다.   |

Three rules:

- **Past tense, specific.** "We never got one user outside our own team", not "user acquisition may be difficult".
- **Not generic.** "Scope creep" and "the team got busy" are true of every failed project ever, so they carry no information. What specifically crept? Who specifically got busy, in which week, because of what?
- **At least two causes involve the people in this team, and at least one of those is about you.** Skill gaps, who actually understands the code the AI wrote, who has a product launch at work in November, who says "sure" in meetings and disappears. If your list is all technical, it is a safe list, not an honest one.
