#!/usr/bin/env python3
"""Validate generated GEMÜ series research outputs."""

from __future__ import annotations

import csv
import json
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
RESEARCH = ROOT / "docs" / "research"
CACHE = ROOT / ".config" / "gemu-series-cache" / "pages"


def read_rows(path: Path) -> list[dict[str, str]]:
    with path.open(encoding="utf-8", newline="") as handle:
        return list(csv.DictReader(handle))


def main() -> None:
    errors: list[str] = []
    catalog = read_rows(RESEARCH / "gemu-series-catalog.csv")
    specs = read_rows(RESEARCH / "gemu-series-specifications.csv")
    evidence = read_rows(RESEARCH / "gemu-series-evidence.csv")
    general_evidence = read_rows(RESEARCH / "2026-06-four-company-evidence.csv")
    fujikin_evidence = read_rows(RESEARCH / "fujikin-series-evidence.csv")
    esg_evidence = read_rows(RESEARCH / "esg-series-evidence.csv")
    mapping = read_rows(RESEARCH / "gemu-burkert-series-map.csv")
    shared_mapping = read_rows(RESEARCH / "burkert-competitor-series-map.csv")
    coverage = json.loads((RESEARCH / "gemu-series-coverage.json").read_text(encoding="utf-8"))
    ids = [row["series_id"] for row in catalog]
    if len(ids) != len(set(ids)):
        errors.append("Duplicate GEMÜ series IDs found.")
    if len(catalog) != coverage["catalog_count"]:
        errors.append("Catalog count differs from coverage.")
    if coverage["missing_cache"]:
        errors.append(f"Missing official page caches: {coverage['missing_cache']}")
    if len(catalog) != coverage["sitemap_product_series_count"] + coverage["solution_row_count"]:
        errors.append("Catalog does not cover all discovered product series and selected solutions.")
    if {row["pharma_relevance"] for row in catalog} - {"HIGH", "MEDIUM", "LOW"}:
        errors.append("Unexpected pharma relevance value.")
    for row in catalog:
        cache_id = row["series_id"].replace("/", "_")
        if not (CACHE / f"{cache_id}.html").exists():
            errors.append(f"{row['series_id']}: cache missing.")
        if not row["name_en"] or not row["official_url"]:
            errors.append(f"{row['series_id']}: missing name or official URL.")
        if row["evidence_grade"] != "A":
            errors.append(f"{row['series_id']}: unexpected evidence grade.")
    valid_ids = set(ids)
    evidence_ids = [row["evidence_id"] for row in evidence]
    if len(evidence) != len(catalog):
        errors.append("Evidence table does not contain one row per catalog series.")
    if len(evidence_ids) != len(set(evidence_ids)):
        errors.append("Duplicate GEMÜ evidence IDs found.")
    if {row["series_id"] for row in evidence} != valid_ids:
        errors.append("Evidence table series coverage differs from catalog.")
    evidence_id_set = set(evidence_ids)
    for row in mapping:
        refs = [item for item in row["evidence_ids"].split("|") if item]
        if not refs:
            errors.append(f"{row['gemu_series']}: mapping has no evidence IDs.")
        missing_refs = set(refs) - evidence_id_set
        if missing_refs:
            errors.append(f"{row['gemu_series']}: unknown evidence IDs {sorted(missing_refs)}.")
    all_evidence_ids = (
        evidence_id_set
        | {row["evidence_id"] for row in general_evidence}
        | {row["evidence_id"] for row in fujikin_evidence}
        | {row["evidence_id"] for row in esg_evidence}
    )
    for row in shared_mapping:
        refs = [item for item in row["evidence_ids"].split("|") if item]
        missing_refs = set(refs) - all_evidence_ids
        if missing_refs:
            errors.append(
                f"{row['burkert_subcategory']}: shared map has unknown evidence IDs "
                f"{sorted(missing_refs)}."
            )
    spec_keys = [(row["series_id"], row["spec_key"]) for row in specs]
    if len(spec_keys) != len(set(spec_keys)):
        errors.append("Duplicate series/specification keys found.")
    for row in specs:
        if row["series_id"] not in valid_ids:
            errors.append(f"Specification references unknown series {row['series_id']}.")
        if not row["value_text"] or not row["source_url"]:
            errors.append(f"{row['series_id']}/{row['spec_key']}: incomplete specification.")
    if errors:
        print("\n".join(errors), file=sys.stderr)
        raise SystemExit(1)
    print(
        json.dumps(
            {
                "catalog_rows": len(catalog),
                "specification_rows": len(specs),
                "pharma_high": sum(row["pharma_relevance"] == "HIGH" for row in catalog),
                "pharma_medium": sum(row["pharma_relevance"] == "MEDIUM" for row in catalog),
                "status": "PASS",
            },
            ensure_ascii=False,
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
