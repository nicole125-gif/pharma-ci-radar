#!/usr/bin/env python3
"""Generate a conservative ESG/Jingrui series catalogue from official indexed pages."""

from __future__ import annotations

import csv
import json
from collections import Counter
from datetime import date
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
RESEARCH = ROOT / "docs" / "research"

CATALOG_FIELDS = [
    "series_id",
    "name_en",
    "name_zh",
    "category",
    "subcategory",
    "product_role",
    "pharma_relevance",
    "pharma_applications",
    "body_material",
    "seal_or_diaphragm",
    "pressure",
    "temperature",
    "connections",
    "automation",
    "fact_status",
    "source_access",
    "official_url",
    "accessed_date",
    "evidence_grade",
    "notes",
]

SPEC_FIELDS = [
    "series_id",
    "spec_key",
    "value_text",
    "fact_status",
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

ROWS = [
    {
        "series_id": "A00",
        "name_en": "Pneumatic diaphragm valve",
        "name_zh": "气动隔膜阀",
        "category": "Sanitary valves",
        "subcategory": "Diaphragm valves",
        "product_role": "Pneumatic hygienic diaphragm valve",
        "pharma_relevance": "HIGH",
        "pharma_applications": "生物制药、配液、纯化、CIP/SIP及卫生输送",
        "body_material": "SS316L",
        "seal_or_diaphragm": "EPDM + PTFE double-layer diaphragm",
        "pressure": "0-10 bar",
        "temperature": "-10 to +150 C",
        "connections": "",
        "automation": "Pneumatic; control pressure 4.5-7 bar",
        "fact_status": "FACT",
        "source_access": "OFFICIAL_PAGE_SEARCH_INDEX",
        "official_url": "https://www.esgvalve.com/diaphragm-valve-a00.html",
        "evidence_grade": "B",
        "notes": "Official indexed page states Ra <= 0.4 um. FDA/USP/EC claims require certificate originals.",
    },
    {
        "series_id": "A01",
        "name_en": "Manual diaphragm valve",
        "name_zh": "手动隔膜阀",
        "category": "Sanitary valves",
        "subcategory": "Diaphragm valves",
        "product_role": "Manual hygienic diaphragm valve",
        "pharma_relevance": "HIGH",
        "pharma_applications": "卫生输送、配液、纯化及设备隔离",
        "body_material": "Investment cast CF3M or forged S316L",
        "seal_or_diaphragm": "EPDM + PTFE or EPDM",
        "pressure": "0-10 bar",
        "temperature": "-10 to +150 C",
        "connections": "",
        "automation": "Manual",
        "fact_status": "FACT",
        "source_access": "OFFICIAL_PAGE_SEARCH_INDEX",
        "official_url": "https://www.esgvalve.cn/diaphragm-valve-a01.html",
        "evidence_grade": "B",
        "notes": "Official indexed Chinese page states mechanically polished Ra <= 0.4 um.",
    },
    {
        "series_id": "A31",
        "name_en": "Manual aseptic sampling valve",
        "name_zh": "手动无菌取样阀",
        "category": "Sanitary valves",
        "subcategory": "Sampling valves",
        "product_role": "Single- or dual-port aseptic sampling valve",
        "pharma_relevance": "HIGH",
        "pharma_applications": "罐体及管路无菌取样",
        "body_material": "AISI 316L",
        "seal_or_diaphragm": "PTFE diaphragm",
        "pressure": "PN16; operating pressure 0-1.0 MPa",
        "temperature": "-10 to +150 C",
        "connections": "ASME BPE welded or clamp",
        "automation": "Manual",
        "fact_status": "FACT",
        "source_access": "OFFICIAL_PAGE_SEARCH_INDEX",
        "official_url": "https://www.esgvalve.com/dual-port-manual-aseptic-sampling-valve-a31.html",
        "evidence_grade": "B",
        "notes": "FDA/USP diaphragm statement remains a company claim until certificate originals are checked.",
    },
    {
        "series_id": "100/101/107/111/120/127",
        "name_en": "Angle seat valve family",
        "name_zh": "Y型角座阀系列",
        "category": "Industrial valves",
        "subcategory": "Angle seat valves",
        "product_role": "Pneumatic and manual angle-seat shut-off valves",
        "pharma_relevance": "MEDIUM",
        "pharma_applications": "洁净蒸汽、CIP/SIP辅助回路、公用工程及设备阀门包",
        "body_material": "CF8 or CF8M",
        "seal_or_diaphragm": "PTFE; selected variants FPM",
        "pressure": "Up to 16 bar depending on series",
        "temperature": "Typically -10 to +180 C; selected high-temperature versions to +220 C",
        "connections": "Threaded; series 120 also lists ASME BPE weld/clamp and flange",
        "automation": "Pneumatic or manual by series",
        "fact_status": "FACT",
        "source_access": "OFFICIAL_PAGE_SEARCH_INDEX",
        "official_url": "https://www.esgvalve.cn/product/jiaozuofa.html",
        "evidence_grade": "B",
        "notes": "Grouped family for navigation only; parameters must be compared by individual series.",
    },
    {
        "series_id": "103",
        "name_en": "Three-way angle seat valve",
        "name_zh": "三通气控角座阀",
        "category": "Industrial valves",
        "subcategory": "Multi-way valves",
        "product_role": "Three-way pneumatic angle-seat valve",
        "pharma_relevance": "MEDIUM",
        "pharma_applications": "设备分流、切换和辅助过程",
        "body_material": "CF8M",
        "seal_or_diaphragm": "PTFE",
        "pressure": "0-16 bar",
        "temperature": "-10 to +180 C",
        "connections": "Standard and quick-connect variants shown",
        "automation": "Pneumatic; control pressure 3-8 bar",
        "fact_status": "FACT",
        "source_access": "OFFICIAL_PAGE_SEARCH_INDEX",
        "official_url": "https://www.esgvalve.cn/product/jiaozuofa.html",
        "evidence_grade": "B",
        "notes": "Not equivalent to a low-dead-leg machined multi-port diaphragm block.",
    },
    {
        "series_id": "104/105/106",
        "name_en": "Proportional control angle seat valve family",
        "name_zh": "比例调节角座阀系列",
        "category": "Industrial valves",
        "subcategory": "Control valves",
        "product_role": "Pneumatic or electric proportional angle-seat control valves",
        "pharma_relevance": "MEDIUM",
        "pharma_applications": "蒸汽、温度、压力和设备流量调节",
        "body_material": "",
        "seal_or_diaphragm": "PTFE variants",
        "pressure": "",
        "temperature": "Pneumatic versions -10 to +180 C; selected high-temperature versions to +220 C",
        "connections": "",
        "automation": "104/105 pneumatic; 106 electric, 4-20 mA or 0-10 V",
        "fact_status": "FACT",
        "source_access": "OFFICIAL_PAGE_SEARCH_INDEX",
        "official_url": "https://www.esgvalve.cn/product/jiaozuofa.html",
        "evidence_grade": "B",
        "notes": "Control accuracy and turndown require current datasheets and project conditions.",
    },
    {
        "series_id": "1AA/1AS",
        "name_en": "Pipe-less filling valve family",
        "name_zh": "无管灌装阀系列",
        "category": "Industrial valves",
        "subcategory": "Filling valves",
        "product_role": "Filling valve for viscous, pasty or foamy media",
        "pharma_relevance": "MEDIUM",
        "pharma_applications": "食品、日化及设备灌装；制药适配需按接液和清洗要求确认",
        "body_material": "CF8 or CF8M",
        "seal_or_diaphragm": "PTFE",
        "pressure": "0-7 bar",
        "temperature": "-10 to +120 C",
        "connections": "BSP, BSPT or NPT threaded",
        "automation": "Double-acting with or without spring",
        "fact_status": "FACT",
        "source_access": "OFFICIAL_PAGE_SEARCH_INDEX",
        "official_url": "https://www.esgvalve.com/esg-tubeless-series-filling-valve-1aa.html",
        "evidence_grade": "B",
        "notes": "Threaded construction is not automatically suitable for sterile pharmaceutical filling.",
    },
    {
        "series_id": "1AJ/1AE/1AK",
        "name_en": "Filling valve family",
        "name_zh": "灌装阀系列",
        "category": "Industrial valves",
        "subcategory": "Filling valves",
        "product_role": "General filling valve variants",
        "pharma_relevance": "MEDIUM",
        "pharma_applications": "灌装设备；具体卫生等级与定量性能待验证",
        "body_material": "",
        "seal_or_diaphragm": "",
        "pressure": "",
        "temperature": "",
        "connections": "",
        "automation": "",
        "fact_status": "FACT",
        "source_access": "OFFICIAL_PDF_SEARCH_INDEX",
        "official_url": "https://www.esgvalve.com/res/en/20220408/0bd846d0bb2622f9.pdf",
        "evidence_grade": "C",
        "notes": "Official PDF is indexed but returned HTTP 403 during this research run.",
    },
    {
        "series_id": "0P1",
        "name_en": "Two-piece intelligent positioner",
        "name_zh": "分体式智能定位器",
        "category": "Control accessories",
        "subcategory": "Positioners",
        "product_role": "Microprocessor-based valve positioner",
        "pharma_relevance": "MEDIUM",
        "pharma_applications": "角座阀与隔膜阀调节、远程自动控制",
        "body_material": "PA6-GF30 + PC enclosure",
        "seal_or_diaphragm": "",
        "pressure": "Control pressure 3-7 bar",
        "temperature": "0 to +60 C",
        "connections": "G1/4 or M26x1.5",
        "automation": "24 V DC; 0/4-20 mA or 0-5/10 V I/O; IP65",
        "fact_status": "FACT",
        "source_access": "OFFICIAL_PAGE_SEARCH_INDEX",
        "official_url": "https://www.esgvalve.com/split-intelligent-regulating-locator-0p1.html",
        "evidence_grade": "B",
        "notes": "Ex nA IIC T4 is stated on the product page; certificate and applicable configuration require verification.",
    },
    {
        "series_id": "300",
        "name_en": "Butterfly valve family",
        "name_zh": "蝶阀系列",
        "category": "Industrial valves",
        "subcategory": "Butterfly valves",
        "product_role": "Butterfly isolation valve family",
        "pharma_relevance": "MEDIUM",
        "pharma_applications": "公用工程、大口径输送和设备隔离",
        "body_material": "",
        "seal_or_diaphragm": "",
        "pressure": "",
        "temperature": "",
        "connections": "",
        "automation": "",
        "fact_status": "FACT",
        "source_access": "OFFICIAL_PAGE_SEARCH_INDEX",
        "official_url": "https://www.esgvalve.com/",
        "evidence_grade": "C",
        "notes": "Series exists in official application index; detailed current datasheet not verified.",
    },
    {
        "series_id": "400",
        "name_en": "Ball valve family",
        "name_zh": "球阀系列",
        "category": "Industrial valves",
        "subcategory": "Ball valves",
        "product_role": "Ball isolation valve family",
        "pharma_relevance": "LOW",
        "pharma_applications": "通用设备隔离和公用工程",
        "body_material": "",
        "seal_or_diaphragm": "",
        "pressure": "",
        "temperature": "",
        "connections": "",
        "automation": "",
        "fact_status": "FACT",
        "source_access": "OFFICIAL_HOME_SEARCH_INDEX",
        "official_url": "https://www.esgvalve.com/",
        "evidence_grade": "C",
        "notes": "No verified hygienic configuration in this research run.",
    },
    {
        "series_id": "500",
        "name_en": "Check valve family",
        "name_zh": "止回阀系列",
        "category": "Industrial valves",
        "subcategory": "Check valves",
        "product_role": "Check valve family",
        "pharma_relevance": "MEDIUM",
        "pharma_applications": "蒸汽、CIP/SIP和公用工程防倒流",
        "body_material": "",
        "seal_or_diaphragm": "",
        "pressure": "",
        "temperature": "",
        "connections": "",
        "automation": "Self-actuating",
        "fact_status": "FACT",
        "source_access": "OFFICIAL_HOME_SEARCH_INDEX",
        "official_url": "https://www.esgvalve.com/",
        "evidence_grade": "C",
        "notes": "Specific clean-steam suitability and condensate behavior require a datasheet.",
    },
    {
        "series_id": "700/701",
        "name_en": "Pressure reducing and overflow valves",
        "name_zh": "减压阀与溢流阀",
        "category": "Industrial valves",
        "subcategory": "Pressure control valves",
        "product_role": "Self-actuating pressure control valves",
        "pharma_relevance": "MEDIUM",
        "pharma_applications": "公用工程压力调节；洁净适配待验证",
        "body_material": "CF8M",
        "seal_or_diaphragm": "",
        "pressure": "PN25",
        "temperature": "-15 to +100 C",
        "connections": "",
        "automation": "Self-actuating",
        "fact_status": "FACT",
        "source_access": "OFFICIAL_PAGE_SEARCH_INDEX",
        "official_url": "https://www.esgvalve.com/product/pressure-valve.html",
        "evidence_grade": "B",
        "notes": "Not evidence of sanitary pressure regulation without wetted-material and connection details.",
    },
    {
        "series_id": "800/801",
        "name_en": "Steam trap family and 801 thermodynamic series",
        "name_zh": "800疏水阀家族与801热动力系列",
        "category": "Industrial valves",
        "subcategory": "Steam traps",
        "product_role": "Steam trap family",
        "pharma_relevance": "MEDIUM",
        "pharma_applications": "蒸汽、公用工程及CIP/SIP冷凝水排放",
        "body_material": "",
        "seal_or_diaphragm": "",
        "pressure": "",
        "temperature": "",
        "connections": "",
        "automation": "Self-actuating",
        "fact_status": "FACT",
        "source_access": "OFFICIAL_HOME_SEARCH_INDEX",
        "official_url": "https://www.esgvalve.com/thermodynamic-steam-trap-801.html",
        "evidence_grade": "B",
        "notes": "Official home index uses the 800 family; an indexed product page identifies the 801 thermodynamic series. Capacity, air venting and clean-steam suitability remain unverified.",
    },
    {
        "series_id": "901",
        "name_en": "Float type air eliminator",
        "name_zh": "浮球式排气阀",
        "category": "Industrial valves",
        "subcategory": "Air eliminators",
        "product_role": "Automatic air eliminator",
        "pharma_relevance": "LOW",
        "pharma_applications": "热水、冷水和一般液体系统排气",
        "body_material": "CF8M",
        "seal_or_diaphragm": "FPM",
        "pressure": "Maximum 16 bar",
        "temperature": "-20 to +200 C",
        "connections": "",
        "automation": "Self-actuating float",
        "fact_status": "FACT",
        "source_access": "OFFICIAL_PAGE_SEARCH_INDEX",
        "official_url": "https://www.esgvalve.com/air-eliminator-float-type-901.html?d_id=167",
        "evidence_grade": "B",
        "notes": "No direct hygienic or pharmaceutical positioning found.",
    },
    {
        "series_id": "T-VALVE",
        "name_en": "Sanitary stainless-steel T-valve",
        "name_zh": "卫生级不锈钢T型阀",
        "category": "Sanitary valves",
        "subcategory": "Special valve bodies",
        "product_role": "Sanitary T-pattern valve announced for pharmaceutical applications",
        "pharma_relevance": "HIGH",
        "pharma_applications": "制药卫生分支、低残留流路和设备连接",
        "body_material": "Stainless steel",
        "seal_or_diaphragm": "",
        "pressure": "",
        "temperature": "",
        "connections": "",
        "automation": "",
        "fact_status": "CLAIM",
        "source_access": "OFFICIAL_NEWS_SEARCH_INDEX",
        "official_url": "https://www.esgvalve.com/",
        "evidence_grade": "C",
        "notes": "Official news announcement found; current product page, drawings and specifications not verified.",
    },
]

CLAIMS = [
    {
        "series_id": "A00",
        "spec_key": "Compliance claim",
        "value_text": "Company states diaphragms passed FDA and USP and valves passed EC 1935/2004.",
        "source_url": "https://www.esgvalve.com/diaphragm-valve-a00.html",
        "notes": "CLAIM: obtain certificate originals, issuer, date, material grade and applicable model scope.",
    },
    {
        "series_id": "A00",
        "spec_key": "Diaphragm endurance claim",
        "value_text": "Company states PTFE diaphragms withstand one million bending cycles.",
        "source_url": "https://www.esgvalve.com/diaphragm-valve-a00.html",
        "notes": "CLAIM: test method, pressure, temperature and failure criteria were not independently verified.",
    },
    {
        "series_id": "A31",
        "spec_key": "Compliance claim",
        "value_text": "Company states the valve diaphragm is certified to FDA and USP.",
        "source_url": "https://www.esgvalve.com/dual-port-manual-aseptic-sampling-valve-a31.html",
        "notes": "CLAIM: certificate originals and exact material/application scope are required.",
    },
    {
        "series_id": "0P1",
        "spec_key": "Explosion protection claim",
        "value_text": "Official page states Ex nA IIC T4.",
        "source_url": "https://www.esgvalve.com/split-intelligent-regulating-locator-0p1.html",
        "notes": "CLAIM: certificate, notified body and product configuration require verification.",
    },
]


def write_csv(path: Path, fields: list[str], rows: list[dict[str, str]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fields, lineterminator="\n")
        writer.writeheader()
        writer.writerows(rows)


def main() -> None:
    accessed = date.today().isoformat()
    catalog = [{**row, "accessed_date": accessed} for row in ROWS]
    specs = []
    for row in catalog:
        for key, field in (
            ("Body material", "body_material"),
            ("Seal or diaphragm", "seal_or_diaphragm"),
            ("Pressure", "pressure"),
            ("Temperature", "temperature"),
            ("Connections", "connections"),
            ("Automation", "automation"),
        ):
            if row[field]:
                specs.append(
                    {
                        "series_id": row["series_id"],
                        "spec_key": key,
                        "value_text": row[field],
                        "fact_status": "FACT",
                        "source_url": row["official_url"],
                        "accessed_date": accessed,
                        "notes": "Transcribed from the indexed official product page; page returned HTTP 403 to direct automation.",
                    }
                )
    specs.extend(
        {
            **claim,
            "fact_status": "CLAIM",
            "accessed_date": accessed,
        }
        for claim in CLAIMS
    )
    evidence = [
        {
            "evidence_id": f"ESG-SERIES-{row['series_id'].replace('/', '-').replace(' ', '-')}",
            "company": "ESG Jingrui",
            "series_id": row["series_id"],
            "topic": f"{row['category']} / {row['subcategory']}",
            "fact_status": row["fact_status"],
            "summary": (
                f"Indexed official source identifies {row['series_id']} as "
                f"{row['name_en']}."
            ),
            "source_type": "官方产品页搜索索引",
            "source_title": f"ESG {row['series_id']} - {row['name_en']}",
            "source_url": row["official_url"],
            "accessed_date": accessed,
            "evidence_grade": row["evidence_grade"],
            "supports_conclusion": (
                f"ESG series catalogue; pharma relevance {row['pharma_relevance']}."
            ),
            "notes": row["notes"],
        }
        for row in catalog
    ]
    write_csv(RESEARCH / "esg-series-catalog.csv", CATALOG_FIELDS, catalog)
    write_csv(RESEARCH / "esg-series-specifications.csv", SPEC_FIELDS, specs)
    write_csv(RESEARCH / "esg-series-evidence.csv", EVIDENCE_FIELDS, evidence)
    coverage = {
        "generated_date": accessed,
        "catalog_count": len(catalog),
        "specification_row_count": len(specs),
        "category_counts": Counter(row["category"] for row in catalog),
        "pharma_relevance_counts": Counter(
            row["pharma_relevance"] for row in catalog
        ),
        "evidence_grade_counts": Counter(row["evidence_grade"] for row in catalog),
        "fact_status_counts": Counter(row["fact_status"] for row in catalog),
        "source_access_limitation": (
            "The official English and Chinese sites returned HTTP 403 to direct "
            "automation. Catalogue records use indexed official pages and PDFs; "
            "certification and performance statements remain claims where originals "
            "were unavailable."
        ),
    }
    (RESEARCH / "esg-series-coverage.json").write_text(
        json.dumps(coverage, ensure_ascii=False, indent=2, default=dict) + "\n",
        encoding="utf-8",
    )
    print(json.dumps(coverage, ensure_ascii=False, indent=2, default=dict))


if __name__ == "__main__":
    main()
