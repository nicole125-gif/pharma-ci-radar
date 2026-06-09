#!/usr/bin/env python3
"""Validate Fujikin catalogue links discovered in the official index."""

from __future__ import annotations

import csv
import time
from datetime import date
from pathlib import Path

import requests


ROOT = Path(__file__).resolve().parents[2]
RESEARCH = ROOT / "docs" / "research"
CATALOG = RESEARCH / "fujikin-series-catalog.csv"
OUTPUT = RESEARCH / "fujikin-catalog-link-validation.csv"
USER_AGENT = "pharma-ci-radar-research/1.0 (+official-public-product-catalog)"
FIELDS = [
    "record_id",
    "language",
    "url",
    "status_code",
    "content_type",
    "validation_status",
    "accessed_date",
    "notes",
]


def read_rows() -> list[dict[str, str]]:
    with CATALOG.open(encoding="utf-8", newline="") as handle:
        return list(csv.DictReader(handle))


def main() -> None:
    targets = [
        (row["record_id"], language, row[field])
        for row in read_rows()
        for language, field in (
            ("EN", "english_catalogue_url"),
            ("ZH", "chinese_catalogue_url"),
        )
        if row[field]
    ]
    session = requests.Session()
    session.headers["User-Agent"] = USER_AGENT
    cache: dict[str, tuple[int, str, str, str]] = {}
    output = []
    for index, (record_id, language, url) in enumerate(targets, 1):
        if url not in cache:
            try:
                response = session.get(url, timeout=90, stream=True)
                status = response.status_code
                content_type = response.headers.get("content-type", "")
                validation = (
                    "PASS"
                    if status == 200
                    and ("pdf" in content_type.lower() or url.lower().endswith(".pdf"))
                    else "FAIL"
                )
                notes = ""
                response.close()
            except requests.RequestException as error:
                status = 0
                content_type = ""
                validation = "FAIL"
                notes = str(error)
            cache[url] = (status, content_type, validation, notes)
            time.sleep(0.2)
        status, content_type, validation, notes = cache[url]
        output.append(
            {
                "record_id": record_id,
                "language": language,
                "url": url,
                "status_code": status,
                "content_type": content_type,
                "validation_status": validation,
                "accessed_date": date.today().isoformat(),
                "notes": notes,
            }
        )
        if index == 1 or index % 25 == 0 or index == len(targets):
            print(f"validated {index}/{len(targets)}", flush=True)
    with OUTPUT.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=FIELDS, lineterminator="\n")
        writer.writeheader()
        writer.writerows(output)
    failed = [row for row in output if row["validation_status"] != "PASS"]
    print(
        {
            "rows": len(output),
            "unique_urls": len(cache),
            "passed": len(output) - len(failed),
            "failed": len(failed),
        }
    )
    if failed:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
