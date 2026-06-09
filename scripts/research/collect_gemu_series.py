#!/usr/bin/env python3
"""Collect current GEMÜ product series from the official English sitemap."""

from __future__ import annotations

import argparse
import csv
import json
import re
import time
from collections import Counter
from datetime import date
from pathlib import Path
from urllib.parse import urlparse

import requests
from lxml import etree, html


ROOT = Path(__file__).resolve().parents[2]
RESEARCH = ROOT / "docs" / "research"
CACHE = ROOT / ".config" / "gemu-series-cache"
SITEMAP_URL = "https://www.gemu-group.com/sitemap?locale=en"
USER_AGENT = "pharma-ci-radar-research/1.0 (+official-public-product-catalog)"

CATALOG_FIELDS = [
    "series_id",
    "name_en",
    "category",
    "subcategory",
    "product_role",
    "actuation",
    "pharma_relevance",
    "pharma_applications",
    "key_features",
    "operating_pressure",
    "media_temperature",
    "sterilization_temperature",
    "nominal_sizes",
    "body_materials",
    "seal_or_diaphragm_materials",
    "connections",
    "conformities",
    "protocols",
    "official_url",
    "accessed_date",
    "evidence_grade",
    "notes",
]

SPEC_FIELDS = [
    "series_id",
    "spec_key",
    "value_text",
    "source_url",
    "accessed_date",
    "notes",
]

EVIDENCE_FIELDS = [
    "evidence_id",
    "company",
    "series_id",
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

SOLUTION_URLS = {
    "P600M/P600S/P500M": (
        "Multi-port valve blocks made of stainless steel",
        "Customised product solutions",
        "Multi-port block valves",
        "https://www.gemu-group.com/en/products/customised-product-solutions/"
        "multi-port-block-valves/multi-port-valve-blocks-made-of-stainless-steel/",
    ),
    "SUMONDO Multiport": (
        "Single-use multi-port valve blocks",
        "Customised product solutions",
        "Single-use solutions",
        "https://www.gemu-group.com/en/products/customised-product-solutions/"
        "single-use-solutions/single-use-multi-port-valve-blocks/",
    ),
    "GEMÜ Systems": (
        "GEMÜ Systems - system solutions",
        "Customised product solutions",
        "System solutions",
        "https://www.gemu-group.com/en/products/customised-product-solutions/"
        "gemue-systems-system-solutions/",
    ),
    "PUPSIT solutions": (
        "Product solutions for PUPSIT",
        "Customised product solutions",
        "PUPSIT",
        "https://www.gemu-group.com/en/products/customised-product-solutions/"
        "product-solutions-for-pupsit/",
    ),
    "CONEXO": (
        "CONEXO asset lifecycle management platform",
        "Digital solutions",
        "Asset lifecycle management",
        "https://www.gemu-group.com/en/products/digital-solutions/"
        "conexo-asset-lifecycle-management-platform/",
    ),
}

HIGH_PHARMA_TERMS = (
    "pharmaceutical",
    "biotechnology",
    "sterile environment",
    "aseptic",
    "single-use",
    "single use",
    "pupsit",
)
MEDIUM_PHARMA_TERMS = (
    "hygienic",
    "sterilization",
    "cip",
    "sip",
    "fda",
    "usp",
    "ehedg",
    "3a",
    "food",
)
PROTOCOL_TERMS = (
    "IO-Link",
    "HART",
    "PROFINET",
    "Profibus",
    "DeviceNet",
    "Modbus",
    "EtherNet/IP",
    "AS-Interface",
    "Bluetooth",
)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--delay", type=float, default=2.0)
    parser.add_argument("--refresh", action="store_true")
    parser.add_argument("--build-only", action="store_true")
    return parser.parse_args()


def clean(value: str) -> str:
    return " ".join(value.replace("\xa0", " ").split())


def series_id_from_url(url: str) -> str:
    return url.rstrip("/").rsplit("/", 1)[-1].upper()


def is_product_series_url(url: str) -> bool:
    path = urlparse(url).path.strip("/").split("/")
    if len(path) != 5:
        return False
    return path[:2] == ["en", "products"] and path[2] in {
        "valve-technology",
        "measurement-and-control-technology",
    }


def discover_product_urls() -> list[str]:
    response = requests.get(
        SITEMAP_URL,
        timeout=60,
        headers={"User-Agent": USER_AGENT},
    )
    response.raise_for_status()
    root = etree.fromstring(response.content)
    namespace = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    urls = root.xpath("//s:loc/text()", namespaces=namespace)
    product_urls = [url.rstrip("/") for url in urls if is_product_series_url(url)]
    return sorted(set(product_urls))


def cache_path(series_id: str) -> Path:
    return CACHE / "pages" / f"{series_id}.html"


def fetch(url: str, target: Path, delay: float, refresh: bool) -> None:
    if target.exists() and not refresh:
        return
    response = requests.get(
        url,
        timeout=90,
        headers={"User-Agent": USER_AGENT},
    )
    response.raise_for_status()
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_bytes(response.content)
    time.sleep(delay)


def text_content(element: etree._Element) -> str:
    return clean(" ".join(element.itertext()))


def technical_details(document: html.HtmlElement) -> dict[str, str]:
    details: dict[str, str] = {}
    for row in document.xpath('//div[@role="row"][@aria-rowindex]'):
        cells = row.xpath('./div[@role="cell"]')
        if len(cells) < 2:
            continue
        key = text_content(cells[0])
        value = text_content(cells[-1])
        if key and value:
            details[key] = value
    return details


def key_features(document: html.HtmlElement) -> str:
    headings = [
        item
        for item in document.xpath("//h2|//h3")
        if clean(" ".join(item.itertext())).lower() == "key features"
    ]
    if not headings:
        return ""
    section = headings[0]
    while section is not None and section.tag != "section":
        section = section.getparent()
    if section is None:
        return ""
    bullets = [clean(" ".join(item.itertext())) for item in section.xpath(".//li")]
    return " | ".join(item for item in bullets if item)[:1500]


def classify_pharma(
    category: str,
    subcategory: str,
    name: str,
    description: str,
    features: str,
    details: dict[str, str],
) -> tuple[str, str]:
    subcategory_lower = subcategory.lower()
    combined = " ".join(
        [category, subcategory, name, description, features, json.dumps(details)]
    ).lower()

    def contains(term: str) -> bool:
        return bool(re.search(rf"(?<![a-z0-9]){re.escape(term)}(?![a-z0-9])", combined))

    if any(contains(term) for term in HIGH_PHARMA_TERMS):
        relevance = "HIGH"
    elif any(contains(term) for term in MEDIUM_PHARMA_TERMS):
        relevance = "MEDIUM"
    elif subcategory_lower in {
        "flow meters",
        "pilot valves",
        "position and process controllers",
        "position feedback devices and valve connections",
        "temperature measuring devices and pressure measuring devices",
        "seat valves",
        "tank bottom valves",
    }:
        relevance = "MEDIUM"
    else:
        relevance = "LOW"

    applications = []
    if any(contains(term) for term in ("sterile", "sterile environment", "aseptic")):
        applications.append("无菌主工艺、配液、纯化或卫生输送")
    elif any(contains(term) for term in ("pharmaceutical", "biotechnology")):
        applications.append("制药或生物技术过程；具体卫生等级需确认")
    if any(contains(term) for term in ("cip", "sip", "sterilization")):
        applications.append("CIP/SIP与蒸汽灭菌")
    if contains("single-use") or contains("single use"):
        applications.append("一次性生物工艺流路")
    if contains("tank bottom"):
        applications.append("罐底排放与低残留")
    if subcategory_lower in {"position and process controllers", "position feedback devices and valve connections"}:
        applications.append("阀门自动化、状态反馈与调节")
    if subcategory_lower == "flow meters":
        applications.append("过程流量测量；制药适配需逐系列确认")
    if subcategory_lower in {"seat valves", "process solenoid valves"} and relevance != "LOW":
        applications.append("CIP/SIP辅助回路与公用工程")
    return relevance, "；".join(dict.fromkeys(applications))


def mapped_value(details: dict[str, str], *keys: str) -> str:
    normalized = {clean(key).lower(): value for key, value in details.items()}
    for key in keys:
        if key.lower() in normalized:
            return normalized[key.lower()]
    return ""


def infer_actuation(name: str, description: str) -> str:
    combined = f"{name} {description}".lower()
    values = []
    for term, label in (
        ("pneumatic", "pneumatic"),
        ("motorized", "motorized"),
        ("electromotive", "motorized"),
        ("manual", "manual"),
        ("solenoid", "solenoid"),
    ):
        if term in combined:
            values.append(label)
    return " | ".join(dict.fromkeys(values))


def parse_product(url: str, accessed: str) -> tuple[dict[str, str], list[dict[str, str]]]:
    series_id = series_id_from_url(url)
    source = cache_path(series_id).read_bytes()
    document = html.fromstring(source)
    path = urlparse(url).path.strip("/").split("/")
    category = path[2].replace("-", " ").title()
    subcategory = path[3].replace("-", " ").title()
    name = clean(document.xpath("string(//h1)"))
    description = clean(document.xpath('string(//meta[@property="og:description"]/@content)'))
    image_alt = clean(document.xpath('string(//meta[@property="og:image:alt"]/@content)'))
    features = key_features(document)
    details = technical_details(document)
    relevance, applications = classify_pharma(
        category, subcategory, name, f"{description} {image_alt}", features, details
    )
    protocols = [term for term in PROTOCOL_TERMS if term.lower() in f"{description} {features} {details}".lower()]
    conformity = mapped_value(details, "Conformities", "Conformity")
    seals = mapped_value(
        details,
        "Diaphragm materials",
        "Seal materials",
        "Seat seal materials",
        "Tube materials",
    )
    row = {
        "series_id": series_id,
        "name_en": name,
        "category": category,
        "subcategory": subcategory,
        "product_role": name,
        "actuation": infer_actuation(name, description),
        "pharma_relevance": relevance,
        "pharma_applications": applications,
        "key_features": features,
        "operating_pressure": mapped_value(details, "Operating pressure"),
        "media_temperature": mapped_value(details, "Media temperature"),
        "sterilization_temperature": mapped_value(details, "Sterilization temperature"),
        "nominal_sizes": mapped_value(details, "Nominal sizes"),
        "body_materials": mapped_value(details, "Body materials"),
        "seal_or_diaphragm_materials": seals,
        "connections": mapped_value(details, "Connection types", "Electrical connection types"),
        "conformities": conformity,
        "protocols": " | ".join(protocols),
        "official_url": url,
        "accessed_date": accessed,
        "evidence_grade": "A",
        "notes": (
            f"Official page description: {description or image_alt}"
            if description or image_alt
            else "Current series discovered from the official English sitemap."
        ),
    }
    specs = [
        {
            "series_id": series_id,
            "spec_key": key,
            "value_text": value,
            "source_url": url,
            "accessed_date": accessed,
            "notes": "Exact text from the official product-page technical details table.",
        }
        for key, value in details.items()
    ]
    return row, specs


def parse_solution(
    series_id: str,
    definition: tuple[str, str, str, str],
    accessed: str,
) -> tuple[dict[str, str], list[dict[str, str]]]:
    fallback_name, category, subcategory, url = definition
    target = cache_path(series_id.replace("/", "_"))
    document = html.fromstring(target.read_bytes())
    name = clean(document.xpath("string(//h1)")) or fallback_name
    description = clean(document.xpath('string(//meta[@property="og:description"]/@content)'))
    details = technical_details(document)
    features = key_features(document)
    relevance, applications = classify_pharma(
        category, subcategory, name, description, features, details
    )
    if series_id in {"P600M/P600S/P500M", "SUMONDO Multiport", "PUPSIT solutions"}:
        relevance = "HIGH"
    if series_id == "P600M/P600S/P500M":
        applications = "低死区分配、混合、排空与复杂无菌流路"
    elif series_id == "SUMONDO Multiport":
        applications = "一次性生物工艺多通流路"
    elif series_id == "PUPSIT solutions":
        applications = "过滤器完整性测试与PUPSIT流路"
    elif series_id == "GEMÜ Systems":
        relevance = "MEDIUM"
        applications = "定制模块与系统集成；制药范围需按项目确认"
    elif series_id == "CONEXO":
        relevance = "MEDIUM"
        applications = "阀门追溯、证书访问和维护生命周期"
    row = {
        "series_id": series_id,
        "name_en": name,
        "category": category,
        "subcategory": subcategory,
        "product_role": name,
        "actuation": "",
        "pharma_relevance": relevance,
        "pharma_applications": applications,
        "key_features": features,
        "operating_pressure": mapped_value(details, "Operating pressure"),
        "media_temperature": mapped_value(details, "Media temperature"),
        "sterilization_temperature": mapped_value(details, "Sterilization temperature"),
        "nominal_sizes": mapped_value(details, "Nominal sizes"),
        "body_materials": mapped_value(details, "Body materials"),
        "seal_or_diaphragm_materials": mapped_value(details, "Diaphragm materials"),
        "connections": mapped_value(details, "Connection types"),
        "conformities": mapped_value(details, "Conformities", "Conformity"),
        "protocols": "",
        "official_url": url,
        "accessed_date": accessed,
        "evidence_grade": "A",
        "notes": description or "Current official solution page.",
    }
    specs = [
        {
            "series_id": series_id,
            "spec_key": key,
            "value_text": value,
            "source_url": url,
            "accessed_date": accessed,
            "notes": "Exact text from the official solution-page technical details table.",
        }
        for key, value in details.items()
    ]
    return row, specs


def write_csv(path: Path, fields: list[str], rows: list[dict[str, str]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fields, lineterminator="\n")
        writer.writeheader()
        writer.writerows(rows)


def main() -> None:
    args = parse_args()
    product_urls = discover_product_urls()
    all_targets = [(series_id_from_url(url), url) for url in product_urls]
    all_targets.extend(
        (series_id.replace("/", "_"), definition[3])
        for series_id, definition in SOLUTION_URLS.items()
    )
    if not args.build_only:
        for index, (series_id, url) in enumerate(all_targets, 1):
            fetch(url, cache_path(series_id), args.delay, args.refresh)
            if index == 1 or index % 20 == 0 or index == len(all_targets):
                print(f"cached {index}/{len(all_targets)}", flush=True)

    accessed = date.today().isoformat()
    catalog: list[dict[str, str]] = []
    specs: list[dict[str, str]] = []
    missing = []
    for url in product_urls:
        series_id = series_id_from_url(url)
        if not cache_path(series_id).exists():
            missing.append(series_id)
            continue
        row, row_specs = parse_product(url, accessed)
        catalog.append(row)
        specs.extend(row_specs)
    for series_id, definition in SOLUTION_URLS.items():
        target_id = series_id.replace("/", "_")
        if not cache_path(target_id).exists():
            missing.append(series_id)
            continue
        row, row_specs = parse_solution(series_id, definition, accessed)
        catalog.append(row)
        specs.extend(row_specs)

    catalog.sort(key=lambda row: (row["category"], row["subcategory"], row["series_id"]))
    specs.sort(key=lambda row: (row["series_id"], row["spec_key"]))
    write_csv(RESEARCH / "gemu-series-catalog.csv", CATALOG_FIELDS, catalog)
    write_csv(RESEARCH / "gemu-series-specifications.csv", SPEC_FIELDS, specs)
    evidence = [
        {
            "evidence_id": f"GEMU-SERIES-{re.sub(r'[^A-Z0-9]+', '-', row['series_id'].upper()).strip('-')}",
            "company": "GEMÜ",
            "series_id": row["series_id"],
            "topic": f"{row['category']} / {row['subcategory']}",
            "fact_status": "FACT",
            "summary": (
                f"Current official product or solution page identifies {row['series_id']} "
                f"as {row['name_en']}."
            ),
            "source_type": "官方产品页",
            "source_title": f"GEMÜ {row['series_id']} - {row['name_en']}",
            "source_url": row["official_url"],
            "accessed_date": row["accessed_date"],
            "evidence_grade": "A",
            "supports_conclusion": (
                f"GEMÜ current-series catalog; pharma relevance {row['pharma_relevance']}."
            ),
            "notes": "Parameters and application boundaries remain configuration-specific.",
        }
        for row in catalog
    ]
    write_csv(RESEARCH / "gemu-series-evidence.csv", EVIDENCE_FIELDS, evidence)
    coverage = {
        "generated_date": accessed,
        "sitemap_product_series_count": len(product_urls),
        "solution_row_count": len(SOLUTION_URLS),
        "catalog_count": len(catalog),
        "missing_cache": missing,
        "category_counts": Counter(row["category"] for row in catalog),
        "subcategory_counts": Counter(row["subcategory"] for row in catalog),
        "pharma_relevance_counts": Counter(row["pharma_relevance"] for row in catalog),
        "specification_row_count": len(specs),
    }
    (RESEARCH / "gemu-series-coverage.json").write_text(
        json.dumps(coverage, ensure_ascii=False, indent=2, default=dict) + "\n",
        encoding="utf-8",
    )
    print(json.dumps(coverage, ensure_ascii=False, indent=2, default=dict))


if __name__ == "__main__":
    main()
