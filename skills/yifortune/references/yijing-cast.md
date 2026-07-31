# YiFortune I Ching Divination — Data Layer

This skill casts a hexagram and **structurally reads** the result. I Ching is for **specific questions and decisions** — not general personality readings.

## Core Principle — The Diviner Must Cast

A hexagram is only meaningful when the **user personally** initiates it. NEVER generate, guess, or auto-fill the divination numbers yourself — doing so produces a meaningless hexagram and violates the entire premise of I Ching. Your role is to **guide the user to provide casting material** (their words, their free associations), turn it into three numbers via the trusted script below, then interpret the result they drew. If you skip the user-provides-material step, you have not done a divination.

The "material" need not be three numbers. The user's free associations in the moment — a phrase, three words, offhand answers to small questions — are themselves an unpredictable casting act, structurally the same as shaking coins in 梅花易数. What matters is that the material **comes from the user**, not from you.

## Step 0 — Gather Missing Information

Plain-language conversation. The I Ching answers a **specific** question, so a vague "帮我算一卦" needs narrowing — but frame it as a real-life question, not a category picker:

> ❌ Don't: "请问您想就什么事起卦? 事业、感情、还是某个具体决定?" (menu-style)
> ✅ Do: "你心里现在最挂念的是哪件事？可以说说看，越具体越好，比如'该不该接受这个 offer'。"

### Gather Casting Material (the user provides; you never invent)

Casting ultimately needs three integers in [0, 99], but the user does **not** have to pick numbers directly. Collect their words, then derive the numbers with the script below. Pick whichever prompt feels most natural for the moment — there is no fixed form:

| Moment                                                                                       | How to ask (plain words, don't say "起卦")                                              | Feed to script |
| ------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | -------------- |
| User is weighing a specific decision                                                        | "用一句话说说你现在对这件事最直接的感受。"                                                  | the sentence   |
| Casual, wants it light                                                                      | "蹦进脑子里的三个词，想到什么说什么。"                                                    | three words    |
| Wants a ritual feel                                                                         | Three small offhand questions (e.g. "现在几点？/看到什么颜色？/想到的第一个人？"), take the answers | the answers    |
| User prefers to give numbers directly                                                       | "随便报三个 0 到 99 的数给我。" (fallback — skip the script, use the numbers as-is)        | —              |

Do not proceed to Step 1 until the user has provided *some* material. If the user says "你帮我随便选" or refuses to engage, do NOT make up words or numbers yourself — explain in plain words why their own input matters: "卦是你和这件事之间的对话，得你自己开口才有意义，随便说几个字就行。"

### Derive the Numbers (script — you do not touch the arithmetic)

You are unreliable at exact arithmetic (hashing, byte sums) and must not invent numbers. Hand the user's words to the bundled script, which deterministically turns them into three numbers. **Pick the script for the user's OS** — both compute the identical result (UTF-8 bytes + current minute → SHA-256 → three [0,99] numbers), cross-checked to match byte-for-byte:

```bash
# macOS / Linux / Git Bash — uses shasum / sha256sum, shipped with the OS
echo "whatever the user said" | bash scripts/cast.sh

# Windows (PowerShell, native) — uses .NET SHA256, no install
"whatever the user said" | powershell -ExecutionPolicy Bypass -File scripts\cast.ps1
# -> "28 55 67"  (three integers, each in [0, 99])
```

Both scripts mix the text with the **current minute** (traditional 梅花易数 casts *by the moment* — 邵康节's 牡丹占 read the time peonies bloomed), hash them with SHA-256, and slice three numbers. Same words + same minute → same numbers, always, across machines and across OSes. No Python, no install. The current minute is part of the seed on purpose: "this hexagram belongs to this instant."

Pass the three returned numbers straight to `divine_yijing_numbers`. **Fallback**: if neither script runs (rare) or the user already gave three numbers directly, skip the script and use the numbers as given.

| User intent                           | Tool                       | When to use                                      |
| ------------------------------------- | -------------------------- | ------------------------------------------------ |
| Three numbers derived from user's words | `divine_yijing_numbers`    | **DEFAULT** — script output feeds this            |
| User gave three numbers [0-99] directly | `divine_yijing_numbers`    | Fallback when script is unavailable               |
| User asks what a specific gua means   | `divine_yijing_by_code`    | Reference lookup only, NOT a divination          |

There is **no** random/auto-cast tool. Server-side random divination was intentionally removed because a machine-drawn hexagram carries no meaning.

## Step 1 — Cast

Feed the three numbers you derived in Step 0 (or that the user gave directly) into the tool:

```
# e.g. scripts/cast.sh printed "28 55 67"
divine_yijing_numbers({ numbers: [28, 55, 67], question: "我今年换工作是否合适？" })
```

### Result fields — and which one to read first

The server has already done the hard part: it picked the hexagram, found the changing lines (动爻), and looked up the ready-made authoritative interpretation for the exact line that matters. Your job is to read the right field, not to re-derive anything.

| Field | What it contains | How to use it |
| ----- | ---------------- | ------------- |
| `gua.name` | Hexagram name (e.g. "家人") | Title |
| `gua.yao_name` | The changing line's name (e.g. "九五") | Title |
| **`gua.yao_info`** | **The changing line's full interpretation: its 爻辞 + 邵雍's verdict + 傅佩荣's verdict (时运/财运/家宅/身体) + the 变卦 it leads to** | **PRIMARY answer** when `num_dong ≥ 1` |
| **`gua.info`** | **The hexagram's overall text: 卦辞 + 断易天机 + 邵雍 + 傅佩荣 + 传统解卦 (运势/事业/婚恋/决策)** | **BACKGROUND** — the big picture; becomes primary only when `num_dong = 0` |
| `gua.desc_cn` | One-line fortune verdict (e.g. "[吉] 君王到达家...") | The定性 in one sentence |
| `dong_yao` | Changing-line positions (array) | How the verdict was derived |
| `num_dong` | Count of changing lines | **Decides which field is primary** |
| `basic_info.timestamp` | The casting moment, UTC ISO-8601 (e.g. `"2026-07-30T04:55:39.291Z"`) | When the hexagram was drawn (audit) |
| `meta.currentDate` | Server's current time **with +08:00 offset** (e.g. `"2026-07-30T13:06:57+08:00"`) | **The "today" anchor** for any time-sensitive reading — derive "this year/month", check expiry, anchor 流年/流月 from this, never from your own session clock |

### The field-priority rule (do not get this wrong)

I Ching answers the **changing line** first — a static hexagram is just the backdrop.

- **`num_dong ≥ 1` → read `gua.yao_info` as the PRIMARY answer.** The server selected the line per the divination algorithm; `yao_info` carries 邵雍's and 傅佩荣's concrete verdicts for *that exact line* (时运/财运/家宅/身体, etc.). Quote and paraphrase these — they are the ready-made material for answering the user's specific question. `gua.info` is only background context here; do not let the overall hexagram text drown the line-specific verdict.
- **`num_dong = 0` → read `gua.info` as the answer.** The situation is static; the hexagram text (卦辞 + 各家解) is the whole answer.

This mirrors how a human diviner reads: 动爻为主，卦辞为辅。`yao_info` is the line-specific answer; `info` is the setting.

## Step 2 — Structural Reading

### Branch on `num_dong` — which field carries the answer

```
num_dong = 0  →  gua.info is the whole answer (static hexagram)
num_dong ≥ 1  →  gua.yao_info is the primary answer; gua.info is background
```

**`num_dong = 0` (static):** Read `gua.info` — the 卦辞 plus the traditional commentators' take on the whole hexagram. The situation is stable; the overall text is the verdict. Also note `gua.desc_cn` for the one-line 吉凶.

**`num_dong ≥ 1` (has changing lines):** Read **`gua.yao_info`** as the primary answer. The server has already selected the decisive line and packaged its full interpretation:
- The 爻辞 (line text) and its 白话文 explanation
- **邵雍解** — a one-line verdict (吉/平/凶) with concrete advice (e.g. "营谋得利，会得到贵人的提携")
- **傅佩荣解** — broken down by 时运/财运/家宅/身体 (e.g. "时运：人心感通，自然吉祥；财运：奉公营商，利润可保")
- The **变卦** it transforms into (named in the text, e.g. "九五爻动变得周易第22卦：山火贲")

These line-specific verdicts are exactly what answers "this specific thing — should I do it, and how will it go?" Paraphrase them into plain language for the user. Use `gua.info` only to sketch the backdrop (what kind of situation this is overall).

**Multiple changing lines:** `yao_info` points to the line the algorithm judged most critical — treat it as the lead. Cross-reference `gua.info` for the broader flux, but the `yao_info` verdict stays primary.

**All six lines change:** the hexagram fully transforms. The `yao_info` text names the 变卦; read toward that outcome direction.

### Fortune verdicts (贞悔亨厉)

Cross-check `gua.desc_cn` and the verdict words inside `yao_info`/`info` against the action table (see glossary for the full table):

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
