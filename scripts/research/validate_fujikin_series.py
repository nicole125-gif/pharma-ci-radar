#!/usr/bin/env python3
"""Validate generated Fujikin series research outputs."""

from __future__ import annotations

import csv
import json
import re
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
RESEARCH = ROOT / "docs" / "research"
CACHE = ROOT / ".config" / "fujikin-series-cache" / "download.html"


def read_rows(path: Path) -> list[dict[str, str]]:
    with path.open(encoding="utf-8", newline="") as handle:
        return list(csv.DictReader(handle))


def main() -> None:
    errors: list[str] = []
    catalog = read_rows(RESEARCH / "fujikin-series-catalog.csv")
    specs = read_rows(RESEARCH / "fujikin-series-specifications.csv")
    evidence = read_rows(RESEARCH / "fujikin-series-evidence.csv")
    mapping = read_rows(RESEARCH / "fujikin-burkert-series-map.csv")
    shared_mapping = read_rows(RESEARCH / "burkert-competitor-series-map.csv")
    link_validations = read_rows(
        RESEARCH / "fujikin-catalog-link-validation.csv"
    )
    coverage = json.loads(
        (RESEARCH / "fujikin-series-coverage.json").read_text(encoding="utf-8")
    )

    ids = [row["record_id"] for row in catalog]
    id_set = set(ids)
    if not CACHE.exists():
        errors.append("Official catalogue cache is missing.")
    if len(catalog) != coverage["catalog_count"]:
        errors.append("Catalog count differs from coverage.")
    if len(catalog) < 100:
        errors.append("Catalogue unexpectedly contains fewer than 100 series rows.")
    if len(ids) != len(id_set):
        errors.append("Duplicate Fujikin record IDs found.")
    expected_categories = {
        "Manual Valves",
        "Automatic Valves",
        "Other Valves",
        "Fittings",
        "Systems",
        "Other",
    }
    if {row["category"] for row in catalog} != expected_categories:
        errors.append("Top-level Fujikin category coverage differs from the official index.")
    if {row["pharma_relevance"] for row in catalog} - {"HIGH", "MEDIUM", "LOW"}:
        errors.append("Unexpected pharma relevance value.")
    for row in catalog:
        if not row["catalogue_title"] or not row["official_index_url"]:
            errors.append(f"{row['record_id']}: missing title or official index URL.")
        if row["evidence_grade"] != "A":
            errors.append(f"{row['record_id']}: unexpected evidence grade.")
        if (
            row["pharma_relevance"] == "HIGH"
            and "Metal Diaphragm" in row["product_group"]
        ):
            errors.append(
                f"{row['record_id']}: semiconductor metal-diaphragm row marked pharma HIGH."
            )

    expected_links = {
        (row["record_id"], language, row[field])
        for row in catalog
        for language, field in (
            ("EN", "english_catalogue_url"),
            ("ZH", "chinese_catalogue_url"),
        )
        if row[field]
    }
    passed_links = {
        (row["record_id"], row["language"], row["url"])
        for row in link_validations
        if row["validation_status"] == "PASS"
    }
    if expected_links != passed_links:
        errors.append("Catalogue-link validation does not cover every discovered EN/ZH link.")

    evidence_ids = [row["evidence_id"] for row in evidence]
    evidence_id_set = set(evidence_ids)
    if len(evidence) != len(catalog):
        errors.append("Evidence table does not contain one row per catalogue record.")
    if len(evidence_ids) != len(evidence_id_set):
        errors.append("Duplicate Fujikin evidence IDs found.")
    if {row["record_id"] for row in evidence} != id_set:
        errors.append("Evidence record coverage differs from catalog.")
    referenced_in_markdown: set[str] = set()
    pattern = re.compile(r"\bFUJIKIN-SERIES-[A-Z0-9-]+\b")
    for path in RESEARCH.glob("*.md"):
        referenced_in_markdown.update(
            pattern.findall(path.read_text(encoding="utf-8"))
        )
    missing_markdown_refs = referenced_in_markdown - evidence_id_set
    if missing_markdown_refs:
        errors.append(
            f"Markdown references unknown Fujikin evidence IDs "
            f"{sorted(missing_markdown_refs)}."
        )

    spec_keys = [(row["record_id"], row["spec_key"]) for row in specs]
    if len(spec_keys) != len(set(spec_keys)):
        errors.append("Duplicate Fujikin record/specification keys found.")
    for row in specs:
        if row["record_id"] not in id_set:
            errors.append(f"Specification references unknown record {row['record_id']}.")
        if not row["value_text"] or not row["source_url"]:
            errors.append(f"{row['record_id']}/{row['spec_key']}: incomplete specification.")

    for row in mapping:
        refs = [item for item in row["evidence_ids"].split("|") if item]
        if not refs:
            errors.append(f"{row['fujikin_series']}: mapping has no evidence IDs.")
        missing = set(refs) - evidence_id_set
        if missing:
            errors.append(
                f"{row['fujikin_series']}: mapping has unknown evidence IDs {sorted(missing)}."
            )
    for row in shared_mapping:
        refs = [
            item
            for item in row["evidence_ids"].split("|")
            if item.startswith("FUJIKIN-SERIES-")
        ]
        missing = set(refs) - evidence_id_set
        if missing:
            errors.append(
                f"{row['burkert_subcategory']}: shared map has unknown Fujikin "
                f"evidence IDs {sorted(missing)}."
            )

    if errors:
        print("\n".join(errors), file=sys.stderr)
        raise SystemExit(1)
    print(
        json.dumps(
            {
                "catalog_rows": len(catalog),
                "specification_rows": len(specs),
                "pharma_high": sum(
                    row["pharma_relevance"] == "HIGH" for row in catalog
                ),
                "pharma_medium": sum(
                    row["pharma_relevance"] == "MEDIUM" for row in catalog
                ),
                "mapping_rows": len(mapping),
                "status": "PASS",
            },
            ensure_ascii=False,
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
