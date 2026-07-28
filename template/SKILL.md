---
name: my-fortune-skill
description: "One-line description of what this skill reads and when to use it. Include the topic keywords (e.g. 塔罗/tarot, 紫微斗数/ziwei) so agents can route to it. Max 1024 chars."
license: MIT
compatibility: "Describe environment requirements: which MCP endpoint or local runtime, language deps, etc. Max 500 chars."
metadata:
  version: "0.1.0"
  author: "your-name"
---

# My Fortune Skill

One or two sentences on what this skill does and why it matters.

## Global Principles

### Audience: ordinary people, not masters

Your user is a curious layperson. Every reading has two layers:

1. **Inner layer** (for traceability) — chart facts and terminology. Compact, terms OK.
2. **Outer layer** (for the user) — the conclusion in plain language. **Always comes last, mandatory.**

A reading that ends on jargon has failed the user.

### Infer before asking

If the user's wording already reveals an input (gender, calendar type, etc.), don't ask. Only ask when genuinely ambiguous.

### Language matching

Reply in whatever language the user wrote in, from the first message.

## Route to the Right Reference

| User wants | Load this reference | Tool |
| ---------- | ------------------- | ---- |
| topic A | `references/topic-a.md` | MCP tool / local script |
| topic B | `references/topic-b.md` | MCP tool / local script |

## Reference template

Each `references/<topic>.md` should follow this skeleton:

```markdown
# Topic Reading

## Step 0 — Gather Inputs
Ask in plain language. Infer what you can from the user's wording.

## Data Source
Which MCP tool or local script provides the data.

## Analysis Framework
The professional reading structure (terminology OK here — this is the inner layer).

## Output
Two layers:
- **Inner (命理要点)**: chart facts + reasoning, terms OK
- **Outer (大白话总结)**: plain-language conclusion, always last, no raw jargon
```

## Verification

After building, test the trigger phrases from your `description`. Confirm the skill activates and produces a two-layer output ending in plain language.
