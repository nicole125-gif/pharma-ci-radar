#!/usr/bin/env python3
"""Collect Fujikin series-level catalogue rows from the official download page."""

from __future__ import annotations

import argparse
import csv
import hashlib
import json
import re
from collections import Counter
from datetime import date
from pathlib import Path
from urllib.parse import urljoin

import requests
from lxml import html


ROOT = Path(__file__).resolve().parents[2]
RESEARCH = ROOT / "docs" / "research"
CACHE = ROOT / ".config" / "fujikin-series-cache"
DOWNLOAD_URL = "https://www.fujikin.co.jp/en/support/download/"
USER_AGENT = "pharma-ci-radar-research/1.0 (+official-public-product-catalog)"

CATALOG_FIELDS = [
    "record_id",
    "catalogue_title",
    "category",
    "subcategory",
    "product_group",
    "model_numbers",
    "maximum_nominal_sizes",
    "cleanliness",
    "flow_rate_class",
    "materials",
    "pharma_relevance",
    "pharma_basis",
    "pharma_applications",
    "english_catalogue_url",
    "chinese_catalogue_url",
    "official_index_url",
    "accessed_date",
    "evidence_grade",
    "notes",
]

SPEC_FIELDS = [
    "record_id",
    "spec_key",
    "value_text",
    "source_url",
    "accessed_date",
    "notes",
]

EVIDENCE_FIELDS = [
    "evidence_id",
    "company",
    "record_id",
    "topic",
    "fact_status",
    "summary",
    "source_type",
    "source_title",
    "source_url",
    "accessed_date",
    "evidence_grade",
    "supports_conclusion",
    "notes",
]

TOP_LEVEL = {
    "1": "Manual Valves",
    "2": "Automatic Valves",
    "3": "Other Valves",
    "4": "Fittings",
    "5": "Systems",
    "6": "Other",
    "7": "Digest",
}

HIGH_PATTERNS = (
    r"\bBNW\b",
    r"\bBSW",
    r"\bLPS",
    r"\bBPV",
    r"\bBYC",
    r"\bSVLCD",
    r"pinch valve systems",
    r"small volume filling",
)

MEDIUM_PATTERNS = (
    r"\bMINUCON\b",
    r"\bFCS",
    r"static mixer",
    r"ball valve",
    r"check valve",
    r"filter",
    r"tube fitting",
    r"auto weld",
)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--refresh", action="store_true")
    parser.add_argument("--build-only", action="store_true")
    return parser.parse_args()


def clean(value: str) -> str:
    return " ".join(value.replace("\xa0", " ").split())


def slug(value: str) -> str:
    normalized = re.sub(r"[^A-Z0-9]+", "-", value.upper()).strip("-")
    return normalized or "UNNAMED"


def record_id(category: str, subcategory: str, models: str, title: str) -> str:
    readable = slug(models or title)[:55]
    digest = hashlib.sha1(
        f"{category}|{subcategory}|{models}|{title}".encode("utf-8")
    ).hexdigest()[:8].upper()
    return f"{readable}-{digest}"


def cache_path() -> Path:
    return CACHE / "download.html"


def fetch(refresh: bool) -> None:
    target = cache_path()
    if target.exists() and not refresh:
        return
    response = requests.get(
        DOWNLOAD_URL,
        timeout=90,
        headers={"User-Agent": USER_AGENT},
    )
    response.raise_for_status()
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_bytes(response.content)


def language_link(row: html.HtmlElement, label: str) -> str:
    for anchor in row.xpath(".//a[@href]"):
        if clean(anchor.text_content()).lower() == label.lower():
            return urljoin(DOWNLOAD_URL, anchor.get("href")).split("#", 1)[0]
    return ""


def classify_pharma(
    title: str,
    product_group: str,
    models: str,
    category: str,
) -> tuple[str, str, str]:
    combined = f"{title} {product_group} {models}"
    if any(re.search(pattern, combined, flags=re.I) for pattern in HIGH_PATTERNS):
        return (
            "HIGH",
            "Official diaphragm/life-science catalogue family or hygienic filling/pinch family.",
            "卫生流体、制药设备、CIP/SIP或灌装；必须按具体型号核对。",
        )
    if any(re.search(pattern, combined, flags=re.I) for pattern in MEDIUM_PATTERNS):
        application = (
            "精密气体流量控制；制药发酵适配和中国案例待验证。"
            if re.search(r"\bFCS", combined, flags=re.I)
            else "制药公用工程、设备内部流体或邻近应用；卫生等级待确认。"
        )
        return (
            "MEDIUM",
            "Product function overlaps a pharma utility or equipment task; no blanket sterile claim.",
            application,
        )
    if category in {"Manual Valves", "Automatic Valves", "Fittings"}:
        return (
            "LOW",
            "Current official catalogue row, but no direct pharma positioning in the index.",
            "可能用于通用设备或公用工程；不能据此推断制药适用。",
        )
    return (
        "LOW",
        "Current official catalogue row without a direct pharma-use signal.",
        "",
    )


def parse_catalogue(source: bytes, accessed: str) -> list[dict[str, str]]:
    document = html.fromstring(source)
    rows: list[dict[str, str]] = []
    for table in document.xpath("(//table)[position() > 1]"):
        heading = table.xpath("preceding::h3[1]")
        if not heading:
            continue
        subcategory = clean(heading[0].text_content())
        prefix = subcategory.split("-", 1)[0].strip()
        category = TOP_LEVEL.get(prefix, "Other")
        product_group = ""
        for row in table.xpath(".//tr[position() > 1]"):
            cells = [clean(cell.text_content()) for cell in row.xpath("./th|./td")]
            if len(cells) == 1:
                product_group = cells[0]
                continue
            if len(cells) < 5:
                continue
            title = re.sub(
                r"\s*(English|Japanese|繁体中文|簡体中文|한국어|Pусский)(?:\s|$)",
                " ",
                cells[0],
            )
            title = clean(title)
            title = re.sub(r"(SERIES|VALVES)(?=[A-Z])", r"\1 ", title)
            models = cells[1]
            relevance, basis, applications = classify_pharma(
                title, product_group, models, category
            )
            row_id = record_id(category, subcategory, models, title)
            flow_index = 4 if len(cells) >= 6 else None
            materials_index = 5 if len(cells) >= 6 else 4
            rows.append(
                {
                    "record_id": row_id,
                    "catalogue_title": title,
                    "category": category,
                    "subcategory": subcategory,
                    "product_group": product_group,
                    "model_numbers": models,
                    "maximum_nominal_sizes": cells[2],
                    "cleanliness": cells[3],
                    "flow_rate_class": cells[flow_index] if flow_index is not None else "",
                    "materials": cells[materials_index],
                    "pharma_relevance": relevance,
                    "pharma_basis": basis,
                    "pharma_applications": applications,
                    "english_catalogue_url": language_link(row, "English"),
                    "chinese_catalogue_url": (
                        language_link(row, "簡体中文")
                        or language_link(row, "繁体中文")
                    ),
                    "official_index_url": DOWNLOAD_URL,
                    "accessed_date": accessed,
                    "evidence_grade": "A",
                    "notes": (
                        "Series-level catalogue row. Model codes may cover multiple variants; "
                        "do not treat them as interchangeable."
                    ),
                }
            )
    return rows


def write_csv(path: Path, fields: list[str], rows: list[dict[str, str]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fields, lineterminator="\n")
        writer.writeheader()
        writer.writerows(rows)


def main() -> None:
    args = parse_args()
    if not args.build_only:
        fetch(args.refresh)
    if not cache_path().exists():
        raise SystemExit("Official Fujikin catalogue cache is missing.")

    accessed = date.today().isoformat()
    catalog = parse_catalogue(cache_path().read_bytes(), accessed)
    catalog.sort(
        key=lambda row: (
            list(TOP_LEVEL.values()).index(row["category"]),
            row["subcategory"],
            row["product_group"],
            row["model_numbers"],
            row["catalogue_title"],
        )
    )
    specs = [
        {
            "record_id": row["record_id"],
            "spec_key": key,
            "value_text": row[field],
            "source_url": row["official_index_url"],
            "accessed_date": row["accessed_date"],
            "notes": "Exact value from the official English catalogue index row.",
        }
        for row in catalog
        for key, field in (
            ("Maximum nominal sizes", "maximum_nominal_sizes"),
            ("Cleanliness", "cleanliness"),
            ("Flow rate class", "flow_rate_class"),
            ("Materials", "materials"),
        )
        if row[field]
    ]
    evidence = [
        {
            "evidence_id": f"FUJIKIN-SERIES-{row['record_id']}",
            "company": "Fujikin",
            "record_id": row["record_id"],
            "topic": f"{row['category']} / {row['subcategory']}",
            "fact_status": "FACT",
            "summary": (
                f"The current official catalogue index lists {row['catalogue_title']} "
                f"with model code(s) {row['model_numbers'] or 'not stated'}."
            ),
            "source_type": "官方产品目录",
            "source_title": row["catalogue_title"],
            "source_url": row["english_catalogue_url"] or row["official_index_url"],
            "accessed_date": row["accessed_date"],
            "evidence_grade": "A",
            "supports_conclusion": (
                f"Fujikin current series catalogue; pharma relevance "
                f"{row['pharma_relevance']}."
            ),
            "notes": row["notes"],
        }
        for row in catalog
    ]
    write_csv(RESEARCH / "fujikin-series-catalog.csv", CATALOG_FIELDS, catalog)
    write_csv(RESEARCH / "fujikin-series-specifications.csv", SPEC_FIELDS, specs)
    write_csv(RESEARCH / "fujikin-series-evidence.csv", EVIDENCE_FIELDS, evidence)
    coverage = {
        "generated_date": accessed,
        "official_index_url": DOWNLOAD_URL,
        "catalog_count": len(catalog),
        "specification_row_count": len(specs),
        "category_counts": Counter(row["category"] for row in catalog),
        "subcategory_counts": Counter(row["subcategory"] for row in catalog),
        "pharma_relevance_counts": Counter(row["pharma_relevance"] for row in catalog),
        "english_catalogue_link_count": sum(
            bool(row["english_catalogue_url"]) for row in catalog
        ),
        "chinese_catalogue_link_count": sum(
            bool(row["chinese_catalogue_url"]) for row in catalog
        ),
    }
    (RESEARCH / "fujikin-series-coverage.json").write_text(
        json.dumps(coverage, ensure_ascii=False, indent=2, default=dict) + "\n",
        encoding="utf-8",
    )
    print(json.dumps(coverage, ensure_ascii=False, indent=2, default=dict))


if __name__ == "__main__":
    main()
