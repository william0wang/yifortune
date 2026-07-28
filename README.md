# YiFortune Skill

[![Agent Skills](https://img.shields.io/badge/Agent%20Skills-spec%20compliant-blue)](https://agentskills.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.0.0-green.svg)](#changelog)

> An [Agent Skills](https://agentskills.io)–compliant skill that turns any LLM client into a professional Chinese fortune-telling and astrology assistant.

YiFortune teaches an AI **how to read** fortune-telling data — the structural frameworks, the terminology, and the plain-language delivery — so that when a chart or hexagram is computed, the output is a high-quality professional reading instead of raw numbers.

It covers **15 topics**: 八字 (BaZi), 西方占星 (Western astrology), 易经起卦 (I Ching divination), 事业 (career), 财运 (wealth), 感情 (love), 健康 (health), 成长 (growth), 配对 (compatibility), 周期运势 (period fortune), 姓名 (name analysis), 择日 (date selection), 风水 (feng shui), 流年详批 (annual reading), and a shared terminology layer.

## What this is — and isn't

| ✅ This repo provides | ❌ It does NOT include |
| --------------------- | --------------------- |
| The `yifortune` skill (SKILL.md + references + scripts) | The MCP server / calculation engine |
| Reading frameworks for 15 fortune-telling topics | The frontend / key-claim service |
| A local Python script for Western natal charts | API keys or hosted infrastructure |
| Plain-language output rules (the AI serves laypeople, not masters) | Domain or deployment config |

The calculation engine runs as a separate **MCP HTTP service**. This skill consumes its output and frames it. See [Prerequisites](#prerequisites).

---

## Prerequisites

### 1. Get an API Key

Open **https://yifortune.pages.dev**, enter your email, and the API key (`yfk_...`) is sent to your inbox (check spam). Free tier: 100 calls/month per user, resets on the 1st of each month.

### 2. Confirm your client supports Streamable HTTP MCP

The YiFortune MCP server uses the **Streamable HTTP** transport with API-key auth. Compatible clients include:

- **Claude Code** / **Claude Desktop**
- **Cursor**
- **ZCode**
- Any client supporting the MCP [Streamable HTTP](https://modelcontextprotocol.io/specification) transport

---

## Install

Pick the path that matches your client. All options require the [prerequisites](#prerequisites) above.

### Option A — Manual install (Claude Code, ZCode, Claude Desktop, Cursor, etc.)

Copy the `yifortune` skill directory into your client's skills folder.

**Claude Code / other `~/.agents`-compatible clients:**

```bash
git clone https://github.com/william0wang/yifortune.git
cp -r yifortune/skills/yifortune ~/.agents/skills/
```

**ZCode:**

```bash
git clone https://github.com/william0wang/yifortune.git
cp -r yifortune/skills/yifortune ~/.zcode/skills/
```

**Claude Desktop:** place the skill under `~/Library/Application Support/Claude/skills/` (macOS) or `%APPDATA%\Claude\skills\` (Windows), then restart Claude Desktop.

After installing, just mention the skill — e.g. "Use the yifortune skill to read my BaZi chart."

### Option B — Claude API

You can upload custom skills via the Claude API. See the [Skills API Quickstart](https://docs.claude.com/en/api/skills-guide) and point the skill at the YiFortune MCP endpoint described below.

### Configure the MCP endpoint

After installing the skill, point your client at the YiFortune MCP server:

- **Endpoint**: `https://mcp.yifortune.workers.dev/mcp`
- **Auth header**: `X-API-Key: yfk_xxxxxxxxxxxxxxxxxxxxxxxx` (the key from step 1)

Per-client config snippets (Claude Desktop JSON, Cursor settings, ZCode) are in [`skills/yifortune/references/setup.md`](skills/yifortune/references/setup.md).

### (Western astrology only) Install the Python dependency

Western astrology is computed **locally** via a bundled Python script (no MCP call). Install once:

```bash
pip install -r skills/yifortune/scripts/requirements.txt   # Python ≥ 3.10
```

BaZi and I Ching do **not** need this — they use the MCP service.

> ⚠️ **License note**: the astrology script depends on [kerykeion](https://github.com/g-battaglia/kerykeion), which is **AGPL-3.0** (strong copyleft). Importing it for the astrology feature triggers AGPL terms on your application. For closed-source/commercial use, prefer kerykeion's hosted [Astrologer API](https://www.kerykeion.net/astrologer-api). The rest of the skill (markdown + BaZi/I Ching via MCP) is MIT and unaffected. See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

---

## Verify the installation

After installing and configuring the MCP endpoint, try these in your client:

| Prompt | What happens |
| ------ | ------------ |
| "帮我排个八字，1990 年 1 月 15 日下午 2 点 30 分出生在上海，男" | BaZi chart reading |
| "我适合做什么工作？" (birth info required) | career analysis |
| "帮我为'今年换工作是否合适'起一卦" | I Ching divination (you'll be asked for three numbers) |
| "What does my astrology chart say about me?" | Western natal chart, replied **in English** |
| "下个月想搬家，帮我选个吉日" | auspicious date selection |

The first call of each session auto-verifies the MCP connection. If it fails, the skill walks you through setup — see [`references/setup.md`](skills/yifortune/references/setup.md).

---

## Architecture: single skill + progressive disclosure

Following the [Agent Skills spec](https://agentskills.io/specification), YiFortune is **one skill** that loads content on demand:

```
skills/yifortune/
├── SKILL.md                  ← entry: routing table + global principles (loaded on trigger)
├── scripts/
│   ├── natal_chart.py        ← local Western astrology computation (Python + kerykeion, offline)
│   └── requirements.txt
└── references/               ← per-topic reading frameworks (loaded on demand, not at startup)
    ├── bazi-chart.md         ← BaZi chart reading (data layer)
    ├── astrology-chart.md    ← Western natal chart reading (data layer)
    ├── yijing-cast.md        ← I Ching divination reading (data layer)
    ├── glossary.md           ← terminology (single source of truth)
    ├── mapping-tables.md     ← extended element mapping tables
    ├── terms-detail.md       ← deep terminology reference
    ├── setup.md              ← MCP client configuration guide
    ├── career.md  wealth.md  love.md  health.md  growth.md
    ├── compatibility.md  period-fortune.md  name-analysis.md
    └── date-selection.md  fengshui.md  annual-reading.md
```

**Three-layer loading** (progressive disclosure):

1. **Metadata** (at startup) — the client reads only `SKILL.md` frontmatter to decide whether to trigger this skill (~100 tokens)
2. **Body** (on trigger) — reads `SKILL.md`: the routing table + global principles, then locates the relevant reference
3. **References** (on demand) — loads the specific `references/*.md` only when a topic is needed, keeping the context window lean

---

## Design principles

- **Audience: ordinary people, not masters** — the AI serves a curious layperson. Every reading has two layers: an inner layer (chart facts + terminology, for traceability) and an **outer layer in plain language** (what the user actually came for).
- **Proactive service** — the AI routes and decides which tool to use; it never dumps a menu of tools for the user to pick from.
- **Language matching** — the AI replies in whatever language the user wrote in, from the very first message.
- **Infer before asking** — when birth info (gender, calendar type, etc.) can be read from the user's wording, the AI doesn't ask.
- **Single source of truth** — all terminology lives in `references/glossary.md`; other references cite it instead of redefining.

## What this skill does NOT do

- ❌ No compliance/censorship rules — readings are produced by the user's own LLM
- ❌ No word-count mandates — unrelated to reading quality
- ❌ No reading decisions on the LLM's behalf — the skill provides frameworks and terminology; the LLM produces the reading with its own capability

---

## Troubleshooting

| Symptom | Cause / Fix |
| ------- | ----------- |
| Skill doesn't activate | Confirm the `yifortune` directory is in your client's skills folder and matches the `name: yifortune` in `SKILL.md` frontmatter. Restart the client. |
| `get_bazi` tool not found | The MCP server isn't configured. Re-check the endpoint URL and `X-API-Key` header — see [`references/setup.md`](skills/yifortune/references/setup.md). |
| 401 "Invalid or disabled API key" | Key is wrong/typo'd. Re-verify the key from your email; if lost, re-register at https://yifortune.pages.dev. |
| "Monthly quota exhausted" | Free tier hits 100 calls/month. Resets on the 1st of next month. |
| Astrology returns a Python error | Run `pip install -r skills/yifortune/scripts/requirements.txt`. Requires Python ≥ 3.10. |

---

## Contributing

Contributions are welcome — especially corrections to terminology, new topic references, or translations. See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## Changelog

### 1.0.0 — 2026-07-28

- First public release. Single skill architecture with progressive disclosure (SKILL.md + references + scripts)
- 15 topics: BaZi, Western astrology, I Ching, career, wealth, love, health, growth, compatibility, period fortune, name analysis, date selection, feng shui, annual reading
- Plain-language output rules (two-layer: professional analysis + plain conclusion)
- Auto MCP connection check on first call, with guided setup on failure

## License

[MIT](LICENSE) © 2026 william0wang
