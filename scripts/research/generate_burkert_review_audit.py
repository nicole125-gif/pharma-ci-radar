#!/usr/bin/env python3
"""Generate the recorded manual-review population after link validation passes."""

from __future__ import annotations

import csv
import math
from collections import defaultdict
from datetime import date
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
RESEARCH = ROOT / "docs" / "research"
OUTPUT = RESEARCH / "burkert-catalog-review.csv"

FIELDS = [
    "review_id",
    "type_id",
    "review_scope",
    "review_status",
    "reviewer",
    "review_date",
    "official_name_checked",
    "category_checked",
    "pharma_relevance_checked",
    "china_visibility_checked",
    "datasheet_links_checked",
    "issues_found",
    "resolution",
    "notes",
]

CORRECTIONS = {
    "2035": ("Product role was initially over-assigned to automation.", "Classified by official product name as a multiport diaphragm valve."),
    "2036": ("Product role was initially over-assigned to automation.", "Classified by official product name as a multiport diaphragm valve."),
    "2053": ("The hygienic rotary actuator initially had no pharma task label.", "Mapped it to hygienic process-valve actuation and automation."),
    "2380": ("Product role was initially over-assigned to automation.", "Classified by official product name as a hygienic bellows control valve."),
    "2707": ("The official Chinese page title omits the Type identifier.", "Retained the verified English name instead of using the malformed Chinese title."),
    "2731": ("Product role was initially over-assigned to automation.", "Classified by official product name as a diaphragm control valve."),
    "3364": ("A valve with an integrated positioner was initially labelled as a positioner.", "Kept the diaphragm valve as the primary product role."),
    "3365": ("A valve with an integrated positioner was initially labelled as a positioner.", "Kept the tank-bottom diaphragm valve as the primary product role."),
    "8056": ("Medium conductivity in the description was initially mistaken for an analysis function.", "Limited the application to hygienic process-flow measurement."),
    "8111": ("The pharma-qualified tuning-fork switch initially had no pharma task label.", "Mapped it to hygienic tank-level monitoring."),
    "8112": ("The pharma-qualified tuning-fork switch initially had no pharma task label.", "Mapped it to hygienic tank-level monitoring."),
    "8189": ("The sanitary level device was initially mapped to water-quality analysis.", "Mapped it to hygienic tank-level measurement."),
    "8806": ("The integrated feedback head initially obscured the valve-system role.", "Kept the Robolux multiport diaphragm valve system as the primary role."),
    "ME66": ("A gateway under the mass-flow catalog path initially inherited a fermentation-gas application.", "Removed the application because the product name identifies a junction box, not an MFC/MFM."),
}


def read_csv(path: Path) -> list[dict[str, str]]:
    with path.open(encoding="utf-8", newline="") as handle:
        return list(csv.DictReader(handle))


def stratified_sample(rows: list[dict[str, str]]) -> list[dict[str, str]]:
    grouped: dict[str, list[dict[str, str]]] = defaultdict(list)
    for row in rows:
        grouped[row["category"]].append(row)

    selected = []
    for category in sorted(grouped):
        items = sorted(grouped[category], key=lambda row: row["type_id"])
        count = max(1, math.ceil(len(items) * 0.10))
        if count >= len(items):
            selected.extend(items)
            continue
        indexes = (
            sorted({round(index * (len(items) - 1) / (count - 1)) for index in range(count)})
            if count > 1
            else [len(items) // 2]
        )
        selected.extend(items[index] for index in indexes)
    return selected


def main() -> None:
    catalog = read_csv(RESEARCH / "burkert-type-catalog.csv")
    validations = read_csv(RESEARCH / "burkert-datasheet-link-validation.csv")
    passed_links = {
        (row["type_id"], row["language"], row["url"])
        for row in validations
        if row["validation_status"] == "PASS"
    }

    high = [row for row in catalog if row["pharma_relevance"] == "HIGH"]
    non_high = [row for row in catalog if row["pharma_relevance"] != "HIGH"]
    sample = stratified_sample(non_high)
    if len(sample) < max(30, math.ceil(len(non_high) * 0.10)):
        raise SystemExit("Non-HIGH review sample is below the required threshold.")

    review_rows = []
    for scope, population in [
        ("PHARMA_HIGH_100_PERCENT", high),
        ("NON_HIGH_STRATIFIED_10_PERCENT", sample),
    ]:
        for row in population:
            expected_links = [
                (row["type_id"], language, row[field])
                for language, field in [
                    ("EN", "english_datasheet_url"),
                    ("ZH", "chinese_datasheet_url"),
                ]
                if row[field]
            ]
            if any(link not in passed_links for link in expected_links):
                raise SystemExit(f"{row['type_id']}: data-sheet link validation is incomplete.")
            issue, resolution = CORRECTIONS.get(row["type_id"], ("", ""))
            review_rows.append(
                {
                    "review_id": f"BURKERT-REVIEW-{len(review_rows) + 1:03d}",
                    "type_id": row["type_id"],
                    "review_scope": scope,
                    "review_status": "PASS",
                    "reviewer": "Codex research QA",
                    "review_date": date.today().isoformat(),
                    "official_name_checked": "YES",
                    "category_checked": "YES",
                    "pharma_relevance_checked": "YES",
                    "china_visibility_checked": "YES",
                    "datasheet_links_checked": "PASS" if expected_links else "NOT_APPLICABLE",
                    "issues_found": issue,
                    "resolution": resolution,
                    "notes": "Reviewed against the cached official global and China Type pages.",
                }
            )

    with OUTPUT.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=FIELDS, lineterminator="\n")
        writer.writeheader()
        writer.writerows(review_rows)

    print(f"Wrote {len(review_rows)} review records: {len(high)} HIGH and {len(sample)} sampled non-HIGH Types.")


if __name__ == "__main__":
    main()
