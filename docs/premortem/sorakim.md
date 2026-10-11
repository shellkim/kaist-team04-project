# Premortem — [김소라]

Team: [team number and name]
Written on: [2026-10-07]
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
Not "went okay" — failed, visibly, in front of the class.

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
| 1 | 사용자들은 AI가 분석한 피부 변화보다 거울을 보고 스스로 판단한 결과를 더 신뢰했다. AI가 “효과가 나타나고 있다”고 알려줘도 본인이 체감하지 못하면 결과를 믿지 않았고, 결국 AI 분석 기능을 사용하지 않게 되었다.| 첫 사용자 테스트| 우리는 사진 데이터를 분석해서 객관적인 결과를 보여주면 사용자가 자신의 주관적인 판단보다 더 신뢰할 것이라고 생각했고, AI의 판단과 사용자의 체감이 다를 때 어떻게 신뢰를 확보할지는 충분히 검증하지 않았다.|
| 2 | 사용자들은 처음에는 자신의 변화를 확인하는 것을 흥미로워했지만, 며칠 지나자 매번 얼굴 사진을 찍고 기록하는 것을 귀찮아했다. 얼굴 사진과 시술 이력을 계속 저장하는 것에 부담을 느끼는 사용자도 있어 데이터가 충분히 쌓이지 않았다.| 첫 테스트 이후 1~2주| 우리 팀원들은 서비스를 만들고 있었기 때문에 직접 사진을 찍고 기록하는 데 적극적이었고, 일반 사용자도 같은 수준으로 참여할 것이라고 생각했다.|
| 3 | 우리가 중요하다고 생각한 ‘지속적인 회복·효과 tracking’이 실제 사용자가 원하는 핵심 가치가 아니었다. 사용자들은 시술 직후 며칠 동안 붓기나 부작용 여부를 확인하는 데에는 관심이 있었지만, 회복이 끝난 뒤까지 계속 기록하고 다음 시술을 관리할 필요성은 크게 느끼지 않았다.| 초기 사용자 인터뷰 및 테스트| 시술 경험이 있는 팀원들의 문제의식을 실제 시장의 니즈와 동일하다고 생각했고, 팀 밖의 사용자를 충분히 만나기 전에 솔루션을 구체화했다.|
| 4 | 조명, 각도, 화장, 표정에 따라 사진 속 얼굴이 크게 달라져 AI가 시술 효과를 일관되게 측정하지 못했다. 같은 사람의 사진인데도 실제 피부 변화보다 촬영 환경의 차이를 더 크게 인식하면서 핵심 기능에 대한 신뢰가 떨어졌다.| 이미지 분석 기능 구현 및 테스트| 사진 촬영 조건을 어느 정도 표준화하면 해결할 수 있다고 생각했고, 실제 사용 환경에서 사람들이 매번 동일한 조건으로 사진을 촬영하지 않는다는 문제를 과소평가했다.|
| 5 | 시술 직후에는 서비스를 사용했지만 회복이 끝난 뒤 다음 시술까지 몇 달 동안 앱을 다시 열 이유가 없었다. 그 결과 개인별 시술·회복 데이터가 충분히 축적되지 않았고, 우리가 차별점이라고 생각했던 개인별 시술 주기와 또래 비교도 의미 있는 수준으로 만들지 못했다.| 첫 번째 시술의 회복 tracking이 끝난 시점| 우리는 aftercare가 장기적인 피부관리로 자연스럽게 연결될 것이라고 생각했지만, 회복 이후 사용자가 다시 돌아올 구체적인 이유를 충분히 만들지 못했다.|
| 6 | 팀원 모두가 이 서비스의 잠재 고객이라는 점을 강점으로 생각한 나머지, 우리 팀의 경험과 취향을 실제 고객의 니즈라고 너무 쉽게 일반화했다. 팀 안에서는 서비스가 필요하다는 데 계속 공감했지만 외부 사용자에게 보여줬을 때는 반응이 훨씬 약했다.| PROJECT.md를 정의하고 초기 기능을 정할 때| 팀원들끼리 문제에 대한 공감대가 높았기 때문에 반대 의견이 잘 나오지 않았고, 나 역시 우리가 직접 겪는 문제라면 다른 사용자도 비슷할 것이라고 생각했다.|
| 7 | 나는 서비스의 컨셉과 사용자 경험을 구체화하는 데 집중하면서도, 실제 구현 가능한 수준인지 확인하기 전에 필요한 기능을 계속 확장했다. 회복 tracking에서 시작했지만 효과 분석, 또래 비교, 적정 시술 주기, 다음 시술 추천까지 모두 구현하려다 Demo Day까지 핵심 기능 하나도 충분한 완성도로 만들지 못했다.| PROJECT.md 이후 기능을 구체화하기 시작한 시점| 각 기능이 서로 연결되어 있어 모두 필요하다고 생각했고, 무엇을 MVP에서 버릴지 명확하게 결정하지 못했다.|



Three rules:

- **Past tense, specific.** "We never got one user outside our own team", not "user acquisition may be difficult".
- **Not generic.** "Scope creep" and "the team got busy" are true of every failed project ever, so they carry no information. What specifically crept? Who specifically got busy, in which week, because of what?
- **At least two causes involve the people in this team, and at least one of those is about you.** Skill gaps, who actually understands the code the AI wrote, who has a product launch at work in November, who says "sure" in meetings and disappears. If your list is all technical, it is a safe list, not an honest one.