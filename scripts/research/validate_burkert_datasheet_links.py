#!/usr/bin/env python3
"""Validate official Bürkert data-sheet URLs with cached, rate-limited HEAD requests."""

from __future__ import annotations

import argparse
import csv
import hashlib
import json
import subprocess
import time
from collections import defaultdict
from concurrent.futures import ThreadPoolExecutor
from datetime import date
from pathlib import Path
from urllib.parse import urlparse


ROOT = Path(__file__).resolve().parents[2]
RESEARCH = ROOT / "docs" / "research"
CACHE = ROOT / ".config" / "burkert-catalog-cache" / "datasheet-status"
OUTPUT = RESEARCH / "burkert-datasheet-link-validation.csv"
USER_AGENT = "pharma-ci-radar-research/1.0 (+official-public-product-catalog)"

FIELDS = [
    "type_id",
    "language",
    "url",
    "http_status",
    "content_type",
    "validation_status",
    "checked_date",
    "notes",
]


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--delay", type=float, default=10.0, help="Seconds between requests per host.")
    parser.add_argument("--refresh", action="store_true", help="Ignore cached validation results.")
    return parser.parse_args()


def cache_path(url: str) -> Path:
    digest = hashlib.sha256(url.encode("utf-8")).hexdigest()
    return CACHE / f"{digest}.json"


def validate_url(url: str) -> dict[str, str]:
    command = [
        "curl",
        "--location",
        "--compressed",
        "--silent",
        "--show-error",
        "--fail",
        "--head",
        "--retry",
        "1",
        "--retry-all-errors",
        "--retry-delay",
        "3",
        "--connect-timeout",
        "15",
        "--max-time",
        "60",
        "--user-agent",
        USER_AGENT,
        "--write-out",
        "\nCATALOG_STATUS:%{http_code}\nCATALOG_TYPE:%{content_type}\n",
        url,
    ]
    try:
        output = subprocess.check_output(command, text=True, stderr=subprocess.STDOUT)
    except subprocess.CalledProcessError as error:
        return {
            "http_status": "",
            "content_type": "",
            "validation_status": "FAIL",
            "notes": error.output.strip()[-500:],
        }

    status = ""
    content_type = ""
    for line in output.splitlines():
        if line.startswith("CATALOG_STATUS:"):
            status = line.split(":", 1)[1].strip()
        elif line.startswith("CATALOG_TYPE:"):
            content_type = line.split(":", 1)[1].strip().lower()
    passed = status.startswith("2") and "application/pdf" in content_type
    return {
        "http_status": status,
        "content_type": content_type,
        "validation_status": "PASS" if passed else "FAIL",
        "notes": "Official URL returned a PDF response." if passed else "Expected a successful application/pdf response.",
    }


def validate_host(host: str, urls: list[str], delay: float, refresh: bool) -> None:
    last_request = 0.0
    for index, url in enumerate(urls, start=1):
        target = cache_path(url)
        if target.exists() and not refresh:
            cached = json.loads(target.read_text(encoding="utf-8"))
            if cached.get("validation_status") == "PASS":
                continue
        wait = delay - (time.monotonic() - last_request)
        if wait > 0:
            time.sleep(wait)
        last_request = time.monotonic()
        result = validate_url(url)
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        if index == 1 or index % 10 == 0 or index == len(urls):
            print(f"[{host}] validated {index}/{len(urls)}", flush=True)


def main() -> None:
    args = parse_args()
    catalog_path = RESEARCH / "burkert-type-catalog.csv"
    with catalog_path.open(encoding="utf-8", newline="") as handle:
        catalog = list(csv.DictReader(handle))

    references: list[tuple[str, str, str]] = []
    for row in catalog:
        if row["english_datasheet_url"]:
            references.append((row["type_id"], "EN", row["english_datasheet_url"]))
        if row["chinese_datasheet_url"]:
            references.append((row["type_id"], "ZH", row["chinese_datasheet_url"]))

    urls_by_host: dict[str, list[str]] = defaultdict(list)
    for url in dict.fromkeys(url for _, _, url in references):
        urls_by_host[urlparse(url).netloc].append(url)

    with ThreadPoolExecutor(max_workers=max(1, len(urls_by_host))) as executor:
        futures = [
            executor.submit(validate_host, host, urls, args.delay, args.refresh)
            for host, urls in sorted(urls_by_host.items())
        ]
        for future in futures:
            future.result()

    checked = date.today().isoformat()
    rows = []
    for type_id, language, url in references:
        status_path = cache_path(url)
        result = (
            json.loads(status_path.read_text(encoding="utf-8"))
            if status_path.exists()
            else {
                "http_status": "",
                "content_type": "",
                "validation_status": "FAIL",
                "notes": "No validation result was cached.",
            }
        )
        rows.append(
            {
                "type_id": type_id,
                "language": language,
                "url": url,
                **result,
                "checked_date": checked,
            }
        )

    with OUTPUT.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=FIELDS, lineterminator="\n")
        writer.writeheader()
        writer.writerows(rows)

    failures = [row for row in rows if row["validation_status"] != "PASS"]
    print(f"Wrote {len(rows)} link checks; failures: {len(failures)}")
    if failures:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
