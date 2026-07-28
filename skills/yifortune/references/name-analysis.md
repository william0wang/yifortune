# YiFortune Name Analysis

Five-dimensional name evaluation. For chart structure, consult **bazi-chart**; for the 五格剖象法 reference, consult **glossary** terms-detail.md.

## Step 0 — Gather Inputs

Interactive — ask, don't guess:

1. **The name**: exact Chinese characters of the full name (姓 + 名), including surname.
2. **Birth data** (optional but recommended): for the BaZi-compatibility dimension. If provided, call `get_bazi` to get the 用神/喜神 and day master.

## Analysis — Five Dimensions

Each dimension produces a sub-score (1-10). The composite is the weighted average.

### 1. 音律分析 (Phonetic Fortune)

How the name sounds — flow, rhythm, tonal harmony:

- **Tonal balance**: mix of the four tones (平上去入) — avoid all-flat or all-sharp
- **Resonance**: open vowels = expansive fortune; cramped sounds = constriction
- **Rhythm**: alternating tonal patterns read better than monotone
- **Avoid**: homophones with negative words (e.g. a name sounding like 输/散/病)

### 2. 字形分析 (Structural Fortune)

Visual structure of the characters:

- **Balance**: characters should feel visually stable (上轻下重 = grounded)
- **Complexity**: overly complex characters are "heavy"; too simple = "light." Balance matters.
- **Radical harmony**: characters sharing radicals can reinforce or clash
- **Stroke balance**: similar stroke counts across characters = harmony

### 3. 寓意分析 (Semantic Fortune)

The meaning of the characters:

- **Positive imagery**: nature (山/川/林), virtues (仁/义/智), aspirations (志/远/鹏)
- **Avoid**: negative connotations, overly fragile/weak imagery
- **Cultural resonance**: characters with deep positive cultural associations score higher
- **Gender alignment**: if the name's imagery matches the person's gender expectation

### 4. 五行分析 (Elemental Fortune)

Each character maps to a five-element via its Kangxi-dictionary stroke count (see terms-detail.md for stroke → element method). Assess:

- **Element balance**: does the name's element distribution complement itself?
- **Element sequence**: productive cycle (相生) sequence > destructive cycle (相克)

### 5. 八字配合分析 (BaZi Compatibility)

**If birth data available** — the most personalized dimension:

- Read the chart's 用神/喜神 (favorable elements)
- Does the name's element makeup **supply** the favorable elements? (Good.)
- Does it **reinforce** an already-excessive element? (Bad.)
- Does it clash with the day master?

**If no birth data**: skip this dimension and note it ("如能补充出生时间, 可做八字配合深读").

## Composite Scoring

| Dimension | Weight                                            |
| --------- | ------------------------------------------------- |
| 音律      | 15%                                               |
| 字形      | 15%                                               |
| 寓意      | 25%                                               |
| 五行      | 20%                                               |
| 八字配合  | 25% (0% if no birth data, redistribute to others) |

## Rename Suggestions (if requested)

Principles:

- Prioritize characters that **supply the 用神** element
- Keep phonetic harmony and positive imagery
- Respect family name constraints
- Offer 3-5 alternatives with per-character reasoning

If the user decides NOT to rename: suggest small adjustments (nickname, English name, or environmental element compensation via the **fengshui**).

## Output

Two layers (see SKILL.md — the plain layer is mandatory and always last):

**Inner layer (命理要点 — for traceability, compact, terms OK):**

1. **五维评分表** — each dimension's score (1-10) + findings
2. **综合评分** — weighted composite + overall verdict
3. **核心优势/不足** — what the name does well + what it lacks
4. **(if birth data) 八字配合** — element compatibility with the chart

**Outer layer (大白话总结 — for the user, always last, no raw jargon):**

5. **这个名字整体怎么样** — one plain sentence on whether the name serves them (e.g. "这个名字整体是加分项，好听也好记，跟你这个人的气质也对得上")
6. **最大的优点和最大的短板** — name the single biggest strength and single biggest weakness in everyday words ("最加分的是读起来响亮、寓意也好；稍微弱一点的是笔画偏多，写起来累")
7. **(if birth data) 名字和你这个人配不配** — chart-compatibility in plain terms ("你的命盘里最需要水和木，名字里恰好补了这两块，挺合适")
8. **改名建议** (if requested) — alternatives with reasoning in plain language, no "用神补木/字形相克" in this layer.
