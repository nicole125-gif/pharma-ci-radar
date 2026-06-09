#!/usr/bin/env python3
"""Validate the cross-company pharma application selection matrix."""

from __future__ import annotations

import csv
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
RESEARCH = ROOT / "docs" / "research"
MATRIX = RESEARCH / "2026-06-pharma-application-selection-matrix.csv"


def read_rows(path: Path) -> list[dict[str, str]]:
    with path.open(encoding="utf-8", newline="") as handle:
        return list(csv.DictReader(handle))


def main() -> None:
    errors: list[str] = []
    rows = read_rows(MATRIX)
    ids = [row["scenario_id"] for row in rows]
    if len(rows) < 12:
        errors.append("Application matrix contains fewer than 12 scenarios.")
    if len(ids) != len(set(ids)):
        errors.append("Duplicate application scenario IDs found.")

    evidence_ids = {
        row["evidence_id"]
        for path in (
            RESEARCH / "2026-06-four-company-evidence.csv",
            RESEARCH / "gemu-series-evidence.csv",
            RESEARCH / "fujikin-series-evidence.csv",
            RESEARCH / "esg-series-evidence.csv",
        )
        for row in read_rows(path)
    }
    required_fields = (
        "customer_task",
        "decision_unit",
        "burkert_candidates",
        "must_ask_conditions",
        "burkert_exclusion_or_caution",
        "competitor_watchpoint",
        "comparison_dimensions",
        "evidence_ids",
        "internal_validation",
    )
    for row in rows:
        for field in required_fields:
            if not row[field]:
                errors.append(f"{row['scenario_id']}: missing {field}.")
        refs = set(filter(None, row["evidence_ids"].split("|")))
        missing = refs - evidence_ids
        if missing:
            errors.append(
                f"{row['scenario_id']}: unknown evidence IDs {sorted(missing)}."
            )

    if errors:
        print("\n".join(errors), file=sys.stderr)
        raise SystemExit(1)
    print(
        {
            "scenario_rows": len(rows),
            "unique_scenarios": len(set(ids)),
            "status": "PASS",
        }
    )


if __name__ == "__main__":
    main()
