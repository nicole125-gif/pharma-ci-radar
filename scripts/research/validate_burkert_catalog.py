#!/usr/bin/env python3
"""Validate generated Bürkert catalog research outputs."""

from __future__ import annotations

import csv
import json
import math
import re
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
RESEARCH = ROOT / "docs" / "research"
CACHE = ROOT / ".config" / "burkert-catalog-cache"

EXPECTED_CATEGORIES = {
    "电磁阀",
    "过程与控制阀",
    "电动阀",
    "气动与过程接口",
    "传感器、变送器与控制器",
    "微流体产品与泵",
    "质量流量控制器与流量计",
    "比例阀",
    "工业通信",
    "附加产品",
}

ALLOWED_CHINA_VISIBILITY = {
    "CHINA_PAGE_AND_ZH_DATASHEET",
    "CHINA_PAGE_ONLY",
    "ZH_DATASHEET_ONLY",
    "NOT_FOUND",
}

ALLOWED_LIFECYCLE = {"CURRENT", "TRANSITION", "DISCONTINUED"}
ALLOWED_PHARMA_RELEVANCE = {"HIGH", "MEDIUM", "LOW"}


def read_dicts(path: Path) -> list[dict[str, str]]:
    with path.open(encoding="utf-8", newline="") as handle:
        return list(csv.DictReader(handle))


def read_evidence_ids(paths: list[Path]) -> set[str]:
    return {
        row["evidence_id"]
        for path in paths
        for row in read_dicts(path)
    }


def extract_evidence_references(text: str, known_evidence_ids: set[str]) -> set[str]:
    known_namespaces = {
        "-".join(evidence_id.split("-")[:2])
        for evidence_id in known_evidence_ids
        if len(evidence_id.split("-")) >= 3
    }
    candidates = re.findall(r"\b[A-Z][A-Z0-9]*(?:-[A-Z0-9]+){2,}\b", text)
    return {
        candidate
        for candidate in candidates
        if "-".join(candidate.split("-")[:2]) in known_namespaces
    }


def require(condition: bool, message: str, errors: list[str]) -> None:
    if not condition:
        errors.append(message)


def cache_identifies_type(source: str, type_id: str) -> bool:
    escaped = re.escape(type_id)
    type_marker = rf"\bType\s+{escaped}(?![A-Za-z0-9-])"
    patterns = [
        rf"<title[^>]*>[^<]*{type_marker}",
        rf"<h1[^>]*>.*?{type_marker}.*?</h1>",
        rf'"name"\s*:\s*"{type_marker}',
    ]
    return any(re.search(pattern, source, flags=re.I | re.S) for pattern in patterns)


def main() -> None:
    errors: list[str] = []
    catalog_path = RESEARCH / "burkert-type-catalog.csv"
    specs_path = RESEARCH / "burkert-type-specifications.csv"
    coverage_path = RESEARCH / "burkert-catalog-coverage.json"
    datasheet_validation_path = RESEARCH / "burkert-datasheet-link-validation.csv"
    evidence_path = RESEARCH / "2026-06-four-company-evidence.csv"
    gemu_evidence_path = RESEARCH / "gemu-series-evidence.csv"
    fujikin_evidence_path = RESEARCH / "fujikin-series-evidence.csv"
    esg_evidence_path = RESEARCH / "esg-series-evidence.csv"
    product_matrix_path = RESEARCH / "2026-06-four-company-product-matrix.csv"
    competitor_map_path = RESEARCH / "burkert-competitor-series-map.csv"
    review_path = RESEARCH / "burkert-catalog-review.csv"
    require(catalog_path.exists(), f"Missing {catalog_path}", errors)
    require(specs_path.exists(), f"Missing {specs_path}", errors)
    require(coverage_path.exists(), f"Missing {coverage_path}", errors)
    require(datasheet_validation_path.exists(), f"Missing {datasheet_validation_path}", errors)
    require(evidence_path.exists(), f"Missing {evidence_path}", errors)
    require(gemu_evidence_path.exists(), f"Missing {gemu_evidence_path}", errors)
    require(fujikin_evidence_path.exists(), f"Missing {fujikin_evidence_path}", errors)
    require(esg_evidence_path.exists(), f"Missing {esg_evidence_path}", errors)
    require(product_matrix_path.exists(), f"Missing {product_matrix_path}", errors)
    require(competitor_map_path.exists(), f"Missing {competitor_map_path}", errors)
    require(review_path.exists(), f"Missing {review_path}", errors)
    if errors:
        print("\n".join(errors), file=sys.stderr)
        raise SystemExit(1)

    catalog = read_dicts(catalog_path)
    specs = read_dicts(specs_path)
    datasheet_validations = read_dicts(datasheet_validation_path)
    product_matrix = read_dicts(product_matrix_path)
    competitor_map = read_dicts(competitor_map_path)
    reviews = read_dicts(review_path)
    coverage = json.loads(coverage_path.read_text(encoding="utf-8"))
    ids = [row["type_id"] for row in catalog]
    id_set = set(ids)
    urls = [row["global_product_url"] for row in catalog]
    categories = {row["category"] for row in catalog}

    require(len(catalog) == coverage["global_sitemap_count"], "Catalog count differs from global sitemap count.", errors)
    require(len(catalog) == coverage["catalog_count"], "Catalog count differs from coverage report.", errors)
    require(not coverage["missing_global_cache"], "Coverage report contains missing global pages.", errors)
    require(not coverage["missing_china_cache"], "Coverage report contains missing China pages.", errors)
    require(len(ids) == len(id_set), "Duplicate type_id values found.", errors)
    require(len(urls) == len(set(urls)), "Duplicate global product URLs found.", errors)
    require(
        categories == EXPECTED_CATEGORIES,
        f"Top-level categories differ from the required ten-category taxonomy: {sorted(categories)}",
        errors,
    )
    require(
        set(coverage["category_membership_counts"]) == EXPECTED_CATEGORIES,
        "Official category membership does not cover the required ten-category taxonomy.",
        errors,
    )
    require(
        coverage["multi_path_type_count"] > 0 and coverage["multi_category_type_count"] > 0,
        "Cross-category Type membership was not recorded.",
        errors,
    )
    require("Unclassified" not in categories, "Unclassified Types remain.", errors)

    for row in catalog:
        type_id = row["type_id"]
        require(bool(row["name_en"]), f"{type_id}: missing English name.", errors)
        require(bool(row["category"]), f"{type_id}: missing category.", errors)
        require(row["lifecycle_status"] in ALLOWED_LIFECYCLE, f"{type_id}: invalid lifecycle status.", errors)
        require(
            row["pharma_relevance"] in ALLOWED_PHARMA_RELEVANCE,
            f"{type_id}: invalid pharma relevance.",
            errors,
        )
        require(row["china_visibility"] in ALLOWED_CHINA_VISIBILITY, f"{type_id}: invalid China visibility.", errors)
        require(row["evidence_grade"] == "A", f"{type_id}: unexpected evidence grade.", errors)
        require(
            row["global_product_url"] == f"https://www.burkert.com/en/type/{type_id}",
            f"{type_id}: unexpected global URL.",
            errors,
        )
        cache_path = CACHE / "global" / f"{type_id}.html"
        require(cache_path.exists(), f"{type_id}: missing successful global-page cache.", errors)
        if cache_path.exists():
            source = cache_path.read_text(encoding="utf-8", errors="ignore")
            require(
                cache_identifies_type(source, type_id),
                f"{type_id}: cache does not contain matching official Type title.",
                errors,
            )
        if row["china_visibility"] in {"CHINA_PAGE_AND_ZH_DATASHEET", "CHINA_PAGE_ONLY"}:
            china_cache = CACHE / "china" / f"{type_id}.html"
            require(china_cache.exists(), f"{type_id}: China page marked visible but cache is missing.", errors)
            if china_cache.exists():
                china_source = china_cache.read_text(encoding="utf-8", errors="ignore")
                require(
                    f"/cn/type/{type_id}" in china_source,
                    f"{type_id}: China cache does not identify the matching official Type URL.",
                    errors,
                )
        if row["english_datasheet_url"]:
            require(
                "/Media/plm/DTS/DS/" in row["english_datasheet_url"],
                f"{type_id}: English data-sheet URL is not an official DTS link.",
                errors,
            )
        if row["chinese_datasheet_url"]:
            require(
                "/Media/plm/DTS/DS/" in row["chinese_datasheet_url"],
                f"{type_id}: Chinese data-sheet URL is not an official DTS link.",
                errors,
            )

    expected_datasheets = {
        (row["type_id"], language, row[field])
        for row in catalog
        for language, field in [
            ("EN", "english_datasheet_url"),
            ("ZH", "chinese_datasheet_url"),
        ]
        if row[field]
    }
    validated_datasheets = {
        (row["type_id"], row["language"], row["url"])
        for row in datasheet_validations
        if row["validation_status"] == "PASS"
    }
    require(
        expected_datasheets == validated_datasheets,
        "Data-sheet validation rows do not exactly match all discovered catalog links.",
        errors,
    )

    spec_keys = [(row["type_id"], row["spec_group"], row["spec_key"]) for row in specs]
    require(len(spec_keys) == len(set(spec_keys)), "Duplicate Type/specification composite keys found.", errors)
    for row in specs:
        require(row["type_id"] in id_set, f"Specification references unknown Type {row['type_id']}.", errors)
        require(bool(row["source_url"]), f"{row['type_id']}/{row['spec_key']}: missing source URL.", errors)
        require(bool(row["value_text"]), f"{row['type_id']}/{row['spec_key']}: missing value.", errors)
        if row["value_min"] or row["value_max"]:
            require(bool(row["unit"]), f"{row['type_id']}/{row['spec_key']}: numeric limit has no unit.", errors)
            try:
                minimum = float(row["value_min"]) if row["value_min"] else None
                maximum = float(row["value_max"]) if row["value_max"] else None
            except ValueError:
                errors.append(f"{row['type_id']}/{row['spec_key']}: non-numeric min/max value.")
            else:
                require(
                    minimum is None or maximum is None or minimum <= maximum,
                    f"{row['type_id']}/{row['spec_key']}: minimum exceeds maximum.",
                    errors,
                )

    evidence_ids = read_evidence_ids(
        [evidence_path, gemu_evidence_path, fujikin_evidence_path, esg_evidence_path]
    )
    referenced_evidence_ids: set[str] = set()
    for row in product_matrix + competitor_map:
        referenced_evidence_ids.update(filter(None, row["evidence_ids"].split("|")))
    for path in RESEARCH.glob("*.md"):
        referenced_evidence_ids.update(
            extract_evidence_references(path.read_text(encoding="utf-8"), evidence_ids)
        )
    require(
        referenced_evidence_ids <= evidence_ids,
        f"Unknown evidence IDs referenced: {sorted(referenced_evidence_ids - evidence_ids)}",
        errors,
    )

    for row in competitor_map:
        mapped_types = set(filter(None, row["burkert_types"].split("|")))
        require(
            mapped_types <= id_set,
            f"Competitor map references unknown Bürkert Types: {sorted(mapped_types - id_set)}",
            errors,
        )

    high_ids = {row["type_id"] for row in catalog if row["pharma_relevance"] == "HIGH"}
    reviewed_high_ids = {
        row["type_id"]
        for row in reviews
        if row["review_scope"] == "PHARMA_HIGH_100_PERCENT" and row["review_status"] == "PASS"
    }
    sampled_non_high = [
        row
        for row in reviews
        if row["review_scope"] == "NON_HIGH_STRATIFIED_10_PERCENT" and row["review_status"] == "PASS"
    ]
    non_high_count = len(catalog) - len(high_ids)
    require(reviewed_high_ids == high_ids, "Pharma-HIGH Types were not reviewed 100%.", errors)
    require(
        len(sampled_non_high) >= max(30, math.ceil(non_high_count * 0.10)),
        "Non-HIGH review sample is below 10% or 30 records.",
        errors,
    )
    require(
        all(row["datasheet_links_checked"] in {"PASS", "NOT_APPLICABLE"} for row in reviews),
        "Review audit contains incomplete data-sheet checks.",
        errors,
    )

    for path in RESEARCH.glob("*"):
        if path.suffix.lower() not in {".md", ".csv", ".json"}:
            continue
        text = path.read_text(encoding="utf-8")
        require("TBD" not in text and "TODO" not in text, f"{path.name}: contains TBD/TODO.", errors)

    if errors:
        print(f"Validation failed with {len(errors)} error(s):", file=sys.stderr)
        for error in errors:
            print(f"- {error}", file=sys.stderr)
        raise SystemExit(1)

    print(
        json.dumps(
            {
                "catalog_rows": len(catalog),
                "specification_rows": len(specs),
                "categories": sorted(categories),
                "china_visibility": coverage["china_visibility_counts"],
                "pharma_relevance": coverage["pharma_relevance_counts"],
                "status": "PASS",
            },
            ensure_ascii=False,
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
