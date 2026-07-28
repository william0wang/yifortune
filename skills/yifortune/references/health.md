# YiFortune Health & Wellness Reading

Health-focused analysis from the BaZi five-element profile. For chart structure, consult **bazi-chart**; for the full element → organ/diet/exercise/season mapping tables, consult **glossary** (especially mapping-tables.md).

## Data Source

Call `get_bazi`. Read: 五行 distribution (which elements are 旺 strong / 弱 weak / 缺 absent), 偏枯 elements (excess or deficiency), 用神/喜神 (the balancing elements), 日主 strength (身旺/身弱 = constitutional type). Ask the user if they have a known health concern, current season of interest, or specific question (sleep / diet / exercise).

## Analysis Framework

### Organ Vulnerability — Five-Element → Organ Mapping

Each element governs organ systems (see glossary). The **weak/absent** elements = organs to protect; the **excessively strong** elements = organs under stress.

| Imbalance                  | Organs at risk                            | Why                                            |
| -------------------------- | ----------------------------------------- | ---------------------------------------------- |
| 木 weak/absent             | Liver, gallbladder, nervous system, eyes  | Liver function compromised                     |
| 火 weak/absent             | Heart, small intestine, circulation       | Cardiovascular vulnerability                   |
| 土 weak/absent             | Spleen, stomach, digestion, immunity      | Digestive weakness                             |
| 金 weak/absent             | Lungs, large intestine, skin, respiratory | Respiratory vulnerability                      |
| 水 weak/absent             | Kidneys, bladder, bones, reproductive     | Kidney/adrenal weakness                        |
| Element excessively strong | The organ it controls is overworked       | e.g. excessive 木 → liver stress, anger issues |

### Diet Therapy — Five-Color Diet

Nourish the favorable/weak element's foods; reduce over-consumption of the unfavorable element's foods. See mapping-tables.md for the five-color diet table. Give 5-8 specific food recommendations.

### Exercise Prescription

Match exercise to the element that needs support (see mapping-tables.md for element → exercise mapping). E.g. 木 needs support → outdoor/nature activities; 金 needs support → breathing-focused (qigong/swimming).

### Sleep Management — Organ Clock (子午流注)

Based on which organs need support, recommend sleep timing aligned with the meridian clock (see mapping-tables.md). Key principle: 23:00–03:00 (子丑时) is critical for liver/gallbladder repair — must be asleep.

### Seasonal Regimen — 四季养生

Tailor advice to the current season (see mapping-tables.md for the seasonal regimen table). Each season has a primary organ focus and regimen.

### Emotional Regulation — Five Emotions

Excess emotion damages its corresponding organ (怒伤肝, 喜伤心, 思伤脾, 悲伤肺, 恐伤肾). Based on the user's imbalanced element, which emotion do they need to manage? Give specific advice.

## Output

Two layers (see SKILL.md — the plain layer is mandatory and always last):

**Inner layer (命理要点 — for traceability, compact, terms OK):**

1. **体质分析** — constitutional type (身旺/身弱) + five-element balance assessment
2. **重点保养部位** — organs to protect (from weak/absent elements) + why
3. **饮食建议** — five-color diet specifics (foods to eat / reduce)
4. **运动处方** — exercise type + intensity + timing
5. **睡眠/作息** — sleep schedule aligned with organ clock
6. **四季养生** — seasonal focus for the current/upcoming season
7. **情志调节** — which emotion to manage + how

**Outer layer (大白话总结 — for the user, always last, no raw jargon):**

8. **你身体最该重视的地方** — name the 1-2 organ systems to watch, in everyday body words ("你的脾胃和睡眠是短板，平时要重点照顾") — no "木弱/土虚" in this layer
9. **日常最该坚持的两三件事** — 2-3 concrete daily habits, picked from the diet/exercise/sleep analysis, in plain verbs ("晚上 11 点前躺下", "多吃黄色和根茎类的食物")
10. **这个季节特别要注意什么** — one plain seasonal reminder tied to the current/upcoming season
