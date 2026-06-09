#!/usr/bin/env python3
"""Generate the GEMÜ product-manager handbook and Bürkert comparison map."""

from __future__ import annotations

import csv
import re
from collections import Counter, defaultdict
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
RESEARCH = ROOT / "docs" / "research"
CATALOG = RESEARCH / "gemu-series-catalog.csv"
HANDBOOK = RESEARCH / "gemu-pharma-series-handbook.md"
MAPPING = RESEARCH / "gemu-burkert-series-map.csv"

MAP_FIELDS = [
    "gemu_series",
    "gemu_category",
    "gemu_role",
    "burkert_types",
    "overlap_type",
    "pharma_scenario",
    "gemu_competitive_strength",
    "burkert_response",
    "comparison_dimensions",
    "evidence_ids",
    "evidence_url",
    "confidence",
    "gaps",
]

MAP_ROWS = [
    {
        "gemu_series": "650",
        "gemu_category": "Diaphragm valves",
        "gemu_role": "BioStar pneumatic aseptic diaphragm valve",
        "burkert_types": "2030|2063|2103",
        "overlap_type": "DIRECT",
        "pharma_scenario": "无菌主工艺、配液、纯化、CIP/SIP",
        "gemu_competitive_strength": "不锈钢活塞执行器、广泛阀体构型与卫生符合性组合。",
        "burkert_response": "按具体阀体、膜片、自动化和完整控制回路比较，不做品牌级参数外推。",
        "comparison_dimensions": "DN；压力；灭菌温度；阀体构型；316L牌号；Ra；膜片；认证；控制头",
        "evidence_url": "https://www.gemu-group.com/en/products/valve-technology/diaphragm-valves/650",
        "confidence": "HIGH",
        "gaps": "中国生产、库存、净价和项目交期需内部验证。",
    },
    {
        "gemu_series": "649",
        "gemu_category": "Diaphragm valves",
        "gemu_role": "eSyDrive motorized diaphragm valve",
        "burkert_types": "3324|3325|3363|3364|3365",
        "overlap_type": "DIRECT",
        "pharma_scenario": "无气源设备、卫生开关阀和精密调节",
        "gemu_competitive_strength": "电动执行器集成参数化、诊断和开关/调节能力。",
        "burkert_response": "比较断电策略、调节精度、速度、诊断、现场通信和卫生阀体组合。",
        "comparison_dimensions": "推力；速度；控制模式；断电位；通信；IP；阀体构型；温压",
        "evidence_url": "https://www.gemu-group.com/en/products/valve-technology/diaphragm-valves/649",
        "confidence": "HIGH",
        "gaps": "不同尺寸和控制版本不能用产品页总范围直接比较。",
    },
    {
        "gemu_series": "653|654",
        "gemu_category": "Diaphragm valves",
        "gemu_role": "Manual hygienic diaphragm valve variants",
        "burkert_types": "2030|2063|2103|2933|2973",
        "overlap_type": "DIRECT",
        "pharma_scenario": "无菌输送、配液、过滤和卫生设备",
        "gemu_competitive_strength": "BioStar家族覆盖不同执行和尺寸需求，专业系列叙事清晰。",
        "burkert_response": "先确认执行方式和尺寸，再选择对应ELEMENT、INOX、CLASSIC或手动系列。",
        "comparison_dimensions": "执行方式；DN；压力；温度；连接；阀体；膜片；自动化附件",
        "evidence_url": "https://www.gemu-group.com/en/products/valve-technology/diaphragm-valves/653",
        "confidence": "HIGH",
        "gaps": "需按653与654各自配置拆分，不能合并引用参数。",
    },
    {
        "gemu_series": "643|P40",
        "gemu_category": "Tank bottom valves",
        "gemu_role": "Tank-bottom valve families",
        "burkert_types": "2033|2065|2105|2935|2975|3235|3325|3365",
        "overlap_type": "DIRECT",
        "pharma_scenario": "配液罐、生物反应器和储罐低残留排放",
        "gemu_competitive_strength": "专用罐底阀产品族，便于围绕排空和卫生设计竞争。",
        "burkert_response": "以罐体接口、排空方向、死区、焊接方式、自动化和维护空间选型。",
        "comparison_dimensions": "罐底接口；排空性；死区；焊接；执行器；膜片；CIP/SIP；维护空间",
        "evidence_url": "https://www.gemu-group.com/en/products/valve-technology/tank-bottom-valves/643",
        "confidence": "HIGH",
        "gaps": "需要具体罐图和安装方向，不能只按DN匹配。",
    },
    {
        "gemu_series": "P600M/P600S/P500M",
        "gemu_category": "Multi-port block valves",
        "gemu_role": "Reusable stainless-steel multi-port valve blocks",
        "burkert_types": "2034|2035|2036|8806",
        "overlap_type": "DIRECT",
        "pharma_scenario": "低死区分配、混合、过滤、PUPSIT和复杂流路",
        "gemu_competitive_strength": "成熟多通阀块工程、传感器集成和制药专业化表达。",
        "burkert_response": "用P&ID、阀位、死区、排空、焊点、控制头和系统责任边界逐图竞争。",
        "comparison_dimensions": "流路；阀位；死区；排空；加工方式；焊点；传感器；文件；交付",
        "evidence_url": "https://www.gemu-group.com/en/products/customised-product-solutions/multi-port-block-valves/multi-port-valve-blocks-made-of-stainless-steel/",
        "confidence": "HIGH",
        "gaps": "项目报价、设计周期和中国加工来源需内部验证。",
    },
    {
        "gemu_series": "SUMONDO Multiport|SU40|SUB",
        "gemu_category": "Single-use solutions",
        "gemu_role": "Single-use diaphragm valves and multi-port blocks",
        "burkert_types": "2707",
        "overlap_type": "ADJACENT",
        "pharma_scenario": "一次性上游/下游、快速换批和交叉污染控制",
        "gemu_competitive_strength": "可更换接液组件、一次性多通阀块和清洁室制造证据清晰。",
        "burkert_response": "不得把软管夹管阀当作等价替代；先确认是否存在一次性接液和验证需求。",
        "comparison_dimensions": "一次性边界；接液材料；辐照；洁净室；压力；DN；连接；验证文件",
        "evidence_url": "https://www.gemu-group.com/en/products/customised-product-solutions/single-use-solutions/single-use-multi-port-valve-blocks/",
        "confidence": "HIGH",
        "gaps": "Bürkert当前公开目录未显示同等完整的一次性阀块产品线。",
    },
    {
        "gemu_series": "550|554|555",
        "gemu_category": "Seat valves",
        "gemu_role": "Pneumatic seat and angle-seat valve families",
        "burkert_types": "2000|2060|2100|2300",
        "overlap_type": "DIRECT",
        "pharma_scenario": "洁净蒸汽、CIP/SIP辅助回路、公用工程和灌装设备",
        "gemu_competitive_strength": "辅助过程阀与GEMÜ卫生主工艺阀形成组合销售。",
        "burkert_response": "强调角座阀深度、ELEMENT自动化、流量调节和整套公用工程控制。",
        "comparison_dimensions": "介质；阀座；压差；温度；Kv；泄漏；执行器；定位器；蒸汽寿命",
        "evidence_url": "https://www.gemu-group.com/en/products/valve-technology/seat-valves/550",
        "confidence": "MEDIUM",
        "gaps": "需按具体阀座和工况拆分开关阀与调节阀。",
    },
    {
        "gemu_series": "1434|1435|1436|1441",
        "gemu_category": "Position and process controllers",
        "gemu_role": "Electro-pneumatic position and process controllers",
        "burkert_types": "8692|8693|8694|8696|8791|8792",
        "overlap_type": "DIRECT",
        "pharma_scenario": "卫生阀调节、设备控制和阀门诊断",
        "gemu_competitive_strength": "从基础定位到智能过程控制形成清晰产品梯度。",
        "burkert_response": "比较安装方式、行程、流量、控制算法、协议、诊断和阀体组合。",
        "comparison_dimensions": "安装；行程；气耗；流量；输入输出；协议；显示；防护；防爆",
        "evidence_url": "https://www.gemu-group.com/en/products/measurement-and-control-technology/position-and-process-controllers/1441",
        "confidence": "HIGH",
        "gaps": "具体协议与移动端功能按版本确认。",
    },
    {
        "gemu_series": "1232|1234|1236|1240|1241|1242",
        "gemu_category": "Position feedback devices and valve connections",
        "gemu_role": "Valve feedback and connection devices",
        "burkert_types": "8681|8691|8695",
        "overlap_type": "DIRECT_OR_ADJACENT",
        "pharma_scenario": "卫生阀开关反馈、分散自动化和远程状态",
        "gemu_competitive_strength": "反馈装置与自有阀门系列组合完整。",
        "burkert_response": "对比控制头是否集成先导阀、诊断、总线、维护与卫生安装。",
        "comparison_dimensions": "反馈点；先导阀；协议；IP；防爆；安装；手动操作；诊断",
        "evidence_url": "https://www.gemu-group.com/en/products/measurement-and-control-technology/position-feedback-devices-and-valve-connections/1234",
        "confidence": "MEDIUM",
        "gaps": "历史1235不应默认视为当前系列；以当前sitemap和项目BOM为准。",
    },
    {
        "gemu_series": "3020|801|805|806|807|811|815|816|817|820|822|825|830|831|832|835|840|841|845|851|855|857|865|875",
        "gemu_category": "Flow meters",
        "gemu_role": "Broad industrial flow-meter portfolio",
        "burkert_types": "8020|8025|8030|8035|8041|8045|8051|8055|8056|8070|8072|8075|8098",
        "overlap_type": "DIRECT_OR_ADJACENT",
        "pharma_scenario": "公用工程、设备流量和部分卫生液体测量",
        "gemu_competitive_strength": "公开系列数量多，可与阀门组合进入设备项目。",
        "burkert_response": "按测量原理和卫生适配分层；FLOWave、EMF、叶轮和浮子不可混比。",
        "comparison_dimensions": "原理；介质；电导率；量程；精度；压降；接液件；连接；卫生认证",
        "evidence_url": "https://www.gemu-group.com/en/products/measurement-and-control-technology/flow-meters",
        "confidence": "MEDIUM",
        "gaps": "需从目录筛出明确适用于制药主工艺的具体系列。",
    },
    {
        "gemu_series": "D480|D488|490|491",
        "gemu_category": "Butterfly valves",
        "gemu_role": "Butterfly valve families",
        "burkert_types": "2671|2672|8804|8805",
        "overlap_type": "DIRECT_OR_ADJACENT",
        "pharma_scenario": "大口径公用工程、工艺水和设备隔离",
        "gemu_competitive_strength": "中国工厂公开具备蝶阀生产能力，产品族丰富。",
        "burkert_response": "区分卫生蝶阀与通用衬里蝶阀，比较阀板、密封、扭矩和执行器。",
        "comparison_dimensions": "口径；阀板；衬里；密封；卫生连接；扭矩；执行器；失效位",
        "evidence_url": "https://www.gemu-group.com/en/products/valve-technology/butterfly-valves/d480",
        "confidence": "MEDIUM",
        "gaps": "具体中国制造系列和制药适用版本需确认。",
    },
    {
        "gemu_series": "B20|B22|B26|B27|B42|B47|B52|B54",
        "gemu_category": "Ball valves",
        "gemu_role": "Metal ball-valve families",
        "burkert_types": "2651|2652|2654|2655|2657|2658|8804|8805",
        "overlap_type": "DIRECT_OR_ADJACENT",
        "pharma_scenario": "公用工程、设备隔离和非无菌过程",
        "gemu_competitive_strength": "手动、气动和电动球阀覆盖广。",
        "burkert_response": "先确认清洁要求和滞留风险；球阀通常不是无菌主工艺隔膜阀替代。",
        "comparison_dimensions": "通径；腔体；密封；排空；连接；执行器；防爆；清洁边界",
        "evidence_url": "https://www.gemu-group.com/en/products/valve-technology/ball-valves/b42",
        "confidence": "MEDIUM",
        "gaps": "卫生型、通用型和高纯型不得合并比较。",
    },
    {
        "gemu_series": "Q30|Q40|Q51",
        "gemu_category": "Pinch valves",
        "gemu_role": "Pinch-valve families",
        "burkert_types": "2707",
        "overlap_type": "DIRECT_OR_ADJACENT",
        "pharma_scenario": "软管流路、一次性耗材外围和颗粒敏感介质",
        "gemu_competitive_strength": "夹管阀产品族与SUMONDO一次性方案可形成组合。",
        "burkert_response": "比较软管规格、夹紧力、寿命、失效位、颗粒兼容和更换便利性。",
        "comparison_dimensions": "软管；压力；温度；夹紧力；寿命；执行方式；失效位；洁净边界",
        "evidence_url": "https://www.gemu-group.com/en/products/valve-technology/pinch-valves/q40",
        "confidence": "MEDIUM",
        "gaps": "软管材料与辐照/生物相容性需按耗材系统验证。",
    },
    {
        "gemu_series": "CONEXO",
        "gemu_category": "Digital solutions",
        "gemu_role": "Component identification and lifecycle documentation",
        "burkert_types": "ME43|ME44|ME61|ME63|ME64|ME66",
        "overlap_type": "ADJACENT",
        "pharma_scenario": "阀门追溯、证书访问、维护和资产生命周期",
        "gemu_competitive_strength": "RFID组件身份、文件和维护流程与制药追溯叙事贴合。",
        "burkert_response": "区分设备通信/控制与资产文件管理；按客户数字化任务组合回答。",
        "comparison_dimensions": "身份；证书；维护；通信；数据模型；权限；移动端；中国可用性",
        "evidence_url": "https://www.gemu-group.com/en/products/digital-solutions/conexo-asset-lifecycle-management-platform/",
        "confidence": "HIGH",
        "gaps": "中国部署、授权、接口和客户采用率需项目验证。",
    },
    {
        "gemu_series": "GEMÜ Systems",
        "gemu_category": "Customised product solutions",
        "gemu_role": "System and subassembly engineering",
        "burkert_types": "BUPLUS|8840",
        "overlap_type": "DIRECT_AT_SOLUTION_LEVEL",
        "pharma_scenario": "模块、撬装、控制系统和已验证子组件",
        "gemu_competitive_strength": "从阀门向完整子组件和系统责任延伸。",
        "burkert_response": "用测量、阀岛、MFC、控制柜和完整流体回路证明系统广度。",
        "comparison_dimensions": "责任边界；工程；验证；控制；测量；阀岛；调试；文件；服务",
        "evidence_url": "https://www.gemu-group.com/en/products/customised-product-solutions/gemue-systems-system-solutions/",
        "confidence": "MEDIUM",
        "gaps": "需用中国项目案例和交付范围验证实际系统深度。",
    },
]


def read_catalog() -> list[dict[str, str]]:
    with CATALOG.open(encoding="utf-8", newline="") as handle:
        return list(csv.DictReader(handle))


def render_table(rows: list[dict[str, str]]) -> list[str]:
    lines = [
        "| 系列 | 产品 | 制药相关性 | 关键范围 | 典型任务 |",
        "|---|---|---|---|---|",
    ]
    for row in rows:
        operating = "；".join(
            value
            for value in (
                row["nominal_sizes"],
                row["operating_pressure"],
                row["media_temperature"],
                row["sterilization_temperature"],
            )
            if value
        )
        lines.append(
            f"| {row['series_id']} | {row['name_en']} | {row['pharma_relevance']} | "
            f"{operating or '官网页未列统一范围'} | {row['pharma_applications'] or '需按应用确认'} |"
        )
    return lines


def main() -> None:
    catalog = read_catalog()
    catalog_ids = {row["series_id"] for row in catalog}
    by_category: dict[str, dict[str, list[dict[str, str]]]] = defaultdict(lambda: defaultdict(list))
    for row in catalog:
        by_category[row["category"]][row["subcategory"]].append(row)

    with MAPPING.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=MAP_FIELDS, lineterminator="\n")
        writer.writeheader()
        mapped_rows = []
        for row in MAP_ROWS:
            candidates = (
                [row["gemu_series"]]
                if row["gemu_series"] in catalog_ids
                else row["gemu_series"].split("|")
            )
            evidence_ids = [
                "GEMU-SERIES-"
                + re.sub(r"[^A-Z0-9]+", "-", series.upper()).strip("-")
                for series in candidates
                if series in catalog_ids
            ]
            mapped_rows.append({**row, "evidence_ids": "|".join(evidence_ids)})
        writer.writerows(mapped_rows)

    relevance = Counter(row["pharma_relevance"] for row in catalog)
    high = [row for row in catalog if row["pharma_relevance"] == "HIGH"]
    lines = [
        "# GEMÜ 制药相关系列与 Bürkert 对标手册",
        "",
        "生成日期：2026-06-09",
        "",
        "## 1. 使用边界",
        "",
        "- 产品存在性与参数以 GEMÜ 当前英文官网产品页为主。",
        "- `HIGH` 表示官网明确出现制药、生物技术、无菌、一次性或 PUPSIT 语境。",
        "- `MEDIUM` 表示存在卫生、灭菌、FDA/USP/EHEDG/3-A 等线索，或属于制药辅助回路常见产品。",
        "- 相关性不是适用性证明；订货前仍须核对具体配置、证书范围和中国供应。",
        "- 当前 sitemap 未出现的历史系列不写成当前在售事实。",
        "",
        "## 2. 目录概览",
        "",
        f"- 当前系列/方案记录：{len(catalog)}",
        f"- HIGH：{relevance['HIGH']}",
        f"- MEDIUM：{relevance['MEDIUM']}",
        f"- LOW：{relevance['LOW']}",
        "",
        "## 3. 产品经理应先记住的结论",
        "",
        "1. GEMÜ 的直接危险区是卫生隔膜阀、多通阀块、罐底阀、一次性和阀门自动化。",
        "2. 650 BioStar 对应 Bürkert 气动卫生隔膜阀；649 eSyDrive 对应电动卫生阀。",
        "3. P600/P500 多通阀块必须按 P&ID 和死区竞争，不能退化为单阀价格比较。",
        "4. SUMONDO 是产品路线差异，不应拿普通夹管阀宣称等价。",
        "5. GEMÜ 测控产品不少，但制药主工艺适配需要逐系列确认，不能把数量等同于优势。",
        "6. CONEXO 偏资产身份、证书和维护；Bürkert EDIP/网关偏设备通信和控制，两者任务不同。",
        "",
        "## 4. 制药高相关系列",
        "",
        *render_table(high),
        "",
        "## 5. 完整当前系列树",
        "",
    ]
    for category in sorted(by_category):
        lines.append(f"### {category}")
        lines.append("")
        for subcategory in sorted(by_category[category]):
            rows = sorted(by_category[category][subcategory], key=lambda row: row["series_id"])
            lines.append(f"#### {subcategory}（{len(rows)}）")
            lines.append("")
            lines.extend(render_table(rows))
            lines.append("")

    lines.extend(
        [
            "## 6. Bürkert 对标速查",
            "",
            "| GEMÜ系列 | Bürkert候选Type | 重叠 | 场景 | 竞争要点 |",
            "|---|---|---|---|---|",
        ]
    )
    for row in MAP_ROWS:
        lines.append(
            f"| {row['gemu_series']} | {row['burkert_types']} | {row['overlap_type']} | "
            f"{row['pharma_scenario']} | {row['gemu_competitive_strength']} |"
        )
    lines.extend(
        [
            "",
            "## 7. 客户需求到候选系列",
            "",
            "| 客户需求 | 先看GEMÜ | 先看Bürkert | 必问条件 |",
            "|---|---|---|---|",
            "| 气动无菌隔膜阀 | 650/653/654 | 2030/2063/2103 | DN、阀体、膜片、Ra、灭菌、自动化 |",
            "| 电动卫生阀 | 649 | 3324/3325/3363/3364/3365 | 推力、速度、断电位、控制、IP |",
            "| 多通低死区阀块 | P600M/P600S/P500M | 2034/2035/2036/8806 | P&ID、排空、死区、焊点、传感器 |",
            "| 一次性多通流路 | SUMONDO Multiport | 当前无直接完整对应 | 接液耗材、辐照、洁净室、验证 |",
            "| 卫生阀反馈/调节 | 123x/143x/1441 | 8681/869x/879x | 安装、协议、诊断、先导阀、控制算法 |",
            "| CIP/SIP辅助阀 | 550/554/555 | 2000/2060/2100/2300 | 蒸汽、压差、温度、阀座、寿命 |",
            "",
            "## 8. 不可直接比较的边界",
            "",
            "- 不同膜片尺寸、阀体构型和控制功能的总范围不能直接判优。",
            "- 多通阀块与多个焊接单阀不是同一设计任务。",
            "- 一次性阀体、夹管阀和可重复使用卫生隔膜阀不是同一替代关系。",
            "- 通用流量计与卫生主工艺流量计不能只比较精度数字。",
            "- CONEXO 与工业以太网网关不能用“数字化功能多少”笼统比较。",
            "",
            "## 9. 内部验证清单",
            "",
            "- GEMÜ 650、649、P600 系列在中国的实际产地、库存与交期。",
            "- 同规格阀门净价、膜片备件价和总拥有成本。",
            "- 中国制药客户的安装基础、验证文件接受度和失效案例。",
            "- SUMONDO 在国内的一次性组件供应、辐照和变更管理。",
            "- GEMÜ Systems 在中国项目中的控制柜、测量、阀岛和调试责任边界。",
        ]
    )
    HANDBOOK.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"Wrote {HANDBOOK} with {len(lines)} lines and {len(MAP_ROWS)} mapping rows.")


if __name__ == "__main__":
    main()
