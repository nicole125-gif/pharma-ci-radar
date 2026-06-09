#!/usr/bin/env python3
"""Generate the ESG/Jingrui product-manager handbook and Bürkert map."""

from __future__ import annotations

import csv
from collections import Counter, defaultdict
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
RESEARCH = ROOT / "docs" / "research"
CATALOG = RESEARCH / "esg-series-catalog.csv"
HANDBOOK = RESEARCH / "esg-jingrui-product-handbook.md"
MAPPING = RESEARCH / "esg-burkert-series-map.csv"

MAP_FIELDS = [
    "esg_series",
    "esg_role",
    "burkert_types",
    "overlap_type",
    "pharma_scenario",
    "esg_competitive_signal",
    "burkert_response",
    "comparison_dimensions",
    "evidence_ids",
    "confidence",
    "gaps",
]

MAP_DEFINITIONS = [
    {
        "esg_series": "A00/A01",
        "source_series": ["A00", "A01"],
        "esg_role": "Pneumatic and manual hygienic diaphragm valves",
        "burkert_types": "2030|2063|2103",
        "overlap_type": "DIRECT",
        "pharma_scenario": "配液、纯化、CIP/SIP和卫生输送",
        "esg_competitive_signal": "公开参数包含316L、Ra、膜片和温压范围，具备国产卫生阀产品基础。",
        "burkert_response": "取得当前数据表和证书原件后，按阀体、Ra、膜片、排空、连接、认证及自动化比较。",
        "comparison_dimensions": "DN；Cv/Kv；阀体；Ra；膜片；连接；压力；温度；排空；认证",
        "confidence": "MEDIUM",
        "gaps": "FDA、USP、EC声明、材料批次、膜片寿命、中国项目案例、净价和交期。",
    },
    {
        "esg_series": "A31",
        "source_series": ["A31"],
        "esg_role": "Manual aseptic sampling valve",
        "burkert_types": "",
        "overlap_type": "PORTFOLIO_ADJACENT",
        "pharma_scenario": "罐体和管路无菌取样",
        "esg_competitive_signal": "公开产品页给出316L、PTFE膜片、ASME BPE焊接/卡箍及PN16。",
        "burkert_response": "若项目包含取样阀，应按取样回路、灭菌、残留、容器和证书单独评估。",
        "comparison_dimensions": "取样口；阀体；膜片；连接；灭菌；残留；容器；证书",
        "confidence": "MEDIUM",
        "gaps": "无菌验证文件、FDA/USP证书原件、取样死区和中国装机。",
    },
    {
        "esg_series": "T-VALVE/103",
        "source_series": ["T-VALVE", "103"],
        "esg_role": "Sanitary T-pattern claim and three-way angle-seat valve",
        "burkert_types": "2034|2035|2104|2106",
        "overlap_type": "ADJACENT_NOT_EQUIVALENT",
        "pharma_scenario": "分流、切换、卫生支路和设备管路",
        "esg_competitive_signal": "具备T型和三通阀产品信号，可进入标准设备阀门包。",
        "burkert_response": "不得把三通角座阀或新闻中的T阀等同于低死区机加工多通隔膜阀块。",
        "comparison_dimensions": "流路；阀位；死区；排空；焊点；阀座；膜片；验证文件",
        "confidence": "LOW",
        "gaps": "T阀当前产品页、图纸、阀体结构、死区、排空和复杂阀块加工能力。",
    },
    {
        "esg_series": "100/101/107/111/120/127",
        "source_series": ["100/101/107/111/120/127"],
        "esg_role": "Angle-seat shut-off valve family",
        "burkert_types": "2000|2002|2012|2100|2101",
        "overlap_type": "DIRECT",
        "pharma_scenario": "蒸汽、CIP/SIP辅助回路、公用工程和灌装设备",
        "esg_competitive_signal": "系列跨度大，覆盖气动、手动、螺纹及部分卫生焊接/卡箍连接。",
        "burkert_response": "按单一系列锁定阀体、密封、温压、连接、执行方式和蒸汽寿命，不做家族级外推。",
        "comparison_dimensions": "介质；DN；Kv；压差；温度；阀座；泄漏；连接；执行器",
        "confidence": "MEDIUM",
        "gaps": "各系列独立数据表、卫生符合性、寿命、备件和项目实际交期。",
    },
    {
        "esg_series": "104/105/106 + 0P1",
        "source_series": ["104/105/106", "0P1"],
        "esg_role": "Proportional angle-seat valves and intelligent positioner",
        "burkert_types": "2300|2301|8692|8693|8694|8791|8792",
        "overlap_type": "DIRECT_OR_ADJACENT",
        "pharma_scenario": "蒸汽、温度、压力和设备流量调节",
        "esg_competitive_signal": "公开产品覆盖气动/电动调节与基础模拟量定位器。",
        "burkert_response": "比较控制精度、可调比、迟滞、反馈、故障位、协议、诊断和防爆证书。",
        "comparison_dimensions": "Cv/Kv；特性；可调比；迟滞；响应；I/O；协议；IP；防爆",
        "confidence": "MEDIUM",
        "gaps": "当前在售配置、控制性能、总线、诊断、Ex证书及执行器兼容性。",
    },
    {
        "esg_series": "1AA/1AS/1AJ/1AE/1AK",
        "source_series": ["1AA/1AS", "1AJ/1AE/1AK"],
        "esg_role": "Filling valve family",
        "burkert_types": "6650|7604|7615",
        "overlap_type": "ADJACENT",
        "pharma_scenario": "灌装、精密定量和黏稠介质设备",
        "esg_competitive_signal": "具有专用灌装阀系列，可参与食品、日化和部分设备项目。",
        "burkert_response": "先确认是否为卫生制药灌装，再比较定量原理、重复性、死体积、清洗和连接。",
        "comparison_dimensions": "定量原理；体积；重复性；死体积；接液；连接；清洗；响应",
        "confidence": "LOW",
        "gaps": "制药卫生适配、定量性能、无菌文件及1AJ/1AE/1AK官方PDF原文。",
    },
    {
        "esg_series": "300/400/500",
        "source_series": ["300", "400", "500"],
        "esg_role": "Butterfly, ball and check valve families",
        "burkert_types": "2671|2672|8804|8805",
        "overlap_type": "DIRECT_OR_ADJACENT",
        "pharma_scenario": "公用工程、大口径输送和设备隔离",
        "esg_competitive_signal": "标准工业阀产品族支持阀门包销售。",
        "burkert_response": "区分卫生型与通用工业型，按阀板/球体、腔体、密封、连接、扭矩和执行器比较。",
        "comparison_dimensions": "口径；阀体；密封；腔体；排空；连接；扭矩；执行器",
        "confidence": "LOW",
        "gaps": "当前详细目录、卫生型号、材料、温压、执行器和认证。",
    },
    {
        "esg_series": "700/701",
        "source_series": ["700/701"],
        "esg_role": "Pressure reducing and overflow valves",
        "burkert_types": "",
        "overlap_type": "UTILITY_ADJACENT",
        "pharma_scenario": "一般公用工程压力调节",
        "esg_competitive_signal": "提供自力式压力控制阀，可扩展设备阀门包。",
        "burkert_response": "不按名称直接与电子压力控制比较；先确认介质、卫生边界和控制任务。",
        "comparison_dimensions": "介质；入口/出口压力；流量；阀体；密封；连接；卫生要求",
        "confidence": "MEDIUM",
        "gaps": "卫生接液、调节精度、容量曲线和制药项目应用。",
    },
    {
        "esg_series": "800/801 + 901",
        "source_series": ["800/801", "901"],
        "esg_role": "Steam traps and air eliminators",
        "burkert_types": "",
        "overlap_type": "UTILITY_ADJACENT",
        "pharma_scenario": "蒸汽冷凝水、热水和一般液体公用工程",
        "esg_competitive_signal": "覆盖蒸汽和液体辅助阀门，可参与完整阀门包。",
        "burkert_response": "把疏水/排气性能、洁净蒸汽适配和维护周期纳入阀门包总评价。",
        "comparison_dimensions": "原理；负荷；差压；背压；排空气；温度；连接；维护",
        "confidence": "LOW",
        "gaps": "800家族/801热动力系列的容量、空气排放、洁净蒸汽适配和当前数据表。",
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
    ids = {row["series_id"] for row in catalog}
    output = []
    for definition in MAP_DEFINITIONS:
        sources = definition["source_series"]
        missing = set(sources) - ids
        if missing:
            raise ValueError(f"Mapping references unknown ESG series: {sorted(missing)}")
        output.append(
            {
                key: value
                for key, value in definition.items()
                if key != "source_series"
            }
            | {
                "evidence_ids": "|".join(
                    f"ESG-SERIES-{item.replace('/', '-').replace(' ', '-')}"
                    for item in sources
                )
            }
        )
    return output


def render_handbook(
    catalog: list[dict[str, str]],
    mapping: list[dict[str, str]],
) -> str:
    relevance = Counter(row["pharma_relevance"] for row in catalog)
    grades = Counter(row["evidence_grade"] for row in catalog)
    grouped: dict[str, list[dict[str, str]]] = defaultdict(list)
    for row in catalog:
        grouped[row["category"]].append(row)

    lines = [
        "# ESG 精锐产品系列与制药竞争手册",
        "",
        "更新日期：2026-06-09",
        "主体：青岛精锐机械制造有限公司；品牌：ESG / Elite Valve",
        "",
        "## 1. 证据边界",
        "",
        "- ESG中英文官网本轮对直接自动化访问返回HTTP 403。",
        "- 本目录来自搜索引擎可见的官方产品页、官方PDF索引和官方新闻索引，不声称为官网全部在售SKU。",
        "- 产品存在和索引参数为B/C级；本轮没有A 级产品证据。",
        "- FDA、USP、EC 1935/2004、百万次弯折和防爆等表述保留为企业CLAIM，不能替代证书原件。",
        "- 价格、库存、产能、交期、客户安装量和售后响应继续列为内部验证。",
        "",
        "## 2. 当前目录规模",
        "",
        f"- 可核验系列或系列组：{len(catalog)}",
        f"- 制药高相关：{relevance['HIGH']}",
        f"- 制药邻近相关：{relevance['MEDIUM']}",
        f"- 低相关：{relevance['LOW']}",
        f"- B级记录：{grades['B']}；C级记录：{grades['C']}",
        "",
        "## 3. 产品定位",
        "",
        "| 方向 | 代表系列 | 竞争含义 |",
        "|---|---|---|",
        "| 卫生主工艺与取样 | A00、A01、A31、T型阀信号 | 可进入标准卫生阀和取样阀竞争，但复杂阀块与证书成熟度待证 |",
        "| 辅助过程与公用工程 | 100系列、103、104/105/106、700/701、800/801、901 | 可用较宽阀门包覆盖蒸汽、压力、切换、排水和排气 |",
        "| 灌装和设备阀 | 1AA/1AS/1AJ/1AE/1AK | 有专用产品线，但制药卫生和定量性能需逐型号验证 |",
        "| 自动化 | 0P1 | 有基础模拟量定位能力，未证明系统级现场总线和资产管理 |",
        "| 通用隔离 | 300、400、500 | 支持大口径和标准设备阀门包，卫生型号范围待证 |",
        "",
        "## 4. 制药重点系列",
        "",
        "| 系列 | 产品角色 | 公开参数摘要 | 证据边界 |",
        "|---|---|---|---|",
    ]
    for row in catalog:
        if row["pharma_relevance"] != "HIGH":
            continue
        summary = "；".join(
            item
            for item in (
                row["body_material"],
                row["seal_or_diaphragm"],
                row["pressure"],
                row["temperature"],
                row["connections"],
            )
            if item
        )
        lines.append(
            f"| {row['series_id']} | {row['product_role']} | {summary or '公开参数不足'} | "
            f"{row['fact_status']}/{row['evidence_grade']} |"
        )

    lines.extend(
        [
            "",
            "## 5. Bürkert 对标地图",
            "",
            "| ESG系列 | Bürkert Type | 重叠 | 场景 | 可信度 |",
            "|---|---|---|---|---|",
        ]
    )
    for row in mapping:
        lines.append(
            f"| {row['esg_series']} | {row['burkert_types'] or '无直接单品映射'} | "
            f"{row['overlap_type']} | {row['pharma_scenario']} | {row['confidence']} |"
        )

    lines.extend(
        [
            "",
            "## 6. 最重要的竞争判断",
            "",
            "1. ESG最明确的直接重叠是A00/A01标准卫生隔膜阀和100系列角座阀。",
            "2. A31证明其进入无菌取样场景，但不等于拥有完整无菌阀块工程能力。",
            "3. 103三通角座阀和T型阀新闻不能作为复杂低死区多通隔膜阀块的等价证据。",
            "4. 0P1说明具备基础阀门调节附件，但未证明与Bürkert EDIP、阀岛或GEMÜ CONEXO同等级数字化。",
            "5. 本土制造可能带来成本和响应条件，但在真实净价、同等认证和实际交期数据出现前不能写成事实优势。",
            "",
            "## 7. 项目必问",
            "",
            "1. 当前报价的完整系列、口径、阀体、膜片、连接和执行器代码是什么？",
            "2. FDA、USP、EC、CE或Ex证书原件的发行机构、日期和适用型号是什么？",
            "3. Ra由何种工艺和检测方法保证，能否提供批次报告？",
            "4. 膜片的供应商、批号、寿命测试条件和变更通知机制是什么？",
            "5. 中国标准品与定制品的承诺交期、实际交期、关键备件库存和现场服务范围是什么？",
            "",
            "## 8. 快速自测",
            "",
            "1. A00与Bürkert 2103比较前必须取得哪些配置与证书？",
            "2. 为什么103三通角座阀不能直接对标Robolux或多通隔膜阀块？",
            "3. 0P1公开信息能证明什么，不能证明什么？",
            "4. ESG的FDA/USP表述为什么应标记为CLAIM而不是独立验证事实？",
            "5. 如何验证“本土价格和交付优势”而不依赖销售印象？",
            "",
            "## 9. 完整可核验目录",
            "",
        ]
    )
    for category, rows in grouped.items():
        lines.extend(
            [
                f"### {category}",
                "",
                "| 系列 | 子类别 | 产品角色 | 制药相关 | 状态/等级 |",
                "|---|---|---|---|---|",
            ]
        )
        for row in rows:
            lines.append(
                f"| {row['series_id']} | {row['subcategory']} | {row['product_role']} | "
                f"{row['pharma_relevance']} | {row['fact_status']}/{row['evidence_grade']} |"
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
