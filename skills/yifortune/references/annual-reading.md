# YiFortune Annual Reading (流年详批)

A comprehensive full-year forecast — deeper than the period-fortune yearly mode. For chart structure, consult **bazi-chart**; for terminology and annual stars, consult **glossary**.

## Step 0 — Gather Inputs

1. **Which year?** If the user doesn't specify, default to the current year. Confirm in plain language: "你想看哪一年的整体运势？" — never say "流年详批".
2. **Birth data**: if not already provided, gather birthDatetime/gender/calendarType (see **bazi-chart** Step 0).

## Data Source

Call `get_bazi`. Read: natal chart, 大运 sequence (which decade is the person in this year?), 用神/喜神/忌神, 日主, key 十神. Then derive the **流年** (the target year's 天干地支) and the **流月** pillars for each of the 12 months.

**Anchor "today" on `meta.currentDate` from the chart result** (see **bazi-chart** Step 1) — derive the target year's position relative to it. When laying out the 12-month trend, verify each month against `meta.currentDate` so you never forecast a month that's already past as "upcoming".

## Analysis Framework

### Annual Pillar vs. Natal Chart (流年与命局)

Analyze how the year's 天干地支 interacts with the natal chart:

- **流年天干** vs. 日主: does it 生扶 (nurture) or 克泄 (drain)? Is it a 用神 or 忌神 stem?
- **流年地支** vs. natal branches: does it form 合 (combination — good), 冲 (clash — change/volatility), 刑 (punishment — friction), or 害 (harm — covert trouble)?
- **Overall**: is this year's element the person's 用神 (favorable → growth year) or 忌神 (unfavorable → challenge year)?

### Annual Stars (流年神煞)

What symbolic stars does the year activate for this person? (See mapping-tables.md.) Note the headline stars:

- 天乙贵人 → mentor/benefactor year
- 桃花 → romance/popularity year
- 驿马 → travel/movement/relocation year
- 文昌 → study/exam/writing year
- 空亡 → things may feel hollow or not materialize (not all bad — can neutralize negative stars)
- 岁破 → disruptive year, caution needed

### Decade Context (大运背景)

The year happens **within** a 大运. A favorable-element year inside a favorable-element decade = peak. A favorable year inside an unfavorable decade = a bright spot in a tough time. State the combination explicitly.

### Month-by-Month Trend (流月走势)

For each of the 12 months, assess the 流月 pillar's interaction with the natal chart and the annual pillar. Produce a trend curve:

- 🟢 Favorable months: 用神/喜神 arrives, harmony, opportunities
- 🟡 Neutral months: mixed signals, steady
- 🔴 Caution months: 忌神 arrives, clash/punishment, avoid major decisions

Highlight the **2-3 best months** (act/initiate) and **2-3 caution months** (conserve/avoid).

### Key Warning Zones

Identify specific periods within the year to watch:

- Months where 流月 冲 日支 → relationship/health volatility
- Months where 流月 刑 → legal/friction risk
- Months where 流月 brings 忌神 → energy low point

### Annual Theme & Keywords

Synthesize into 3-5 keywords that define the year's theme (e.g. "突破、合作、健康调整") and a one-paragraph summary.

## Output

Two layers (see SKILL.md — the plain layer is mandatory and always last):

**Inner layer (命理要点 — for traceability, compact, terms OK):**

1. **流年总论** — the year's pillar + its interaction with the natal chart (用神/忌神 + 合/冲/刑)
2. **大运背景** — which decade this year falls in + how they combine
3. **流年神煞** — headline stars and their meaning
4. **年度主题词** — 3-5 keywords + one-paragraph summary
5. **逐月走势** — 12-month trend (🟢/🟡/🔴) with best/caution months highlighted
6. **关键预警** — specific periods to watch + how to navigate them

**Outer layer (大白话总结 — for the user, always last, no raw jargon):**

7. **这一年对你来说一句话** — the whole year in one plain sentence (e.g. "今年是你这十年来少有的好年份，关键是别坐着等，得自己动起来")
8. **最好的几个月 / 最需要注意的几个月** — pick the 2-3 best and 2-3 caution months, name them by 月份（"5 月、6 月"），一句话说清楚为什么
9. **今年到底该干嘛** — 2-3 concrete moves for the year, in plain verbs, mapped to the best months. No "用神得力/伤官泄秀" in this layer.

### Tone

State analysis, not fatalism. Even a "忌神 year" has growth opportunities — frame challenges as "what to learn/strengthen" rather than "what will go wrong." And always close in plain language — a year forecast that ends on "用神有力传导" has failed the user.
