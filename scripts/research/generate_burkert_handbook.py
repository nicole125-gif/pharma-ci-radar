#!/usr/bin/env python3
"""Generate the Chinese product-manager handbook from validated catalog CSVs."""

from __future__ import annotations

import csv
import json
from collections import defaultdict
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
RESEARCH = ROOT / "docs" / "research"

CATEGORY_ORDER = [
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
]

CATEGORY_GUIDE = {
    "电磁阀": {
        "role": "使用电磁力直接或先导切换流路，覆盖通用介质、隔离介质、气动控制和特殊工况。",
        "tasks": "快速开关；介质隔离；气路先导；设备内部流路；安全切断。",
        "variables": "通路；作用原理；介质；通径/Kv；压差；温度；阀体与密封；连接；电压；功耗；防爆。",
        "exclude": "不能把普通隔离膜片电磁阀直接等同于卫生级过程隔膜阀；先导式阀通常需要最低压差。",
    },
    "过程与控制阀": {
        "role": "承担工业及卫生过程中的隔离、切换和连续调节，是制药主工艺竞争的核心产品族。",
        "tasks": "无菌隔离；CIP/SIP；罐底与T型流路；蒸汽/公用工程；流量调节；多通阀块。",
        "variables": "阀体结构；DN；Kv；材质；Ra；膜片/阀座；连接；压温；排空；执行器；反馈/定位；认证。",
        "exclude": "卫生主工艺阀、普通角座阀和公用工程阀风险等级不同；单阀与多通阀块不能按阀位数量简单换算。",
    },
    "电动阀": {
        "role": "通过电动执行器完成开关或调节，适用于无压缩空气、低能耗或需要精确位置控制的场景。",
        "tasks": "去气源改造；精确定位；慢速/可控启闭；分散设备自动化。",
        "variables": "阀型；推力/扭矩；速度；失效策略；供电；控制模式；通信；防护；占空比。",
        "exclude": "断电保持、失效安全和调节性能必须逐型号确认，不能把电动执行简单视为气动执行的等价替代。",
    },
    "气动与过程接口": {
        "role": "把控制系统与气动执行器连接起来，包括气动阀、阀岛、远程I/O、控制柜和气缸。",
        "tasks": "集中或分布式气动控制；设备标准化；诊断；减少布线；安全分区。",
        "variables": "阀位；流量；气源；压力；模块数；协议；I/O；冗余；热插拔；防爆；柜体；环境等级。",
        "exclude": "阀岛容量、气动流量和网络节点必须一起设计；产品具备协议不等于项目已具备冗余或验证。",
    },
    "传感器、变送器与控制器": {
        "role": "覆盖流量、液位、压力、温度和液体分析，并提供显示、变送和闭环控制能力。",
        "tasks": "WFI/PW监控；CIP介质识别；罐体测量；公用工程；水质分析；本地控制。",
        "variables": "测量原理；介质；范围；精度；重复性；响应；接液材质；连接；安装条件；输出；校准；卫生认证。",
        "exclude": "不同测量原理的适用介质和安装条件不同；不得只比较标称精度而忽略气泡、电导率、直管段或污染。",
    },
    "微流体产品与泵": {
        "role": "面向实验室、分析和医疗设备的小型介质隔离阀、微泵和精密定量组件。",
        "tasks": "微量切换；试剂加注；样品处理；时间压力定量；紧凑仪器流路。",
        "variables": "隔离方式；内部体积；死体积；介质兼容；压力；流量；响应；寿命；功耗；定量重复性。",
        "exclude": "微流体器件和工厂级卫生过程阀不是同一尺度；一次性生物工艺阀也不等同于仪器微阀。",
    },
    "质量流量控制器与流量计": {
        "role": "将流量传感、电子控制和调节阀组合，用于气体或液体的精确测量与闭环控制。",
        "tasks": "发酵供气；气体配比；实验室供气；液体精密定量；电子压力控制。",
        "variables": "介质；标况；量程；精度定义；量程比；响应；入口压力；压降；阀座；校准；通信；洁净材料。",
        "exclude": "MFM只测量、MFC测量并控制；热式与科里奥利原理不可脱离介质和精度要求直接排名。",
    },
    "比例阀": {
        "role": "通过连续电信号改变阀开度，用于快速、紧凑的压力或流量调节。",
        "tasks": "气体压力控制；流量调节；设备定量；闭环执行元件。",
        "variables": "介质；孔径；Kv；压差；控制信号；迟滞；重复性；响应；线圈；驱动电子；温升。",
        "exclude": "直接作用比例阀与带定位器的过程调节阀技术路线不同；需要结合传感器和控制器评价闭环表现。",
    },
    "工业通信": {
        "role": "连接 Bürkert 设备、远程I/O和上位控制系统，支持参数化、诊断和设备级数据。",
        "tasks": "PROFINET/EtherNet/IP集成；IO-Link；büS/EDIP；网关；远程I/O；资产诊断。",
        "variables": "协议；拓扑；节点数；循环时间；冗余；安全；I/O类型；配置工具；设备描述；网络安全。",
        "exclude": "协议名称相同不代表实现范围相同；需确认版本、设备数、冗余、授权和中国可用支持。",
    },
    "附加产品": {
        "role": "补充接头、附件、服务、维护和调试等，使产品能够安装、运行和持续维护。",
        "tasks": "安装连接；备件；维护；调试；校准；培训；生命周期支持。",
        "variables": "兼容型号；材料；尺寸；认证；备件状态；服务地点；响应；校准范围；文档。",
        "exclude": "附件兼容性必须按 Type 和配置确认；服务产品存在不代表具体地区具备相同SLA。",
    },
}

NEED_PATHS = [
    ("无菌液路隔离", "过程与控制阀 > 卫生/隔膜阀", "2030–2036、2103–2106", "介质、DN、阀体结构、Ra、膜片、连接、CIP/SIP、排空、认证", "普通电磁阀或非卫生过程阀"),
    ("WFI/PW流量监控", "传感器 > 流量", "8098及适用的电磁/机械/超声流量Type", "介质电导率、气泡、口径、量程、精度、安装、卫生连接、校准", "未满足介质或安装条件的测量原理"),
    ("发酵气体配比", "MFC/MFM", "8700–8756当前在售相关Type", "气体、标况、量程、入口压力、精度、响应、校准、通信", "只测量的MFM不能替代闭环MFC"),
    ("设备气动自动化", "气动与过程接口", "8640、8644、8650、8652及远程I/O", "阀位、气量、气源分区、协议、诊断、冗余、防爆", "容量、流量或协议不匹配的阀岛"),
    ("CIP/SIP公用工程", "过程阀/电磁阀/传感器", "按蒸汽、冷凝水、清洗液和风险等级组合", "介质、温压、压差、水锤、失效位、寿命、维护", "把卫生主工艺规格一刀切套用到全部辅助阀"),
    ("实验室精密定量", "微流体/比例阀/流量控制", "6624、6650、6712、6724、7604、7615等", "体积、压力、介质、死体积、响应、重复性、寿命", "用工厂级过程阀替代仪器微流体器件"),
]

BOUNDARIES = [
    ("电磁阀 vs 过程阀", "电磁阀适合紧凑快速切换；过程阀承担更大通径、复杂工况和卫生/调节任务。"),
    ("卫生隔膜阀 vs 隔离膜片电磁阀", "两者都有膜片，但阀体尺度、卫生设计、排空、连接、认证和应用风险完全不同。"),
    ("开关阀 vs 调节阀", "开关阀验证可靠启闭；调节阀还需评价阀特性、可调比、迟滞、定位和闭环稳定性。"),
    ("MFM vs MFC", "MFM只测量；MFC集成调节元件并跟踪设定值。"),
    ("热式MFC vs 科里奥利MFC", "热式通常针对已知气体并依赖气体特性；科里奥利直接测质量且可同时获得密度/温度，但成本和结构不同。"),
    ("阀岛 vs 单阀", "阀岛整合气路、I/O、诊断和网络；单阀适合分散或少量控制点。"),
    ("现场控制头 vs 控制柜阀岛", "控制头靠近过程阀、布线直观；集中阀岛便于维护和气源管理，选择取决于设备布局与验证策略。"),
    ("微流体阀 vs 一次性生物工艺阀", "微流体阀服务仪器小体积流路；一次性阀强调预灭菌接液组件、换批和污染控制。"),
]


def read_csv(path: Path) -> list[dict[str, str]]:
    with path.open(encoding="utf-8", newline="") as handle:
        return list(csv.DictReader(handle))


def link(label: str, url: str) -> str:
    return f"[{label}]({url})" if url else label


def main() -> None:
    catalog = read_csv(RESEARCH / "burkert-type-catalog.csv")
    competitor_map = read_csv(RESEARCH / "burkert-competitor-series-map.csv")
    coverage = json.loads((RESEARCH / "burkert-catalog-coverage.json").read_text(encoding="utf-8"))
    grouped: dict[str, dict[str, list[dict[str, str]]]] = defaultdict(lambda: defaultdict(list))
    for row in catalog:
        grouped[row["category"]][row["subcategory"] or "未细分"].append(row)

    lines = [
        "# Bürkert 全产品 Type 产品经理手册",
        "",
        f"生成日期：{coverage['generated_date']}",
        "范围：Bürkert 全球官网当前 Type；中国站可见性与中文数据表另行标记",
        "使用边界：本手册用于产品学习和初步选型，不替代具体订货号数据表、正式选型确认或项目报价。",
        "",
        "## 1. 数据口径",
        "",
        f"- 全球 Type sitemap：{coverage['global_sitemap_count']} 个。",
        f"- 已建档：{coverage['catalog_count']} 个 Type。",
        f"- 参数记录：{coverage['specification_row_count']} 条可追溯页面级规格。",
        f"- 多分类路径：{coverage['multi_path_type_count']} 个 Type；跨一级产品族：{coverage['multi_category_type_count']} 个 Type。",
        "- 一个 Type 可能出现在多个官方分类路径；目录选择一个主分类，全部官方路径保留在 `notes`。",
        "- `china_visibility` 只说明中国页面/中文数据表公开可见，不说明库存、产地和交期。",
        "- 精确参数只收录官方页面明确值；具体配置仍以数据表、订货代码和工程确认结果为准。",
        "",
        "## 2. 十大产品族记忆图",
        "",
        "| 产品族 | Type数量 | 核心作用 | 第一组选型变量 |",
        "|---|---:|---|---|",
    ]
    for category in CATEGORY_ORDER:
        guide = CATEGORY_GUIDE[category]
        count = sum(len(rows) for rows in grouped.get(category, {}).values())
        lines.append(f"| {category} | {count} | {guide['role']} | {guide['variables']} |")

    lines.extend(
        [
            "",
            "## 3. 客户需求到候选 Type",
            "",
            "| 客户任务 | 先进入的产品族 | 候选Type范围 | 必问工况 | 排除方向 |",
            "|---|---|---|---|---|",
        ]
    )
    for row in NEED_PATHS:
        lines.append("| " + " | ".join(row) + " |")

    lines.extend(["", "## 4. 相邻产品不可互换边界", ""])
    for title, body in BOUNDARIES:
        lines.append(f"- **{title}：** {body}")

    lines.extend(["", "## 5. 完整 Type 产品树", ""])
    for index, category in enumerate(CATEGORY_ORDER, start=1):
        guide = CATEGORY_GUIDE[category]
        lines.extend(
            [
                f"### 5.{index} {category}",
                "",
                f"**产品角色：** {guide['role']}",
                "",
                f"**客户任务：** {guide['tasks']}",
                "",
                f"**关键选型变量：** {guide['variables']}",
                "",
                f"**排除与边界：** {guide['exclude']}",
                "",
            ]
        )
        subgroups = grouped.get(category, {})
        if not subgroups:
            lines.extend(["该产品族当前没有被解析到目录记录。", ""])
            continue
        for subcategory in sorted(subgroups):
            rows = sorted(subgroups[subcategory], key=lambda row: row["type_id"])
            lines.extend(
                [
                    f"#### {subcategory}",
                    "",
                    "| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |",
                    "|---|---|---|---|---|---|",
                ]
            )
            for row in rows:
                docs = [
                    link("产品页", row["global_product_url"]),
                    link("英文数据表", row["english_datasheet_url"]) if row["english_datasheet_url"] else "",
                    link("中文数据表", row["chinese_datasheet_url"]) if row["chinese_datasheet_url"] else "",
                ]
                docs = " / ".join(item for item in docs if item)
                name = row["name_zh"] or row["name_en"]
                lines.append(
                    f"| {row['type_id']} | {name} | {row['product_role']} | "
                    f"{row['pharma_relevance']} | {row['china_visibility']} | {docs} |"
                )
            lines.append("")

    pharma_rows = [
        row
        for row in catalog
        if row["pharma_relevance"] == "HIGH"
        or (row["pharma_relevance"] == "MEDIUM" and row["pharma_applications"])
    ]
    lines.extend(
        [
            "## 6. 制药重点 Type",
            "",
            "以下 Type 是基于官方分类和页面描述形成的制药重点学习清单。`MEDIUM` 表示邻近或系统支持能力，不代表所有配置满足卫生主工艺要求。",
            "",
            "| Type | 产品族/子类 | 官方名称 | 制药场景 | 相关性 |",
            "|---|---|---|---|---|",
        ]
    )
    for row in sorted(pharma_rows, key=lambda row: (CATEGORY_ORDER.index(row["category"]), row["type_id"])):
        lines.append(
            f"| {link(row['type_id'], row['global_product_url'])} | {row['category']} / {row['subcategory']} | "
            f"{row['name_zh'] or row['name_en']} | {row['pharma_applications'] or '需按项目确认'} | {row['pharma_relevance']} |"
        )

    lines.extend(
        [
            "",
            "## 7. 竞品系列映射",
            "",
            "| Bürkert方向 | Bürkert Type | GEMÜ | Fujikin | ESG精锐 | 重叠 | 可信度 |",
            "|---|---|---|---|---|---|---|",
        ]
    )
    for row in competitor_map:
        lines.append(
            f"| {row['burkert_category']} / {row['burkert_subcategory']} | {row['burkert_types']} | "
            f"{row['gemu_series']} | {row['fujikin_series']} | {row['esg_series']} | "
            f"{row['overlap_type']} | {row['confidence']} |"
        )

    lines.extend(
        [
            "",
            "## 8. 快速记忆与训练",
            "",
            "### 必须脱口而出的十组锚点",
            "",
            "1. 2030–2036、2103–2106：卫生隔膜阀、T型/罐底/多通等制药核心方向。",
            "2. 2000/2002/2012、2100/2101、2300/2301：过程隔离与调节阀骨架。",
            "3. 8681/8685、8690–8696：阀门控制头、反馈和定位。",
            "4. 8640/8644/8650/8652：阀岛与气动自动化。",
            "5. 8098：FLOWave卫生流量测量代表。",
            "6. 8200–8232、8905：液体分析与多通道系统。",
            "7. 8700–8756当前在售相关Type：MFC/MFM与精密流量控制。",
            "8. 6624/6650/6712/6724/7604/7615：微流体阀、泵和定量方向。",
            "9. 2861–2875、6024、6223：比例阀方向。",
            "10. ME43–ME66、BUPLUS：通信、I/O及生命周期服务。",
            "",
            "### 每次选型必须回答",
            "",
            "1. 客户要测量、开关、调节，还是完整闭环？",
            "2. 介质、温度、压力、压差和流量范围是什么？",
            "3. 接液材料、密封/膜片、连接和卫生等级是什么？",
            "4. 失效位、反馈、诊断和通信要求是什么？",
            "5. 当前比较的是 Type、具体订货号还是完整系统？",
            "6. 中国页面/中文资料可见，还是已确认中国库存和交期？",
            "7. 对手对应的是同一技术路线和同一风险等级吗？",
            "",
            "## 9. 当前知识缺口",
            "",
            "- Article Number级配置、价格、库存、产地和交期不在本目录范围内。",
            "- Type页没有明确披露的数值参数保持空缺，不能从相邻型号外推。",
            "- 竞品本轮只映射到系列级，下一阶段再逐家公司建立全量型号目录。",
            "- 制药适用性最终取决于具体配置、证书范围、项目工况和验证要求。",
        ]
    )

    target = RESEARCH / "burkert-full-product-handbook.md"
    target.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"Wrote {target} with {len(lines)} lines.")


if __name__ == "__main__":
    main()
