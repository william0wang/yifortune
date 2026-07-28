# YiFortune Date Selection (择日择吉)

Selecting auspicious dates for important life events. For chart structure, consult **bazi-chart**; for divination, consult **yijing-cast**; for terminology, **glossary**.

## Step 0 — Gather Inputs

Interactive — ask before proceeding:

1. **The event**: what is the date for? (结婚/搬家/开业/签约/出行/手术/面试/其他) Different events have different auspiciousness criteria.
2. **The person's birth data**: to personalize against their chart (用神 favorable elements, clash branches). Call `get_bazi`.
3. **Date range**: what window are they considering? (e.g. "next 2 months", "2026 spring")
4. **Constraints**: any fixed constraints? (must be a weekend, a specific month, etc.)

## Selection Framework

> **Time anchor**: every recommended date must be checked against `meta.currentDate` from the tool result (see **bazi-chart** Step 1). Never recommend a date that's already past, and never describe a past date as "upcoming". The user's stated date range is a search window, not a guarantee every day in it is still ahead.

### Layer 1 — Favorable Element Matching (用神择日)

From the person's chart, identify 用神/喜神. Favorable dates have day-pillars whose element matches or supports the 用神:

- 用神 木 → favor 甲乙寅卯 days
- 用神 火 → favor 丙丁巳午 days
- 用神 土 → favor 戊己辰戌丑未 days
- 用神 金 → favor 庚辛申酉 days
- 用神 水 → favor 壬癸亥子 days

### Layer 2 — Clash Avoidance (避冲)

**Absolute must-avoid**:

- 日期地支冲 the person's 年支 (生肖) — e.g. a 鼠(子) person should avoid 午 days
- 日期地支冲 the 日支 (day pillar branch) — personal clash day
- 日期冲 the event's relevant palace (e.g. for marriage, avoid days clashing the spouse palace)

### Layer 3 — Auspicious Stars (神煞择日)

Favor dates carrying auspicious stars (see mapping-tables.md for annual stars):

- **天赦日**: universally auspicious — best for new starts, legal matters, resolutions
- **天德/月德**: protection — reduces negativity
- **天乙贵人日**: mentor/benefactor support — great for interviews, meetings, negotiations
- **文昌日**: academic — great for exams, starting studies

Avoid dates carrying:

- **岁破**: year-breaker — major avoid for everything
- **月破**: month-breaker — avoid for important events
- **日破**: day-breaker — unstable

### Layer 4 — Event-Specific Criteria

| Event                   | Additional criteria                                                       |
| ----------------------- | ------------------------------------------------------------------------- |
| 结婚 (Wedding)          | Favor 天合地合 days; avoid 冲夫星/财星 days; avoid 孤辰/寡宿 stars        |
| 搬家 (Moving)           | Favor 安床/移徙 auspicious days; avoid 冲 the new home's facing direction |
| 开业 (Business opening) | Favor 财星/生气 days; avoid 冲 the owner's 用神                           |
| 签约 (Signing)          | Favor 天乙贵人/六合 days; avoid 刑/害 days                                |
| 出行 (Travel)           | Favor 驿马 days (if travel desired); avoid 冲 the destination direction   |

### Layer 5 — I Ching Verification (optional, for major decisions)

For a critical date decision, cast a hexagram asking "此日行此事, 吉凶如何?". **You must ask the user to supply three numbers** (0–99) and pass them to `divine_yijing_numbers` — do not auto-generate numbers. If the verdict is 吉/亨, confirm. If 凶/悔, suggest reconsidering. See **yijing-cast** for the full framework.

## Output

Two layers (see SKILL.md — the plain layer is mandatory and always last):

**Inner layer (命理要点 — for traceability, compact, terms OK):**

1. **筛选范围** — the date range considered + constraints
2. **推荐吉日** — 3-5 best dates, each with: the day's pillar, why it's favorable (element match + auspicious stars), and what time window within the day
3. **避讳日期** — dates to absolutely avoid (clash/breaker days) + why
4. **事项特定建议** — event-specific considerations
5. **(if used) 易经验证** — the hexagram verdict for the top recommendation

**Outer layer (大白话总结 — for the user, always last, no raw jargon):**

6. **最推荐的 1-2 个日子** — name the top pick(s) by actual calendar date, in plain words why ("5 月 18 日是个好日子，整体顺，特别适合搬家这种事")
7. **千万要避开的几天** — name the absolute-avoid dates by calendar date, one-line why ("5 月 3 日这天冲你的生肖，再忙也避开")
8. **定下来之后还要注意什么** — plain reminder for the day-of (e.g. "上午 9 到 11 点这个时段最旺，尽量安排在这个时段里办"). No "岁破/月破/天乙贵人日" in this layer unless glossed.
