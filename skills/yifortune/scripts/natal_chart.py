#!/usr/bin/env python3
"""YiFortune local natal chart calculator.

Runs entirely on the client machine — no server, no network (kerykeion's
offline mode). Reads a JSON request from stdin, computes the natal chart
via kerykeion, and prints structured JSON to stdout for the LLM to read.

Usage (from the skill root, i.e. the yifortune/ directory):
    echo '{"name":"...","birthDatetime":"...","lat":...,"lng":...,"tz_str":"..."}' \
        | python3 scripts/natal_chart.py

Input fields:
    name           (str)  any label for the subject
    birthDatetime  (str)  ISO-8601 with explicit offset, e.g. "1990-01-15T14:30:00+08:00".
                          NEVER use a trailing "Z" — birthplace local clock time matters.
    lat            (float) birthplace latitude
    lng            (float) birthplace longitude
    tz_str         (str)  IANA timezone, e.g. "Asia/Shanghai" (must match the offset
                          in birthDatetime for the birthplace)

Output: JSON with sun/moon/ascendant (Big Three), all planets in signs & houses,
the twelve house cusps, and the major aspects. No SVG — the LLM reads structured
data, not an image wheel.
"""

from __future__ import annotations

import json
import sys
from datetime import datetime


def parse_birth_datetime(s: str) -> datetime:
    """Parse an ISO-8601 string with an explicit UTC offset."""
    # datetime.fromisoformat handles "+08:00" offsets in Python 3.11+.
    # It rejects a trailing "Z" on older Pythons, so normalize it.
    text = s.strip()
    if text.endswith("Z"):
        raise ValueError(
            "birthDatetime must carry an explicit UTC offset (e.g. +08:00), "
            "not a trailing 'Z'. The offset encodes the birthplace's clock time."
        )
    try:
        return datetime.fromisoformat(text)
    except ValueError as e:
        raise ValueError(f"Invalid birthDatetime {s!r}: {e}") from e


def point_to_dict(point) -> dict:
    """Flatten a kerykeion AstrologicalPointModel into a compact dict.

    kerykeion 5.x exposes pydantic models; model_dump() gives the full record.
    We keep the fields an astrologer actually reads.
    """
    if point is None:
        return {}
    try:
        d = point.model_dump()
    except AttributeError:
        # Fallback for attribute-style access on older objects.
        d = {
            "name": getattr(point, "name", ""),
            "sign": getattr(point, "sign", ""),
            "position": getattr(point, "position", None),
            "house": getattr(point, "house", ""),
            "quality": getattr(point, "quality", ""),
            "element": getattr(point, "element", ""),
            "retrograde": getattr(point, "retrograde", None),
        }
    # Keep the readable subset; drop noisy internals.
    keep = ("name", "sign", "sign_num", "position", "abs_pos", "house",
            "quality", "element", "emoji", "retgrograde", "retrograde")
    return {k: v for k, v in d.items() if k in keep}


PLANET_KEYS = (
    "sun", "moon", "mercury", "venus", "mars", "jupiter", "saturn",
    "uranus", "neptune", "pluto", "north_node", "chiron",
)
ANGLE_KEYS = ("first_house", "tenth_house", "seventh_house", "fourth_house")
ALL_HOUSE_KEYS = tuple(f"{ordinal}_house" for ordinal in (
    "first", "second", "third", "fourth", "fifth", "sixth",
    "seventh", "eighth", "ninth", "tenth", "eleventh", "twelfth",
))


def extract_chart(subject) -> dict:
    """Pull the Big Three, planets, houses, and aspects off a kerykeion subject."""
    planets = {}
    for key in PLANET_KEYS:
        attr = getattr(subject, key, None)
        if attr is not None:
            planets[key] = point_to_dict(attr)

    angles = {}
    for key in ANGLE_KEYS:
        attr = getattr(subject, key, None)
        if attr is not None:
            angles[key] = point_to_dict(attr)

    houses = {}
    for key in ALL_HOUSE_KEYS:
        attr = getattr(subject, key, None)
        if attr is not None:
            houses[key] = point_to_dict(attr)

    chart = {
        "big_three": {
            "sun": planets.get("sun", {}),
            "moon": planets.get("moon", {}),
            # Ascendant = first house cusp sign/position.
            "ascendant": angles.get("first_house", {}),
            "midheaven": angles.get("tenth_house", {}),
        },
        "planets": planets,
        "houses": houses,
        "angles": angles,
    }
    return chart


def extract_aspects(subject) -> list:
    """Compute major aspects via kerykeion and return a compact list."""
    try:
        from kerykeion import NatalAspects
    except ImportError:
        return []
    try:
        na = NatalAspects(subject)
        raw = getattr(na, "all_aspects", None) or getattr(na, "aspects", None)
    except Exception as e:  # noqa: BLE001 — aspect API varies across versions.
        return [{"error": f"aspect calculation failed: {e}"}]
    if not raw:
        return []

    out = []
    for a in raw:
        if hasattr(a, "model_dump"):
            d = a.model_dump()
        elif isinstance(a, dict):
            d = a
        else:
            d = {
                "p1_name": getattr(a, "p1_name", None),
                "p2_name": getattr(a, "p2_name", None),
                "aspect": getattr(a, "aspect", None),
                "orbit": getattr(a, "orbit", None),
            }
        # Keep the human-readable fields; drop numeric indices and noise.
        keep = ("p1_name", "p2_name", "aspect", "orbit",
                "aspect_degrees", "diff", "aspect_movement")
        out.append({k: v for k, v in d.items() if k in keep})
    return out


def main() -> int:
    raw = sys.stdin.read()
    if not raw.strip():
        print(json.dumps({"error": "no input received on stdin"}))
        return 1

    try:
        req = json.loads(raw)
    except json.JSONDecodeError as e:
        print(json.dumps({"error": f"invalid JSON input: {e}"}))
        return 1

    required = ("name", "birthDatetime", "lat", "lng", "tz_str")
    missing = [k for k in required if k not in req]
    if missing:
        print(json.dumps({"error": f"missing required fields: {', '.join(missing)}"}))
        return 1

    try:
        dt = parse_birth_datetime(req["birthDatetime"])
    except ValueError as e:
        print(json.dumps({"error": str(e)}))
        return 1

    try:
        from kerykeion import AstrologicalSubjectFactory
    except ImportError:
        print(json.dumps({
            "error": "kerykeion is not installed. Run: pip install kerykeion",
        }))
        return 1

    try:
        subject = AstrologicalSubjectFactory.from_birth_data(
            req["name"],
            dt.year, dt.month, dt.day,
            dt.hour, dt.minute,
            lng=float(req["lng"]),
            lat=float(req["lat"]),
            tz_str=req["tz_str"],
            online=False,  # never hit the network — coordinates are explicit.
        )
    except Exception as e:  # noqa: BLE001 — surface kerykeion errors verbatim.
        print(json.dumps({"error": f"kerykeion failed: {e}"}))
        return 1

    result = {
        "birth": {
            "name": req["name"],
            "datetime": req["birthDatetime"],
            "lat": req["lat"],
            "lng": req["lng"],
            "tz": req["tz_str"],
        },
        "chart": extract_chart(subject),
        "aspects": extract_aspects(subject),
    }
    print(json.dumps(result, ensure_ascii=False, indent=2, default=str))
    return 0


if __name__ == "__main__":
    sys.exit(main())
