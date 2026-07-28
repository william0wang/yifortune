# Third-Party Notices

This skill bundles or references third-party software. Each component retains its own license.

## kerykeion (Python library)

- **Repository:** https://github.com/g-battaglia/kerykeion
- **Homepage:** https://kerykeion.net
- **Version:** >= 5.12, < 6
- **License:** GNU Affero General Public License v3.0 (AGPL-3.0)

Used by `scripts/natal_chart.py` for Western astrology natal chart computation (planetary positions, houses, aspects). The script calls kerykeion as an imported Python library.

### ⚠️ Important licensing note

**kerykeion is AGPL-3.0**, a strong copyleft license. This differs from this skill's MIT license in an important way:

- If you **only read the skill's markdown** (SKILL.md + references) and use the YiFortune MCP service for BaZi/I Ching, you are **not** affected by AGPL — kerykeion is never imported.
- If you **run the Western astrology script** (`scripts/natal_chart.py`), you import kerykeion, and AGPL-3.0 terms apply to that usage. AGPL requires that any application you distribute or make available over a network that incorporates AGPL code must itself be made available under AGPL-compatible terms (including source code).

For **closed-source or commercial** use of the astrology features, consider kerykeion's hosted [Astrologer API](https://www.kerykeion.net/astrologer-api) instead of importing the library directly — it consumes kerykeion as an external service, avoiding the copyleft obligation.

See the [full AGPL-3.0 text](https://www.gnu.org/licenses/agpl-3.0.html) for the definitive terms.

## Swiss Ephemeris

Kerykeion bundles [Swiss Ephemeris](https://www.astro.com/swisseph/) data for high-precision astronomical calculations. Swiss Ephephemeris is licensed under a dual license (AGPL-3.0 / commercial). When used via kerykeion under AGPL, the AGPL terms above apply.
