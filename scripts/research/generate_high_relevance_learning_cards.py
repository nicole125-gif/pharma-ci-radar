#!/usr/bin/env python3
"""Generate evidence-bounded learning cards for all HIGH pharma records."""

from __future__ import annotations

import csv
import re
from collections import Counter, defaultdict
from dataclasses import dataclass
from datetime import date
from pathlib import Path
from typing import Iterable


ROOT = Path(__file__).resolve().parents[2]
DEFAULT_RESEARCH_DIRECTORY = ROOT / "docs" / "research"
OUTPUT_FILENAME = "2026-06-high-relevance-product-learning-cards.csv"
GENERATED_DATE = date(2026, 6, 24).isoformat()
MISSING = "未公开，需查当前数据表或项目文件"
EXPECTED_COUNTS = Counter({"Bürkert": 73, "GEMÜ": 50, "Fujikin": 9, "ESG 精锐": 4})

CARD_FIELDS = [
    "card_id",
    "company",
    "product_id",
    "name",
    "secondary_name",
    "category",
    "subcategory",
    "product_role",
    "operating_principle",
    "customer_jobs",
    "pharma_applications",
    "key_specifications",
    "selection_questions",
    "exclusion_conditions",
    "adjacent_or_related_products",
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
]

HANDBOOK_FILENAMES = {
    "Bürkert": "2026-06-burkert-high-product-learning-cards.md",
    "GEMÜ": "2026-06-gemu-high-product-learning-cards.md",
    "Fujikin": "2026-06-fujikin-high-product-learning-cards.md",
    "ESG 精锐": "2026-06-esg-high-product-learning-cards.md",
}

CATALOG_CONFIG = {
    "Bürkert": {
        "filename": "burkert-type-catalog.csv",
        "id": "type_id",
        "name": "name_en",
        "secondary": "name_zh",
        "role": "product_role",
        "principle": "operating_principle",
        "applications": "pharma_applications",
        "source_fields": (
            "global_product_url",
            "china_product_url",
            "english_datasheet_url",
            "chinese_datasheet_url",
        ),
    },
    "GEMÜ": {
        "filename": "gemu-series-catalog.csv",
        "id": "series_id",
        "name": "name_en",
        "secondary": "",
        "role": "product_role",
        "principle": "actuation",
        "applications": "pharma_applications",
        "source_fields": ("official_url",),
    },
    "Fujikin": {
        "filename": "fujikin-series-catalog.csv",
        "id": "record_id",
        "name": "catalogue_title",
        "secondary": "model_numbers",
        "role": "product_group",
        "principle": "",
        "applications": "pharma_applications",
        "source_fields": (
            "english_catalogue_url",
            "chinese_catalogue_url",
            "official_index_url",
        ),
    },
    "ESG 精锐": {
        "filename": "esg-series-catalog.csv",
        "id": "series_id",
        "name": "name_en",
        "secondary": "name_zh",
        "role": "product_role",
        "principle": "automation",
        "applications": "pharma_applications",
        "source_fields": ("official_url",),
    },
}

SPEC_CONFIG = {
    "Bürkert": ("burkert-type-specifications.csv", "type_id"),
    "GEMÜ": ("gemu-series-specifications.csv", "series_id"),
    "Fujikin": ("fujikin-series-specifications.csv", "record_id"),
    "ESG 精锐": ("esg-series-specifications.csv", "series_id"),
}

MAP_CONFIG = {
    "Bürkert": (
        ("burkert-competitor-series-map.csv", "burkert_types"),
        ("gemu-burkert-series-map.csv", "burkert_types"),
        ("fujikin-burkert-series-map.csv", "burkert_types"),
        ("esg-burkert-series-map.csv", "burkert_types"),
    ),
    "GEMÜ": (
        ("burkert-competitor-series-map.csv", "gemu_series"),
        ("gemu-burkert-series-map.csv", "gemu_series"),
    ),
    "Fujikin": (
        ("burkert-competitor-series-map.csv", "fujikin_series"),
        ("fujikin-burkert-series-map.csv", "fujikin_series"),
    ),
    "ESG 精锐": (
        ("burkert-competitor-series-map.csv", "esg_series"),
        ("esg-burkert-series-map.csv", "esg_series"),
    ),
}

COMMON_GAPS = "中国项目价格/净价、库存、产地、标准品与定制品交期、装机量、客户评价及售后服务表现需内部验证"


@dataclass(frozen=True)
class Guidance:
    customer_jobs: str
    selection_questions: str
    exclusion_conditions: str


def read_rows(path: Path) -> list[dict[str, str]]:
    with path.open(encoding="utf-8-sig", newline="") as handle:
        return list(csv.DictReader(handle))


def unique_join(values: Iterable[str], separator: str = "；") -> str:
    result: list[str] = []
    for value in values:
        cleaned = value.strip()
        if cleaned and cleaned not in result:
            result.append(cleaned)
    return separator.join(result)


def pipe_values(values: Iterable[str]) -> list[str]:
    return [
        part.strip()
        for value in values
        for part in value.split("|")
        if part.strip()
    ]


def identifier_present(value: str, identifier: str) -> bool:
    pattern = rf"(?<![A-Za-z0-9]){re.escape(identifier)}(?![A-Za-z0-9])"
    return re.search(pattern, value, flags=re.IGNORECASE) is not None


def guidance_for(row: dict[str, str], company: str) -> Guidance:
    searchable = " ".join(
        row.get(field, "")
        for field in (
            "category",
            "subcategory",
            "product_role",
            "product_group",
            "name_en",
            "catalogue_title",
        )
    ).lower()
    applications = row.get("pharma_applications", "").strip() or "制药流体过程中的适用任务"
    role = (
        row.get("product_role", "")
        or row.get("product_group", "")
        or row.get("name_en", "")
        or row.get("catalogue_title", "")
    )

    if any(
        term in searchable
        for term in (
            "flowmeter",
            "flow meter",
            "flow measurement",
            "mfc",
            "mfm",
            "流量计",
            "流量测量",
            "conductivity",
            "orp",
            "analysis sensor",
            "liquid analysis",
            "sensor",
            "transmitter",
            "measuring device",
        )
    ):
        return Guidance(
            f"在{applications}中完成过程测量、监控或闭环控制，为批次放行、清洗终点或工艺稳定性提供信号。",
            "介质及电导/黏度/气体组分；量程与正常工作点；精度、重复性和响应时间；压力、温度及压降；接液材料；卫生连接与可清洗性；校准和验证要求；输出信号、现场总线和控制系统接口；安装方向与直管段。",
            "量程、介质属性、安装条件或校准口径不一致时不得直接比较精度；没有卫生连接、材料和清洗适配证据时，不得仅凭测量原理判定可用于制药主工艺。",
        )
    if any(term in searchable for term in ("single use", "single-use", "pinch", "tube", "tubing", "一次性")):
        return Guidance(
            f"在{applications}中通过软管夹断或一次性流路实现介质隔离，减少清洗验证负担和交叉污染风险。",
            "软管与接液材料；管径和壁厚；灭菌方式；压力与温度；密封完整性；死体积和滞留；循环次数或一次性使用边界；批次追溯；供应连续性；执行器和反馈要求。",
            "软管尺寸、材料、灭菌方法或寿命未经确认时不得替代；一次性组件与可重复使用阀门的维护、验证和总成本口径不可直接混比。",
        )
    if any(term in searchable for term in ("fitting", "connection", "component", "accessor", "膜片", "diaphragms")):
        return Guidance(
            f"作为{applications}的连接、密封或维护部件，保证完整流路的机械兼容、卫生边界和可追溯性。",
            "配套主产品；尺寸和连接标准；接液材料；表面状态；密封材质；压力与温度；清洗灭菌循环；批次和材料追溯；安装空间；更换周期。",
            "尺寸或材料相近不代表可互换；未经主产品兼容性、材料证明和寿命验证，不得用于关键工艺替换。",
        )
    if any(term in searchable for term in ("diaphragm", "隔膜", "aseptic", "hygienic", "multi-port", "multiport", "tank bottom")):
        return Guidance(
            f"在{applications}中完成卫生隔离、切换、调节或低滞留流路设计；具体任务取决于阀体和执行配置。",
            "介质与批次风险；DN及目标Cv/Kv；阀体流路和排空方向；接液材料与表面粗糙度；膜片材质和寿命；连接标准；工作与灭菌温压；CIP/SIP程序；死区要求；认证与材料追溯；手动、开关或调节自动化。",
            "不能用系列名称代替具体阀体、膜片和连接配置；未确认排空、死区、温压、材料证明或灭菌循环时，不得判定适用于关键无菌主工艺。",
        )
    if any(term in searchable for term in ("positioner", "control head", "automation", "controller", "remote", "interface")):
        return Guidance(
            f"为{applications}提供阀门驱动、位置反馈、诊断或分布式自动化，降低接线和维护复杂度。",
            "兼容的阀门与执行器；开关或连续调节；供气与供电；输入输出信号；通信协议；反馈和诊断深度；故障安全位；防护与防爆等级；清洗环境；调试和资产管理方式。",
            "机械接口、行程、供气供电或协议不兼容时不得替换；系列具备诊断能力不代表每个配置都已启用相同功能。",
        )
    if any(term in searchable for term in ("ball", "butterfly", "globe", "angle", "seat", "bellows", "valve", "阀")):
        return Guidance(
            f"在{applications}中完成介质隔离、切换或调节，适用性由阀体结构、密封和工况共同决定。",
            "介质；DN与目标Cv/Kv；压力、温度和压差；阀体与密封材料；连接标准；泄漏等级；执行方式和故障安全位；循环频率；清洗或灭菌要求；认证与材料文件。",
            "不同阀体结构、密封原理和调节任务不可仅按口径互换；缺少接液材料、温压、排空或卫生证明时，不得外推到关键无菌流路。",
        )

    return Guidance(
        f"支持{applications}中的{role}任务，具体适用性需回到当前配置与官方技术文件确认。",
        "介质；功能任务；尺寸或量程；工作压力和温度；接液材料；连接和安装；驱动与信号；清洗灭菌；认证与文件；维护条件。",
        f"{company}产品族能力不能替代具体配置证明；关键工况或合规文件未确认时不得做最终选型。",
    )


def load_specifications(research_directory: Path) -> dict[str, dict[str, list[dict[str, str]]]]:
    result: dict[str, dict[str, list[dict[str, str]]]] = {}
    for company, (filename, identifier_field) in SPEC_CONFIG.items():
        by_identifier: dict[str, list[dict[str, str]]] = defaultdict(list)
        for row in read_rows(research_directory / filename):
            by_identifier[row[identifier_field]].append(row)
        result[company] = by_identifier
    return result


def load_mappings(research_directory: Path) -> dict[str, list[dict[str, str]]]:
    result: dict[str, list[dict[str, str]]] = {}
    for company, sources in MAP_CONFIG.items():
        matches: list[dict[str, str]] = []
        for filename, identifier_field in sources:
            for row in read_rows(research_directory / filename):
                matches.append({**row, "_identifier_field": identifier_field, "_filename": filename})
        result[company] = matches
    return result


def mapping_summary(
    company: str, product_id: str, mappings: dict[str, list[dict[str, str]]]
) -> tuple[str, str, str]:
    matches = [
        row
        for row in mappings[company]
        if identifier_present(row.get(row["_identifier_field"], ""), product_id)
    ]
    if not matches:
        return (
            "未形成明确系列级竞品映射；需按客户任务和具体配置另行检索。",
            "产品功能；工况；接液材料；连接；自动化；文件与服务",
            "无独立映射证据编号；以官方产品页和规格表为准",
        )

    overlap_parts = []
    for row in matches:
        candidates = [
            row.get("overlap_type", ""),
            row.get("pharma_scenario", ""),
            row.get("gemu_series", "") if company != "GEMÜ" else row.get("burkert_types", ""),
            row.get("fujikin_series", "") if company != "Fujikin" else row.get("burkert_types", ""),
            row.get("esg_series", "") if company != "ESG 精锐" else row.get("burkert_types", ""),
        ]
        overlap_parts.append(" / ".join(value for value in candidates if value))
    evidence_ids = unique_join(
        pipe_values(row.get("evidence_ids", "") for row in matches),
        separator="|",
    )
    return (
        unique_join(overlap_parts),
        unique_join(row.get("comparison_dimensions", "") for row in matches)
        or "产品功能；工况；接液材料；连接；自动化；文件与服务",
        evidence_ids or "无独立映射证据编号；以官方产品页和规格表为准",
    )


def specification_summary(
    company: str,
    product_id: str,
    specification_rows: dict[str, dict[str, list[dict[str, str]]]],
) -> tuple[str, list[str], list[str], bool]:
    rows = specification_rows[company].get(product_id, [])
    parts: list[str] = []
    source_urls: list[str] = []
    accessed_dates: list[str] = []
    has_claim = False
    for row in rows[:10]:
        key = row.get("spec_key", "").strip()
        value = row.get("value_text", "").strip()
        if not value:
            minimum = row.get("value_min", "").strip()
            maximum = row.get("value_max", "").strip()
            unit = row.get("unit", "").strip()
            if minimum or maximum:
                value = f"{minimum or '—'}–{maximum or '—'} {unit}".strip()
        if key and value:
            status = row.get("fact_status", "").strip()
            has_claim = has_claim or status == "CLAIM"
            suffix = "（CLAIM）" if status == "CLAIM" else ""
            parts.append(f"{key}={value}{suffix}")
        if row.get("source_url", "").strip():
            source_urls.append(row["source_url"].strip())
        if row.get("accessed_date", "").strip():
            accessed_dates.append(row["accessed_date"].strip())
    return unique_join(parts) or MISSING, source_urls, accessed_dates, has_claim


def adjacent_products(
    product_id: str, row: dict[str, str], high_rows: list[dict[str, str]], identifier_field: str
) -> str:
    same_subcategory = [
        candidate[identifier_field]
        for candidate in high_rows
        if candidate[identifier_field] != product_id
        and candidate.get("subcategory", "") == row.get("subcategory", "")
    ]
    return "|".join(same_subcategory[:8]) or "同类高相关记录未找到；需扩展到相邻产品族判断"


def fact_boundary(company: str, row: dict[str, str], has_claim: bool) -> str:
    parts = [
        "本卡仅汇总公开目录、官方产品页和规格主表，不等同于应用工程批准或验证文件。",
        "HIGH表示制药相关性高，不表示全部配置均适用于无菌主工艺。",
    ]
    if company == "Bürkert":
        parts.append("中国公开可见性只表示页面或中文资料可见，不证明中国库存、产地或交期。")
    if company == "Fujikin":
        parts.append("高纯或生命科学产品定位不能自动等同于具体制药工况适用，必须锁定型号和配置。")
    if company == "ESG 精锐":
        parts.append("ESG公开资料中的认证与符合性声明需取得当前证书原件复核。")
    if company == "ESG 精锐" or has_claim or row.get("fact_status", "") == "CLAIM":
        parts.append("CLAIM内容是企业自述，尚未完成独立验证。")
    if row.get("notes", "").strip():
        parts.append(f"源记录边界：{row['notes'].strip()}")
    return unique_join(parts)


def build_card(
    company: str,
    row: dict[str, str],
    config: dict[str, object],
    high_rows: list[dict[str, str]],
    specification_rows: dict[str, dict[str, list[dict[str, str]]]],
    mappings: dict[str, list[dict[str, str]]],
) -> dict[str, str]:
    product_id = row[str(config["id"])]
    guidance = guidance_for(row, company)
    specifications, spec_urls, spec_dates, has_claim = specification_summary(
        company, product_id, specification_rows
    )
    catalog_urls = [
        row.get(field, "").strip() for field in config["source_fields"] if row.get(field, "").strip()
    ]
    overlap, dimensions, evidence_ids = mapping_summary(company, product_id, mappings)
    source_dates = [row.get("accessed_date", "").strip(), *spec_dates]
    applications = row.get(str(config["applications"]), "").strip() or MISSING
    name = row.get(str(config["name"]), "").strip()
    role = row.get(str(config["role"]), "").strip() or name
    principle_field = str(config["principle"])
    principle = row.get(principle_field, "").strip() if principle_field else ""
    secondary_field = str(config["secondary"])
    secondary = row.get(secondary_field, "").strip() if secondary_field else ""

    return {
        "card_id": f"{company.upper().replace(' ', '-').replace('Ü', 'U')}-{product_id}",
        "company": company,
        "product_id": product_id,
        "name": name,
        "secondary_name": secondary,
        "category": row.get("category", ""),
        "subcategory": row.get("subcategory", ""),
        "product_role": role,
        "operating_principle": principle or MISSING,
        "customer_jobs": guidance.customer_jobs,
        "pharma_applications": applications,
        "key_specifications": specifications,
        "selection_questions": guidance.selection_questions,
        "exclusion_conditions": guidance.exclusion_conditions,
        "adjacent_or_related_products": adjacent_products(
            product_id, row, high_rows, str(config["id"])
        ),
        "competitor_overlap": overlap,
        "comparison_dimensions": dimensions,
        "evidence_grade": row.get("evidence_grade", "") or "D",
        "fact_boundary": fact_boundary(company, row, has_claim),
        "source_urls": unique_join([*catalog_urls, *spec_urls], separator="|"),
        "evidence_ids": evidence_ids,
        "knowledge_gaps": COMMON_GAPS,
        "memory_hook": f"{product_id}：{role}；优先联想到{applications}，再核对工况、配置和证据边界。",
        "quiz_question": f"客户在什么工况下应选择或排除 {product_id}？比较前必须确认哪些参数和证据？",
        "review_status": "GENERATED_REVIEWED_BY_RULES",
        "source_accessed_date": max(value for value in source_dates if value),
        "generated_date": GENERATED_DATE,
    }


def write_csv(cards: list[dict[str, str]], output_directory: Path) -> None:
    path = output_directory / OUTPUT_FILENAME
    with path.open("w", encoding="utf-8-sig", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=CARD_FIELDS, lineterminator="\n")
        writer.writeheader()
        writer.writerows(cards)


def write_handbooks(cards: list[dict[str, str]], output_directory: Path) -> None:
    for company, filename in HANDBOOK_FILENAMES.items():
        company_cards = [card for card in cards if card["company"] == company]
        lines = [
            f"# {company} 制药高相关产品深度学习卡",
            "",
            f"- 生成日期：{GENERATED_DATE}",
            f"- 覆盖记录：{len(company_cards)}",
            "- 范围：仅包含产品主数据中 `pharma_relevance=HIGH` 的当前记录。",
            "- 使用边界：用于产品学习、客户访谈准备和竞品定位，不替代当前数据表、证书、验证文件或应用工程批准。",
            "",
            "## 快速索引",
            "",
        ]
        for card in company_cards:
            lines.append(
                f"- `{card['product_id']}` {card['name']}：{card['subcategory']}"
            )
        lines.extend(["", "## 共通使用规则", ""])
        lines.extend(
            [
                "1. 先确认客户任务和介质，再进入型号或系列。",
                "2. 精确参数只采用规格主表中的公开值；未公开项保持缺口。",
                "3. HIGH 是制药相关性，不代表全部配置均满足无菌或卫生要求。",
                "4. 价格、库存、产地、交期、装机量和服务表现必须通过内部验证。",
                "",
            ]
        )
        for card in company_cards:
            lines.extend(
                [
                    f"## `{card['product_id']}` {card['name']}",
                    "",
                    f"**定位：** {card['product_role']}",
                    "",
                    f"**工作原理：** {card['operating_principle']}",
                    "",
                    f"**客户任务：** {card['customer_jobs']}",
                    "",
                    f"**制药应用：** {card['pharma_applications']}",
                    "",
                    f"**公开规格：** {card['key_specifications']}",
                    "",
                    f"**选型必问：** {card['selection_questions']}",
                    "",
                    f"**排除条件：** {card['exclusion_conditions']}",
                    "",
                    f"**相邻产品：** {card['adjacent_or_related_products']}",
                    "",
                    f"**竞品重叠：** {card['competitor_overlap']}",
                    "",
                    f"**比较维度：** {card['comparison_dimensions']}",
                    "",
                    f"**事实边界：** {card['fact_boundary']}",
                    "",
                    f"**待验证：** {card['knowledge_gaps']}",
                    "",
                    f"**记忆钩子：** {card['memory_hook']}",
                    "",
                    f"**自测题：** {card['quiz_question']}",
                    "",
                    f"**来源：** {card['source_urls']}",
                    "",
                ]
            )
        (output_directory / filename).write_text("\n".join(lines), encoding="utf-8")


def generate_learning_cards(
    research_directory: Path = DEFAULT_RESEARCH_DIRECTORY,
    output_directory: Path = DEFAULT_RESEARCH_DIRECTORY,
) -> list[dict[str, str]]:
    output_directory.mkdir(parents=True, exist_ok=True)
    specification_rows = load_specifications(research_directory)
    mappings = load_mappings(research_directory)
    cards: list[dict[str, str]] = []

    for company, config in CATALOG_CONFIG.items():
        rows = read_rows(research_directory / str(config["filename"]))
        high_rows = [row for row in rows if row.get("pharma_relevance") == "HIGH"]
        cards.extend(
            build_card(
                company,
                row,
                config,
                high_rows,
                specification_rows,
                mappings,
            )
            for row in high_rows
        )

    cards.sort(key=lambda card: (list(CATALOG_CONFIG).index(card["company"]), card["product_id"]))
    counts = Counter(card["company"] for card in cards)
    if counts != EXPECTED_COUNTS:
        raise ValueError(f"Unexpected HIGH coverage: {dict(counts)}")
    if len({card["card_id"] for card in cards}) != len(cards):
        raise ValueError("Duplicate card_id values")

    write_csv(cards, output_directory)
    write_handbooks(cards, output_directory)
    return cards


def main() -> None:
    cards = generate_learning_cards()
    print(
        {
            "status": "PASS",
            "card_rows": len(cards),
            "company_counts": dict(Counter(card["company"] for card in cards)),
            "output": str(DEFAULT_RESEARCH_DIRECTORY / OUTPUT_FILENAME),
        }
    )


if __name__ == "__main__":
    main()
