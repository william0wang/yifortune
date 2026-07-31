#!/usr/bin/env bash
# YiFortune casting-number generator.
#
# Turns the user's free-form reply into three integers in [0, 99] for
# `divine_yijing_numbers`. The user never picks numbers — they just talk,
# and this script derives the numbers deterministically.
#
# Usage (from the skill root, i.e. the yifortune/ directory):
#     echo "anything the user said" | bash scripts/cast.sh
#     -> prints "n1 n2 n3\n"  (three integers, each in [0, 99])
#
# Why a script, not the LLM:
#     The LLM is unreliable at exact arithmetic (hashing, byte sums). It
#     must NOT generate the casting numbers itself — doing so breaks the
#     "the diviner personally casts" premise. This script is the trusted
#     deterministic converter. The AI only ferries the user's words in
#     and reads three numbers out.
#
# Why time is mixed into the seed:
#     Traditional 梅花易数 casts *by the moment* (邵康节's 牡丹占 read the
#     time peonies bloomed). So the seed is the user's text *plus* the
#     current minute — "this hexagram belongs to this instant." The same
#     sentence spoken one minute later is a different cast.
#
# Algorithm:
#     seed  = user_text (raw bytes) + ":" + current_minute ("YYYY-MM-DD HH:MM")
#     hex   = sha256(seed)
#     n_i   = int(hex[i*8 : i*8+8], 16) % 100   for i in 0,1,2
#
#     Same (text, minute) -> same three numbers, always. No Python, no
#     venv, no dependencies — only shasum/sha256sum (shipped with the OS).

set -euo pipefail

# Read all of stdin, then trim leading/trailing whitespace.
text=$(cat)
text="${text#"${text%%[![:space:]]*}"}"   # ltrim
text="${text%"${text##*[![:space:]]}"}"   # rtrim

if [ -z "$text" ]; then
  echo "cast.sh: empty input; provide the user's reply on stdin" >&2
  exit 1
fi

# Current minute in local time — the "moment" the cast belongs to.
# Minute granularity (not second) so the number is stable while the user
# finishes typing, but differs across minutes.
minute=$(date '+%Y-%m-%d %H:%M')
seed="${text}:${minute}"

# macOS ships `shasum` (a Perl script in the Base System); Linux distros
# ship `sha256sum` (coreutils). Either produces the same SHA-256 hex.
if command -v shasum >/dev/null 2>&1; then
  hash=$(printf '%s' "$seed" | shasum -a 256 | cut -d' ' -f1)
elif command -v sha256sum >/dev/null 2>&1; then
  hash=$(printf '%s' "$seed" | sha256sum | cut -d' ' -f1)
else
  echo "cast.sh: requires shasum (macOS) or sha256sum (Linux)" >&2
  exit 1
fi

# Slice the 64-char hex into three 8-char chunks, each -> base-10 -> mod 100.
# bash arithmetic ($(( ... ))) handles 64-bit ints, so 0xffffffff fits fine.
n1=$(( 16#${hash:0:8}  % 100 ))
n2=$(( 16#${hash:8:8}  % 100 ))
n3=$(( 16#${hash:16:8} % 100 ))

# Single line, space-separated — easy for the LLM to parse. No JSON: the
# contract is just "three numbers".
printf '%s %s %s\n' "$n1" "$n2" "$n3"
