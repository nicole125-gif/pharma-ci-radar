#!/usr/bin/env python3
"""Independently validate generated HIGH-relevance learning cards."""

from __future__ import annotations

import csv
import json
import re
import sys
from collections import Counter
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[2]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from scripts.research.generate_high_relevance_learning_cards import (
    CARD_FIELDS,
    CATALOG_CONFIG,
    DEFAULT_RESEARCH_DIRECTORY,
    EXPECTED_COUNTS,
    HANDBOOK_FILENAMES,
    OUTPUT_FILENAME,
)


FORBIDDEN_PLACEHOLDERS = ("TBD", "TODO", "待补充", "待完善")
REQUIRED_TEXT_FIELDS = (
    "card_id",
    "company",
    "product_id",
    "name",
    "category",
    "subcategory",
    "product_role",
    "customer_jobs",
    "pharma_applications",
    "key_specifications",
    "selection_questions",
    "exclusion_conditions",
    "competitor_overlap",
    "comparison_dimensions",
    "evidence_grade",
    "fact_boundary",
    "source_urls",
    "evidence_ids",
    "knowledge_gaps",
    "memory_hook",
    "quiz_question",
    "review_status",
    "source_accessed_date",
    "generated_date",
)


def read_csv(path: Path) -> tuple[list[str], list[dict[str, str]]]:
    with path.open(encoding="utf-8-sig", newline="") as handle:
        reader = csv.DictReader(handle)
        return reader.fieldnames or [], list(reader)


def expected_ids(research_directory: Path) -> dict[str, set[str]]:
    result: dict[str, set[str]] = {}
    for company, config in CATALOG_CONFIG.items():
        _, rows = read_csv(research_directory / str(config["filename"]))
        result[company] = {
            row[str(config["id"])]
            for row in rows
            if row.get("pharma_relevance") == "HIGH"
        }
    return result


def validate_url(value: str) -> bool:
    parsed = urlparse(value)
    return parsed.scheme in {"http", "https"} and bool(parsed.netloc)


def validate(
    research_directory: Path = DEFAULT_RESEARCH_DIRECTORY,
) -> dict[str, object]:
    errors: list[str] = []
    headers, rows = read_csv(research_directory / OUTPUT_FILENAME)
    if headers != CARD_FIELDS:
        errors.append(f"Header mismatch: {headers}")

    counts = Counter(row.get("company", "") for row in rows)
    if counts != EXPECTED_COUNTS:
        errors.append(f"Company counts mismatch: {dict(counts)}")
    if len(rows) != sum(EXPECTED_COUNTS.values()):
        errors.append(f"Expected 136 rows, found {len(rows)}")

    card_ids = [row.get("card_id", "") for row in rows]
    if len(set(card_ids)) != len(card_ids):
        errors.append("Duplicate card_id values")

    source_ids = expected_ids(research_directory)
    for company, identifiers in source_ids.items():
        actual = {
            row["product_id"] for row in rows if row.get("company") == company
        }
        if actual != identifiers:
            errors.append(
                f"{company} product ID set differs: missing={sorted(identifiers - actual)}, extra={sorted(actual - identifiers)}"
            )

    for row_number, row in enumerate(rows, start=2):
        context = f"row {row_number} {row.get('company')} {row.get('product_id')}"
        for field in REQUIRED_TEXT_FIELDS:
            if not row.get(field, "").strip():
                errors.append(f"{context}: blank {field}")
        combined = " ".join(row.values())
        for token in FORBIDDEN_PLACEHOLDERS:
            if token.lower() in combined.lower():
                errors.append(f"{context}: forbidden placeholder {token}")
        if row.get("evidence_grade") not in {"A", "B", "C", "D"}:
            errors.append(f"{context}: invalid evidence grade")
        if row.get("review_status") != "GENERATED_REVIEWED_BY_RULES":
            errors.append(f"{context}: invalid review status")
        for source_url in row.get("source_urls", "").split("|"):
            if source_url and not validate_url(source_url):
                errors.append(f"{context}: invalid source URL {source_url}")
        evidence_ids = row.get("evidence_ids", "").split("|")
        if len(evidence_ids) != len(set(evidence_ids)):
            errors.append(f"{context}: duplicate evidence IDs")
        gaps = row.get("knowledge_gaps", "")
        for required_gap in ("价格", "库存", "产地", "交期", "装机量", "售后"):
            if required_gap not in gaps:
                errors.append(f"{context}: missing knowledge gap {required_gap}")
        boundary = row.get("fact_boundary", "")
        if "不等同于应用工程批准" not in boundary:
            errors.append(f"{context}: missing engineering approval boundary")
        if row.get("company") == "ESG 精锐" and "CLAIM" not in boundary:
            errors.append(f"{context}: ESG CLAIM boundary missing")
        if re.search(r"(价格|交期).{0,5}(优势|领先|更快|更低)", combined):
            errors.append(f"{context}: unverified price or lead-time advantage")

    for company, filename in HANDBOOK_FILENAMES.items():
        path = research_directory / filename
        if not path.exists():
            errors.append(f"Missing handbook {filename}")
            continue
        content = path.read_text(encoding="utf-8")
        company_rows = [row for row in rows if row.get("company") == company]
        expected_sections = len(company_rows) + 2
        if content.count("\n## ") != expected_sections:
            errors.append(
                f"{filename}: expected {expected_sections} H2 sections, found {content.count(chr(10) + '## ')}"
            )
        for row in company_rows:
            if f"`{row['product_id']}`" not in content:
                errors.append(f"{filename}: missing {row['product_id']}")

    result = {
        "status": "PASS" if not errors else "FAIL",
        "card_rows": len(rows),
        "company_counts": dict(counts),
        "unique_cards": len(set(card_ids)),
        "errors": errors,
    }
    return result


def main() -> None:
    result = validate()
    print(json.dumps(result, ensure_ascii=False, indent=2))
    if result["status"] != "PASS":
        raise SystemExit(1)


if __name__ == "__main__":
    main()
