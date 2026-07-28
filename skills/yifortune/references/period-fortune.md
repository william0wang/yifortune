# YiFortune Period Fortune Reading

Time-window fortune analysis from the BaZi chart + current cosmic pillars. For chart structure, consult **bazi-chart**; for terminology, **glossary**.

## Step 0 — Gather Inputs

1. **Period granularity**: if the user's phrasing is vague ("看看运势"), ASK in plain language: "你想看最近哪一阵的？今天、这周、这个月、还是今年？" Default to 这周 if they decline. Never say "流年/流月/流日" to the user.
2. **Birth data**: cycle analysis needs a chart. If not already provided, gather birthDatetime/gender/calendarType (see **bazi-chart** Step 0).

### Granularity Guide

| User says   | Granularity | Window                                   |
| ----------- | ----------- | ---------------------------------------- |
| 今天/今日   | daily       | today (+tomorrow if late evening)        |
| 这周/本周   | weekly      | rest of this week + early next           |
| 这个月/本月 | monthly     | rest of this month + early next          |
| 今年/流年   | yearly      | this year (+early next year if past Nov) |

Always state the analysis window explicitly: "分析周期: X月X日 ~ X月X日".

## Data Source

Call `get_bazi`. Read: natal chart, 大运 sequence, 用神/喜神/忌神. Then derive the current 流年/流月/流日 pillar (the current year/month/day's 天干地支).

**Derive "current" from `meta.currentDate`** (see **bazi-chart** Step 1) — never from your own session clock. Before reporting any "today / this week / this month" window, verify it actually contains or follows `meta.currentDate`; do not present a past period as current or upcoming.

## Analysis Framework

### Flow Pillar Interaction (流年/流月/流日推演)

The current period's pillar interacts with the natal chart:

- **用神到位** (favorable element arrives) → smooth period, opportunities
- **忌神到位** (unfavorable element arrives) → pressure, caution needed
- **天合地合 with 日柱** → harmony/relationship/cooperation period
- **冲 日支** → change (moving/job/relationship shift — neutral, just change)
- **刑/害** → friction, internal drain, needs proactive resolution

### Multi-Domain Analysis

| Domain        | Stars/palaces to watch | Analysis points                                       |
| ------------- | ---------------------- | ----------------------------------------------------- |
| Overall       | 用神喜忌 total         | Score (1-10) + theme + keywords                       |
| Career (事业) | 官杀 + 印星            | Work state, opportunities/challenges, decision timing |
| Love (感情)   | 财星(M)/官杀(F) + 日支 | Relationship state, romance signals, maintenance      |
| Health (健康) | 五行偏枯 → organs      | Body areas to watch + wellness tips                   |
| Social (社交) | 比劫 + 食伤            | Interpersonal, networking, cooperation luck           |

Each domain follows: 现象描述 + 命理原因 (how the flow pillar acts on the 十神/五行) + 具体建议.

### Lucky Elements

Derived from 用神 (NOT invented) — see mapping-tables.md:

- Numbers (用神 element's numbers)
- Colors (用神 element's color)
- Direction (用神 element's direction)
- Objects/materials

Every lucky element must trace back to the natal 用神 — state the reasoning.

### Timing Within the Period

- **Best windows**: specific days/times when 用神 arrives
- **Caution windows**: days when 忌神 or 冲刑 hits

## Output

Two layers (see SKILL.md — the plain layer is mandatory and always last):

**Inner layer (命理要点 — for traceability, compact, terms OK):**

1. **周期定位** — window + current 大运/流年 overall assessment
2. **整体状态** — score (1-10) + 3 keywords + one-line theme
3. **分领域** — career/love/health/social, each: phenomenon + reason + advice
4. **幸运元素** — numbers/colors/direction/objects (with 用神 reasoning)
5. **时序要点** — best windows + caution windows

**Outer layer (大白话总结 — for the user, always last, no raw jargon):**

6. **这一阵整体怎么样** — one plain sentence on the period's vibe (e.g. "这周对你来说是攒劲的一周，别指望有大突破，但底子打得很扎实")
7. **最值得抓住的几天 / 最该稳着的几天** — name specific dates, one-line why each
8. **这一阵具体该做和不该做的事** — 2-3 plain do's + 1-2 don'ts. No "用神到位/忌神回归" in this layer.

### Tone

**State analysis, not fatalism.** Use "倾向", "较容易", "适合", "需留意" — not "必定发生".
