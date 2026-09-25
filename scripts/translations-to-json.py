#!/usr/bin/env python3
"""Regenerate lib/i18n/dictionaries/{en,es}.json from project-docs/quiz-translations-EN-ES.xlsx.

Rerun this whenever the translations sheet changes:
    python3 scripts/translations-to-json.py
"""
import json
import re
import sys
from pathlib import Path

import openpyxl

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "project-docs" / "quiz-translations-EN-ES.xlsx"
OUT_DIR = ROOT / "lib" / "i18n" / "dictionaries"

KEY_PATTERN = re.compile(r"^[a-z0-9_]+(\.[a-z0-9_]+)+$", re.IGNORECASE)


def main() -> None:
    wb = openpyxl.load_workbook(SOURCE)
    ws = wb["Translations"]

    en: dict[str, str] = {}
    es: dict[str, str] = {}
    errors: list[str] = []

    for row in ws.iter_rows(min_row=2, values_only=True):
        key, en_text, es_text = (row + (None, None, None))[:3]
        if not isinstance(key, str) or not KEY_PATTERN.match(key):
            continue  # section header / instructions row

        if en_text is None:
            errors.append(f'"{key}" is missing its English text')
            continue

        if es_text is None:
            errors.append(f'"{key}" is missing its Spanish text')
            continue

        en[key] = str(en_text)
        es[key] = str(es_text)

    if errors:
        print("Translation extraction failed:", file=sys.stderr)
        for e in errors:
            print(f"  - {e}", file=sys.stderr)
        sys.exit(1)

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    (OUT_DIR / "en.json").write_text(json.dumps(en, indent=2, ensure_ascii=False) + "\n")
    (OUT_DIR / "es.json").write_text(json.dumps(es, indent=2, ensure_ascii=False) + "\n")

    print(f"Wrote {len(en)} keys to lib/i18n/dictionaries/en.json and es.json")


if __name__ == "__main__":
    main()
