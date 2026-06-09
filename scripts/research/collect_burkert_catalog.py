#!/usr/bin/env python3
"""Build a current Bürkert Type catalog from official global and China sites."""

from __future__ import annotations

import argparse
import csv
import html
import json
import re
import subprocess
import sys
import threading
import time
import xml.etree.ElementTree as ET
from collections import Counter, defaultdict
from concurrent.futures import ThreadPoolExecutor
from datetime import date
from pathlib import Path
from urllib.parse import urlparse


ROOT = Path(__file__).resolve().parents[2]
OUTPUT_DIR = ROOT / "docs" / "research"
CACHE_DIR = ROOT / ".config" / "burkert-catalog-cache"

GLOBAL_SITEMAP = "https://www.burkert.com/GoogleSitemaps/website_com_en_Type_GoogleSitemap.xml"
CHINA_SITEMAP = "https://www.burkert.com.cn/GoogleSitemaps/website_cn_cn_Type_GoogleSitemap.xml"
USER_AGENT = "pharma-ci-radar-research/1.0 (+official-public-product-catalog)"

UNAVAILABLE_DATASHEET_URLS = {
    "https://www.burkert.com/en/Media/plm/DTS/DS/ds2063-inox-eu-en.pdf?id=DTS0000000000000001000450606ENO":
        "Official page link returned HTTP 404 during validation on 2026-06-09.",
}

CATALOG_FIELDS = [
    "type_id",
    "name_en",
    "name_zh",
    "category",
    "subcategory",
    "product_role",
    "operating_principle",
    "primary_media",
    "primary_applications",
    "pharma_relevance",
    "pharma_applications",
    "lifecycle_status",
    "china_visibility",
    "global_product_url",
    "china_product_url",
    "english_datasheet_url",
    "chinese_datasheet_url",
    "accessed_date",
    "evidence_grade",
    "notes",
]

SPEC_FIELDS = [
    "type_id",
    "spec_group",
    "spec_key",
    "value_min",
    "value_max",
    "value_text",
    "unit",
    "configuration_scope",
    "source_url",
    "accessed_date",
    "notes",
]

CATEGORY_ZH = {
    "Solenoid Valves": "电磁阀",
    "Process and Control Valves": "过程与控制阀",
    "Electromotive Valves": "电动阀",
    "Pneumatics and Process Interfaces": "气动与过程接口",
    "Sensors, Transmitters and Controllers": "传感器、变送器与控制器",
    "Microfluidics Products and Pumps": "微流体产品与泵",
    "Mass Flow Controllers": "质量流量控制器与流量计",
    "Proportional Valves": "比例阀",
    "Industrial Communication": "工业通信",
    "Additional Products": "附加产品",
}

PHARMA_HIGH_TERMS = {
    "pharma",
    "pharmaceutical",
    "hygienic",
    "aseptic",
    "sterile",
    "diaphragm valve",
    "multiport",
    "tank bottom",
    "wfi",
    "cip",
    "sip",
}

CERTIFICATIONS = [
    "3-A",
    "EHEDG",
    "FDA",
    "USP",
    "ASME BPE",
    "ATEX",
    "IECEx",
    "EC 1935/2004",
    "NEMA Type 4X",
]

PROTOCOLS = [
    "PROFINET",
    "EtherNet/IP",
    "EtherCAT",
    "IO-Link",
    "CANopen",
    "Modbus",
    "HART",
    "büS",
    "AS-Interface",
    "FOUNDATION Fieldbus",
    "PROFIBUS",
]

MATERIALS = [
    "stainless steel",
    "316L",
    "PTFE",
    "EPDM",
    "PEEK",
    "PFA",
    "PVDF",
    "brass",
    "plastic",
    "ceramic",
]


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--delay", type=float, default=10.0, help="Seconds between requests per host.")
    parser.add_argument("--limit", type=int, default=0, help="Limit Types for a smoke run; 0 means all.")
    parser.add_argument("--refresh", action="store_true", help="Ignore cached Type pages.")
    parser.add_argument("--build-only", action="store_true", help="Build CSVs from existing cache.")
    return parser.parse_args()


def run_curl(url: str) -> bytes:
    command = [
        "curl",
        "--location",
        "--compressed",
        "--silent",
        "--show-error",
        "--fail",
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
        url,
    ]
    return subprocess.check_output(command)


def cache_path(scope: str, key: str, suffix: str = ".html") -> Path:
    safe = re.sub(r"[^A-Za-z0-9_.-]+", "_", key)
    return CACHE_DIR / scope / f"{safe}{suffix}"


def fetch_cached(url: str, path: Path, refresh: bool = False) -> bytes:
    if path.exists() and not refresh:
        return path.read_bytes()
    data = run_curl(url)
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_suffix(path.suffix + ".tmp")
    temporary.write_bytes(data)
    temporary.replace(path)
    return data


def sitemap_urls(url: str, cache_key: str, refresh: bool = False) -> list[str]:
    payload = fetch_cached(url, cache_path("sitemaps", cache_key, ".xml"), refresh)
    root = ET.fromstring(payload)
    namespace = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    return [node.text.strip() for node in root.findall("s:url/s:loc", namespace) if node.text]


def type_id_from_url(url: str) -> str:
    return url.rstrip("/").rsplit("/", 1)[-1]


def crawl_scope(
    label: str,
    urls: list[str],
    delay: float,
    refresh: bool,
) -> None:
    last_request = 0.0
    fetched = 0
    failed_urls: list[str] = []
    for index, url in enumerate(urls, start=1):
        type_id = type_id_from_url(url)
        target = cache_path(label, type_id)
        if target.exists() and not refresh:
            continue
        wait = delay - (time.monotonic() - last_request)
        if wait > 0:
            time.sleep(wait)
        last_request = time.monotonic()
        try:
            fetch_cached(url, target, refresh=True)
        except subprocess.CalledProcessError as error:
            print(f"[{label}] failed {type_id}: {error}", file=sys.stderr, flush=True)
            failed_urls.append(url)
            continue
        fetched += 1
        if fetched == 1 or fetched % 10 == 0 or index == len(urls):
            print(f"[{label}] fetched {fetched}; processed {index}/{len(urls)}", flush=True)

    for recovery_round in range(1, 3):
        if not failed_urls:
            break
        retry_urls, failed_urls = failed_urls, []
        print(f"[{label}] recovery round {recovery_round}: {len(retry_urls)} page(s)", flush=True)
        time.sleep(delay)
        for url in retry_urls:
            type_id = type_id_from_url(url)
            wait = delay - (time.monotonic() - last_request)
            if wait > 0:
                time.sleep(wait)
            last_request = time.monotonic()
            try:
                fetch_cached(url, cache_path(label, type_id), refresh=True)
            except subprocess.CalledProcessError as error:
                print(f"[{label}] recovery failed {type_id}: {error}", file=sys.stderr, flush=True)
                failed_urls.append(url)
                continue
            fetched += 1


def clean_text(value: str) -> str:
    value = html.unescape(html.unescape(value))
    value = re.sub(r"<[^>]+>", " ", value)
    value = value.replace("✓", "")
    return " ".join(value.split())


def meta_content(source: str, name: str) -> str:
    patterns = [
        rf'<meta\s+name="{re.escape(name)}"\s+content="([^"]*)"',
        rf'<meta\s+content="([^"]*)"\s+name="{re.escape(name)}"',
    ]
    for pattern in patterns:
        match = re.search(pattern, source, flags=re.I | re.S)
        if match:
            return clean_text(match.group(1))
    return ""


def page_title(source: str) -> str:
    match = re.search(r"<title>(.*?)</title>", source, flags=re.I | re.S)
    return clean_text(match.group(1)) if match else ""


def type_description(source: str) -> tuple[str, str]:
    match = re.search(
        r"<h2>\s*Type Description\s*</h2>(.*?)(?:<small\s+class=\"small-print\"|</section>)",
        source,
        flags=re.I | re.S,
    )
    if not match:
        return "", ""
    section = match.group(1)
    paragraphs = re.findall(r"<p[^>]*>(.*?)</p>", section, flags=re.I | re.S)
    bullets = re.findall(r"<li[^>]*>(.*?)</li>", section, flags=re.I | re.S)
    paragraph = clean_text(paragraphs[0]) if paragraphs else ""
    features = " | ".join(clean_text(item) for item in bullets if clean_text(item))
    return paragraph, features


def product_name(title: str, type_id: str, chinese: bool = False) -> str:
    if not title:
        return ""
    patterns = (
        [
            rf"^类型\s*{re.escape(type_id)}\s*[-–—]\s*",
            rf"^{re.escape(type_id)}\s*型\s*[-–—]\s*",
            rf"^Type\s+{re.escape(type_id)}\s*[-–—]\s*",
        ]
        if chinese
        else [rf"^Type\s+{re.escape(type_id)}\s*[-–—]\s*"]
    )
    for pattern in patterns:
        stripped = re.sub(pattern, "", title, flags=re.I)
        if stripped != title:
            return stripped.strip()
    if chinese and type_id.lower() not in title.lower():
        return ""
    return title.strip()


def breadcrumb_paths(source: str) -> list[list[str]]:
    paths: list[list[str]] = []
    for block in re.findall(
        r'<script\s+type="application/ld\+json">(.*?)</script>',
        source,
        flags=re.I | re.S,
    ):
        try:
            payload = json.loads(html.unescape(block))
        except json.JSONDecodeError:
            continue
        entries = payload if isinstance(payload, list) else [payload]
        for entry in entries:
            if not isinstance(entry, dict) or entry.get("@type") != "BreadcrumbList":
                continue
            names = [
                item.get("name", "")
                for item in entry.get("itemListElement", [])
                if isinstance(item, dict)
            ]
            names = [name for name in names if name and name not in {"Home", "Products"}]
            if names and names[-1].lower().startswith("type "):
                names = names[:-1]
            if names:
                paths.append(names)
    unique: list[list[str]] = []
    for path in paths:
        if path not in unique:
            unique.append(path)
    return unique


def datasheet_urls(source: str, type_id: str) -> tuple[str, str]:
    links = [
        html.unescape(link)
        for link in re.findall(
            r'https://www\.burkert\.com(?:\.cn)?/(?:en|cn)/Media/plm/DTS/DS/[^"\s<]+?\.pdf2?(?:\?id=[^"&\s<]+)?',
            source,
            flags=re.I,
        )
    ]
    links = list(dict.fromkeys(links))
    normalized_id = re.sub(r"[^a-z0-9]", "", type_id.lower())

    def belongs_to_type(link: str) -> bool:
        filename = urlparse(link).path.rsplit("/", 1)[-1].lower()
        normalized_filename = re.sub(r"[^a-z0-9]", "", filename)
        return normalized_id in normalized_filename

    english_links = [link for link in links if re.search(r"(?:-eu-en|_en)\.pdf2?", link, re.I)]
    chinese_links = [link for link in links if re.search(r"(?:-cn-zh|-zh-cn|_zh)\.pdf2?", link, re.I)]
    english = next((link for link in english_links if belongs_to_type(link)), "")
    chinese = next((link for link in chinese_links if belongs_to_type(link)), "")
    return english, chinese


def infer_media(text: str) -> str:
    lower = text.lower()
    values = []
    for term, label in [
        ("gas", "气体"),
        ("air", "空气"),
        ("steam", "蒸汽"),
        ("water", "水"),
        ("liquid", "液体"),
        ("fluid", "液体/气体"),
        ("aggressive", "腐蚀性介质"),
        ("neutral", "中性介质"),
    ]:
        if term in lower and label not in values:
            values.append(label)
    return "；".join(values)


def infer_applications(text: str, category: str, subcategory: str) -> str:
    lower = text.lower()
    values = []
    candidates = [
        ("dosing", "定量/加注"),
        ("mixing", "混合"),
        ("analysis", "分析测量"),
        ("laboratory", "实验室设备"),
        ("medical", "医疗设备"),
        ("water treatment", "水处理"),
        ("process automation", "过程自动化"),
        ("hygienic", "卫生过程"),
        ("food", "食品饮料"),
        ("pharma", "制药"),
        ("fermentation", "发酵"),
        ("packaging", "包装"),
    ]
    for term, label in candidates:
        if term in lower and label not in values:
            values.append(label)
    if not values:
        values.append(subcategory or category)
    return "；".join(values)


def pharma_classification(
    text: str,
    category: str,
    subcategory: str,
    product_name: str,
) -> tuple[str, str]:
    lower = text.lower()
    process_hygienic = category == "过程与控制阀" and any(
        term in lower for term in PHARMA_HIGH_TERMS
    )
    if process_hygienic or any(term in lower for term in ["pharma", "pharmaceutical", "aseptic", "sterile"]):
        relevance = "HIGH"
    elif category in {
        "过程与控制阀",
        "传感器、变送器与控制器",
        "质量流量控制器与流量计",
        "气动与过程接口",
        "微流体产品与泵",
    }:
        relevance = "MEDIUM"
    else:
        relevance = "LOW"

    applications = []
    combined = f"{lower} {subcategory.lower()}"
    role_context = f"{product_name.lower()} {subcategory.lower()}"
    if category == "过程与控制阀":
        if any(
            term in role_context
            for term in [
                "diaphragm valve",
                "bellows valve",
                "pinch valve",
                "hygienic 2-way",
                "multifunction block",
            ]
        ):
            applications.extend(["无菌输送/隔离", "CIP/SIP", "制药用水"])
        elif "angle seat" in role_context:
            applications.append("CIP/SIP辅助回路及洁净公用工程")
        elif "actuator" in role_context and "hygienic" in combined:
            applications.append("卫生过程阀执行与自动化")
        elif any(term in role_context for term in ["control head", "positioner", "feedback head", "control unit"]):
            applications.append("制药设备阀门自动化/状态反馈")
        elif "adapter" in role_context:
            applications.append("卫生过程阀自动化接口")
        elif "service, maintenance" in role_context:
            applications.append("制药设备调试/维护")
        elif "accessories > diaphragms" in role_context:
            applications.append("卫生隔膜阀膜片维护")
    if category == "质量流量控制器与流量计" and any(
        term in product_name.lower()
        for term in ["mass flow", "gas controller", "gas meter"]
    ):
        applications.append("发酵/生物反应器供气")
    if category == "传感器、变送器与控制器" and any(
        term in lower for term in ["flowmeter", "flow meter", "flow sensor", "flow transmitter"]
    ):
        applications.append("WFI/PW及CIP流量监控")
    if category == "气动与过程接口" and any(
        term in combined for term in ["valve island", "pneumatic", "process interface"]
    ):
        applications.append("制药设备气动自动化")
    if category == "微流体产品与泵" and any(
        term in combined for term in ["microfluidic", "micro valve", "micro pump", "dosing"]
    ):
        applications.append("实验室/分析及精密定量")
    analysis_context = f"{product_name.lower()} {subcategory.lower()}"
    if category == "传感器、变送器与控制器" and any(
        term in analysis_context
        for term in ["conductivity", "ph", "orp", "turbidity", "liquid analysis", "analysis probes"]
    ):
        applications.append("制药用水质量监测")
    if category == "传感器、变送器与控制器" and (
        any(term in combined for term in ["sanitary variant", "hygienic level"])
        or (relevance == "HIGH" and "level" in subcategory.lower())
    ):
        applications.append("卫生储罐液位监测")
    if category == "附加产品" and "hygienic fitting" in combined:
        applications.append("卫生管路连接")
    if category == "附加产品" and any(
        term in combined for term in ["microfiltration", "ultrafiltration", "nanofiltration"]
    ):
        applications.append("生物工艺过滤/分离")
    return relevance, "；".join(dict.fromkeys(applications))


def lifecycle_status(text: str) -> str:
    lower = text.lower()
    if any(term in lower for term in ["discontinued", "no longer available", "product is obsolete"]):
        return "DISCONTINUED"
    if any(term in lower for term in ["successor product", "replacement product", "replaced by"]):
        return "TRANSITION"
    return "CURRENT"


def extract_specs(type_id: str, source_url: str, text: str, accessed: str) -> list[dict[str, str]]:
    rows: list[dict[str, str]] = []

    def add(group: str, key: str, value: str, unit: str = "") -> None:
        if not value:
            return
        rows.append(
            {
                "type_id": type_id,
                "spec_group": group,
                "spec_key": key,
                "value_min": "",
                "value_max": "",
                "value_text": value,
                "unit": unit,
                "configuration_scope": "Type-level official page description",
                "source_url": source_url,
                "accessed_date": accessed,
                "notes": "Only values explicitly present in the official Type page title or description are recorded.",
            }
        )

    def add_ranges(group: str, key: str, pattern: str, unit: str) -> None:
        matches = list(re.finditer(pattern, text, flags=re.I))
        for index, match in enumerate(matches, start=1):
            row_unit = match.group(3) if unit == "$3" and match.lastindex and match.lastindex >= 3 else unit
            rows.append(
                {
                    "type_id": type_id,
                    "spec_group": group,
                    "spec_key": f"{key}_{index}",
                    "value_min": match.group(1).replace(",", "."),
                    "value_max": match.group(2).replace(",", "."),
                    "value_text": clean_text(match.group(0)),
                    "unit": row_unit,
                    "configuration_scope": "Type-level official page description",
                    "source_url": source_url,
                    "accessed_date": accessed,
                    "notes": "Explicit range extracted from the official Type page; confirm configuration-specific limits in the data sheet.",
                }
            )

    def add_upper_limits(group: str, key: str, pattern: str, unit: str) -> None:
        matches = list(re.finditer(pattern, text, flags=re.I))
        for index, match in enumerate(matches, start=1):
            rows.append(
                {
                    "type_id": type_id,
                    "spec_group": group,
                    "spec_key": f"{key}_{index}",
                    "value_min": "",
                    "value_max": match.group(1).replace(",", "."),
                    "value_text": clean_text(match.group(0)),
                    "unit": unit,
                    "configuration_scope": "Type-level official page description",
                    "source_url": source_url,
                    "accessed_date": accessed,
                    "notes": "Explicit upper limit extracted from the official Type page; confirm configuration-specific limits in the data sheet.",
                }
            )

    way_match = re.search(r"\b([234]/[234]-way)\b", text, flags=re.I)
    if way_match:
        add("function", "way_configuration", way_match.group(1))

    actuations = [
        label
        for term, label in [
            ("pneumatic", "pneumatic"),
            ("electromotive", "electromotive"),
            ("solenoid", "solenoid"),
            ("manual", "manual"),
            ("piezoelectric", "piezoelectric"),
        ]
        if term in text.lower()
    ]
    add("actuation", "actuation_method", " | ".join(dict.fromkeys(actuations)))

    materials = [value for value in MATERIALS if value.lower() in text.lower()]
    add("materials", "explicit_materials", " | ".join(materials))

    certifications = [value for value in CERTIFICATIONS if value.lower() in text.lower()]
    add("compliance", "explicit_certifications_or_ratings", " | ".join(certifications))

    protocols = [value for value in PROTOCOLS if value.lower() in text.lower()]
    add("communication", "explicit_protocols", " | ".join(protocols))

    protection = sorted(set(re.findall(r"\bIP\d{2}(?:/\d{2})?\b", text, flags=re.I)))
    add("environment", "protection_rating", " | ".join(protection))

    voltages = sorted(set(re.findall(r"\b\d+(?:\.\d+)?\s*V(?:\s*DC|\s*AC)?\b", text, flags=re.I)))
    add("electrical", "explicit_voltage", " | ".join(voltages))

    seals = [value for value in ["EPDM", "PTFE", "FKM", "FFKM", "NBR"] if value.lower() in text.lower()]
    add("seals", "explicit_seal_materials", " | ".join(seals))

    connections = [
        label
        for term, label in [
            ("clamp", "clamp"),
            ("weld", "weld"),
            ("flange", "flange"),
            ("thread", "thread"),
            ("push-in", "push-in"),
            ("hose", "hose"),
        ]
        if term in text.lower()
    ]
    add("connection", "explicit_connection_types", " | ".join(dict.fromkeys(connections)))

    separator = r"(?:to|…|\.{2,3}|–|-)"
    add_ranges(
        "operating_limits",
        "pressure_range",
        rf"(?:from\s+)?(-?\d+(?:[.,]\d+)?)\s*(?:bar\s*)?{separator}\s*(-?\d+(?:[.,]\d+)?)\s*bar\b",
        "bar",
    )
    add_ranges(
        "operating_limits",
        "temperature_range",
        rf"(?:from\s+)?(-?\d+(?:[.,]\d+)?)\s*(?:°?\s*C\s*)?{separator}\s*(-?\d+(?:[.,]\d+)?)\s*°?\s*C\b",
        "°C",
    )
    add_ranges(
        "dimensions",
        "diameter_range",
        rf"(?:Ø|DN)\s*(-?\d+(?:[.,]\d+)?)\s*{separator}\s*(-?\d+(?:[.,]\d+)?)\s*mm\b",
        "mm",
    )
    add_ranges(
        "flow",
        "flow_range",
        rf"(-?\d+(?:[.,]\d+)?)\s*{separator}\s*(-?\d+(?:[.,]\d+)?)\s*([µμu]l/min|ml/min|l/min|m³/h|m3/h|slpm)\b",
        "$3",
    )
    add_ranges(
        "flow",
        "nominal_flow_range",
        r"(?:from\s+)?(-?\d+(?:[.,]\d+)?)\s*(?:IN/min|lN/min|[µμu]l/min|ml/min|l/min|m³/h|m3/h|slpm)"
        r"\s*(?:to|…|\.{2,3}|–|-)\s*(-?\d+(?:[.,]\d+)?)\s*(IN/min|lN/min|[µμu]l/min|ml/min|l/min|m³/h|m3/h|slpm)\b",
        "$3",
    )
    add_ranges(
        "flow_capacity",
        "kvs_range",
        rf"Kvs?\s+value\s+(-?\d+(?:[.,]\d+)?)\s*{separator}\s*(-?\d+(?:[.,]\d+)?)\s*(m³/h|m3/h)\b",
        "$3",
    )
    add_ranges(
        "dimensions",
        "nominal_diameter_dn_range",
        rf"DN\s*0?(\d+(?:[.,]\d+)?)\s*{separator}\s*DN\s*0?(\d+(?:[.,]\d+)?)\b",
        "DN",
    )
    add_upper_limits(
        "flow_capacity",
        "cv_max",
        r"Cv\s+ratings?\s+up\s+to\s+(\d+(?:[.,]\d+)?)",
        "Cv",
    )
    add_upper_limits(
        "operating_limits",
        "pressure_max",
        r"(?:operating|high)\s+pressure(?:\s+range)?\s+up\s+to\s+\+?(\d+(?:[.,]\d+)?)\s*bar(?:\(g\))?",
        "bar",
    )
    add_upper_limits(
        "operating_limits",
        "temperature_max",
        r"(?:medium\s+)?temperature\s+up\s+to\s+\+?(\d+(?:[.,]\d+)?)\s*°?\s*C\b",
        "°C",
    )
    add_upper_limits(
        "dimensions",
        "nominal_diameter_dn_max",
        r"nominal\s+diameters?(?:\s+of)?\s+up\s+to\s+DN\s*(\d+(?:[.,]\d+)?)",
        "DN",
    )
    surface_finishes = re.findall(
        r"Ra\s*[≤<]\s*\d+(?:[.,]\d+)?\s*[µμ]m(?:\s*(?:\.\.\.|to|–|-)\s*[≤<]?\s*\d+(?:[.,]\d+)?\s*[µμ]m)?",
        text,
        flags=re.I,
    )
    add("surface_finish", "explicit_roughness", " | ".join(dict.fromkeys(surface_finishes)), "µm")

    kvs_signatures = {
        (row["value_min"], row["value_max"], row["unit"])
        for row in rows
        if row["spec_group"] == "flow_capacity" and row["spec_key"].startswith("kvs_range")
    }
    return [
        row
        for row in rows
        if not (
            row["spec_group"] == "flow"
            and row["spec_key"].startswith("flow_range")
            and (row["value_min"], row["value_max"], row["unit"]) in kvs_signatures
        )
    ]


def parse_type(
    type_id: str,
    global_url: str,
    china_url: str,
    accessed: str,
) -> tuple[dict[str, str], list[dict[str, str]]]:
    global_path = cache_path("global", type_id)
    source = global_path.read_text(encoding="utf-8", errors="ignore")
    china_path = cache_path("china", type_id)
    china_source = china_path.read_text(encoding="utf-8", errors="ignore") if china_path.exists() else ""

    title_en = page_title(source)
    title_zh = page_title(china_source)
    name_en = product_name(title_en, type_id)
    name_zh = product_name(title_zh, type_id, chinese=True)
    description, features = type_description(source)
    if not description:
        description = meta_content(source, "description")
    paths = breadcrumb_paths(source)
    primary_path = paths[0] if paths else []
    category_en = primary_path[0] if primary_path else "Unclassified"
    category = CATEGORY_ZH.get(category_en, category_en)
    subcategory = " > ".join(primary_path[1:]) if len(primary_path) > 1 else ""
    product_role = primary_path[-1] if primary_path else name_en
    english_datasheet, chinese_datasheet = datasheet_urls(source, type_id)
    if not chinese_datasheet and china_source:
        _, chinese_datasheet = datasheet_urls(china_source, type_id)
    unavailable_documents = []
    if english_datasheet in UNAVAILABLE_DATASHEET_URLS:
        unavailable_documents.append(("English data sheet", english_datasheet))
        english_datasheet = ""
    if chinese_datasheet in UNAVAILABLE_DATASHEET_URLS:
        unavailable_documents.append(("Chinese data sheet", chinese_datasheet))
        chinese_datasheet = ""
    has_china_page = bool(china_url and china_path.exists())
    has_zh_datasheet = bool(chinese_datasheet)
    if has_china_page and has_zh_datasheet:
        china_visibility = "CHINA_PAGE_AND_ZH_DATASHEET"
    elif has_china_page:
        china_visibility = "CHINA_PAGE_ONLY"
    elif has_zh_datasheet:
        china_visibility = "ZH_DATASHEET_ONLY"
    else:
        china_visibility = "NOT_FOUND"

    combined = " ".join([name_en, description, features, category_en, subcategory])
    relevance, pharma_apps = pharma_classification(combined, category, subcategory, name_en)
    all_paths = " | ".join(" > ".join(path) for path in paths)
    notes = (
        "Global official Type page is the product master. "
        "China visibility indicates public page/document visibility only, not stock, origin or lead time."
    )
    if all_paths:
        notes += f" Official category paths: {all_paths}."
    for label, url in unavailable_documents:
        notes += f" {label} omitted because the official link returned HTTP 404 on 2026-06-09: {url}."
    if not name_zh:
        name_zh = name_en
        notes += " No official Chinese page title was parsed; English name retained."

    row = {
        "type_id": type_id,
        "name_en": name_en,
        "name_zh": name_zh,
        "category": category,
        "subcategory": subcategory,
        "product_role": product_role,
        "operating_principle": description,
        "primary_media": infer_media(combined),
        "primary_applications": infer_applications(combined, category, subcategory),
        "pharma_relevance": relevance,
        "pharma_applications": pharma_apps,
        "lifecycle_status": lifecycle_status(combined),
        "china_visibility": china_visibility,
        "global_product_url": global_url,
        "china_product_url": china_url if has_china_page else "",
        "english_datasheet_url": english_datasheet,
        "chinese_datasheet_url": chinese_datasheet,
        "accessed_date": accessed,
        "evidence_grade": "A",
        "notes": notes,
    }
    return row, extract_specs(type_id, global_url, combined, accessed)


def write_csv(path: Path, fields: list[str], rows: list[dict[str, str]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fields, lineterminator="\n")
        writer.writeheader()
        writer.writerows(rows)


def build_outputs(global_urls: list[str], china_urls: list[str]) -> tuple[list[str], list[str]]:
    accessed = date.today().isoformat()
    china_by_id = {type_id_from_url(url): url for url in china_urls}
    catalog: list[dict[str, str]] = []
    specs: list[dict[str, str]] = []
    missing = []
    category_membership_counts: Counter[str] = Counter()
    multi_path_type_count = 0
    multi_category_type_count = 0
    for global_url in global_urls:
        type_id = type_id_from_url(global_url)
        if not cache_path("global", type_id).exists():
            missing.append(type_id)
            continue
        source = cache_path("global", type_id).read_text(encoding="utf-8", errors="ignore")
        paths = breadcrumb_paths(source)
        top_categories = {
            CATEGORY_ZH.get(path[0], path[0])
            for path in paths
            if path
        }
        category_membership_counts.update(top_categories)
        if len(paths) > 1:
            multi_path_type_count += 1
        if len(top_categories) > 1:
            multi_category_type_count += 1
        row, type_specs = parse_type(
            type_id,
            global_url,
            china_by_id.get(type_id, ""),
            accessed,
        )
        catalog.append(row)
        specs.extend(type_specs)

    catalog.sort(key=lambda row: row["type_id"])
    unique_specs = {}
    for row in specs:
        key = (row["type_id"], row["spec_group"], row["spec_key"])
        unique_specs[key] = row
    specs = [unique_specs[key] for key in sorted(unique_specs)]

    write_csv(OUTPUT_DIR / "burkert-type-catalog.csv", CATALOG_FIELDS, catalog)
    write_csv(OUTPUT_DIR / "burkert-type-specifications.csv", SPEC_FIELDS, specs)

    category_counts = Counter(row["category"] for row in catalog)
    china_counts = Counter(row["china_visibility"] for row in catalog)
    relevance_counts = Counter(row["pharma_relevance"] for row in catalog)
    missing_china = [
        type_id_from_url(url)
        for url in china_urls
        if not cache_path("china", type_id_from_url(url)).exists()
    ]
    coverage = {
        "generated_date": accessed,
        "global_sitemap_count": len(global_urls),
        "china_sitemap_count": len(china_urls),
        "catalog_count": len(catalog),
        "missing_global_cache": missing,
        "missing_china_cache": missing_china,
        "category_counts": dict(sorted(category_counts.items())),
        "category_membership_counts": dict(sorted(category_membership_counts.items())),
        "multi_path_type_count": multi_path_type_count,
        "multi_category_type_count": multi_category_type_count,
        "china_visibility_counts": dict(sorted(china_counts.items())),
        "pharma_relevance_counts": dict(sorted(relevance_counts.items())),
        "specification_row_count": len(specs),
    }
    (OUTPUT_DIR / "burkert-catalog-coverage.json").write_text(
        json.dumps(coverage, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(json.dumps(coverage, ensure_ascii=False, indent=2))
    return missing, missing_china


def main() -> None:
    args = parse_args()
    global_urls = sitemap_urls(GLOBAL_SITEMAP, "global-types", args.refresh)
    china_urls = sitemap_urls(CHINA_SITEMAP, "china-types", args.refresh)
    if args.limit:
        global_urls = global_urls[: args.limit]
        global_ids = {type_id_from_url(url) for url in global_urls}
        china_urls = [url for url in china_urls if type_id_from_url(url) in global_ids]

    if not args.build_only:
        with ThreadPoolExecutor(max_workers=2) as executor:
            futures = [
                executor.submit(crawl_scope, "global", global_urls, args.delay, args.refresh),
                executor.submit(crawl_scope, "china", china_urls, args.delay, args.refresh),
            ]
            for future in futures:
                future.result()

    missing_global, missing_china = build_outputs(global_urls, china_urls)
    if missing_global or missing_china:
        print(
            "Catalog is incomplete: "
            f"{len(missing_global)} global and {len(missing_china)} China Type page(s) are still missing.",
            file=sys.stderr,
        )
        raise SystemExit(1)


if __name__ == "__main__":
    main()
