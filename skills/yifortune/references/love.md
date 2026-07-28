# YiFortune Love & Marriage Reading

Love-focused analysis combining BaZi and (optionally) Western astrology. For chart structure, consult **bazi-chart**; for terminology, **glossary**.

## Data Source

Call `get_bazi`. Read: 日支 (spouse palace / 夫妻宫), 配偶星 (财星 for males, 官杀 for females), 桃花/红艳 stars (神煞), 大运/流年 for timing. If the user also has a birth time + place, compute the Western natal chart via the local script (see **astrology-chart** for the I/O contract) and read Venus (love language), Moon (emotional needs), 7th house (partnership).

## Analysis Framework

### Spouse Profile — Spouse Palace (日支)

The day branch IS the spouse palace. Its 十神 reveals the partner's core trait:

| 日支 十神 | Partner trait                                                       |
| --------- | ------------------------------------------------------------------- |
| 正官/七杀 | Authoritative, responsible, protective — may be controlling         |
| 正印/偏印 | Nurturing, intellectual, supportive — may be emotionally distant    |
| 比肩/劫财 | Peer-like, egalitarian, independent — may compete                   |
| 食神/伤官 | Creative, expressive, charming — may be restless                    |
| 正财/偏财 | Practical, resourceful, dependable — may prioritize material things |

### Spouse Star — What You Attract

- **Male**: 财星 (wealth star) = wife. 正财 = steady partner; 偏财 = exciting/unconventional partner. If 财星 is absent or weak, marriage may come later or require effort.
- **Female**: 官杀 (authority star) = husband. 正官 = steady, respectable; 七杀 = powerful, intense, may be domineering.

### Romance Triggers — Stars (神煞)

- **桃花 (Peach Blossom)**: romance/attraction star — present = magnetic; absent = lower romantic activity
- **红艳 (Red Glamour)**: intense romantic allure
- **驿马 (Travel)** in the spouse palace: may meet partner through travel/relocation

### Love Timing — Luck Pillars & Annual Pillars

- 大运/流年 bringing 配偶星 → marriage window opens
- 大运/流年 combining with 日支 (天合地合) → strong relationship/marriage year
- 流年 clashing 日支 (冲夫妻宫) → relationship change (could be meeting someone new OR a breakup — context-dependent)
- For specific year predictions, cross-reference with the **period-fortune** or **annual-reading**

### Western Astrology Cross-Reference (if available)

- **Venus sign + house**: love language, what one finds beautiful
- **Moon sign**: emotional needs in intimacy
- **7th house + ruler**: partner type and relationship pattern
- **Mars-Venus aspect**: sexual/creative dynamic

Note congruences and divergences between the BaZi and astrology readings — they're different systems with different logic. Don't force them to agree.

## Output

Two layers (see SKILL.md — the plain layer is mandatory and always last):

**Inner layer (命理要点 — for traceability, compact, terms OK):**

1. **配偶画像** — partner traits from spouse palace + spouse star
2. **感情模式** — love style, what you attract, attachment pattern
3. **桃花信号** — romance stars and their meaning
4. **感情时机** — favorable 大运/流年 for meeting/marrying
5. **(optional) 东西方交叉** — BaZi vs. astrology synthesis, if both charts available

**Outer layer (大白话总结 — for the user, always last, no raw jargon):**

6. **你这类人在感情里是什么样** — plain portrait of their love nature (e.g. "你在感情里是付出型，一旦认定就特别上心，但容易吸引到需要你照顾的人")
7. **什么样的人跟你最搭** — describe the compatible partner type in everyday words, not "正官/七杀"
8. **感情上接下来顺不顺** — timing read in plain language ("这两年桃花比较旺，是认识人的好时候" or "现在这段更像是给自己打底的阶段，急不得")
