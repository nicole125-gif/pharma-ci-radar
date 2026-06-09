#!/usr/bin/env python3
"""Generate the Fujikin product-manager handbook and Bürkert series map."""

from __future__ import annotations

import csv
from collections import Counter, defaultdict
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
RESEARCH = ROOT / "docs" / "research"
CATALOG = RESEARCH / "fujikin-series-catalog.csv"
HANDBOOK = RESEARCH / "fujikin-product-series-handbook.md"
MAPPING = RESEARCH / "fujikin-burkert-series-map.csv"

MAP_FIELDS = [
    "fujikin_series",
    "fujikin_capability_line",
    "fujikin_role",
    "burkert_types",
    "overlap_type",
    "pharma_scenario",
    "fujikin_competitive_strength",
    "burkert_response",
    "comparison_dimensions",
    "evidence_ids",
    "confidence",
    "gaps",
]

MAP_DEFINITIONS = [
    {
        "fujikin_series": "BNWM/BNWC",
        "selectors": ["BNWM-BNWC-66C6E5BE", "BNWC-2F0E12E0"],
        "fujikin_capability_line": "Life science hygienic",
        "fujikin_role": "Manual and automatic weir diaphragm valves",
        "burkert_types": "2030|2063|2103",
        "overlap_type": "DIRECT",
        "pharma_scenario": "配液、纯化、CIP/SIP与卫生输送",
        "fujikin_competitive_strength": "316L、卫生连接、Class 1洁净等级及生命科学产品定位。",
        "burkert_response": "锁定具体型号后比较阀体、膜片、Ra、排空、认证、执行器和控制头。",
        "comparison_dimensions": "DN；Cv；阀体；Ra；膜片；连接；压力；温度；认证；自动化",
        "confidence": "HIGH",
        "gaps": "中国生产型号、库存、净价、验证文件和项目交期需确认。",
    },
    {
        "fujikin_series": "BSW/BSWCN/LPS",
        "selectors": [
            "BSW-F5AFD21C",
            "BSWCN-AD5BAF95",
            "LPSM-LPSL-88A88889",
            "LPS-5E67B882",
        ],
        "fujikin_capability_line": "Life science hygienic",
        "fujikin_role": "Weirless diaphragm valve families",
        "burkert_types": "2030|2063|2103",
        "overlap_type": "DIRECT_OR_DIFFERENT_DESIGN",
        "pharma_scenario": "高流量卫生输送、配液和设备内部流路",
        "fujikin_competitive_strength": "无堰结构和较高流量等级形成差异化卫生阀选择。",
        "burkert_response": "不可只按DN比较；应核对流路结构、排空、膜片受力、Cv和维护方式。",
        "comparison_dimensions": "流路；Cv；排空；死区；膜片；压力；温度；连接；维护",
        "confidence": "HIGH",
        "gaps": "无堰结构在具体无菌验证中的项目接受度需客户证据。",
    },
    {
        "fujikin_series": "BPV-HIN",
        "selectors": ["BPV-HIN-9B49F6A4"],
        "fujikin_capability_line": "Life science hygienic",
        "fujikin_role": "Pinch valve system",
        "burkert_types": "2707",
        "overlap_type": "DIRECT_OR_ADJACENT",
        "pharma_scenario": "软管流路、一次性外围和颗粒敏感介质",
        "fujikin_competitive_strength": "BNW生命科学组合中包含专用夹管阀系统。",
        "burkert_response": "比较软管规格、压力、夹紧力、寿命、失效位及耗材验证。",
        "comparison_dimensions": "软管；压力；温度；夹紧力；寿命；执行方式；失效位",
        "confidence": "MEDIUM",
        "gaps": "一次性接液边界、辐照和生物相容性文件需按耗材系统确认。",
    },
    {
        "fujikin_series": "BYCFO/BYCFU",
        "selectors": ["BYCFO-BYCFU-BF751B4A"],
        "fujikin_capability_line": "Life science utility",
        "fujikin_role": "Angle seat valves",
        "burkert_types": "2000|2100|2300",
        "overlap_type": "DIRECT",
        "pharma_scenario": "洁净蒸汽、CIP/SIP辅助回路、公用工程和灌装",
        "fujikin_competitive_strength": "与卫生隔膜阀组合进入生命科学设备阀门包。",
        "burkert_response": "强调角座阀产品深度、调节版本、ELEMENT自动化和完整公用工程回路。",
        "comparison_dimensions": "介质；Kv/Cv；压差；温度；阀座；泄漏；执行器；定位器",
        "confidence": "HIGH",
        "gaps": "蒸汽寿命、具体卫生符合性和中国备件仍需项目验证。",
    },
    {
        "fujikin_series": "SVLCDC",
        "selectors": ["SVLCDC-244EFA5B"],
        "fujikin_capability_line": "Life science filling",
        "fujikin_role": "Small-volume filling valve",
        "burkert_types": "6650|7604|7615",
        "overlap_type": "DIRECT_OR_ADJACENT",
        "pharma_scenario": "小剂量灌装、分析设备和精密定量",
        "fujikin_competitive_strength": "专用小容量灌装系列，应用叙事比通用过程阀更聚焦。",
        "burkert_response": "先确认定量原理，再比较死体积、重复性、清洗、响应和介质隔离。",
        "comparison_dimensions": "定量原理；单次体积；重复性；死体积；压力；清洗；响应",
        "confidence": "MEDIUM",
        "gaps": "目录索引未披露完整定量性能，需使用当前数据表。",
    },
    {
        "fujikin_series": "MINUCON UN/M2/M3",
        "selectors": [
            "UN-115-UN-130-UN-150-953E87EE",
            "M2-M3-FEA975F3",
            "M2-M3-D64FEC55",
        ],
        "fujikin_capability_line": "Cross-industry precision control",
        "fujikin_role": "Diaphragm-type mini control valves",
        "burkert_types": "2861|2863|2865|2871|2873|2875|2300",
        "overlap_type": "DIRECT_OR_ADJACENT",
        "pharma_scenario": "微小流量调节、设备气液控制和精密加注",
        "fujikin_competitive_strength": "低Cv精密控制阀形成单品技术深度。",
        "burkert_response": "区分直接作用比例阀与执行器控制阀，按介质、Cv、压差和控制性能比较。",
        "comparison_dimensions": "介质；Cv；特性；压差；泄漏；迟滞；重复性；执行器；定位",
        "confidence": "HIGH",
        "gaps": "制药卫生接液、清洗验证和中国安装案例不能从精密控制能力直接推出。",
    },
    {
        "fujikin_series": "FCST1000/FCST2000",
        "selectors": ["FCST1000-FCST2000-BE84B2C5"],
        "fujikin_capability_line": "Cross-industry precision control",
        "fujikin_role": "Thermal mass flow controllers",
        "burkert_types": "8700|8701|8702|8703|8741|8742|8743|8744|8745",
        "overlap_type": "DIRECT",
        "pharma_scenario": "发酵供气、气体配比和设备精密气路",
        "fujikin_competitive_strength": "成熟高纯气体质量流量控制与多语言技术目录。",
        "burkert_response": "按气体、标况、量程、精度定义、响应、压降、阀座、通信和校准比较。",
        "comparison_dimensions": "气体；标况；量程；精度；响应；压降；校准；阀座；通信",
        "confidence": "HIGH",
        "gaps": "中国制药发酵安装、校准服务和卫生气体文件仍需客户或内部验证。",
    },
    {
        "fujikin_series": "FCSP7000/FCSP8000",
        "selectors": ["FCSP7000-FCSP8000-882FFB98"],
        "fujikin_capability_line": "Semiconductor/high-purity system",
        "fujikin_role": "Pressure-based flow control systems",
        "burkert_types": "8741|8742|8745",
        "overlap_type": "ADJACENT",
        "pharma_scenario": "高纯气体供给；制药适用性待逐项目确认",
        "fujikin_competitive_strength": "压力式流控和高纯气体系统经验。",
        "burkert_response": "先判断客户需要质量流量控制还是压力式流控，不做跨原理参数优劣比较。",
        "comparison_dimensions": "控制原理；气体；入口条件；量程；响应；精度；系统集成",
        "confidence": "HIGH",
        "gaps": "不能把半导体高纯系统能力直接写成制药主工艺能力。",
    },
    {
        "fujikin_series": "F900/LF900/UJR/UJL/UJT/UPG",
        "selectors": [
            "F900-5473313A",
            "LF900-B2B76351",
            "UJR-28559EEE",
            "UJL-UJT-B170D197",
            "UPG-A9B37E7E",
        ],
        "fujikin_capability_line": "Semiconductor/high-purity components",
        "fujikin_role": "High-purity fittings and auto-weld components",
        "burkert_types": "",
        "overlap_type": "PORTFOLIO_ADJACENT",
        "pharma_scenario": "高纯气体与设备内部配管；制药卫生管路并非自动等价",
        "fujikin_competitive_strength": "接头和高纯配管组件产品深度明显。",
        "burkert_response": "承认接头深度；将竞争边界放回阀门、测量、控制和完整功能模块。",
        "comparison_dimensions": "连接原理；材料；洁净等级；泄漏；焊接；安装；文件",
        "confidence": "HIGH",
        "gaps": "与ASME BPE卫生管路、CIP/SIP和制药材料文件的等价性需逐项证明。",
    },
    {
        "fujikin_series": "FINE PURE IGS/WVG",
        "selectors": [
            "FINE-SERIES-PURE-IGS-INTEGRATED-GAS-SYSTEM-3D87FB3B",
            "FINE-SERIES-PURE-WVG-WATER-VAPOR-GENERATOR-D993DC14",
        ],
        "fujikin_capability_line": "Semiconductor/high-purity system",
        "fujikin_role": "Integrated gas system and water-vapor generator",
        "burkert_types": "",
        "overlap_type": "SYSTEM_ADJACENT",
        "pharma_scenario": "高纯气体系统；不能默认等同洁净蒸汽或制药用水系统",
        "fujikin_competitive_strength": "高纯气体系统集成和专用发生设备能力。",
        "burkert_response": "先确认介质、行业规范和验证任务，再判断是否与流体控制回路形成竞争。",
        "comparison_dimensions": "介质；纯度；系统边界；控制；安全；验证；维护；行业规范",
        "confidence": "HIGH",
        "gaps": "缺少中国制药系统案例，WVG名称不应被误读为洁净蒸汽发生器。",
    },
]


def read_rows(path: Path) -> list[dict[str, str]]:
    with path.open(encoding="utf-8", newline="") as handle:
        return list(csv.DictReader(handle))


def write_csv(path: Path, fields: list[str], rows: list[dict[str, str]]) -> None:
    with path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fields, lineterminator="\n")
        writer.writeheader()
        writer.writerows(rows)


def build_mapping(catalog: list[dict[str, str]]) -> list[dict[str, str]]:
    by_id = {row["record_id"]: row for row in catalog}
    rows = []
    for definition in MAP_DEFINITIONS:
        selectors = definition.pop("selectors")
        selected = [by_id[item] for item in selectors]
        evidence_ids = "|".join(
            f"FUJIKIN-SERIES-{row['record_id']}" for row in selected
        )
        rows.append({**definition, "evidence_ids": evidence_ids})
        definition["selectors"] = selectors
    return rows


def render_handbook(
    catalog: list[dict[str, str]],
    mapping: list[dict[str, str]],
) -> str:
    categories = Counter(row["category"] for row in catalog)
    relevance = Counter(row["pharma_relevance"] for row in catalog)
    grouped: dict[str, list[dict[str, str]]] = defaultdict(list)
    for row in catalog:
        grouped[row["category"]].append(row)

    lines = [
        "# Fujikin 产品系列与制药竞争手册",
        "",
        "更新日期：2026-06-09",
        "主来源：Fujikin 官方英文产品目录下载页及其官方技术目录",
        "",
        "## 1. 使用边界",
        "",
        "- 本目录按官方目录行记录系列或型号族，不展开全部具体 Product No.。",
        "- `HIGH` 表示明确属于生命科学卫生阀、夹管阀、角座阀或灌装产品族。",
        "- `MEDIUM` 表示功能可进入制药设备或公用工程，但不能据此证明无菌适用。",
        "- FINE PURE、IGS、FCS Pressure 等高纯能力主要证明半导体/高纯技术深度，不自动等于制药验证能力。",
        "- 价格、库存、产地、交期和中国安装案例仍需内部项目数据。",
        "",
        "## 2. 目录规模",
        "",
        f"- 官方系列级目录记录：{len(catalog)}",
        f"- 高制药相关：{relevance['HIGH']}",
        f"- 邻近相关：{relevance['MEDIUM']}",
        f"- 低或未证实相关：{relevance['LOW']}",
        "",
        "| 一级类别 | 记录数 |",
        "|---|---:|",
    ]
    for category, count in categories.items():
        lines.append(f"| {category} | {count} |")

    lines.extend(
        [
            "",
            "## 3. 三条能力线",
            "",
            "| 能力线 | 代表系列 | 对中国制药竞争的含义 |",
            "|---|---|---|",
            "| 生命科学卫生产品 | BNW、BSW、LPS、BPV、BY、SVLCD | 可形成卫生阀、辅助阀和灌装场景的直接竞争 |",
            "| 跨行业精密流控 | MINUCON、FCS Thermal | 与Bürkert比例控制和MFC形成直接或邻近重叠，但须验证制药案例 |",
            "| 半导体/高纯产品 | FINE PURE阀件、接头、IGS、FCS Pressure、WVG | 证明高纯技术深度和客户关系，不应整体外推为制药能力 |",
            "",
            "## 4. 高制药相关系列",
            "",
            "| 系列/型号族 | 产品组 | 目录规格摘要 | 关键边界 |",
            "|---|---|---|---|",
        ]
    )
    for row in catalog:
        if row["pharma_relevance"] != "HIGH":
            continue
        summary = "；".join(
            item
            for item in (
                row["maximum_nominal_sizes"],
                row["cleanliness"],
                row["flow_rate_class"],
                row["materials"],
            )
            if item
        )
        lines.append(
            f"| {row['model_numbers']} | {row['product_group']} | {summary} | "
            f"{row['pharma_applications']} |"
        )

    lines.extend(
        [
            "",
            "## 5. Bürkert 对标地图",
            "",
            "| Fujikin系列 | 能力线 | Bürkert Type | 重叠 | 场景 | 可信度 |",
            "|---|---|---|---|---|---|",
        ]
    )
    for row in mapping:
        lines.append(
            f"| {row['fujikin_series']} | {row['fujikin_capability_line']} | "
            f"{row['burkert_types'] or '无直接单品映射'} | {row['overlap_type']} | "
            f"{row['pharma_scenario']} | {row['confidence']} |"
        )

    lines.extend(
        [
            "",
            "## 6. 竞争时必须先问",
            "",
            "1. 报价产品属于生命科学卫生系列、通用工业系列，还是半导体高纯系列？",
            "2. 具体型号是否明确标注 Biomedical/Food 或 Life Science，而不是只引用集团行业能力？",
            "3. 卫生阀的阀体、Ra、膜片、连接、排空和认证是否与项目规格逐项一致？",
            "4. FCS 是 Thermal 质量流量控制还是 Pressure 压力式流控，比较原理是否一致？",
            "5. 中国供货型号的制造地、校准、备件、服务地点和承诺交期分别是什么？",
            "",
            "## 7. 快速记忆",
            "",
            "- BNW/BSW/LPS：卫生隔膜阀直接竞争。",
            "- BY：制药辅助过程角座阀竞争。",
            "- SVLCD：小容量灌装与精密定量方向。",
            "- MINUCON：微小Cv控制阀，不等同于直接作用比例电磁阀。",
            "- FCS Thermal：与Bürkert气体MFC直接重叠。",
            "- FCS Pressure/IGS/FINE PURE：高纯能力强，但制药适配必须另证。",
            "",
            "## 8. 自测题",
            "",
            "1. 为什么不能把FINE PURE金属膜片阀直接列为制药卫生阀？",
            "2. BNW有堰与BSW/LPS无堰结构比较时，除DN外还要确认什么？",
            "3. FCS Thermal与FCS Pressure为什么不能用同一套参数直接排名？",
            "4. MINUCON与Bürkert比例电磁阀的技术路线边界是什么？",
            "5. Fujikin中国有制造实体为什么仍不能证明BNW在中国生产？",
            "",
            "## 9. 完整官方目录树",
            "",
        ]
    )
    for category, rows in grouped.items():
        lines.extend([f"### {category}", "", "| 子类别 | 产品组 | 型号族 | 目录名称 | 制药相关 |", "|---|---|---|---|---|"])
        for row in rows:
            lines.append(
                f"| {row['subcategory']} | {row['product_group']} | "
                f"{row['model_numbers'] or '未列型号'} | {row['catalogue_title']} | "
                f"{row['pharma_relevance']} |"
            )
        lines.append("")
    return "\n".join(lines).rstrip() + "\n"


def main() -> None:
    catalog = read_rows(CATALOG)
    mapping = build_mapping(catalog)
    write_csv(MAPPING, MAP_FIELDS, mapping)
    HANDBOOK.write_text(render_handbook(catalog, mapping), encoding="utf-8")
    print(f"Wrote {HANDBOOK} with {len(HANDBOOK.read_text(encoding='utf-8').splitlines())} lines.")
    print(f"Wrote {MAPPING} with {len(mapping)} mapping rows.")


if __name__ == "__main__":
    main()
