# YiFortune Astrology Chart — Data Layer

This reference computes a natal chart **locally** (no server, no MCP call) via a Python + kerykeion script bundled in `scripts/`, then **structurally reads** the result. It is the foundation that love, compatibility, and career frameworks build on. **This reference does NOT do topic-specific analysis** — route those to dedicated topic references.

## Prerequisites (one-time install)

This skill ships a local Python script that needs the `kerykeion` library. Install once:

```bash
pip install -r scripts/requirements.txt
```

Python ≥ 3.10 required. If `kerykeion` is missing, the script returns an error telling you to install it — re-run the install command, then retry. The script never touches the network (`online=False`); it computes purely from the Swiss Ephemeris bundled with kerykeion.

## Step 0 — Gather Missing Information

Ask in **plain language**. Astrology is extremely sensitive to time and place, but the user doesn't need a lecture on house cusps — just ask for the facts. Required:

- **name**: any label for the subject.
- **birthDatetime**: ISO-8601 with explicit birthplace offset. Never `Z`. If birth-time uncertainty >15 min, gently flag it: "出生时间记得不太准的话，会稍微影响上升星座的判断，没事，我们先用这个看" — don't paralyze the user with caveat stacks.
- **lat** / **lng**: the **birthplace** coordinates (NOT current residence). Ask "你是在哪个城市出生的？" — resolve to lat/lng yourself.
- **tz_str**: IANA timezone of the birthplace (e.g. `Asia/Shanghai`), must match the offset in `birthDatetime`.

## Step 1 — Compute the Chart (local script)

Pipe a JSON object to the script; it prints structured JSON to stdout:

```bash
echo '{
  "name": "张三",
  "birthDatetime": "1990-01-15T14:30:00+08:00",
  "lat": 39.9042,
  "lng": 116.4074,
  "tz_str": "Asia/Shanghai"
}' | python3 scripts/natal_chart.py
```

The output JSON has:

- `chart.big_three` — `sun`, `moon`, `ascendant` (1st house cusp), `midheaven` (10th house cusp)
- `chart.planets` — Sun/Moon/Mercury…Pluto + North Node + Chiron, each with `sign`, `position`, `house`, `element`, `quality`, `retrograde`
- `chart.houses` — all twelve house cusps (sign + position)
- `aspects` — list of `{p1_name, p2_name, aspect, orbit, aspect_degrees, aspect_movement}`

There is **no SVG** — the analysis must come from the structured `data`, not a visual wheel. The LLM reads JSON, not images.

## Step 2 — Structural Reading

### The Big Three (三巨头)

The personality core — start here.

| Element          | Field                            | Represents                              |
| ---------------- | -------------------------------- | --------------------------------------- |
| Sun (太阳)       | `big_three.sun: { sign, house }` | Core identity, vitality, life direction |
| Moon (月亮)      | `big_three.moon: { sign, house }`| Emotional needs, inner self, security   |
| Ascendant (上升) | `big_three.ascendant: { sign }`  | Outward persona, first impression       |

### Ten Planets in Signs & Houses

Each planet = a psychological function. **Sign** = style (how), **House** = life area (where). Read all in `chart.planets`.

| Planet               | Function                                   |
| -------------------- | ------------------------------------------ |
| Mercury (水星)       | Mind, communication, learning              |
| Venus (金星)         | Love, aesthetics, values                   |
| Mars (火星)          | Drive, desire, conflict                    |
| Jupiter (木星)       | Expansion, opportunity, belief             |
| Saturn (土星)        | Limit, responsibility, mastery             |
| Uranus/Neptune/Pluto | Generational: change/dreams/transformation |
| North Node (北交点)  | Soul evolution direction                   |
| Chiron (凯龙)        | Core wound → healing gift                  |

Note retrograde planets (`retrograde: true`) — their energy turns inward.

### Major Aspects (主要相位)

Read the `aspects` array. Note tight orbs (`orbit` < 2° = strong). Major aspects:

- **conjunction** (合相, 0°): fusion of energies
- **sextile** (六合, 60°): easy opportunity
- **square** (刑相, 90°): tension → growth through friction
- **trine** (三合, 120°): natural flow, talent
- **opposition** (冲相, 180°): polarity, projection, balance needed

Watch for patterns: a **stellium** (3+ planets in one sign/house), a **T-square** (two planets opposing + both squaring a third), or a **grand trine** (three planets 120° apart).

For terminology, consult **glossary**.

## Output

A structural natal chart reading in **two layers** (see SKILL.md — the plain layer is mandatory):

**Inner layer (星盘要点 — for traceability, compact, terms OK):**

1. **三巨头总论** — Sun/Moon/Ascendant interplay and what it means for the personality
2. **行星分布** — key planets in signs/houses (what's prominent, what's challenged)
3. **相位格局** — major aspects and the dynamic they create (e.g. T-square, grand trine, stellium)

**Outer layer (大白话总结 — for the user, always last, no raw jargon):**

4. **一句话说说你这个人** — synthesize the above into a plain portrait of who this person is (e.g. "你是一个特别看重安全感的人，外表很稳，其实心里戏很丰富")
5. **你身上最明显的天赋** — the single strongest planet/aspect, translated into an everyday strength
6. **你最容易卡住的地方** — the single tightest hard aspect or challenged house, translated into a real-life pattern to watch

**When the user asks about a specific topic** (love, compatibility, career), do NOT attempt it here — route to the dedicated topic reference.
