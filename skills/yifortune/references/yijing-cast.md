# YiFortune I Ching Divination — Data Layer

This skill casts a hexagram and **structurally reads** the result. I Ching is for **specific questions and decisions** — not general personality readings.

## Core Principle — The Diviner Must Cast

A hexagram is only meaningful when the **user personally** initiates it. NEVER generate, guess, or auto-fill the divination numbers yourself — doing so produces a meaningless hexagram and violates the entire premise of I Ching. Your role is to **guide the user to supply three numbers**, then interpret the result they drew. If you skip the user-chooses-numbers step, you have not done a divination.

## Step 0 — Gather Missing Information

Plain-language conversation. The I Ching answers a **specific** question, so a vague "帮我算一卦" needs narrowing — but frame it as a real-life question, not a category picker:

> ❌ Don't: "请问您想就什么事起卦? 事业、感情、还是某个具体决定?" (menu-style)
> ✅ Do: "你心里现在最挂念的是哪件事？可以说说看，越具体越好，比如'该不该接受这个 offer'。"

### ALWAYS Ask the User for Three Numbers

Casting requires three integers in [0, 99], **chosen by the user**. Prompt them in everyday words — don't say "起卦":

> "现在请凭直觉，随口报三个 0 到 99 之间的数字给我——想到什么说什么，不用想太多。"

Do not proceed to Step 1 until the user provides three numbers. If the user says "你帮我随便选" or refuses to engage, do NOT pick numbers yourself — explain in plain words why their own choice matters: "卦是你和这件事之间的对话，得你自己开口才有意义，你随便报三个数就行。"

| User intent                           | Tool                       | When to use                                      |
| ------------------------------------- | -------------------------- | ------------------------------------------------ |
| User supplies three numbers [0-99]    | `divine_yijing_numbers`    | **DEFAULT** — the only true divination entry     |
| User asks what a specific gua means   | `divine_yijing_by_code`    | Reference lookup only, NOT a divination          |

There is **no** random/auto-cast tool. Server-side random divination was intentionally removed because a machine-drawn hexagram carries no meaning.

## Step 1 — Cast

```
divine_yijing_numbers({ numbers: [7, 23, 41], question: "我今年换工作是否合适？" })
```

The result (`YiResult`) contains: `gua` (name, 卦辞 text, 爻辞 line texts, codes), `dong_yao` (changing-line positions), `num_dong` (count), `basic_info` (metadata).

### `meta.currentDate` — the "today" anchor

The result also carries `meta.currentDate`: the server's current time as an ISO-8601 string with the +08:00 offset, e.g. `"2026-07-28T20:22:38+08:00"`. Use it as the "today" reference whenever the reading touches time (e.g. "this year", "next month", seasonal timing). Do not rely on your own session clock — see **bazi-chart** Step 1 for the full rationale.

## Step 2 — Structural Reading

### Read the Original Hexagram (本卦)

Start with `gua.name` and `gua.info` (卦辞). What is the oracle's overall message for this question? Note the fortune verdict in `gua.desc_cn` (吉/凶/无咎/悔/吝/厉 — see glossary).

### Determine the Changing Lines (动爻)

Check `dong_yao` array and `num_dong`:

- **No changing lines** (num_dong = 0): read the 卦辞 (hexagram text) as the whole answer. Static situation.
- **One changing line**: read that specific 爻辞 (line text) as the primary answer — it's the most precise reading.
- **Multiple changing lines**: the situation is in flux. Read the 本卦 overall + the 变卦 for where it's heading. The most senior changing line often carries the key message.
- **All lines change**: read the 变卦 as the primary answer.

### Derive the Transformed Hexagram (变卦)

If there are changing lines, the hexagram transforms. The 变卦 shows the **outcome direction** — where the situation is heading if the current dynamics play out.

### Fortune Verdicts (贞悔亨厉)

Translate the textual judgments into action guidance (see glossary for full 贞悔亨厉 table):

| Verdict  | Action                                   |
| -------- | ---------------------------------------- |
| 元/亨/吉 | Proceed with confidence                  |
| 利       | Seize the opportunity                    |
| 贞       | Hold steady, don't move rashly           |
| 无咎     | Okay to proceed, mind your duties        |
| 悔/吝    | Reflect, adjust, expect minor difficulty |
| 厉       | High alert — danger, but not hopeless    |
| 凶       | Do not act, lay low                      |

## Output

Two layers (see SKILL.md — the plain layer is mandatory):

**Inner layer (卦象要点 — for traceability, compact, terms OK):**

1. **卦象概览** — hexagram name + the core message of 卦辞
2. **动爻解读** — what the changing lines specifically say (if any)
3. **变卦趋势** — the outcome direction (if there are changing lines)

**Outer layer (大白话结论 — for the user, always last, no raw jargon):**

4. **一句话回答你的问题** — direct answer to the user's actual question, in their own words. Yes/no + a short why. E.g. "该去。这卦整体是通的，越走越开，主要卡点在第 4 个月前后，扛过去就顺了。"
5. **接下来具体怎么做** — 2-3 concrete actions derived from the 贞悔亨厉 verdict, in plain verbs ("现在就可以推进", "再等一个月看看", "先别签"). No "贞/悔/吝/厉" in this layer unless you've already glossed it.

For date-selection (择日) and specific event consultation, route to the **date-selection** reference which builds on this divination.
