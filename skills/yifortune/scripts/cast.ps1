<#
.SYNOPSIS
  YiFortune casting-number generator (Windows native).

.DESCRIPTION
  Turns the user's free-form reply into three integers in [0, 99] for
  `divine_yijing_numbers`. The user never picks numbers - they just talk,
  and this script derives the numbers deterministically.

  Usage:
      "anything the user said" | powershell -ExecutionPolicy Bypass -File scripts\cast.ps1
      -> "n1 n2 n3"   (three integers, each in [0, 99])

  Why a script, not the LLM:
      The LLM is unreliable at exact arithmetic (hashing, byte sums). It
      must NOT generate the casting numbers itself - doing so breaks the
      "the diviner personally casts" premise. This script is the trusted
      deterministic converter. The AI only ferries the user's words in
      and reads three numbers out.

  Why time is mixed into the seed:
      Traditional 梅花易数 casts *by the moment* (邵康节's 牡丹占 read the
      time peonies bloomed). So the seed is the user's text *plus* the
      current minute - "this hexagram belongs to this instant." The same
      sentence spoken one minute later is a different cast.

  Algorithm (MUST match scripts/cast.sh byte-for-byte):
      seed  = user_text (UTF-8 bytes) + ":" + current_minute ("YYYY-MM-DD HH:MM")
      hex   = sha256(seed)
      n_i   = [convert]::ToInt64(hex.Substring(i*8, 8), 16) % 100   for i in 0,1,2

      Same (text, minute) -> same three numbers, always, across Windows /
      macOS / Linux. The companion cast.sh uses the identical formula.
#>

$ErrorActionPreference = 'Stop'

# Read all of stdin, trim surrounding whitespace.
$raw = [Console]::In.ReadToEnd()
$text = $raw.Trim()

if ([string]::IsNullOrEmpty($text)) {
    [Console]::Error.WriteLine("cast.ps1: empty input; provide the user's reply on stdin")
    exit 1
}

# Current minute in local time - the "moment" the cast belongs to.
# Format MUST match cast.sh: `date '+%Y-%m-%d %H:%M'`.
$minute = Get-Date -Format 'yyyy-MM-dd HH:mm'
$seed   = "$text`:$minute"

# SHA-256 over the UTF-8 bytes of the seed. .NET's SHA256 computes on
# bytes, so encoding is explicit - this is what keeps it byte-aligned
# with bash's `printf '%s' | shasum` (which also emits raw UTF-8 bytes).
$utf8 = [System.Text.Encoding]::UTF8.GetBytes($seed)
$hashBytes = [System.Security.Cryptography.SHA256]::Create().ComputeHash($utf8)
$sb = New-Object System.Text.StringBuilder
foreach ($b in $hashBytes) { [void]$sb.Append($b.ToString('x2')) }
$hash = $sb.ToString()

# Slice the 64-char hex into three 8-char chunks, each -> base-16 -> mod 100.
# ToInt64 handles 0xffffffff (fits in Int64, unlike Int32 which overflows).
$n1 = [convert]::ToInt64($hash.Substring(0, 8), 16) % 100
$n2 = [convert]::ToInt64($hash.Substring(8, 8), 16) % 100
$n3 = [convert]::ToInt64($hash.Substring(16, 8), 16) % 100

# Single line, space-separated - same contract as cast.sh.
Write-Output "$n1 $n2 $n3"
