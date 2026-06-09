#!/usr/bin/env python3
"""Validate the conservative ESG/Jingrui research catalogue."""

from __future__ import annotations

import csv
import json
import re
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
RESEARCH = ROOT / "docs" / "research"


def read_rows(path: Path) -> list[dict[str, str]]:
    with path.open(encoding="utf-8", newline="") as handle:
        return list(csv.DictReader(handle))


def main() -> None:
    errors: list[str] = []
    catalog = read_rows(RESEARCH / "esg-series-catalog.csv")
    specs = read_rows(RESEARCH / "esg-series-specifications.csv")
    evidence = read_rows(RESEARCH / "esg-series-evidence.csv")
    mapping = read_rows(RESEARCH / "esg-burkert-series-map.csv")
    shared_mapping = read_rows(RESEARCH / "burkert-competitor-series-map.csv")
    coverage = json.loads(
        (RESEARCH / "esg-series-coverage.json").read_text(encoding="utf-8")
    )

    ids = [row["series_id"] for row in catalog]
    id_set = set(ids)
    if len(catalog) != coverage["catalog_count"]:
        errors.append("ESG catalog count differs from coverage.")
    if len(ids) != len(id_set):
        errors.append("Duplicate ESG series IDs found.")
    if {row["evidence_grade"] for row in catalog} - {"B", "C"}:
        errors.append("ESG catalog contains an unsupported evidence grade.")
    if any(row["evidence_grade"] == "A" for row in catalog):
        errors.append("ESG catalog must not claim A-grade evidence without direct originals.")
    for row in catalog:
        if not row["name_en"] or not row["official_url"]:
            errors.append(f"{row['series_id']}: missing name or official URL.")
        if row["pharma_relevance"] == "HIGH" and row["category"] != "Sanitary valves":
            errors.append(f"{row['series_id']}: HIGH relevance lacks sanitary basis.")

    evidence_ids = [row["evidence_id"] for row in evidence]
    evidence_id_set = set(evidence_ids)
    if len(evidence) != len(catalog):
        errors.append("ESG evidence table is not one-to-one with catalog.")
    if len(evidence_ids) != len(evidence_id_set):
        errors.append("Duplicate ESG evidence IDs found.")
    if {row["series_id"] for row in evidence} != id_set:
        errors.append("ESG evidence coverage differs from catalog.")

    spec_keys = [(row["series_id"], row["spec_key"]) for row in specs]
    if len(spec_keys) != len(set(spec_keys)):
        errors.append("Duplicate ESG series/specification keys found.")
    for row in specs:
        if row["series_id"] not in id_set:
            errors.append(f"Unknown ESG series in specifications: {row['series_id']}.")
        if not row["source_url"] or not row["value_text"]:
            errors.append(f"{row['series_id']}/{row['spec_key']}: incomplete spec.")
        if any(
            term in row["value_text"]
            for term in ("FDA", "USP", "1935/2004", "million", "Ex nA")
        ) and row["fact_status"] != "CLAIM":
            errors.append(
                f"{row['series_id']}/{row['spec_key']}: certification/performance "
                "statement is not marked CLAIM."
            )

    for row in mapping:
        refs = [item for item in row["evidence_ids"].split("|") if item]
        missing = set(refs) - evidence_id_set
        if not refs or missing:
            errors.append(
                f"{row['esg_series']}: missing or unknown mapping evidence {sorted(missing)}."
            )
    for row in shared_mapping:
        refs = [
            item
            for item in row["evidence_ids"].split("|")
            if item.startswith("ESG-SERIES-")
        ]
        missing = set(refs) - evidence_id_set
        if missing:
            errors.append(
                f"{row['burkert_subcategory']}: shared map has unknown ESG evidence "
                f"{sorted(missing)}."
            )

    markdown_refs: set[str] = set()
    pattern = re.compile(r"\bESG-SERIES-[A-Z0-9-]+\b")
    for path in RESEARCH.glob("*.md"):
        markdown_refs.update(pattern.findall(path.read_text(encoding="utf-8")))
    missing_markdown_refs = markdown_refs - evidence_id_set
    if missing_markdown_refs:
        errors.append(
            f"Markdown references unknown ESG evidence IDs "
            f"{sorted(missing_markdown_refs)}."
        )

    if errors:
        print("\n".join(errors), file=sys.stderr)
        raise SystemExit(1)
    print(
        json.dumps(
            {
                "catalog_rows": len(catalog),
                "specification_rows": len(specs),
                "claim_rows": sum(row["fact_status"] == "CLAIM" for row in specs),
                "mapping_rows": len(mapping),
                "status": "PASS",
            },
            ensure_ascii=False,
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
