# YiFortune Compatibility Reading

Multi-system compatibility analysis between **two people**. Collect info about both by asking — don't guess birth years, blood types, or MBTI. You don't need every field to start; work with what's given and ask for more when it unlocks a deeper system.

## Step 0 — Gather Inputs

| System                   | Info needed                    | Required?          |
| ------------------------ | ------------------------------ | ------------------ |
| 生肖 (Zodiac)            | Both birth years (or 生肖)     | At least one       |
| 星座 (Western)           | Both birth dates (or Sun sign) | At least one       |
| 血型 (Blood type)        | Both blood types               | Optional           |
| MBTI                     | Both MBTI types                | Optional           |
| 八字合婚 (BaZi synastry) | Both full birth times + gender | Optional (deepest) |

For BaZi-level analysis, call `get_bazi` for each person. For Western astrology synastry, compute each natal chart via the local script (see **astrology-chart** for the I/O contract) if birth time + place are available.

## Analysis — Layer by Layer

### 1. 生肖配对 (Chinese Zodiac)

Based on earthly-branch interactions (see terms-detail.md for full 三合/六合/四冲 tables):

- **三合 (Trine)**: highly compatible (e.g. 猴·鼠·龙)
- **六合 (Harmonious pair)**: naturally drawn together
- **四冲 (Clash)**: friction, needs conscious management
- **三刑 (Punishment)**: deep tension, growth through difficulty

### 2. 星座配对 (Western Zodiac)

Based on element compatibility (see glossary):

- Same element or complementary (Fire↔Air, Earth↔Water) = natural flow
- Square/opposition = attraction through contrast, growth through friction

### 3. 血型配对 (Blood Type)

See terms-detail.md for blood-type personality baseline. Note temperamental compatibility and friction.

### 4. MBTI 兼容性

If both types known, note cognitive-function compatibility (e.g. ENFP-INTJ = complementary, INFP-INFJ = mirror harmony).

### 5. 八字合婚 (BaZi Synastry — deepest, if both birth times available)

Call `get_bazi` for each person and compare:

**日主关系**: do the two day-master stems 生 (nurture), 合 (combine), or 克 (clash)? 相生 = warm support; 相合 = deep bond; 相克 = needs磨合.

**夫妻宫**: compare both 日支. 合 (combination) = harmony; 冲 (clash) = volatility; 刑 (punishment) = friction.

**用神互补**: does one person's favorable element match the other's strong element? (Complementary = mutually beneficial.) Do both share the same 忌神? (Shared pressure.)

**大运同步**: do their luck pillars peak at similar times? (Synchronized = smooth partnership; offset = one thrives while the other struggles.)

## Synthesis

Integrate all available systems:

- **多系统共振** (multiple systems agree) = high compatibility
- **系统间矛盾** (systems disagree) = solid foundation but specific area needs work
- **多系统冲突** = requires more effort, but "不配" ≠ "不能在一起"

### Guidance by Situation

- **Singles**: what type to look for, where to meet them, how to attract
- **Couples**: core strengths, friction zones, how to deepen the bond, communication strategies

## Output

Two layers (see SKILL.md — the plain layer is mandatory and always last):

**Inner layer (命理要点 — for traceability, compact, terms OK):**

1. **多系统配对评分** — each system's verdict + overall direction
2. **核心优势** — where the pairing naturally clicks
3. **摩擦区** — where differences create tension + how to manage
4. **(if BaZi) 合婚深读** — 日主关系/夫妻宫/用神互补/大运同步

**Outer layer (大白话总结 — for the user, always last, no raw jargon):**

5. **一句话说说你俩** — overall compatibility in one plain sentence (e.g. "你们俩底子很合，但都挺有主见，得学着好好说话")
6. **你们最合得来的地方** — name 1-2 concrete areas of natural ease, in everyday relationship words ("你们对生活节奏的看法很像，过日子这块不会有大矛盾")
7. **最容易起摩擦的地方，怎么处理** — name the 1-2 friction zones + a plain-language fix ("你们都觉得自己有理，吵起来谁也不让——约定一个'先听对方说完'的规矩就基本能化解")
8. **(取决于状态) 给你的具体建议** — tailored: singles hear what to look for; couples hear how to deepen. No "日主相克/夫妻宫相冲" in this layer.
