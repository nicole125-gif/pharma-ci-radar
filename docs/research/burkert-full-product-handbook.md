# Bürkert 全产品 Type 产品经理手册

生成日期：2026-06-09
范围：Bürkert 全球官网当前 Type；中国站可见性与中文数据表另行标记
使用边界：本手册用于产品学习和初步选型，不替代具体订货号数据表、正式选型确认或项目报价。

## 1. 数据口径

- 全球 Type sitemap：511 个。
- 已建档：511 个 Type。
- 参数记录：1040 条可追溯页面级规格。
- 多分类路径：247 个 Type；跨一级产品族：112 个 Type。
- 一个 Type 可能出现在多个官方分类路径；目录选择一个主分类，全部官方路径保留在 `notes`。
- `china_visibility` 只说明中国页面/中文数据表公开可见，不说明库存、产地和交期。
- 精确参数只收录官方页面明确值；具体配置仍以数据表、订货代码和工程确认结果为准。

## 2. 十大产品族记忆图

| 产品族 | Type数量 | 核心作用 | 第一组选型变量 |
|---|---:|---|---|
| 电磁阀 | 110 | 使用电磁力直接或先导切换流路，覆盖通用介质、隔离介质、气动控制和特殊工况。 | 通路；作用原理；介质；通径/Kv；压差；温度；阀体与密封；连接；电压；功耗；防爆。 |
| 过程与控制阀 | 120 | 承担工业及卫生过程中的隔离、切换和连续调节，是制药主工艺竞争的核心产品族。 | 阀体结构；DN；Kv；材质；Ra；膜片/阀座；连接；压温；排空；执行器；反馈/定位；认证。 |
| 电动阀 | 6 | 通过电动执行器完成开关或调节，适用于无压缩空气、低能耗或需要精确位置控制的场景。 | 阀型；推力/扭矩；速度；失效策略；供电；控制模式；通信；防护；占空比。 |
| 气动与过程接口 | 41 | 把控制系统与气动执行器连接起来，包括气动阀、阀岛、远程I/O、控制柜和气缸。 | 阀位；流量；气源；压力；模块数；协议；I/O；冗余；热插拔；防爆；柜体；环境等级。 |
| 传感器、变送器与控制器 | 125 | 覆盖流量、液位、压力、温度和液体分析，并提供显示、变送和闭环控制能力。 | 测量原理；介质；范围；精度；重复性；响应；接液材质；连接；安装条件；输出；校准；卫生认证。 |
| 微流体产品与泵 | 10 | 面向实验室、分析和医疗设备的小型介质隔离阀、微泵和精密定量组件。 | 隔离方式；内部体积；死体积；介质兼容；压力；流量；响应；寿命；功耗；定量重复性。 |
| 质量流量控制器与流量计 | 27 | 将流量传感、电子控制和调节阀组合，用于气体或液体的精确测量与闭环控制。 | 介质；标况；量程；精度定义；量程比；响应；入口压力；压降；阀座；校准；通信；洁净材料。 |
| 比例阀 | 17 | 通过连续电信号改变阀开度，用于快速、紧凑的压力或流量调节。 | 介质；孔径；Kv；压差；控制信号；迟滞；重复性；响应；线圈；驱动电子；温升。 |
| 工业通信 | 4 | 连接 Bürkert 设备、远程I/O和上位控制系统，支持参数化、诊断和设备级数据。 | 协议；拓扑；节点数；循环时间；冗余；安全；I/O类型；配置工具；设备描述；网络安全。 |
| 附加产品 | 51 | 补充接头、附件、服务、维护和调试等，使产品能够安装、运行和持续维护。 | 兼容型号；材料；尺寸；认证；备件状态；服务地点；响应；校准范围；文档。 |

## 3. 客户需求到候选 Type

| 客户任务 | 先进入的产品族 | 候选Type范围 | 必问工况 | 排除方向 |
|---|---|---|---|---|
| 无菌液路隔离 | 过程与控制阀 > 卫生/隔膜阀 | 2030–2036、2103–2106 | 介质、DN、阀体结构、Ra、膜片、连接、CIP/SIP、排空、认证 | 普通电磁阀或非卫生过程阀 |
| WFI/PW流量监控 | 传感器 > 流量 | 8098及适用的电磁/机械/超声流量Type | 介质电导率、气泡、口径、量程、精度、安装、卫生连接、校准 | 未满足介质或安装条件的测量原理 |
| 发酵气体配比 | MFC/MFM | 8700–8756当前在售相关Type | 气体、标况、量程、入口压力、精度、响应、校准、通信 | 只测量的MFM不能替代闭环MFC |
| 设备气动自动化 | 气动与过程接口 | 8640、8644、8650、8652及远程I/O | 阀位、气量、气源分区、协议、诊断、冗余、防爆 | 容量、流量或协议不匹配的阀岛 |
| CIP/SIP公用工程 | 过程阀/电磁阀/传感器 | 按蒸汽、冷凝水、清洗液和风险等级组合 | 介质、温压、压差、水锤、失效位、寿命、维护 | 把卫生主工艺规格一刀切套用到全部辅助阀 |
| 实验室精密定量 | 微流体/比例阀/流量控制 | 6624、6650、6712、6724、7604、7615等 | 体积、压力、介质、死体积、响应、重复性、寿命 | 用工厂级过程阀替代仪器微流体器件 |

## 4. 相邻产品不可互换边界

- **电磁阀 vs 过程阀：** 电磁阀适合紧凑快速切换；过程阀承担更大通径、复杂工况和卫生/调节任务。
- **卫生隔膜阀 vs 隔离膜片电磁阀：** 两者都有膜片，但阀体尺度、卫生设计、排空、连接、认证和应用风险完全不同。
- **开关阀 vs 调节阀：** 开关阀验证可靠启闭；调节阀还需评价阀特性、可调比、迟滞、定位和闭环稳定性。
- **MFM vs MFC：** MFM只测量；MFC集成调节元件并跟踪设定值。
- **热式MFC vs 科里奥利MFC：** 热式通常针对已知气体并依赖气体特性；科里奥利直接测质量且可同时获得密度/温度，但成本和结构不同。
- **阀岛 vs 单阀：** 阀岛整合气路、I/O、诊断和网络；单阀适合分散或少量控制点。
- **现场控制头 vs 控制柜阀岛：** 控制头靠近过程阀、布线直观；集中阀岛便于维护和气源管理，选择取决于设备布局与验证策略。
- **微流体阀 vs 一次性生物工艺阀：** 微流体阀服务仪器小体积流路；一次性阀强调预灭菌接液组件、换批和污染控制。

## 5. 完整 Type 产品树

### 5.1 电磁阀

**产品角色：** 使用电磁力直接或先导切换流路，覆盖通用介质、隔离介质、气动控制和特殊工况。

**客户任务：** 快速开关；介质隔离；气路先导；设备内部流路；安全切断。

**关键选型变量：** 通路；作用原理；介质；通径/Kv；压差；温度；阀体与密封；连接；电压；功耗；防爆。

**排除与边界：** 不能把普通隔离膜片电磁阀直接等同于卫生级过程隔膜阀；先导式阀通常需要最低压差。

#### Accessories > Cable Plugs

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| 1054 | 电缆插头 | Cable Plugs | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/1054) |
| 2503 | 用于 6712 和 6724 型静音阀的设备插口 | Cable Plugs | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/2503) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds2503-standard-eu-en.pdf?id=DTS0000000000000001000410571ENG) |
| 2504 | 只与 6650 一起销售！没有单独的数据页！ | Cable Plugs | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/2504) |
| 2505 | 适合 Bürkert 小型电磁阀的 10 mm 设备插口 | Cable Plugs | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/2505) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds2505-standard-eu-en.pdf?id=DTS0000000000000001000274823ENG) |
| 2506 | 插头形状 C | Cable Plugs | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/2506) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds2506-standard-eu-en.pdf?id=DTS0000000000000001000010985ENF) |
| 2507 | 工业标准设备插口 – B 型插头 | Cable Plugs | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/2507) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds2507-standard-eu-en.pdf?id=DTS0000000000000001000010986ENN) |
| 2508 | 插头形状 A | Cable Plugs | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/2508) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds2508-standard-eu-en.pdf?id=DTS0000000000000001000010987ENL) |
| 2509 | 设备插口，A 型插头，符合 DIN EN 175301-803 | Cable Plugs | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/2509) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds2509-standard-eu-en.pdf?id=DTS0000000000000001000010988ENK) |
| 2510 | 设备插口 AS 接口，C 型 | Cable Plugs | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/2510) |
| 2511 | 插头形状 A | Cable Plugs | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/2511) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds2511-highpower-eu-en.pdf?id=DTS0000000000000001000097035ENH) |
| 2513 | 符合 DIN EN 175301-803 A 型的设备插座 | Cable Plugs | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/2513) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds2513-standard-eu-en.pdf?id=DTS0000000000000001000219551ENH) |
| 2516 | 设备插口 DIN EN 175301-803 – C 型插头 | Cable Plugs | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/2516) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds2516-standard-eu-en.pdf?id=DTS0000000000000001000326278ENK) |
| 2518 | 设备插口 DIN EN 175301-803 A 型插头 | Cable Plugs | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/2518) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds2518-standard-eu-en.pdf?id=DTS0000000000000001000386347ENI) |

#### Accessories > Coils

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| AC07 | 盘 | Coils | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/AC07) |
| AC10 | 磁性线圈 | Coils | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/AC10) |
| AC19 | 线圈 | Coils | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/AC19) |

#### Accessories > Timers

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| 1077 | 显示和编程模块 | Timers | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/1077) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds1077-2-eu-en.pdf?id=DTS0000000000000001000010951ENA) |
| 1078 | 适合电磁阀的时间控制装置 | Timers | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/1078) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds1078-mechanical-eu-en.pdf?id=DTS0000000000000001000010952ENE) |
| 1087 | 定时器 | Timers | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/1087) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds1087-standard-eu-en.pdf?id=DTS0000000000000001000391602ENI) |

#### General Purpose 2/2 Solenoids

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| 0117 | 二位二通隔膜柱塞式电磁阀 | General Purpose 2/2 Solenoids | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/0117) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds0117-standard-eu-en.pdf?id=DTS0000000000000001000010903ENK) |
| 0121 | 直动式两位两通或二位三通枢轴电枢阀 | General Purpose 2/2 Solenoids | LOW | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/0121) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds0121-standard-eu-en.pdf?id=DTS0000000000000001000010904ENS) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds0121-standard-cn-zh.pdf?id=DTS0000000000000001000721755ZH-) |
| 0127 | 二位二通或二位三通摇臂隔膜式电磁阀 | General Purpose 2/2 Solenoids | LOW | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/0127) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds0127-standard-eu-en.pdf?id=DTS0000000000000001000010906ENAA) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds0127-standard-cn-zh.pdf?id=DTS0000000000000001000580056ZHG) |
| 0131 | 直动式二位二通或二位三通肘节阀 | General Purpose 2/2 Solenoids | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/0131) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds0131-standard-eu-en.pdf?id=DTS0000000000000001000010907ENR) |
| 0142 | 伺服控制式二位二通隔膜阀 | General Purpose 2/2 Solenoids | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/0142) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds0142-standard-eu-en.pdf?id=DTS0000000000000001000010909ENL) |
| 0200 | 直动式二位二通升降式衔铁阀 | General Purpose 2/2 Solenoids | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/0200) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds0200-standard-eu-en.pdf?id=DTS0000000000000001000010912ENA) |
| 0201 | 直动式二位二通升降式衔铁阀 | General Purpose 2/2 Solenoids | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/0201) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds0201-standard-eu-en.pdf?id=DTS0000000000000001000010915ENA) |
| 0211 | 直动式二位二通升降式衔铁阀 | General Purpose 2/2 Solenoids | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/0211) |
| 0212 | 直动式二位二通升降式衔铁阀 | General Purpose 2/2 Solenoids | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/0212) |
| 0243 | 直动式二位二通升降式衔铁阀 | General Purpose 2/2 Solenoids | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/0243) |
| 0253 | 二位二通电磁阀，直动式 | General Purpose 2/2 Solenoids | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/0253) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds0253-standard-eu-en.pdf?id=DTS0000000000000001000010916ENA) |
| 0256 | 二位二通电磁阀；直动式；适合中性介质 | General Purpose 2/2 Solenoids | LOW | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/0256) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds0256-standard-eu-en.pdf?id=DTS0000000000000001000010918ENK) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds0256-standard-cn-zh.pdf?id=DTS0000000000000001000659664ZHC) |
| 0280 | 伺服控制的二位二通隔膜阀 | General Purpose 2/2 Solenoids | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/0280) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds0280-standard-eu-en.pdf?id=DTS0000000000000001000010920ENA) |
| 0283 | 直动式二位二通升降式衔铁阀 | General Purpose 2/2 Solenoids | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/0283) |
| 0285 | 直动式二位二通升降式衔铁阀 | General Purpose 2/2 Solenoids | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/0285) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds0285-dvgw-eu-en.pdf?id=DTS0000000000000001000178266ENH) |
| 0286 | 直动式二位二通升降式衔铁阀 | General Purpose 2/2 Solenoids | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/0286) |
| 0287 | 用于中性介质的两位两通电磁阀 | General Purpose 2/2 Solenoids | LOW | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/0287) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds0287-standard-eu-en.pdf?id=DTS0000000000000001000551788ENC) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds0287-standard-cn-zh.pdf?id=DTS0000000000000001000713675ZHB) |
| 0290 | 伺服控制式两位两通隔膜阀 | General Purpose 2/2 Solenoids | LOW | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/0290) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds0290-standard-eu-en.pdf?id=DTS0000000000000001000024859ENZ) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds0290-standard-cn-zh.pdf?id=DTS0000000000000001000673542ZHB) |
| 0293 | 直动式二位二通升降式衔铁阀 | General Purpose 2/2 Solenoids | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/0293) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds0293-standard-eu-en.pdf?id=DTS0000000000000001000204244ENH) |
| 0330 | 直动式二位二通或二位三通枢轴电枢阀 | General Purpose 2/2 Solenoids | LOW | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/0330) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds0330-standard-eu-en.pdf?id=DTS0000000000000001000079488ENAJ) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds0330-standard-cn-zh.pdf?id=DTS0000000000000001000574583ZHG) |
| 0400 | 伺服控制的二位二通活塞阀 | General Purpose 2/2 Solenoids | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/0400) |
| 0404 | 伺服辅助式两位两通活塞电磁阀 | General Purpose 2/2 Solenoids | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/0404) |
| 0641 | 直动式二位二通升降式衔铁阀 | General Purpose 2/2 Solenoids | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/0641) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds0641-atexversion-eu-en.pdf?id=DTS0000000000000001000219035ENF) |
| 0643 | 直动式二位二通升降式衔铁阀 | General Purpose 2/2 Solenoids | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/0643) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds0643-0653atexv.-eu-en.pdf?id=DTS0000000000000001000219162ENA) |
| 0780 | 直动式二位三通旋启式衔铁阀 | General Purpose 2/2 Solenoids | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/0780) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds0780-eexed-eu-en.pdf?id=DTS0000000000000001000010947ENF) |
| 2200 | 直动式二位二通升降式衔铁阀 | General Purpose 2/2 Solenoids | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/2200) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds2200-standard-eu-en.pdf?id=DTS0000000000000001000104052EN-) |
| 5404 | 伺服控制式两位两通活塞阀 | General Purpose 2/2 Solenoids | LOW | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/5404) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds5404-standard-eu-en.pdf?id=DTS0000000000000001000011017ENAE) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds5404-standard-cn-zh.pdf?id=DTS0000000000000001000659455ZHB) |
| 5406 | 伺服控制的二位二通活塞阀 | General Purpose 2/2 Solenoids | LOW | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/5406) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds5406-ssv-eu-en.pdf?id=DTS0000000000000001000158188ENI) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds5406-ssv-cn-zh.pdf?id=DTS0000000000000001000391549ZHH) |
| 5407 | 直动式二位二通升降式衔铁阀 | General Purpose 2/2 Solenoids | LOW | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/5407) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds5407-ssv-eu-en.pdf?id=DTS0000000000000001000158193ENH) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds5407-ssv-cn-zh.pdf?id=DTS0000000000000001000391550ZHF) |
| 5686 | 二位二通电磁阀，伺服活塞 | General Purpose 2/2 Solenoids | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/5686) |
| 6011 | 直动式两位两通柱塞电磁阀 | General Purpose 2/2 Solenoids | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/6011) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds6011-standard-eu-en.pdf?id=DTS0000000000000001000011026ENU) |
| 6013 | 直动式二位二通柱塞阀 | General Purpose 2/2 Solenoids | LOW | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/6013) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds6013-standard-eu-en.pdf?id=DTS0000000000000001000011032ENAP) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds6013-standard-cn-zh.pdf?id=DTS0000000000000001000660444ZHF) |
| 6026 | 直动式隔离电磁阀 | General Purpose 2/2 Solenoids | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/6026) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds6026-standard-eu-en.pdf?id=DTS0000000000000001000395475ENL) |
| 6030 | 直动式两位两通电磁阀 | General Purpose 2/2 Solenoids | LOW | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/6030) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds6030-standard-eu-en.pdf?id=DTS0000000000000001000598018ENE) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds6030-standard-cn-zh.pdf?id=DTS0000000000000001000656758ZHF) |
| 6038 | 伺服控制的二位二通活塞阀 | General Purpose 2/2 Solenoids | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/6038) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds6038-standard-eu-en.pdf?id=DTS0000000000000001000011042ENF) |
| 6080 | Direct-acting 2/2-way plunger valve up to 900 bar | General Purpose 2/2 Solenoids | LOW | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/6080) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds6080-standard-eu-en.pdf?id=DTS0000000000000001000636664ENA) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds6080-standard-cn-zh.pdf?id=DTS0000000000000001000656730ZHB) |
| 6106 | 两位两通和两位三通气动摆动电磁阀 | General Purpose 2/2 Solenoids | LOW | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/6106) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds6106-standard-eu-en.pdf?id=DTS0000000000000001000011046ENL) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds6106-standard-cn-zh.pdf?id=DTS0000000000000001000659460ZHC) |
| 6211 | 伺服控制的二位二通隔膜阀 | General Purpose 2/2 Solenoids | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/6211) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds6211-standard-eu-en.pdf?id=DTS0000000000000001000011051ENN) |
| 6221 | 伺服控制的二位二通活塞阀 | General Purpose 2/2 Solenoids | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/6221) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds6221-standard-eu-en.pdf?id=DTS0000000000000001000011056ENC) |
| 6222 | 伺服控制的二位二通隔膜阀 | General Purpose 2/2 Solenoids | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/6222) |
| 6227 | 伺服控制的二位二通隔膜阀块 | General Purpose 2/2 Solenoids | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/6227) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds6227-standard-eu-en.pdf?id=DTS0000000000000001000011058ENA) |
| 6228 | 伺服控制的二位二通隔膜阀 | General Purpose 2/2 Solenoids | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/6228) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds6228-standard-eu-en.pdf?id=DTS0000000000000001000011059ENJ) |
| 6281 | 伺服控制式两位两通隔膜阀 | General Purpose 2/2 Solenoids | LOW | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/6281) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds6281-evstandard-eu-en.pdf?id=DTS0000000000000001000152082ENT) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds6281-evstandard-cn-zh.pdf?id=DTS0000000000000001000391552ZHE) |
| 6407 | 伺服辅助式二位二通活塞阀 | General Purpose 2/2 Solenoids | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/6407) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds6407-standard-eu-en.pdf?id=DTS0000000000000001000348453ENL) |
| 6440 | 伺服控制式二位二通活塞阀 | General Purpose 2/2 Solenoids | LOW | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/6440) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds6440-standard-eu-en.pdf?id=DTS0000000000000001000578533ENL) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds6440-standard-cn-zh.pdf?id=DTS0000000000000001000632932ZHB) |
| 6480 | Servo-assisted 2/2-way piston valve up to 1000 bar | General Purpose 2/2 Solenoids | LOW | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/6480) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds6480-standard-eu-en.pdf?id=DTS0000000000000001000636667ENA) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds6480-standard-cn-zh.pdf?id=DTS0000000000000001000656734ZHA) |
| 6481 | Servo-assisted 2/2-way piston valve up to 450 bar | General Purpose 2/2 Solenoids | LOW | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/6481) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds6481-standard-eu-en.pdf?id=DTS0000000000000001000636672ENA) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds6481-standard-cn-zh.pdf?id=DTS0000000000000001000656737ZHA) |
| 6642 | 伺服控制的二位二通隔膜阀 | General Purpose 2/2 Solenoids | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/6642) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds6642-standard-eu-en.pdf?id=DTS0000000000000001000011074ENB) |
| 6732 | 介质隔离式二位二通静音阀 | General Purpose 2/2 Solenoids | LOW | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/6732) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds6732-standard-eu-en.pdf?id=DTS0000000000000001000692299EN-) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds6732-standard-cn-zh.pdf?id=DTS0000000000000001000713156ZH-) |
| 6757 | 带介质隔离功能的两位两通或两位三通静音阀 | General Purpose 2/2 Solenoids | LOW | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/6757) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds6757-standard-eu-en.pdf?id=DTS0000000000000001000551791ENE) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds6757-standard-cn-zh.pdf?id=DTS0000000000000001000719743ZHA) |
| 7011 | 直动式两通电磁阀 | General Purpose 2/2 Solenoids | LOW | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/7011) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds7011-standard-eu-en.pdf?id=DTS0000000000000001000446515ENL) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds7011-standard-cn-zh.pdf?id=DTS0000000000000001000676429ZHA) |
| 7015 | 直动式两位两通电磁阀 | General Purpose 2/2 Solenoids | LOW | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/7015) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds7015-standard-eu-en.pdf?id=DTS0000000000000001000579958ENH) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds7015-standard-cn-zh.pdf?id=DTS0000000000000001000616113ZHF) |
| 8820 | Modular solenoid valve manifolds | General Purpose 2/2 Solenoids | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/8820) |

#### General Purpose 3/2 Solenoids

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| 0125 | 直动式二位三通旋启式衔铁阀 | General Purpose 3/2 Solenoids | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/0125) |
| 0300 | 直动式二位三通升降式衔铁阀 | General Purpose 3/2 Solenoids | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/0300) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds0300-standard-eu-en.pdf?id=DTS0000000000000001000010921ENA) |
| 0301 | 直动式二位三通升降式衔铁阀 | General Purpose 3/2 Solenoids | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/0301) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds0301-standard-eu-en.pdf?id=DTS0000000000000001000010923ENA) |
| 0303 | 直动式二位三通升降式衔铁阀 | General Purpose 3/2 Solenoids | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/0303) |
| 0304 | 直动式二位三通升降式衔铁阀 | General Purpose 3/2 Solenoids | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/0304) |
| 0311 | 直动式二位三通升降式衔铁阀 | General Purpose 3/2 Solenoids | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/0311) |
| 0312 | 直动式二位三通升降式衔铁阀 | General Purpose 3/2 Solenoids | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/0312) |
| 0313 | 直动式二位三通升降式衔铁阀 | General Purpose 3/2 Solenoids | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/0313) |
| 0340 | 伺服辅助式两位三通活塞电磁阀 | General Purpose 3/2 Solenoids | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/0340) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds0340-standard-eu-en.pdf?id=DTS0000000000000001000010929ENJ) |
| 0341 | 外部控制的二位三通伺服活塞阀 | General Purpose 3/2 Solenoids | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/0341) |
| 0343 | 外部控制的二位三通伺服活塞阀 | General Purpose 3/2 Solenoids | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/0343) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds0343-standard-eu-en.pdf?id=DTS0000000000000001000219736ENC) |
| 0344 | 伺服辅助式两位三通活塞电磁阀 | General Purpose 3/2 Solenoids | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/0344) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds0344-standard-eu-en.pdf?id=DTS0000000000000001000010930ENH) |
| 0644 | 直动式二位二通升降式衔铁阀 | General Purpose 3/2 Solenoids | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/0644) |
| 6430 | 伺服控制式 2 位 3 通活塞阀 | General Purpose 3/2 Solenoids | LOW | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/6430) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds6430-standard-eu-en.pdf?id=DTS0000000000000001000395477ENG) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds6430-standard-cn-zh.pdf?id=DTS0000000000000001000720223ZH-) |
| 6724 | 二位二通或二位三通 Whisper Valve，介质隔离式 | General Purpose 3/2 Solenoids | LOW | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/6724) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds6724-standard-eu-en.pdf?id=DTS0000000000000001000262565ENY) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds6724-standard-cn-zh.pdf?id=DTS0000000000000001000409410ZHH) |
| 7012 | 直动式二位三通电磁阀 | General Purpose 3/2 Solenoids | LOW | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/7012) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds7012-standard-eu-en.pdf?id=DTS0000000000000001000446517ENN) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds7012-standard-cn-zh.pdf?id=DTS0000000000000001000682262ZHC) |
| 7016 | 直动式两位三通电磁阀 | General Purpose 3/2 Solenoids | LOW | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/7016) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds7016-standard-eu-en.pdf?id=DTS0000000000000001000579967ENG) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds7016-standard-cn-zh.pdf?id=DTS0000000000000001000616115ZHF) |
| 7017 | 带介质隔离功能的两位三通摇臂阀 | General Purpose 3/2 Solenoids | LOW | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/7017) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds7017-standard-eu-en.pdf?id=DTS0000000000000001000531617END) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds7017-standard-cn-zh.pdf?id=DTS0000000000000001000616116ZHE) |

#### High Pressure

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| 2400 | 伺服控制的二位二通活塞阀 | High Pressure | LOW | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/2400) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds2400-standard-eu-en.pdf?id=DTS0000000000000001000148941ENC) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds2400-standard-cn-zh.pdf?id=DTS0000000000000001000357082ZHA) |
| 6027 | 直动式两位两通柱塞电磁阀 | High Pressure | LOW | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/6027) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds6027-standard-eu-en.pdf?id=DTS0000000000000001000089742ENAU) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds6027-standard-cn-zh.pdf?id=DTS0000000000000001000659410ZHC) |

#### Media Separated

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| 0124 | 直动式二位三通旋启式衔铁阀 | Media Separated | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/0124) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds0124-standard-eu-en.pdf?id=DTS0000000000000001000010905END) |
| 0788 | 直动式二位三通旋启式衔铁阀 | Media Separated | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/0788) |
| 0789 | 直动式二位三通旋启式衔铁阀 | Media Separated | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/0789) |
| 2610 | 直动式两位两通柱塞电磁阀 | Media Separated | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/2610) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds2610-standard-eu-en.pdf?id=DTS0000000000000001000215510ENB) |
| 5282 | 伺服辅助式二位二通隔膜阀 | Media Separated | LOW | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/5282) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds5282-standard-eu-en.pdf?id=DTS0000000000000001000011015ENX) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds5282-standard-cn-zh.pdf?id=DTS0000000000000001000550360ZHH) |
| 6126 | 二位二通和二位三通摇臂电磁阀，带有隔膜 | Media Separated | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/6126) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds6126-standard-eu-en.pdf?id=DTS0000000000000001000138746ENG) |
| 6212 | 伺服控制式二位二通隔膜阀 | Media Separated | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/6212) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds6212-standard-eu-en.pdf?id=DTS0000000000000001000011052ENJ) |
| 6624 | 二位二通和二位三通 Bürkert TwinPower 隔膜摇臂式电磁阀 | Media Separated | LOW | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/6624) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds6624-standard-eu-en.pdf?id=DTS0000000000000001000155774ENM) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds6624-twinpower-cn-zh.pdf?id=DTS0000000000000001000357146ZHH) |
| 6628 | 带隔离膜片的二位二通和二位三通 TwinPower 摇臂电磁阀 | Media Separated | LOW | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/6628) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds6628-standard-eu-en.pdf?id=DTS0000000000000001000170656ENN) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds6628-standard-cn-zh.pdf?id=DTS0000000000000001000658913ZHF) |
| 6650 | 带介质隔离功能的二位二通挡板式电磁阀 | Media Separated | LOW | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/6650) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds6650-standard-eu-en.pdf?id=DTS0000000000000001000105258ENT) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds6650-standard-cn-zh.pdf?id=DTS0000000000000001000656610ZHB) |
| 6712 | 二位二通静音阀，介质隔离式 | Media Separated | LOW | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/6712) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds6712-standard-eu-en.pdf2?id=DTS0000000000000001000243413ENQ) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds6712-standard-cn-zh.pdf?id=DTS0000000000000001000357100ZHK) |

#### Steam Solenoid Valves

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| 0255 | 直动式二位二通升降式衔铁阀 | Steam Solenoid Valves | LOW | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/0255) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds0255-standard-eu-en.pdf?id=DTS0000000000000001000010917ENS) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds0255-standard-cn-zh.pdf?id=DTS0000000000000001000721768ZH-) |
| 0355 | 直动式二位三通升降式衔铁阀 | Steam Solenoid Valves | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/0355) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds0355-standard-eu-en.pdf?id=DTS0000000000000001000010931ENM) |
| 0406 | 伺服控制的二位二通活塞阀 | Steam Solenoid Valves | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/0406) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds0406-standard-eu-en.pdf?id=DTS0000000000000001000010932END) |
| 0407 | 伺服控制的二位二通活塞阀 | Steam Solenoid Valves | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/0407) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds0407-standard-eu-en.pdf?id=DTS0000000000000001000010933END) |
| 6240 | 伺服辅助式两位两通活塞电磁阀 | Steam Solenoid Valves | LOW | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/6240) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds6240-standard-eu-en.pdf?id=DTS0000000000000001000089730ENAJ) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds6240-standard-cn-zh.pdf?id=DTS0000000000000001000659409ZHC) |

#### Water Solenoid Valves

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| 5281 | 伺服控制的二位二通隔膜阀 | Water Solenoid Valves | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/5281) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds5281-atexversion-eu-en.pdf?id=DTS0000000000000001000219039ENB) |
| 6213 | 伺服控制式两位两通隔膜阀 | Water Solenoid Valves | LOW | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/6213) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds6213-standard-eu-en.pdf?id=DTS0000000000000001000115690ENAI) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds6213-standard-cn-zh.pdf?id=DTS0000000000000001000659462ZHC) |

### 5.2 过程与控制阀

**产品角色：** 承担工业及卫生过程中的隔离、切换和连续调节，是制药主工艺竞争的核心产品族。

**客户任务：** 无菌隔离；CIP/SIP；罐底与T型流路；蒸汽/公用工程；流量调节；多通阀块。

**关键选型变量：** 阀体结构；DN；Kv；材质；Ra；膜片/阀座；连接；压温；排空；执行器；反馈/定位；认证。

**排除与边界：** 卫生主工艺阀、普通角座阀和公用工程阀风险等级不同；单阀与多通阀块不能按阀位数量简单换算。

#### Accessories > Diaphragms

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| SV01 | 隔膜 | Diaphragms | HIGH | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/SV01) |
| SV02 | 隔膜 | Diaphragms | HIGH | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/SV02) |

#### Accessories > Position Feedback

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| 1060 | 适用于气动过程阀的位置反馈器 | Position Feedback | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/1060) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds1060-standard-eu-en.pdf?id=DTS0000000000000001000282018END) |
| 1061 | 适用于气动摆动执行机构的位置反馈器 | Position Feedback | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/1061) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds1061-standard-eu-en.pdf?id=DTS0000000000000001000275088ENT) |
| TEU001 | 用于气动回转执行机构的附件 | Position Feedback | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/TEU001) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/dsteu001-various-eu-en.pdf?id=DTS0000000000000001000173856ENI) |
| TEU002 | 用于气动回转执行机构的附件 | Position Feedback | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/TEU002) |
| TEU003 | 用于气动回转执行机构的附件 | Position Feedback | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/TEU003) |
| TEU004 | 用于气动回转执行机构的附件 | Position Feedback | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/TEU004) |

#### Accessories > Silencers / Mufflers

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| TVG006 | 消音器 | Silencers / Mufflers | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/TVG006) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/dstvg006-standrad-eu-en.pdf?id=DTS0000000000000001000253751ENG) |

#### Control Valves > Angle Seat Valves > Electromotive

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| 3360 | 二通电动角座型调节阀 | Electromotive | HIGH | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/3360) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds3360-standard-eu-en.pdf?id=DTS0000000000000001000273502ENAI) |

#### Control Valves > Angle Seat Valves > Manual

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| 2960 | 手动操作二通斜座调节阀 | Manual | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/2960) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds2960-standard-eu-en.pdf?id=DTS0000000000000001000597486ENG) |

#### Control Valves > Angle Seat Valves > Pneumatic

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| 2300 | 气动控制的二通角座调节阀 ELEMENT | Pneumatic | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/2300) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds2300-standard-eu-en.pdf?id=DTS0000000000000001000475061ENL) |
| 2702 | 手动操作二通斜座调节阀 | Pneumatic | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/2702) |

#### Control Valves > Ball Valves > Actuators

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| 2050 | 单作用和双作用的气动旋转执行机构 | Actuators | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/2050) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds2050-standard-eu-en.pdf?id=DTS0000000000000001000096374END) |
| 2051 | 气动摆动执行机构 | Actuators | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/2051) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds2051-standard-eu-en.pdf?id=DTS0000000000000001000104926ENS) |
| 3003 | 电动旋转执行机构 - 打开/关闭或调节执行机构 | Actuators | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/3003) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds3003-ps-eu-en.pdf?id=DTS0000000000000001000361794ENC) |

#### Control Valves > Ball Valves > Electromotive

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| 0248 | 电动球阀 | Electromotive | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/0248) |
| 8804 | 带有电动旋转执行机构的球阀/截止阀 | Electromotive | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/8804) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8804-plastic-eu-en.pdf?id=DTS0000000000000001000089995ENN) |

#### Control Valves > Ball Valves > Manual

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| 2657 | 球阀，手动操作，塑料外壳 | Manual | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/2657) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds2657-standard-eu-en.pdf?id=DTS0000000000000001000090181ENN) |
| TKU001 | 二位二通紧凑型法兰球阀，DN15-DN150 | Manual | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/TKU001) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/dstku001-flange-eu-en.pdf?id=DTS0000000000000001000112284ENP) |
| TKU003 | 带 T 形孔的二位三通球阀 | Manual | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/TKU003) |

#### Control Valves > Ball Valves > Pneumatic

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| 2651 | 二位二通和二位三通球阀，由两部分构成。 | Pneumatic | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/2651) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds2651-flange-eu-en.pdf?id=DTS0000000000000001000361184ENF) |
| 2652 | 带有气动旋转执行机构的二位二通球阀，由两部分和三部分构成的不锈钢外壳 | Pneumatic | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/2652) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds2652-standard-eu-en.pdf?id=DTS0000000000000001000110785ENM) |
| 2654 | 二位二通球阀由三部分构成 | Pneumatic | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/2654) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds2654-hygienic-eu-en.pdf?id=DTS0000000000000001000243919ENQ) |
| 8805 | 带有气动旋转执行机构的球阀/蝶阀 | Pneumatic | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/8805) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8805-standard-eu-en.pdf?id=DTS0000000000000001000109493ENT) |

#### Control Valves > Butterfly Valves

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| 2671 | 二位二通截止阀 | Butterfly Valves | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/2671) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds2671-centric-eu-en.pdf?id=DTS0000000000000001000205027ENM) |
| 2672 | 带有气动旋转执行机构的二位二通截止阀 | Butterfly Valves | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/2672) |
| 2674 | 塑料蝶阀 | Butterfly Valves | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/2674) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds2674-standard-eu-en.pdf?id=DTS0000000000000001000302674ENG) |

#### Control Valves > Diaphragm Valves

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| 2730 | 带有塑料制成的气动位置调节驱动器的二位二通隔膜阀（CLASSIC 型） | Diaphragm Valves | HIGH | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/2730) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds2730-classic-eu-en.pdf?id=DTS0000000000000001000490461ENF) |
| 2731 | 带有塑料制成的气动位置调节驱动器的二位二通隔膜阀（CLASSIC 型） | Diaphragm Valves | HIGH | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/2731) |
| 2732 | 气动操作的无死角 T 型阀，不锈钢一体式外壳。可组合成 Continuous Classic 系统，型号 8802-DE | Diaphragm Valves | HIGH | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/2732) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds2732-standard-eu-en.pdf?id=DTS0000000000000001000140454ENG) |
| 3363 | 电动两通隔膜阀-调节阀 | Diaphragm Valves | HIGH | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/3363) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds3363-standard-eu-en.pdf?id=DTS0000000000000001000303711ENZ) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds3363-standard-cn-zh.pdf?id=DTS0000000000000001000670680ZHB) |
| 8802 | ELEMENT 连续调节阀系统概述 | Diaphragm Valves | HIGH | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/8802) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8802-elementsys-eu-en.pdf?id=DTS0000000000000001000123272ENM) |
| 8803 | 带有先导阀和反馈器的过程阀系统 | Diaphragm Valves | HIGH | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/8803) |

#### Control Valves > Disc Valves

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| 3285 | 电动两通直座比例阀 | Disc Valves | MEDIUM | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/3285) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds3285-standard-eu-en.pdf?id=DTS0000000000000001000256911ENAD) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds3285-standard-cn-zh.pdf?id=DTS0000000000000001000381481ZHJ) |

#### Control Valves > Globe Valves > Manual

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| 2961 | 手动二通直座控制阀 | Manual | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/2961) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds2961-standard-eu-en.pdf?id=DTS0000000000000001000597490ENF) |

#### Control Valves > Globe Valves > Pneumatic

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| 2301 | 气动操作的两通截止型调节阀 ELEMENT 系列 | Pneumatic | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/2301) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds2301-standard-eu-en.pdf?id=DTS0000000000000001000112693ENAR) |
| 2380 | 卫生型两通波纹管调节阀 | Pneumatic | HIGH | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/2380) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds2380-datasheet-eu-en.pdf?id=DTS0000000000000001000274158ENK) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds2380-datasheet-cn-zh.pdf?id=DTS0000000000000001000562440ZHD) |
| 2712 | 气动二通直座控制阀 | Pneumatic | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/2712) |

#### Control Valves > Positioners / Process Controllers > ELEMENT Positioner / Process Controllers

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| 8693 | 适用于集成安装到过程控制阀上的数字式电动气动过程控制器 | ELEMENT Positioner / Process Controllers | HIGH | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/8693) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8693-standard-eu-en.pdf?id=DTS0000000000000001000110929ENAE) |
| 8696 | 适用于集成安装到过程控制阀上的数字式电动气动位置调节器 | ELEMENT Positioner / Process Controllers | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/8696) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8696-standard-eu-en.pdf?id=DTS0000000000000001000110889ENU) |

#### Control Valves > Positioners / Process Controllers > SideCONTROL

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| 8791 | SideControl BASIC 数字式电动气动定位器 | SideCONTROL | MEDIUM | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/8791) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8791-basic-eu-en.pdf?id=DTS0000000000000001000123308ENAC) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8791-standard-cn-zh.pdf2?id=DTS0000000000000001000671125ZHB) |
| 8792 | SideControl 数字式电动气动定位器 | SideCONTROL | MEDIUM | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/8792) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8792-standard-eu-en.pdf?id=DTS0000000000000001000121137ENAK) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8792-standard-cn-zh.pdf?id=DTS0000000000000001000669905ZHC) |

#### Hygienic / Pharma / Hydrogen / Speciality Process Valves > Bellows Valves

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| 2080 | 气动操作的二位二通阀，带有 PTFE 波纹管 | Bellows Valves | HIGH | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/2080) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds2080-inox-eu-en.pdf?id=DTS0000000000000001000526613END) |
| 3260 | Bellow sampling valve | Bellows Valves | HIGH | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/3260) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds3260-standard-eu-en.pdf?id=DTS0000000000000001000593994ENJ) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds3260-standard-cn-zh.pdf?id=DTS0000000000000001000667723ZHC) |

#### Hygienic / Pharma / Hydrogen / Speciality Process Valves > Pinch valve

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| 2707 | Hose pinch valve with pneumatic actuator | Pinch valve | HIGH | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/2707) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds2707-standard-eu-en.pdf?id=DTS0000000000000001000643724ENI) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds2707-standard-cn-zh.pdf?id=DTS0000000000000001000657233ZHG) |

#### Hygienic / Pharma / Hydrogen / Speciality Process Valves > Robolux / Multiport valve

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| 2035 | Robolux 多路多接头气动隔膜阀 | Robolux / Multiport valve | HIGH | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/2035) |
| 8685 | 可一体化安装于 Robolux 阀门 2036 型上的控制按钮和反馈按钮 | Robolux / Multiport valve | HIGH | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/8685) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8685-headrobolux-eu-en.pdf?id=DTS0000000000000001000216207ENH) |
| 8686 | 可一体化安装于 Robolux 阀门 2036 型上的控制按钮和反馈按钮 | Robolux / Multiport valve | HIGH | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/8686) |
| 8806 | 带有控制头和反馈头的 Robolux 多路多接头隔膜阀 | Robolux / Multiport valve | HIGH | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/8806) |

#### Hygienic / Pharma / Hydrogen / Speciality Process Valves > T-valves

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| 2064 | 带不锈钢气动驱动器的 T 型隔膜阀（INOX 型） | T-valves | HIGH | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/2064) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds2064-inox-eu-en.pdf?id=DTS0000000000000001000450610ENI) |
| 2934 | 带手动执行机构的 T 型隔膜阀 | T-valves | HIGH | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/2934) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds2934-manual-eu-en.pdf?id=DTS0000000000000001000584284ENI) |
| 3324 | 带有电气线性驱动装置（开/关）的塑料材质 T 形隔膜阀（EVA 型） | T-valves | HIGH | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/3324) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds3324-standard-eu-en.pdf?id=DTS0000000000000001000516529ENN) |
| 3364 | 带有电气线性驱动装置（位置调节器）的塑料材质 T 形隔膜阀（EVA 型） | T-valves | HIGH | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/3364) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds3364-standard-eu-en.pdf?id=DTS0000000000000001000516533ENL) |
| 8690 | 适用于 ELEMENT 过程阀离散自动化的气动控制装置 | T-valves | HIGH | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/8690) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8690-standard-eu-en.pdf?id=DTS0000000000000001000108879ENAC) |

#### Hygienic / Pharma / Hydrogen / Speciality Process Valves > Tank Bottom Valves

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| 2033 | 带气动塑料驱动器的罐底隔膜阀（CLASSIC 型） | Tank Bottom Valves | HIGH | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/2033) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds2033-classic-eu-en.pdf?id=DTS0000000000000001000450595ENM) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds2033-standard-cn-zh.pdf?id=DTS0000000000000001000672522ZHC) |
| 2065 | 带不锈钢气动驱动器的罐底隔膜阀（INOX 型） | Tank Bottom Valves | HIGH | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/2065) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds2065-inox-eu-en.pdf?id=DTS0000000000000001000450613ENJ) |
| 2105 | 带不锈钢气动驱动器（ELEMENT 型）的罐底隔膜阀，用于分散式自动化 | Tank Bottom Valves | HIGH | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/2105) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds2105-element-eu-en.pdf?id=DTS0000000000000001000450603ENJ) |
| 3235 | 带手动驱动器的罐底隔膜阀 | Tank Bottom Valves | HIGH | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/3235) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds3235-manual-eu-en.pdf?id=DTS0000000000000001000450621ENE) |
| 3325 | 带有电气线性驱动装置（开/关）的塑料材质罐底隔膜阀（EVA 型） | Tank Bottom Valves | HIGH | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/3325) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds3325-standard-eu-en.pdf?id=DTS0000000000000001000516531ENN) |
| 3365 | 带有电气线性驱动装置（位置调节器）的塑料材质罐底隔膜阀（EVA 型） | Tank Bottom Valves | HIGH | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/3365) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds3365-standard-eu-en.pdf?id=DTS0000000000000001000516536ENM) |

#### Process Valve Automation > Control

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| 8635 | 数字电动气动定位器：SideCONTROL 定位器 | Control | MEDIUM | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/8635) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8635-standard-eu-en.pdf2?id=DTS0000000000000001000019155ENU) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8635-standard-cn-zh.pdf?id=DTS0000000000000001000669167ZHA) |
| 8692 | 适用于集成加装到过程控制阀的数字电动气动式位置调节器 | Control | HIGH | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/8692) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8692-standard-eu-en.pdf?id=DTS0000000000000001000110876ENAG) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8692-standard-cn-zh.pdf?id=DTS0000000000000001000551311ZHB) |
| 8694 | 适用于集成安装到过程控制阀上的数字式电动气动位置调节器 | Control | MEDIUM | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/8694) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8694-standard-eu-en.pdf?id=DTS0000000000000001000110879ENX) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8694-standard-cn-zh.pdf?id=DTS0000000000000001000551315ZHC) |
| 8798 | 适用于气动操作的调节阀的远程传感器 | Control | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/8798) |

#### Process Valve Automation > External (Banjo) Pilots

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| 0331 | 直动式二位二通或二位三通枢轴电枢阀 | External (Banjo) Pilots | MEDIUM | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/0331) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds0331-standard-eu-en.pdf?id=DTS0000000000000001000010928ENAA) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds0331-standard-cn-zh.pdf?id=DTS0000000000000001000670650ZHF) |
| 6012 | 直动式两位三通柱塞电磁阀 | External (Banjo) Pilots | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/6012) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds6012-standard-eu-en.pdf?id=DTS0000000000000001000011028ENW) |

#### Process Valve Automation > ON/OFF

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| 8681 | 卫生级过程调节阀控制头 | ON/OFF | HIGH | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/8681) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8681-standard-eu-en.pdf?id=DTS0000000000000001000140628ENP) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8681-standard-cn-zh.pdf2?id=DTS0000000000000001000619150ZHC) |
| 8691 | 适用于 ELEMENT 过程阀离散自动化的控制头 | ON/OFF | HIGH | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/8691) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8691-standard-eu-en.pdf?id=DTS0000000000000001000110599ENAO) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8691-element-cn-zh.pdf?id=DTS0000000000000001000398576ZHG) |
| 8697 | 适用于 ELEMENT 过程阀离散自动化的气动控制装置 | ON/OFF | HIGH | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/8697) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8697-standard-eu-en.pdf?id=DTS0000000000000001000215412ENAA) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8697-standard-cn-zh.pdf?id=DTS0000000000000001000659466ZHD) |
| KK01 | 用于卫生型流程阀的配件 | ON/OFF | HIGH | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/KK01) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/dskk01-adaptersets-eu-en.pdf?id=DTS0000000000000001000184481ENAG) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/dskk01-adaptersets-cn-zh.pdf?id=DTS0000000000000001000398582ZHF) |

#### Process Valve Automation > Valve Islands

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| 8640 | 定制化的气动系统解决方案 | Valve Islands | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/8640) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8640-standard-eu-en.pdf?id=DTS0000000000000001000049870ENAC) |

#### Shut-off Valves (On/Off) > 3-Way Process Valves

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| 2006 | CLASSIC 两位三通气动座阀 | 3-Way Process Valves | MEDIUM | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/2006) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds2006-classic-eu-en.pdf?id=DTS0000000000000001000257612ENL) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds2006-classic-cn-zh.pdf?id=DTS0000000000000001000546232ZHC) |

#### Shut-off Valves (On/Off) > Angle Seat Valves > Manual

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| 2920 | 手动两位两通斜座阀 | Manual | MEDIUM | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/2920) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds2920-standard-eu-en.pdf?id=DTS0000000000000001000599138ENK) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds2920-standard-cn-zh.pdf?id=DTS0000000000000001000620292ZHF) |

#### Shut-off Valves (On/Off) > Angle Seat Valves > Pneumatic

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| 2000 | 气动二位二通 CLASSIC 座阀 | Pneumatic | MEDIUM | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/2000) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds2000-standard-eu-en.pdf?id=DTS0000000000000001000444947ENAD) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds2000-standard-cn-zh.pdf?id=DTS0000000000000001000357095ZHL) |
| 2060 | 配备不锈钢执行机构的两位两通气动角座阀 | Pneumatic | MEDIUM | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/2060) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds2060-standard-eu-en.pdf?id=DTS0000000000000001000290884ENW) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds2060-standard-cn-zh.pdf?id=DTS0000000000000001000666050ZHE) |
| 2100 | 适用于分散式自动化的 ELEMENT 气动二位二通斜座阀 | Pneumatic | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/2100) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds2100-standard-eu-en.pdf?id=DTS0000000000000001000496323ENT) |
| 8840 | 模块化过程阀节点 - 分配器和收集器 | Pneumatic | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/8840) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8840-standard-eu-en.pdf?id=DTS0000000000000001000338741ENI) |

#### Shut-off Valves (On/Off) > Ball Valves > Electromotive

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| 2664 | 带有电动执行机构的二位二通球阀 | Electromotive | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/2664) |

#### Shut-off Valves (On/Off) > Ball Valves > Manual

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| 2660 | 两分式两位两通或者两位三通黄铜球阀。 | Manual | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/2660) |
| TKU002 | 带 L 形孔的二位三通球阀 | Manual | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/TKU002) |
| TKU004 | 手动操作的球阀 | Manual | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/TKU004) |

#### Shut-off Valves (On/Off) > Ball Valves > Pneumatic

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| 2655 | 带有气动旋转执行机构的二位二通球阀，由三部分构成的不锈钢外壳 | Pneumatic | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/2655) |
| 2658 | 带有气动旋转执行机构的二位二通球阀；塑料外壳；DN 10-50 | Pneumatic | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/2658) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds2658-pneumatic-eu-en.pdf?id=DTS0000000000000001000021453ENL) |
| 3210 | 二位二通或二位三通球阀，气动控制 | Pneumatic | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/3210) |

#### Shut-off Valves (On/Off) > Ball Valves > Quarter Turn Actuators

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| 2052 | 气动摆动执行机构 | Quarter Turn Actuators | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/2052) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds2052-standard-eu-en.pdf?id=DTS0000000000000001000202407ENH) |
| 2053 | 气动摆动执行机构，用于球阀和截止阀的自动化控制 | Quarter Turn Actuators | HIGH | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/2053) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds2053-standard-eu-en.pdf?id=DTS0000000000000001000436877ENE) |
| 3004 | 防爆旋转执行机构 - 打开/关闭或调节执行机构 | Quarter Turn Actuators | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/3004) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds3004-eex-eu-en.pdf?id=DTS0000000000000001000097022ENX) |
| 3005 | 电动旋转执行机构 - 打开/关闭或调节执行机构 | Quarter Turn Actuators | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/3005) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds3005-ps-eu-en.pdf?id=DTS0000000000000001000532998ENC) |

#### Shut-off Valves (On/Off) > Diaphragm Valves > Manual

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| 2933 | 带手动执行机构的两位两通隔膜阀 | Manual | HIGH | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/2933) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds2933-manual-eu-en.pdf?id=DTS0000000000000001000570666ENO) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds2933-manual-cn-zh.pdf?id=DTS0000000000000001000620299ZHE) |
| 2935 | 带手动执行机构的罐底隔膜阀 | Manual | HIGH | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/2935) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds2935-manual-eu-en.pdf?id=DTS0000000000000001000584287ENK) |
| 2973 | 带手动执行机构的两位两通隔膜阀（全功能） | Manual | HIGH | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/2973) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds2973-manual-eu-en.pdf?id=DTS0000000000000001000597497END) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds2973-manual-cn-zh.pdf?id=DTS0000000000000001000613700ZHC) |
| 2974 | 带手动执行机构的 T 型隔膜阀（全功能） | Manual | HIGH | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/2974) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds2974-manual-eu-en.pdf?id=DTS0000000000000001000597499ENC) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds2974-manual-cn-zh.pdf?id=DTS0000000000000001000613717ZHC) |
| 2975 | 带手动执行机构的罐底隔膜阀（全功能） | Manual | HIGH | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/2975) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds2975-manual-eu-en.pdf?id=DTS0000000000000001000597501ENC) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds2975-manual-cn-zh.pdf?id=DTS0000000000000001000613728ZHD) |
| 3232 | 带手动操作执行机构的二位二通隔膜阀 | Manual | HIGH | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/3232) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds3232-manual-eu-en.pdf?id=DTS0000000000000001000450617ENH) |
| 3233 | 带手动驱动器的两位两通隔膜阀 | Manual | HIGH | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/3233) |
| 3234 | 带手动驱动器的 T 型隔膜阀 | Manual | HIGH | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/3234) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds3234-manual-eu-en.pdf?id=DTS0000000000000001000450619ENH) |
| 3236 | 多通路多接口隔膜阀，手动操作 | Manual | HIGH | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/3236) |

#### Shut-off Valves (On/Off) > Diaphragm Valves > Pneumatic

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| 2030 | 带气动塑料执行机构的二位二通隔膜阀（CLASSIC 型） | Pneumatic | HIGH | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/2030) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds2030-classic-eu-en.pdf?id=DTS0000000000000001000450587ENR) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds2030-classic-cn-zh.pdf?id=DTS0000000000000001000547355ZHC) |
| 2031 | 带气动塑料驱动器的两位两通隔膜阀（CLASSIC 型） | Pneumatic | HIGH | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/2031) |
| 2032 | 带气动塑料驱动器的 T 型隔膜阀（CLASSIC 型） | Pneumatic | HIGH | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/2032) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds2032-classic-eu-en.pdf?id=DTS0000000000000001000450589ENL) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds2032-standard-cn-zh.pdf?id=DTS0000000000000001000666047ZHD) |
| 2034 | 多功能阀组解决方案 | Pneumatic | HIGH | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/2034) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds2034-block-eu-en.pdf?id=DTS0000000000000001000213540ENP) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds2034-block-cn-zh.pdf?id=DTS0000000000000001000562422ZHF) |
| 2063 | 配备不锈钢气动执行机构的二位二通隔膜阀 (INOX 型) | Pneumatic | HIGH | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/2063) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds2063-inox-cn-zh.pdf?id=DTS0000000000000001000562434ZHH) |
| 2103 | 带不锈钢气动驱动器（ELEMENT 型）的二位二通隔膜阀，用于分散式自动化 | Pneumatic | HIGH | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/2103) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds2103-element-eu-en.pdf?id=DTS0000000000000001000450597ENS) |
| 2104 | 带不锈钢气动驱动器（ELEMENT 型）的 T 型隔膜阀，用于分散式自动化 | Pneumatic | HIGH | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/2104) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds2104-element-eu-en.pdf?id=DTS0000000000000001000450599ENL) |
| 3230 | 气动操作的二位二通隔膜阀，带有塑料外壳 | Pneumatic | HIGH | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/3230) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds3230-pneumatic-eu-en.pdf?id=DTS0000000000000001000020595ENJ) |
| 8801 | 带有离散自动化的 ELEMENT 开/关阀门系统概述 | Pneumatic | HIGH | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/8801) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8801-classicsys-eu-en.pdf?id=DTS0000000000000001000134189ENL) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8801-classic-cn-zh.pdf?id=DTS0000000000000001000669141ZHC) |

#### Shut-off Valves (On/Off) > Globe Valves > Manual

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| 2921 | 手动两位两通直座阀 | Manual | MEDIUM | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/2921) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds2921-standard-eu-en.pdf?id=DTS0000000000000001000599141ENF) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds2921-standard-cn-zh.pdf?id=DTS0000000000000001000620285ZHE) |

#### Shut-off Valves (On/Off) > Globe Valves > Pneumatic

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| 0262 | 气动操作的二位二通阀 | Pneumatic | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/0262) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds0262-standard-eu-en.pdf?id=DTS0000000000000001000010919ENJ) |
| 0263 | 气动操作的二位二通阀，带有隔膜 | Pneumatic | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/0263) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds0263-standard-eu-en.pdf?id=DTS0000000000000001000193675ENI) |
| 2002 | 气动操作的二位三通阀 | Pneumatic | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/2002) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds2002-32way-eu-en.pdf?id=DTS0000000000000001000010967ENJ) |
| 2012 | 气动操作的二位二通直座阀 | Pneumatic | MEDIUM | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/2012) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds2012-globevalve-eu-en.pdf?id=DTS0000000000000001000010970ENAR) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds2012-standard-cn-zh.pdf?id=DTS0000000000000001000546251ZHK) |
| 2101 | 适用于分散式自动化的 ELEMENT 气动二位二通直座阀 | Pneumatic | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/2101) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds2101-element-eu-en.pdf?id=DTS0000000000000001000112108ENAG) |
| 2106 | 气动操作的三通座阀 ELEMENT 系列 | Pneumatic | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/2106) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds2106-element-eu-en.pdf2?id=DTS0000000000000001000257617ENP) |
| 2111 | 用于离散自动化的气动两位两通直座阀 | Pneumatic | MEDIUM | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/2111) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds2111-on_off-eu-en.pdf?id=DTS0000000000000001000633108ENC) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds2111-on_off-cn-zh.pdf?id=DTS0000000000000001000656617ZHD) |
| 2121 | 用于离散自动化的气动两位两通直座阀 | Pneumatic | MEDIUM | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/2121) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds2121-on_off-eu-en.pdf?id=DTS0000000000000001000633110ENB) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds2121-on_off-cn-zh.pdf?id=DTS0000000000000001000656725ZHA) |

#### Shut-off Valves (On/Off) > Pneumatic Control

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| 6014 | 直动式两位三通柱塞电磁阀 | Pneumatic Control | MEDIUM | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/6014) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds6014-standard-eu-en.pdf?id=DTS0000000000000001000011035ENAA) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds6014-standard-cn-zh.pdf?id=DTS0000000000000001000660460ZHE) |
| 8695 | 适用于 ELEMENT 过程阀离散自动化的控制头 | Pneumatic Control | HIGH | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/8695) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8695-standard-eu-en.pdf?id=DTS0000000000000001000110880ENY) |

#### Shut-off Valves (On/Off) > Robolux (Multiport valves)

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| 2036 | Robolux 多通道组合隔膜阀，气动操作 | Robolux (Multiport valves) | HIGH | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/2036) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds2036-standard-eu-en.pdf?id=DTS0000000000000001000215411ENL) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds2036-standard-cn-zh.pdf?id=DTS0000000000000001000567894ZHC) |
| BUPLUS | Service, Maintenance and Commissioning | Robolux (Multiport valves) | HIGH | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/BUPLUS) |

### 5.3 电动阀

**产品角色：** 通过电动执行器完成开关或调节，适用于无压缩空气、低能耗或需要精确位置控制的场景。

**客户任务：** 去气源改造；精确定位；慢速/可控启闭；分散设备自动化。

**关键选型变量：** 阀型；推力/扭矩；速度；失效策略；供电；控制模式；通信；防护；占空比。

**排除与边界：** 断电保持、失效安全和调节性能必须逐型号确认，不能把电动执行简单视为气动执行的等价替代。

#### Angle Seat Valves > ON/OFF

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| 3320 | 电动二位二通斜座阀 | ON/OFF | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/3320) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds3320-standard-eu-en.pdf?id=DTS0000000000000001000295547ENAF) |

#### Diaphragm Valves > ON/OFF

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| 3323 | 电动二位二通隔膜阀（开/关） | ON/OFF | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/3323) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds3323-standard-eu-en.pdf?id=DTS0000000000000001000303513ENAB) |

#### Globe Valves > Control

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| 3280 | 电动两通直座比例阀 | Control | LOW | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/3280) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds3280-standard-eu-en.pdf?id=DTS0000000000000001000240084ENAK) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds3280-standard-cn-zh.pdf?id=DTS0000000000000001000381480ZHM) |
| 3281 | 电动两通直座比例阀 | Control | LOW | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/3281) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds3281-standard-eu-en.pdf?id=DTS0000000000000001000551384ENQ) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds3281-standard-cn-zh.pdf?id=DTS0000000000000001000659450ZHB) |
| 3361 | 电动二通直座控制阀 | Control | LOW | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/3361) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds3361-standard-eu-en.pdf?id=DTS0000000000000001000273772ENAF) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds3361-standard-cn-zh.pdf?id=DTS0000000000000001000576858ZHD) |

#### Globe Valves > ON/OFF

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| 3321 | 电动二位二通直座阀 | ON/OFF | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/3321) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds3321-standard-eu-en.pdf?id=DTS0000000000000001000295565ENZ) |

### 5.4 气动与过程接口

**产品角色：** 把控制系统与气动执行器连接起来，包括气动阀、阀岛、远程I/O、控制柜和气缸。

**客户任务：** 集中或分布式气动控制；设备标准化；诊断；减少布线；安全分区。

**关键选型变量：** 阀位；流量；气源；压力；模块数；协议；I/O；冗余；热插拔；防爆；柜体；环境等级。

**排除与边界：** 阀岛容量、气动流量和网络节点必须一起设计；产品具备协议不等于项目已具备冗余或验证。

#### Accessories > Double Check Valve

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| 0498 | 三位五通带双止回阀 | Double Check Valve | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/0498) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds0498-standard-eu-en.pdf?id=DTS0000000000000001000085808ENE) |

#### Accessories > Fittings and Push-ins

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| TVG002 | 插头连接器 | Fittings and Push-ins | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/TVG002) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/dstvg002-standard-eu-en.pdf?id=DTS0000000000000001000194965ENK) |
| TVG003 | 螺纹连接器 | Fittings and Push-ins | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/TVG003) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/dstvg003-standard-eu-en.pdf?id=DTS0000000000000001000112007ENJ) |

#### Accessories > Maintenance equipment and parts

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| TPM001 | 压缩空气用的保养设备 | Maintenance equipment and parts | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/TPM001) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/dstpm001-standard-eu-en.pdf?id=DTS0000000000000001000194817ENI) |

#### Accessories > Various Components

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| SV04 | 8652 型磨损零件套件气动阀 | Various Components | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/SV04) |
| SVVI | Spare part sets for Type 8640 / 8644 / 8647 / 8650 | Various Components | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/SVVI) |
| TVG007 | 适合气动系统的塑料软管 | Various Components | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/TVG007) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/dstvg007-standard-eu-en.pdf?id=DTS0000000000000001000185147ENI) |

#### Control Cabinets

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| 8614 | 卫生工艺环境的气动开关柜解决方案 | Control Cabinets | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/8614) |

#### Pneumatic Cylinder > Accessories

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| TBU001 | 气缸的固定件 | Accessories | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/TBU001) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/dstbu001-standard-eu-en.pdf?id=DTS0000000000000001000111834ENE) |
| TEU005 | 气缸开关 | Accessories | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/TEU005) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/dsteu005-standard-eu-en.pdf?id=DTS0000000000000001000110978ENH) |
| TEU007 | 极限值开关 | Accessories | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/TEU007) |

#### Pneumatic Cylinder > Double Acting

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| 0044 | 符合 ISO 标准的塑料材质气动缸 | Double Acting | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/0044) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds0044-standard-eu-en.pdf?id=DTS0000000000000001000268330ENK) |
| TZG001 | 气缸 | Double Acting | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/TZG001) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/dstzg001-standard-eu-en.pdf?id=DTS0000000000000001000268346END) |
| TZU002 | 气缸 ISO 15552 | Double Acting | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/TZU002) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/dstzu002-standard-eu-en.pdf?id=DTS0000000000000001000268348END) |

#### Pneumatic Cylinder > Single Acting

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| 0045 | 符合 ISO 标准的塑料材质气动缸 | Single Acting | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/0045) |

#### Pneumatic Valves > 3/2 way valves

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| 0450 | 二位三通和二位五通活塞滑阀 | 3/2 way valves | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/0450) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds0450-eexi-eu-en.pdf?id=DTS0000000000000001000010935ENA) |
| 0470 | 二位三通或二位四通电磁阀 | 3/2 way valves | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/0470) |
| 6115 | 二位三通压电阀，直动式，适合气动系统 | 3/2 way valves | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/6115) |
| 6510 | 用于气动装置的二位三通电磁阀 | 3/2 way valves | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/6510) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds6510-eex-eu-en.pdf?id=DTS0000000000000001000011061ENA) |
| 6516 | 适合气动系统的二位三通电磁阀 | 3/2 way valves | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/6516) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds6516-eexi-eu-en.pdf?id=DTS0000000000000001000011062ENB) |
| 6518 | 6518/6519 型先导电磁阀/阀组 | 3/2 way valves | MEDIUM | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/6518) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds6518-standard-eu-en.pdf?id=DTS0000000000000001000011064ENJ) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds6518-standard-cn-zh.pdf?id=DTS0000000000000001000670651ZHB) |
| 6521 | 二位三通阀门，伺服控制 | 3/2 way valves | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/6521) |
| 6524 | 用于气动装置的二位三通或 2 个二位三通电磁阀 | 3/2 way valves | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/6524) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds6524-standard-eu-en.pdf?id=DTS0000000000000001000021454ENS) |
| 6526 | 用于气动装置的二位三通电磁阀 | 3/2 way valves | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/6526) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds6526-standard-eu-en.pdf?id=DTS0000000000000001000019897ENJ) |

#### Pneumatic Valves > 4/2 way valves

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| 5420 | 适合气动系统的二位四通电磁阀 | 4/2 way valves | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/5420) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds5420-standard-ex-eu-en.pdf?id=DTS0000000000000001000011020ENN) |
| 5470 | 二位三通和二位四通气动电磁阀 | 4/2 way valves | MEDIUM | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/5470) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds5470-standard-eu-en.pdf?id=DTS0000000000000001000390870ENI) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds5470-standard-cn-zh.pdf?id=DTS0000000000000001000670337ZHB) |

#### Pneumatic Valves > 5/2 way valves

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| 6511 | 用于气动装置的二位五通电磁阀 | 5/2 way valves | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/6511) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds6511-standard-eu-en.pdf?id=DTS0000000000000001000135011ENF) |
| 6517 | 适合气动系统的二位五通电磁阀 | 5/2 way valves | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/6517) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds6517-asi-eu-en.pdf?id=DTS0000000000000001000011063ENA) |
| 6519 | 气动伺服控制式二位三通、二位五通或三位五通电磁阀 | 5/2 way valves | MEDIUM | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/6519) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds6519-standard-eu-en.pdf?id=DTS0000000000000001000011067ENZ) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds6519-standard-cn-zh.pdf?id=DTS0000000000000001000675097ZHB) |
| 6520 | 适合气动系统的二位三通和二位五通压电阀 | 5/2 way valves | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/6520) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds6520-namureexi-eu-en.pdf?id=DTS0000000000000001000011070ENB) |
| 6523 | 用于气动装置的压电式阀门 | 5/2 way valves | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/6523) |
| 6525 | 用于气动装置的二位五通电磁阀 | 5/2 way valves | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/6525) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds6525-standard-eu-en.pdf?id=DTS0000000000000001000021455ENQ) |
| 6527 | 用于气动装置的二位五通电磁阀 | 5/2 way valves | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/6527) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds6527-standard-eu-en.pdf?id=DTS0000000000000001000019898ENJ) |

#### Pneumatic Valves > 5/3 way valves

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| 0460 | 用于气动系统的两位五通脉冲电磁阀或者三位五通电磁阀 | 5/3 way valves | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/0460) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds0460-standard-eu-en.pdf?id=DTS0000000000000001000187175ENG) |
| 0461 | 用于气动系统的两位五通脉冲电磁阀和三位五通电磁阀 | 5/3 way valves | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/0461) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds0461-standard-eu-en.pdf?id=DTS0000000000000001000187176END) |

#### Valve Islands

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| 8644 | 气动自动化系统 AirLINE 阀岛 | Valve Islands | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/8644) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8644-wago-eu-en.pdf?id=DTS0000000000000001000011132ENX) |
| 8647 | AirLINE SP - 电动气动自动化系统 | Valve Islands | MEDIUM | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/8647) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8647-airline_sp-eu-en.pdf?id=DTS0000000000000001000324658ENW) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8647-airlinesp-cn-zh.pdf?id=DTS0000000000000001000391590ZHE) |
| 8650 | AirLINE Ex 电气自动化系统适用于危险区域 | Valve Islands | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/8650) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8650-standard-eu-en.pdf?id=DTS0000000000000001000089716ENU) |
| 8652 | AirLINE 阀岛──针对过程自动化进行优化 | Valve Islands | MEDIUM | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/8652) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8652-airline-eu-en.pdf?id=DTS0000000000000001000336890ENZ) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8652-airline-cn-zh.pdf?id=DTS0000000000000001000391593ZHH) |
| 8653 | AirLINE Field 阀岛 – 已针对流程自动化进行了优化 | Valve Islands | MEDIUM | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/8653) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8653-airline-eu-en.pdf?id=DTS0000000000000001000361033ENI) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8653-airline-cn-zh.pdf?id=DTS0000000000000001000567542ZHC) |
| MKRS | 为安全切断的冗余区块 | Valve Islands | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/MKRS) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/dsmkrs-standard-eu-en.pdf?id=DTS0000000000000001000285116ENF) |

### 5.5 传感器、变送器与控制器

**产品角色：** 覆盖流量、液位、压力、温度和液体分析，并提供显示、变送和闭环控制能力。

**客户任务：** WFI/PW监控；CIP介质识别；罐体测量；公用工程；水质分析；本地控制。

**关键选型变量：** 测量原理；介质；范围；精度；重复性；响应；接液材质；连接；安装条件；输出；校准；卫生认证。

**排除与边界：** 不同测量原理的适用介质和安装条件不同；不得只比较标称精度而忽略气泡、电导率、直管段或污染。

#### Armatures for Analysis Sensors

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| 8200 | 适用于分析探头的配件 | Armatures for Analysis Sensors | HIGH | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/8200) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8200-standard-eu-en.pdf?id=DTS0000000000000001000141421ENAB) |
| S022 | 适合 ELEMENT pH 和传导性电导率测量仪的接头 | Armatures for Analysis Sensors | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/S022) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/dss022-standard-eu-en.pdf?id=DTS0000000000000001000118437ENQ) |

#### Controllers / Transmitters

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| 8022 | 流量变送器/脉冲分配器 | Controllers / Transmitters | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/8022) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8022-standard-eu-en.pdf?id=DTS0000000000000001000156568ENI) |
| 8205 | 带有数字指示器的 pH 传送器或调节器 | Controllers / Transmitters | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/8205) |
| 8206 | 带有数字指示器的氧化还原电位传送器 | Controllers / Transmitters | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/8206) |
| 8285 | 适合测量 pH、ORP 和电导率的模块化分析传送器 | Controllers / Transmitters | HIGH | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/8285) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/DS8285-Standard-EU-EN.pdf?id=DTS0000000000000001000096130ENC) |
| 8611 | eCONTROL──通用控制器 | Controllers / Transmitters | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/8611) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8611-standard-eu-en.pdf?id=DTS0000000000000001000089169ENAB) |
| 8620 | mxCONTROL 多功能调节器 | Controllers / Transmitters | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/8620) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/DS8620-mxCONTROL-EU-EN.pdf?id=DTS0000000000000001000115642END) |
| 8761 | 电子压力控制器 (EPC) | Controllers / Transmitters | MEDIUM | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/8761) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8761-standard-eu-en.pdf?id=DTS0000000000000001000613078ENK) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8761-standard-cn-zh.pdf?id=DTS0000000000000001000664478ZHC) |

#### Flow > Differential pressure

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| 8084 | 差压流量计 | Differential pressure | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/8084) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8084-standard-eu-en.pdf?id=DTS0000000000000001000734965ENB) |
| 8708 | 液体流量测量仪 LFM Liquid Flow Meter | Differential pressure | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/8708) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8708-lfmstandard-eu-en.pdf?id=DTS0000000000000001000116975ENJ) |

#### Flow > Electromagnetic Flowmeter (EMF) > Inline EMF

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| 8050 | 紧凑型流量计 | Inline EMF | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/8050) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8050-standard-eu-en.pdf?id=DTS0000000000000001000540238ENH) |
| 8051 | 适合小流量的磁感应流量计 | Inline EMF | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/8051) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/DS8051-Low-flow-EU-EN.pdf2?id=DTS0000000000000001000101292ENR) |
| 8054 | 带中间法兰的磁感应流量计 | Inline EMF | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/8054) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/DS8054-G.purpose-EU-EN.pdf2?id=DTS0000000000000001000425130ENA) |
| 8055 | 带法兰的磁感应流量计 | Inline EMF | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/8055) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/DS8055-G.purpose-EU-EN.pdf2?id=DTS0000000000000001000101296ENR) |
| 8056 | 磁感应流量计，卫生工艺接口 | Inline EMF | HIGH | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/8056) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/DS8056-Sanitary-EU-EN.pdf2?id=DTS0000000000000001000101313ENP) |
| S051 | 电磁感应流量传感器，适用于小流量 | Inline EMF | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/S051) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/dss051-standard-eu-en.pdf?id=DTS0000000000000001000471655ENG) |
| S054 | 不带法兰的电磁感应流量传感器（中间法兰型号） | Inline EMF | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/S054) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/dss054-standard-eu-en.pdf?id=DTS0000000000000001000471658ENF) |
| S055 | 带法兰的电磁感应传感器 | Inline EMF | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/S055) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/dss055-standard-eu-en.pdf?id=DTS0000000000000001000471664ENK) |
| S056 | 带卫生型管道接口的电磁感应流量传感器 | Inline EMF | HIGH | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/S056) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/dss056-standard-eu-en.pdf?id=DTS0000000000000001000471725ENH) |
| SE58 | 用于电磁感应流量传感器的变送器 | Inline EMF | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/SE58) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/dsse58-standard-eu-en.pdf?id=DTS0000000000000001000463561ENI) |

#### Flow > Electromagnetic Flowmeter (EMF) > Insertion EMF

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| 8041 | 磁感应插入式流量计 | Insertion EMF | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/8041) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8041-standard-eu-en.pdf?id=DTS0000000000000001000021534ENY) |
| 8045 | 磁感应插入式流量计 | Insertion EMF | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/8045) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8045-standard-eu-en.pdf?id=DTS0000000000000001000011093ENAJ) |

#### Flow > FLOWave (SAW)

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| 8098 | FLOWave SAW 流量计 | FLOWave (SAW) | MEDIUM | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/8098) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8098-standard-eu-en.pdf?id=DTS0000000000000001000270652ENAE) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8098-standard-cn-zh.pdf?id=DTS0000000000000001000543016ZHE) |

#### Flow > Flow Fittings / Armature

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| 1500 | 用于流量或分析测量的 INSERTION 配件（参见 S020 型的数据页） | Flow Fittings / Armature | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/1500) |
| 1501 | 用于流量或分析测量的 INSERTION 配件（参见 S020 型的数据页） | Flow Fittings / Armature | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/1501) |
| S020 | 用于流量测量或分析测量的插入式接头 | Flow Fittings / Armature | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/S020) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/dss020-standard-eu-en.pdf?id=DTS0000000000000001000011768ENAW) |

#### Flow > Oval Gear (Positive Displacement)

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| 8070 | 管道式椭圆轮流量计 | Oval Gear (Positive Displacement) | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/8070) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/DS8070-Standard-EU-EN.pdf?id=DTS0000000000000001000049348ENH) |
| 8071 | 用于小流量的椭圆轮流量传感器 | Oval Gear (Positive Displacement) | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/8071) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8071-standard-eu-en.pdf?id=DTS0000000000000001000011095ENY) |
| 8072 | 带有显示器的椭圆齿轮流量测量仪 | Oval Gear (Positive Displacement) | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/8072) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/DS8072-standard-EU-EN.pdf?id=DTS0000000000000001000088139ENG) |
| 8075 | 带有显示器的椭圆齿轮流量测量仪 | Oval Gear (Positive Displacement) | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/8075) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/DS8075-Batch-EU-EN.pdf?id=DTS0000000000000001000129081ENE) |
| 8076 | 带有显示器的椭圆齿轮流量测量仪，ELEMENT 设计 | Oval Gear (Positive Displacement) | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/8076) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/DS8076-Standard-EU-EN.pdf?id=DTS0000000000000001000128713ENF) |
| 8077 | 用于小流量的椭圆轮流量传感器 | Oval Gear (Positive Displacement) | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/8077) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8077-standard-eu-en.pdf?id=DTS0000000000000001000282310ENK) |
| S070 | Inline 椭圆齿轮传感器 | Oval Gear (Positive Displacement) | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/S070) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/DSS070-Standard-EU-EN.pdf2?id=DTS0000000000000001000011140ENO) |
| S077 | 带椭圆轮（基于位移原理）的管内传感器接头，用于流量测量 | Oval Gear (Positive Displacement) | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/S077) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/dss077-standard-eu-en.pdf?id=DTS0000000000000001000282306ENJ) |

#### Flow > Paddle Wheel > Inline

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| 8011 | 适合持续测量的 Inline 叶轮式流量传感器 | Inline | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/8011) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/DS8011-standard-EU-EN.pdf?id=DTS0000000000000001000102447ENS) |
| 8012 | 适用于持续测量的涡轮式流量计 | Inline | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/8012) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8012-standard-eu-en.pdf?id=DTS0000000000000001000083708ENAI) |
| 8030 | 适用于持续测量的管内流量计 | Inline | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/8030) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8030-standard-eu-en.pdf?id=DTS0000000000000001000011081ENAG) |
| 8032 | 管道式涡轮流量计 | Inline | MEDIUM | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/8032) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8032-standard-eu-en.pdf?id=DTS0000000000000001000011084ENAB) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8032-standard-cn-zh.pdf2?id=DTS0000000000000001000676318ZH-) |
| 8035 | 管道式涡轮流量计/管内定量设备 | Inline | MEDIUM | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/8035) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8035-standard-eu-en.pdf?id=DTS0000000000000001000011089ENX) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8035-standard-cn-zh.pdf?id=DTS0000000000000001000551200ZHC) |
| 8036 | 管道式涡轮流量计，ELEMENT 设计 | Inline | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/8036) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8036-standard-eu-en.pdf?id=DTS0000000000000001000128709ENV) |
| 8039 | Inline 叶轮式流量测量仪，光学信号检测 | Inline | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/8039) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/DS8039-Standard-EU-EN.pdf?id=DTS0000000000000001000011091ENO) |
| S010 | 带有环圈的 INLINE 传感器-配件 | Inline | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/S010) |
| S012 | 叶轮传感器配件 | Inline | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/S012) |
| S030 | 带集成叶轮的管内传感器接头，用于流量测量 | Inline | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/S030) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/dss030-standard-eu-en.pdf?id=DTS0000000000000001000011766ENAO) |
| S039 | 用于依据光学测量原理的变送器的 INLINE 传感器-配件（带叶轮） | Inline | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/S039) |

#### Flow > Paddle Wheel > Insertion

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| 8020 | 适用于持续测量的插入式涡轮流量计 | Insertion | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/8020) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8020-standard-eu-en.pdf?id=DTS0000000000000001000011076ENAA) |
| 8025 | 插入式流量测量设备/带涡轮和流量变送器的定量设备/远程定量设备 | Insertion | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/8025) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8025-standard-eu-en.pdf?id=DTS0000000000000001000011079ENAH) |
| 8026 | 插入式涡轮流量计，ELEMENT 设计 | Insertion | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/8026) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8026-standard-eu-en.pdf?id=DTS0000000000000001000128706ENT) |

#### Flow > Paddle Wheel > Low Flow

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| 8031 | 适合小流量的流量传感器 | Low Flow | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/8031) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8031-standard-eu-en.pdf?id=DTS0000000000000001000011083ENV) |

#### Flow > Rotameter

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| TAU003 | 浮子式流量测量仪 | Rotameter | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/TAU003) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/dstau003-tau003-eu-en.pdf?id=DTS0000000000000001000125972ENN) |

#### Flow > Switch / Flow

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| 8010 | Inline 叶轮式流量开关 | Switch / Flow | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/8010) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/DS8010-Standard-EU-EN.pdf?id=DTS0000000000000001000011075ENM) |
| TCQ001 | 流量控制开关 - 常开触点或常闭触点，可调节的开关点，很小的压力损失，适合液体 | Switch / Flow | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/TCQ001) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/dstcq001-standard-eu-en.pdf?id=DTS0000000000000001000364464ENC) |

#### Flow > Thermal mass flow meter

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| 8007 | 适合气体的流量测量仪，安装在现有的管道中 | Thermal mass flow meter | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/8007) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8007-bigflow-eu-en.pdf?id=DTS0000000000000001000195999ENQ) |
| 8008 | 适合气体的流量测量仪，带有集成式输入和输出管道 | Thermal mass flow meter | MEDIUM | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/8008) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8008-bigflow-eu-en.pdf?id=DTS0000000000000001000196002ENR) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8008-standard-cn-zh.pdf?id=DTS0000000000000001000666039ZHA) |
| 8700 | 气体质量流量计 (MFM) | Thermal mass flow meter | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/8700) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8700-standard-eu-en.pdf?id=DTS0000000000000001000095930ENK) |
| 8701 | 气体质量流量测量仪 (MFM) | Thermal mass flow meter | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/8701) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8701-standard-eu-en.pdf?id=DTS0000000000000001000019862ENT) |
| 8703 | 气体质量流量测量仪 (Mass Flow Meter) | Thermal mass flow meter | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/8703) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8703-standard-eu-en.pdf?id=DTS0000000000000001000085464ENL) |
| 8735 | 多通道-气体质量流量控制器（MFC）/气体质量流量计（MFM） | Thermal mass flow meter | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/8735) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8735-standard-eu-en.pdf?id=DTS0000000000000001000444910ENH) |
| 8742 | 气体质量流量控制器 (MFC)/气体质量流量计 (MFM) | Thermal mass flow meter | MEDIUM | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/8742) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8742-standard-eu-en.pdf?id=DTS0000000000000001000236628ENAJ) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8742-standard-cn-zh.pdf?id=DTS0000000000000001000391641ZHE) |
| 8743 | 气体质量流量控制器 (MFC)/气体质量流量计 (MFM) | Thermal mass flow meter | MEDIUM | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/8743) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8743-standard-eu-en.pdf?id=DTS0000000000000001000590606ENO) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8743-standard-cn-zh.pdf?id=DTS0000000000000001000618993ZHC) |

#### Flow > Transmitter

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| SE10 | 适用于 INLINE 传感器配件的变送器 | Transmitter | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/SE10) |
| SE11 | 带依据磁性测量原理的叶轮变送器，用于流量测量 | Transmitter | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/SE11) |
| SE12 | 带依据光学或磁性测量原理的叶轮变送器，用于流量测量 | Transmitter | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/SE12) |
| SE30 | Inline 叶轮式传送器 | Transmitter | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/SE30) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/dsse30-atex-eu-en.pdf?id=DTS0000000000000001000049988ENAC) |
| SE32 | 带有显示器的 Inline 叶轮式传送器 | Transmitter | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/SE32) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/dsse32-s077-eu-en.pdf?id=DTS0000000000000001000285898ENL) |
| SE35 | 适用于 INLINE 传感器配件的变送器或计量设备 | Transmitter | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/SE35) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/dsse35-s077-eu-en.pdf?id=DTS0000000000000001000285920ENJ) |
| SE36 | 配套于在线传感器的ELEMENT 变送器 | Transmitter | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/SE36) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/dsse36-s077-eu-en.pdf?id=DTS0000000000000001000285936ENO) |
| SE39 | 适合光学传送器的 Inline 叶轮式传送器 | Transmitter | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/SE39) |
| SE56 | 适合磁感式流量传感器的变送器 | Transmitter | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/SE56) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/DSSE56-Electronics-EU-EN.pdf2?id=DTS0000000000000001000101308ENT) |

#### Flow > Ultrasonic

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| 8081 | 适用于连续测量水流量的流量计 | Ultrasonic | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/8081) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8081-standard-eu-en.pdf?id=DTS0000000000000001000106406ENN) |

#### Level > Float

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| 8181 | 液位浮动开关 | Float | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/8181) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8181-standard-eu-en.pdf?id=DTS0000000000000001000612997ENB) |
| TCL001 | 简单的浮子开关 | Float | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/TCL001) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/dstcl001-standard-eu-en.pdf?id=DTS0000000000000001000110262ENK) |

#### Level > Guided Radar

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| 8185 | 液位测量仪，受控微波 | Guided Radar | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/8185) |
| 8186 | 液位测量仪，受控微波 | Guided Radar | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/8186) |
| 8188 | 带引导式微波的液位测量计 | Guided Radar | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/8188) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8188-standard-eu-en.pdf?id=DTS0000000000000001000244851ENO) |
| 8189 | 带引导式微波的液位测量计——无菌版本 | Guided Radar | HIGH | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/8189) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8189-standard-eu-en.pdf?id=DTS0000000000000001000244852ENJ) |

#### Level > Radar

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| 8131 | 用于液体和散装固体的雷达物位计 | Radar | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/8131) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8131-standard-eu-en.pdf?id=DTS0000000000000001000646693END) |
| 8140 | 雷达液位计，适用于具有腐蚀性介质和卫生要求的应用中的液体和松散物料 | Radar | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/8140) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8140-standard-eu-en.pdf?id=DTS0000000000000001000604793END) |

#### Level > Tuning Fork

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| 8110 | 音叉式液位开关 | Tuning Fork | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/8110) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8110-standard-eu-en.pdf?id=DTS0000000000000001000079485ENQ) |
| 8111 | 音叉式液位开关 | Tuning Fork | HIGH | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/8111) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8111-standard-eu-en.pdf?id=DTS0000000000000001000086887ENT) |
| 8112 | 带延长管音叉式液位开关 | Tuning Fork | HIGH | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/8112) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8112-standard-eu-en.pdf?id=DTS0000000000000001000086888ENS) |

#### Level > Ultrasonic

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| 8170 | 超声波液位传送器 | Ultrasonic | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/8170) |
| 8175 | 超声波液位传送器，无接触式 | Ultrasonic | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/8175) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/DS8175-Standard-EU-EN.pdf?id=DTS0000000000000001000011100ENJ) |
| 8176 | 超声波液位变送器 | Ultrasonic | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/8176) |
| 8178 | 超声波液位传送器 | Ultrasonic | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/8178) |

#### Liquid Analysis > Chlorine

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| 8232 | 氯传感器 | Chlorine | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/8232) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8232-standard-eu-en.pdf?id=DTS0000000000000001000231931ENO) |

#### Liquid Analysis > Conductivity

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| 8220 | 电导率传感器 | Conductivity | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/8220) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8220-standard-eu-en.pdf?id=DTS0000000000000001000141283ENS) |
| 8221 | 用于卫生级应用的电导率传感器 | Conductivity | HIGH | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/8221) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8221-standard-eu-en.pdf?id=DTS0000000000000001000096134ENX) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8221-standard-cn-zh.pdf?id=DTS0000000000000001000551201ZHD) |
| 8222 | 电导率测量仪，ELEMENT 设计 | Conductivity | MEDIUM | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/8222) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8222-standard-eu-en.pdf?id=DTS0000000000000001000114221ENW) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8222-standard-cn-zh.pdf?id=DTS0000000000000001000684450ZH-) |
| 8223 | 没有显示器的感应式电导率传送器 | Conductivity | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/8223) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/DS8223-Standard-EU-EN.pdf?id=DTS0000000000000001000011773ENK) |
| 8226 | 带有显示器的感应式电导率传送器 | Conductivity | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/8226) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/DS8226-Standard-EU-EN.pdf?id=DTS0000000000000001000011107ENI) |
| 8228 | 感应式电导率测量仪，ELEMENT 设计 | Conductivity | MEDIUM | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/8228) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8228-standard-eu-en.pdf?id=DTS0000000000000001000220089ENX) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8228-standard-cn-zh.pdf?id=DTS0000000000000001000603086ZHD) |

#### Liquid Analysis > Multichannel Systems

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| 8619 | multiCELL──多通道/多功能变送器/控制器 | Multichannel Systems | HIGH | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/8619) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8619-standard-eu-en.pdf?id=DTS0000000000000001000130448ENY) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8619-multicell-cn-zh.pdf?id=DTS0000000000000001000409428ZHE) |
| 8905 | 在线水分析系统 | Multichannel Systems | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/8905) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8905-standard-eu-en.pdf?id=DTS0000000000000001000220829ENP) |
| 8906 | 在线水分析系统 | Multichannel Systems | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/8906) |
| ME2X | 系统控制单元 | Multichannel Systems | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/ME2X) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/dsme2x-standard-eu-en.pdf?id=DTS0000000000000001000222225ENM) |
| MS01 | pH 值传感器立方体 | Multichannel Systems | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/MS01) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/dsms01-ph-eu-en.pdf?id=DTS0000000000000001000220806ENU) |
| MS02 | 氯 (Cl2) 或二氧化氯 (ClO2) 传感器立方体 | Multichannel Systems | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/MS02) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/dsms02-chlorine-eu-en.pdf?id=DTS0000000000000001000220807ENQ) |
| MS03 | 电导率传感器 | Multichannel Systems | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/MS03) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/dsms03-conductivity-eu-en.pdf?id=DTS0000000000000001000220809ENS) |
| MS04 | 氧化还原传感器立方体 | Multichannel Systems | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/MS04) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/dsms04-orp-eu-en.pdf?id=DTS0000000000000001000220810ENP) |
| MS05 | 浊度传感器立方体 | Multichannel Systems | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/MS05) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/dsms05-turbidity-eu-en.pdf?id=DTS0000000000000001000220812ENV) |
| MS06 | 用于溶解铁的 Sensor-Cube（传感器立方体） - 流动注射分析 | Multichannel Systems | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/MS06) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/dsms06-standard-eu-en.pdf?id=DTS0000000000000001000300813END) |

#### Liquid Analysis > Nitrate

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| MS09 | 硝酸盐传感器 | Nitrate | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/MS09) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/dsms09-standard-eu-en.pdf?id=DTS0000000000000001000529166ENE) |

#### Liquid Analysis > SAC254

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| MS08 | SAK 254 传感器 | SAC254 | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/MS08) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/dsms08-standard-eu-en.pdf?id=DTS0000000000000001000529163ENF) |

#### Liquid Analysis > pH / ORP

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| 8201 | 卫生型PH测量仪 | pH / ORP | HIGH | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/8201) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8201-standard-eu-en.pdf?id=DTS0000000000000001000075647ENAA) |
| 8202 | pH 或氧化还原电位变送器，ELEMENT 设计 | pH / ORP | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/8202) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8202-standard-eu-en.pdf?id=DTS0000000000000001000114206ENT) |
| 8203 | pH 和 O.R.P 探针 | pH / ORP | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/8203) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8203-standard-eu-en.pdf2?id=DTS0000000000000001000164699ENR) |

#### Pressure

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| 8312 | 带 CANopen 接口的压力变送器 | Pressure | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/8312) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8312-standard-eu-en.pdf?id=DTS0000000000000001000416947ENH) |
| 8314 | 压力传送器 - OEM | Pressure | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/8314) |
| 8316 | 压力测量设备 | Pressure | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/8316) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8316-standard-eu-en.pdf?id=DTS0000000000000001000182539ENL) |
| 8318 | 带 IO-Link 接口的压力变送器 | Pressure | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/8318) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8318-standard-eu-en.pdf?id=DTS0000000000000001000416952ENE) |
| 8323 | 压力变送器 | Pressure | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/8323) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8323-standard-eu-en.pdf?id=DTS0000000000000001000011112ENT) |
| 8325 | 用于所有应用的压力变送器，0-25 bar | Pressure | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/8325) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8325-standard-eu-en.pdf?id=DTS0000000000000001000356452ENK) |
| 8762 | 电子压力控制器 (EPC) | Pressure | MEDIUM | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/8762) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8762-standard-eu-en.pdf?id=DTS0000000000000001000613083ENI) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8762-standard-cn-zh.pdf?id=DTS0000000000000001000663677ZHA) |
| 8763 | 压力调节器，用于精确的压力时间计量 | Pressure | MEDIUM | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/8763) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8763-standard-eu-en.pdf?id=DTS0000000000000001000398869ENK) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8763-standard-cn-zh.pdf?id=DTS0000000000000001000583980ZHC) |
| 8880 | 模块化容器压力调节器 | Pressure | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/8880) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8880-standard-eu-en.pdf?id=DTS0000000000000001000681538ENK) |
| TAU001 | 弹簧管压力计，尾部和下部接口 | Pressure | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/TAU001) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/dstau001-standard-eu-en.pdf?id=DTS0000000000000001000110255ENF) |
| TCD001 | 适合中性气体和液体的压力开关 | Pressure | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/TCD001) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/dstcd001-standard-eu-en.pdf?id=DTS0000000000000001000264997ENF) |
| TFU006 | 水压力调节器 | Pressure | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/TFU006) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/dstfu006-standard-eu-en.pdf?id=DTS0000000000000001000118120ENO) |
| TSD001 | 压力传送器 | Pressure | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/TSD001) |

#### Temperature

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| 8412 | 带 CANopen 接口的 RTD 温度传感器 | Temperature | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/8412) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8412-standard-eu-en.pdf?id=DTS0000000000000001000416967ENG) |
| 8418 | 带 IO-Link 接口的 RTD 温度传感器 | Temperature | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/8418) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8418-standard-eu-en.pdf?id=DTS0000000000000001000416970ENE) |
| KE00 | 类型 KE00 | Temperature | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/KE00) |
| TST001 | 电子温度计 Pt100 | Temperature | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/TST001) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/dstst001-standard-eu-en.pdf?id=DTS0000000000000001000110274ENF) |

### 5.6 微流体产品与泵

**产品角色：** 面向实验室、分析和医疗设备的小型介质隔离阀、微泵和精密定量组件。

**客户任务：** 微量切换；试剂加注；样品处理；时间压力定量；紧凑仪器流路。

**关键选型变量：** 隔离方式；内部体积；死体积；介质兼容；压力；流量；响应；寿命；功耗；定量重复性。

**排除与边界：** 微流体器件和工厂级卫生过程阀不是同一尺度；一次性生物工艺阀也不等同于仪器微阀。

#### 2/2 and 3/2 way Micro Solenoids > Media Separated

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| 5550 | 带介质隔离功能的泄压阀 | Media Separated | MEDIUM | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/5550) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds5550-standard-eu-en.pdf?id=DTS0000000000000001000681585ENH) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds5550-standard-cn-zh.pdf?id=DTS0000000000000001000721767ZHB) |
| 6606 | 二位二通和二位三通摇臂电磁阀，带有隔膜 | Media Separated | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/6606) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds6606-standard-eu-en.pdf?id=DTS0000000000000001000011072ENO) |
| 6626 | 带隔离膜片的二位二通和二位三通 Bürkert TwinPower 摇臂电磁阀 | Media Separated | MEDIUM | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/6626) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds6626-standard-eu-en.pdf2?id=DTS0000000000000001000169436ENH) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds6626-standard-cn-zh.pdf?id=DTS0000000000000001000357145ZHB) |

#### 2/2 and 3/2 way Micro Solenoids > Not media separated

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| 0375 | 2 位 2 通或 2 位 3 通气动摇臂阀 | Not media separated | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/0375) |
| 6114 | 二位二通和二位三通 Flipper 电磁阀，带有介质分离 | Not media separated | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/6114) |
| 6144 | 二位三通挡板式电磁阀，直动式 | Not media separated | MEDIUM | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/6144) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds6144-standard-eu-en.pdf?id=DTS0000000000000001000090355ENP) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds6144-standard-cn-zh.pdf?id=DTS0000000000000001000357098ZHF) |
| 6164 | 两位三通气动式插装电磁阀 | Not media separated | MEDIUM | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/6164) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds6164-standard-eu-en.pdf?id=DTS0000000000000001000257619ENQ) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds6164-standard-cn-zh.pdf?id=DTS0000000000000001000658914ZHB) |

#### Membrane / Micro-dosing Pumps

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| 7604 | 适合持续输送的微型隔膜泵 | Membrane / Micro-dosing Pumps | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/7604) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds7604-standard-eu-en.pdf?id=DTS0000000000000001000011780ENN) |
| 7615 | 精确的微量（微升）滴定单元 | Membrane / Micro-dosing Pumps | MEDIUM | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/7615) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds7615-standard-eu-en.pdf?id=DTS0000000000000001000185431ENJ) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds7615-standard-cn-zh.pdf?id=DTS0000000000000001000673178ZHA) |

#### Time-Pressure Dosing

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| 5120 | 计量头和电子装置，可实现精确的压力-时间定量添加 | Time-Pressure Dosing | MEDIUM | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/5120) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds5120-standard-eu-en.pdf?id=DTS0000000000000001000681543ENA) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds5120-standard-cn-zh.pdf?id=DTS0000000000000001000683200ZHA) |

### 5.7 质量流量控制器与流量计

**产品角色：** 将流量传感、电子控制和调节阀组合，用于气体或液体的精确测量与闭环控制。

**客户任务：** 发酵供气；气体配比；实验室供气；液体精密定量；电子压力控制。

**关键选型变量：** 介质；标况；量程；精度定义；量程比；响应；入口压力；压降；阀座；校准；通信；洁净材料。

**排除与边界：** MFM只测量、MFC测量并控制；热式与科里奥利原理不可脱离介质和精度要求直接排名。

#### Gateway / I/O Modules

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| BPX3 | 背板系统连接 | Gateway / I/O Modules | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/BPX3) |
| ME43 | 现场总线网关 | Gateway / I/O Modules | MEDIUM | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/ME43) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/dsme43-standard-eu-en.pdf?id=DTS0000000000000001000328369ENU) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/dsme43-standard-cn-zh.pdf?id=DTS0000000000000001000391649ZHF) |
| ME44 | I/O 模块，IP20 | Gateway / I/O Modules | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/ME44) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/dsme44-iomodules-eu-en.pdf?id=DTS0000000000000001000353026ENR) |
| ME61 | EDIP 过程显示屏 | Gateway / I/O Modules | MEDIUM | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/ME61) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/dsme61-standard-eu-en.pdf?id=DTS0000000000000001000463135ENF) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/dsme61-standard-cn-zh.pdf?id=DTS0000000000000001000566166ZHD) |
| ME63 | 工业以太网网关，IP65/IP67/IP69k | Gateway / I/O Modules | MEDIUM | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/ME63) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/dsme63-standard-eu-en.pdf?id=DTS0000000000000001000438645ENJ) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/dsme63-standard-cn-zh.pdf?id=DTS0000000000000001000578866ZHB) |
| ME64 | I/O模块 IP65/IP67/IP69k | Gateway / I/O Modules | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/ME64) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/dsme64-standard-eu-en.pdf?id=DTS0000000000000001000438650ENJ) |
| ME66 | büS 分配箱，IP65/IP67/IP69k | Gateway / I/O Modules | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/ME66) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/dsme66-standard-eu-en.pdf?id=DTS0000000000000001000563115ENH) |

#### Liquid Flow Controllers

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| 8718 | 液体流量调节器 LFC Liquid Flow Controller | Liquid Flow Controllers | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/8718) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8718-lfcstandard-eu-en.pdf?id=DTS0000000000000001000116955ENK) |
| 8719 | 液体流量控制器 | Liquid Flow Controllers | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/8719) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8719-lfcstandard-eu-en.pdf?id=DTS0000000000000001000116762ENL) |
| 8752 | 液体流量控制器 (LFC) | Liquid Flow Controllers | MEDIUM | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/8752) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8752-standard-eu-en.pdf?id=DTS0000000000000001000667757ENH) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8752-standard-cn-zh.pdf?id=DTS0000000000000001000678846ZHC) |
| 8756 | 液体质量流量控制器 (MFC)/质量流量计 (MFM) | Liquid Flow Controllers | MEDIUM | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/8756) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8756-batch-eu-en.pdf?id=DTS0000000000000001000497674ENK) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8756-batch-cn-zh.pdf?id=DTS0000000000000001000686829ZH-) |

#### Liquid Flow Meters

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| 8709 | 液体流量测量仪 LFM Liquid Flow Meter | Liquid Flow Meters | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/8709) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8709-lfmstandard-eu-en.pdf?id=DTS0000000000000001000116945ENK) |

#### Mass Flow Controllers (Gas)

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| 8626 | 气体质量流量控制器 (MFC) | Mass Flow Controllers (Gas) | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/8626) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8626-standard-eu-en.pdf?id=DTS0000000000000001000011124ENW) |
| 8710 | 气体质量流量控制器 (MFC) | Mass Flow Controllers (Gas) | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/8710) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8710-standard-eu-en.pdf?id=DTS0000000000000001000095464ENK) |
| 8711 | 气体质量流量控制器 (MFC) | Mass Flow Controllers (Gas) | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/8711) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8711-standard-eu-en.pdf?id=DTS0000000000000001000017527ENP) |
| 8712 | 气体质量流量控制器 (MFC) | Mass Flow Controllers (Gas) | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/8712) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8712-standard-eu-en.pdf?id=DTS0000000000000001000011287ENU) |
| 8713 | 气体质量流量控制器 (MFC) | Mass Flow Controllers (Gas) | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/8713) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8713-standard-eu-en.pdf?id=DTS0000000000000001000085466ENI) |
| 8715 | 气体质量流量调节器 (Mass Flow Controller) | Mass Flow Controllers (Gas) | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/8715) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8715-standard-eu-en.pdf2?id=DTS0000000000000001000205028ENF) |
| 8716 | 气体质量流量调节器 (MFC) | Mass Flow Controllers (Gas) | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/8716) |
| 8744 | 气体质量流量控制器 (MFC)/气体质量流量计 (MFM) | Mass Flow Controllers (Gas) | MEDIUM | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/8744) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8744-standard-eu-en.pdf?id=DTS0000000000000001000592376ENJ) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8744-standard-cn-zh.pdf?id=DTS0000000000000001000618997ZHB) |
| 8745 | 气体质量流量控制器 (MFC)/气体质量流量计 (MFM) | Mass Flow Controllers (Gas) | MEDIUM | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/8745) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8745-standard-eu-en.pdf?id=DTS0000000000000001000338235ENW) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8745-standard-cn-zh.pdf?id=DTS0000000000000001000391643ZHG) |
| 8746 | 气体质量流量控制器 (MFC)/气体质量流量计 (MFM) | Mass Flow Controllers (Gas) | MEDIUM | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/8746) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8746-standard-eu-en.pdf?id=DTS0000000000000001000241027ENAF) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8746-standard-cn-zh.pdf?id=DTS0000000000000001000391644ZHF) |
| 8750 | 用于气体的流体流量调节器 | Mass Flow Controllers (Gas) | MEDIUM | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/8750) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8750-standard-eu-en.pdf2?id=DTS0000000000000001000089368ENT) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8750-standard-cn-zh.pdf?id=DTS0000000000000001000666049ZHD) |

#### Mass Flow Meters (Gas)

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| 8006 | 质量流量测量仪 (MFM) | Mass Flow Meters (Gas) | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/8006) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8006-standard-eu-en.pdf?id=DTS0000000000000001000017532ENS) |
| 8702 | 气体质量流量测量仪 (MFM) | Mass Flow Meters (Gas) | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/8702) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8702-standard-eu-en.pdf?id=DTS0000000000000001000011286ENS) |
| 8705 | 气体质量流量测量仪 (Mass Flow Meter) | Mass Flow Meters (Gas) | MEDIUM | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/8705) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8705-standard-eu-en.pdf?id=DTS0000000000000001000205124ENF) |
| 8741 | 气体质量流量控制器 (MFC)/气体质量流量计 (MFM) | Mass Flow Meters (Gas) | MEDIUM | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/8741) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8741-standard-eu-en.pdf?id=DTS0000000000000001000222224ENAK) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8741-standard-cn-zh.pdf?id=DTS0000000000000001000434212ZHJ) |

### 5.8 比例阀

**产品角色：** 通过连续电信号改变阀开度，用于快速、紧凑的压力或流量调节。

**客户任务：** 气体压力控制；流量调节；设备定量；闭环执行元件。

**关键选型变量：** 介质；孔径；Kv；压差；控制信号；迟滞；重复性；响应；线圈；驱动电子；温升。

**排除与边界：** 直接作用比例阀与带定位器的过程调节阀技术路线不同；需要结合传感器和控制器评价闭环表现。

#### Controllers

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| 8605 | 用于电磁比例阀的 PWM 控制电子元件 | Controllers | LOW | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/8605) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8605-standard-eu-en.pdf?id=DTS0000000000000001000086949ENP) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8605-standard-cn-zh.pdf?id=DTS0000000000000001000551272ZHC) |

#### General Purpose Proportional Valves

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| 2822 | 直动式二位二通比例阀 | General Purpose Proportional Valves | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/2822) |
| 2824 | 直动式二位二通比例阀 | General Purpose Proportional Valves | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/2824) |
| 2833 | 直动式二位二通比例阀 | General Purpose Proportional Valves | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/2833) |
| 2835 | 直动式二位二通比例阀 | General Purpose Proportional Valves | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/2835) |
| 2836 | 直动式二通比例电磁阀 | General Purpose Proportional Valves | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/2836) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds2836-standard-eu-en.pdf?id=DTS0000000000000001000023640ENR) |
| 2852 | 带泄压功能的两通比例阀 | General Purpose Proportional Valves | LOW | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/2852) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds2852-standard-eu-en.pdf?id=DTS0000000000000001000597991ENE) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds2852-standard-cn-zh.pdf?id=DTS0000000000000001000614836ZHC) |
| 2853 | 直动式二位二通比例阀，带有介质分离 | General Purpose Proportional Valves | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/2853) |
| 2861 | 直动式二位二通基本型比例阀 | General Purpose Proportional Valves | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/2861) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds2861-standard-eu-en.pdf?id=DTS0000000000000001000173850ENQ) |
| 2863 | 直动式二位二通基本型比例阀 | General Purpose Proportional Valves | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/2863) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds2863-standard-eu-en.pdf?id=DTS0000000000000001000173851ENP) |
| 2865 | 直动式二位二通基本型比例阀 | General Purpose Proportional Valves | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/2865) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds2865-standard-eu-en.pdf?id=DTS0000000000000001000173852ENQ) |
| 2871 | 直动式二通标准比例电磁阀 | General Purpose Proportional Valves | LOW | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/2871) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds2871-standard-eu-en.pdf?id=DTS0000000000000001000173853ENAB) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds2871-standard-cn-zh.pdf?id=DTS0000000000000001000679286ZHB) |
| 2873 | 直动式二通标准比例电磁阀 | General Purpose Proportional Valves | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/2873) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds2873-standard-eu-en.pdf?id=DTS0000000000000001000173854ENT) |
| 2875 | 直动式二通标准比例电磁阀 | General Purpose Proportional Valves | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/2875) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds2875-standard-eu-en.pdf?id=DTS0000000000000001000173855ENS) |
| 6020 | 直动式两通比例阀 | General Purpose Proportional Valves | LOW | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/6020) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds6020-standard-eu-en.pdf?id=DTS0000000000000001000588807ENF) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds6020-standard-cn-zh.pdf?id=DTS0000000000000001000632608ZHF) |
| 6024 | 直动式二位二通比例阀，适合低差压 | General Purpose Proportional Valves | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/6024) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds6024-standard-eu-en.pdf?id=DTS0000000000000001000017535ENQ) |
| 6223 | 先导式二位二通比例阀，适合大流量 | General Purpose Proportional Valves | LOW | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/6223) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds6223-standard-eu-en.pdf?id=DTS0000000000000001000011057ENN) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds6223-standard-cn-zh.pdf?id=DTS0000000000000001000544202ZHC) |

### 5.9 工业通信

**产品角色：** 连接 Bürkert 设备、远程I/O和上位控制系统，支持参数化、诊断和设备级数据。

**客户任务：** PROFINET/EtherNet/IP集成；IO-Link；büS/EDIP；网关；远程I/O；资产诊断。

**关键选型变量：** 协议；拓扑；节点数；循环时间；冗余；安全；I/O类型；配置工具；设备描述；网络安全。

**排除与边界：** 协议名称相同不代表实现范围相同；需确认版本、设备数、冗余、授权和中国可用支持。

#### Accessories

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| 8923 | USB-büS 接口集 | Accessories | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/8923) |

#### PROFINET > PROFINET capable products

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| 8793 | 数字化电动气动侧部控制过程控制器 | PROFINET capable products | LOW | CHINA_PAGE_AND_ZH_DATASHEET | [产品页](https://www.burkert.com/en/type/8793) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8793-standard-eu-en.pdf?id=DTS0000000000000001000121144ENAL) / [中文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8793-standard-cn-zh.pdf?id=DTS0000000000000001000669911ZHB) |

#### Software

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| 8920 | Bürkert Communicator 软件 | Software | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/8920) |
| 8922 | 启用软件功能 | Software | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/8922) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds8922-standard-eu-en.pdf?id=DTS0000000000000001000546235ENJ) |

### 5.10 附加产品

**产品角色：** 补充接头、附件、服务、维护和调试等，使产品能够安装、运行和持续维护。

**客户任务：** 安装连接；备件；维护；调试；校准；培训；生命周期支持。

**关键选型变量：** 兼容型号；材料；尺寸；认证；备件状态；服务地点；响应；校准范围；文档。

**排除与边界：** 附件兼容性必须按 Type 和配置确认；服务产品存在不代表具体地区具备相同SLA。

#### BBS Hygienic Fittings

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| BBS-03 | 采用 Steril Orbital 或 Aseptik 设计的焊接接头 | BBS Hygienic Fittings | HIGH | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/BBS-03) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/dsbbs-03-standard-eu-en.pdf?id=DTS0000000000000001000175495ENP) |
| BBS-04 | 铂网硅胶软管 | BBS Hygienic Fittings | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/BBS-04) |
| BBS-05 | 采用 Quick Connect 或 Aseptik 设计的压合接头 | BBS Hygienic Fittings | HIGH | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/BBS-05) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/dsbbs-05-standard-eu-en.pdf?id=DTS0000000000000001000148954ENT) |
| BBS-06 | 采用 Steril Orbital 或 Aseptik 设计的法兰接头 | BBS Hygienic Fittings | HIGH | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/BBS-06) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/dsbbs-06-standard-eu-en.pdf?id=DTS0000000000000001000148955ENQ) |
| BBS-07 | 滑块法兰适用于 Steril Orbital 或无菌法兰。夹持滑块法兰适用于夹持套管或无菌夹紧套管 | BBS Hygienic Fittings | HIGH | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/BBS-07) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/dsbbs-07-standard-eu-en.pdf?id=DTS0000000000000001000179579ENL) |
| BBS-10 | 无菌止回阀 | BBS Hygienic Fittings | HIGH | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/BBS-10) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/dsbbs-10-standard-eu-en.pdf?id=DTS0000000000000001000150433ENL) |
| BBS-11 | 安全 Ingold 套管 - 无菌规格及无菌采样系统 | BBS Hygienic Fittings | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/BBS-11) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/dsbbs-11-adaptors-eu-en.pdf?id=DTS0000000000000001000174939ENL) |
| BBS-25 | 夹持套管、夹具和密封件 - DIN 32676 | BBS Hygienic Fittings | HIGH | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/BBS-25) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/dsbbs-25-standard-eu-en.pdf?id=DTS0000000000000001000175512ENN) |
| BBS-3F | 带有焊接式和夹紧式接头的管线视孔玻璃 | BBS Hygienic Fittings | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/BBS-3F) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/dsbbs-3f-standard-eu-en.pdf?id=DTS0000000000000001000148923ENS) |
| BBS-4S | 可重复使用的软管螺纹套管接头适用于所有卫生流程应用 | BBS Hygienic Fittings | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/BBS-4S) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/dsbbs-4s-standard-eu-en.pdf?id=DTS0000000000000001000148951ENN) |

#### Fittings and Push-ins

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| TVU001 | 螺纹连接器 | Fittings and Push-ins | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/TVU001) |
| TVU002 | 插头连接器 | Fittings and Push-ins | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/TVU002) |
| TVU003 | 连接 PTFE 软管的 UNF 接口接头，用于带 UNF-1/4-28 接头的分析阀 | Fittings and Push-ins | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/TVU003) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/dstvu003-standard-eu-en.pdf?id=DTS0000000000000001000404527ENG) |

#### Various Components

| Type | 官方名称 | 产品角色 | 制药相关性 | 中国公开可见性 | 官方资料 |
|---|---|---|---|---|---|
| 1573 | 主开关电源 | Various Components | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/1573) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/ds1573-standard-eu-en.pdf?id=DTS0000000000000001000252581ENL) |
| 5500 | 气动计量阀 | Various Components | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/5500) |
| CUT-01 | S-CUT 4S 或 4I 设计，用于微过滤、超过滤和纳米过滤的螺旋卷绕模块 | Various Components | HIGH | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/CUT-01) |
| CUT-02 | C-CUT，用于微过滤和超过滤的毛细管模块 | Various Components | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/CUT-02) |
| CUT-03 | T-CUT PP，用于微过滤的管状或管式模块（02-55 系列） | Various Components | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/CUT-03) |
| CUT-04 | T-CUT，用于微过滤和超过滤的管状或管式模块 | Various Components | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/CUT-04) |
| EB32 | 盲盖 | Various Components | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/EB32) |
| KK02 | 插拔连接器和电缆 | Various Components | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/KK02) |
| KK03 | 类型 KK03 | Various Components | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/KK03) |
| KM00 | 连接板 | Various Components | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/KM00) |
| KOMP | 备件 | Various Components | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/KOMP) |
| KT01 | 备件 | Various Components | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/KT01) |
| MZ15 | 手动校准和清洁模块 | Various Components | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/MZ15) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/dsmz15-standard-eu-en.pdf?id=DTS0000000000000001000326996ENJ) |
| MZ20 | 清洁系统 | Various Components | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/MZ20) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/dsmz20-standard-eu-en.pdf?id=DTS0000000000000001000282423ENH) |
| MZ30 | 试剂单元 | Various Components | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/MZ30) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/dsmz30-standard-eu-en.pdf?id=DTS0000000000000001000396168ENC) |
| NORM | 备件 | Various Components | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/NORM) |
| SC02 | 不同的组件 | Various Components | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/SC02) |
| SET1 | 线圈组 | Various Components | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/SET1) |
| SET2 | 垫片套件 | Various Components | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/SET2) |
| SET3 | 设置易损件 | Various Components | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/SET3) |
| SET4 | 备件套件 | Various Components | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/SET4) |
| SET5 | 备件 | Various Components | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/SET5) |
| SET6 | 阀门和调节锥套件 | Various Components | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/SET6) |
| SET7 | 塞子套件 | Various Components | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/SET7) |
| SET8 | 传感器成套备件 | Various Components | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/SET8) |
| SET9 | 不同的组件 | Various Components | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/SET9) |
| SY01CS | 您安全切换的个性化控制系统。 | Various Components | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/SY01CS) |
| SY02CS | 您的个性化测量系统，确保过程透明 | Various Components | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/SY02CS) |
| SY03CS | 您的个性化测量控制系统紧凑组合 | Various Components | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/SY03CS) |
| SY04CS | 您个性化的控制系统，确保过程值稳定。 | Various Components | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/SY04CS) |
| SY05CS | 您个性化的控制调节系统，直接实施 | Various Components | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/SY05CS) |
| SY06CS | 您个性化的测量调节系统，确保基于数据的稳定性 | Various Components | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/SY06CS) |
| SY07CS | 您的个性化测量-控制-执行系统作为整体解决方案。 | Various Components | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/SY07CS) |
| TFU001 | 集污器 | Various Components | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/TFU001) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/dstfu001-standard-eu-en.pdf?id=DTS0000000000000001000194970ENG) |
| TFU002 | 适合水的止回阀 | Various Components | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/TFU002) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/dstfu002-standard-eu-en.pdf?id=DTS0000000000000001000194806ENI) |
| TFU005 | 适合水的止回阀 | Various Components | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/TFU005) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/dstfu005-standard-eu-en.pdf?id=DTS0000000000000001000252544ENF) |
| TRF003 | 二位二通夹管阀 | Various Components | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/TRF003) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/dstrf003-standard-eu-en.pdf?id=DTS0000000000000001000405001ENA) |
| TRG001 | 节气门、节气门消音器、调节阀、双止回阀、快速排气阀 | Various Components | LOW | CHINA_PAGE_ONLY | [产品页](https://www.burkert.com/en/type/TRG001) / [英文数据表](https://www.burkert.com/en/Media/plm/DTS/DS/dstrg001-standard-eu-en.pdf?id=DTS0000000000000001000422051END) |

## 6. 制药重点 Type

以下 Type 是基于官方分类和页面描述形成的制药重点学习清单。`MEDIUM` 表示邻近或系统支持能力，不代表所有配置满足卫生主工艺要求。

| Type | 产品族/子类 | 官方名称 | 制药场景 | 相关性 |
|---|---|---|---|---|
| [2000](https://www.burkert.com/en/type/2000) | 过程与控制阀 / Shut-off Valves (On/Off) > Angle Seat Valves > Pneumatic | 气动二位二通 CLASSIC 座阀 | CIP/SIP辅助回路及洁净公用工程 | MEDIUM |
| [2030](https://www.burkert.com/en/type/2030) | 过程与控制阀 / Shut-off Valves (On/Off) > Diaphragm Valves > Pneumatic | 带气动塑料执行机构的二位二通隔膜阀（CLASSIC 型） | 无菌输送/隔离；CIP/SIP；制药用水 | HIGH |
| [2031](https://www.burkert.com/en/type/2031) | 过程与控制阀 / Shut-off Valves (On/Off) > Diaphragm Valves > Pneumatic | 带气动塑料驱动器的两位两通隔膜阀（CLASSIC 型） | 无菌输送/隔离；CIP/SIP；制药用水 | HIGH |
| [2032](https://www.burkert.com/en/type/2032) | 过程与控制阀 / Shut-off Valves (On/Off) > Diaphragm Valves > Pneumatic | 带气动塑料驱动器的 T 型隔膜阀（CLASSIC 型） | 无菌输送/隔离；CIP/SIP；制药用水 | HIGH |
| [2033](https://www.burkert.com/en/type/2033) | 过程与控制阀 / Hygienic / Pharma / Hydrogen / Speciality Process Valves > Tank Bottom Valves | 带气动塑料驱动器的罐底隔膜阀（CLASSIC 型） | 无菌输送/隔离；CIP/SIP；制药用水 | HIGH |
| [2034](https://www.burkert.com/en/type/2034) | 过程与控制阀 / Shut-off Valves (On/Off) > Diaphragm Valves > Pneumatic | 多功能阀组解决方案 | 无菌输送/隔离；CIP/SIP；制药用水 | HIGH |
| [2035](https://www.burkert.com/en/type/2035) | 过程与控制阀 / Hygienic / Pharma / Hydrogen / Speciality Process Valves > Robolux / Multiport valve | Robolux 多路多接头气动隔膜阀 | 无菌输送/隔离；CIP/SIP；制药用水 | HIGH |
| [2036](https://www.burkert.com/en/type/2036) | 过程与控制阀 / Shut-off Valves (On/Off) > Robolux (Multiport valves) | Robolux 多通道组合隔膜阀，气动操作 | 无菌输送/隔离；CIP/SIP；制药用水 | HIGH |
| [2053](https://www.burkert.com/en/type/2053) | 过程与控制阀 / Shut-off Valves (On/Off) > Ball Valves > Quarter Turn Actuators | 气动摆动执行机构，用于球阀和截止阀的自动化控制 | 卫生过程阀执行与自动化 | HIGH |
| [2060](https://www.burkert.com/en/type/2060) | 过程与控制阀 / Shut-off Valves (On/Off) > Angle Seat Valves > Pneumatic | 配备不锈钢执行机构的两位两通气动角座阀 | CIP/SIP辅助回路及洁净公用工程 | MEDIUM |
| [2063](https://www.burkert.com/en/type/2063) | 过程与控制阀 / Shut-off Valves (On/Off) > Diaphragm Valves > Pneumatic | 配备不锈钢气动执行机构的二位二通隔膜阀 (INOX 型) | 无菌输送/隔离；CIP/SIP；制药用水 | HIGH |
| [2064](https://www.burkert.com/en/type/2064) | 过程与控制阀 / Hygienic / Pharma / Hydrogen / Speciality Process Valves > T-valves | 带不锈钢气动驱动器的 T 型隔膜阀（INOX 型） | 无菌输送/隔离；CIP/SIP；制药用水 | HIGH |
| [2065](https://www.burkert.com/en/type/2065) | 过程与控制阀 / Hygienic / Pharma / Hydrogen / Speciality Process Valves > Tank Bottom Valves | 带不锈钢气动驱动器的罐底隔膜阀（INOX 型） | 无菌输送/隔离；CIP/SIP；制药用水 | HIGH |
| [2080](https://www.burkert.com/en/type/2080) | 过程与控制阀 / Hygienic / Pharma / Hydrogen / Speciality Process Valves > Bellows Valves | 气动操作的二位二通阀，带有 PTFE 波纹管 | 无菌输送/隔离；CIP/SIP；制药用水 | HIGH |
| [2100](https://www.burkert.com/en/type/2100) | 过程与控制阀 / Shut-off Valves (On/Off) > Angle Seat Valves > Pneumatic | 适用于分散式自动化的 ELEMENT 气动二位二通斜座阀 | CIP/SIP辅助回路及洁净公用工程 | MEDIUM |
| [2103](https://www.burkert.com/en/type/2103) | 过程与控制阀 / Shut-off Valves (On/Off) > Diaphragm Valves > Pneumatic | 带不锈钢气动驱动器（ELEMENT 型）的二位二通隔膜阀，用于分散式自动化 | 无菌输送/隔离；CIP/SIP；制药用水 | HIGH |
| [2104](https://www.burkert.com/en/type/2104) | 过程与控制阀 / Shut-off Valves (On/Off) > Diaphragm Valves > Pneumatic | 带不锈钢气动驱动器（ELEMENT 型）的 T 型隔膜阀，用于分散式自动化 | 无菌输送/隔离；CIP/SIP；制药用水 | HIGH |
| [2105](https://www.burkert.com/en/type/2105) | 过程与控制阀 / Hygienic / Pharma / Hydrogen / Speciality Process Valves > Tank Bottom Valves | 带不锈钢气动驱动器（ELEMENT 型）的罐底隔膜阀，用于分散式自动化 | 无菌输送/隔离；CIP/SIP；制药用水 | HIGH |
| [2300](https://www.burkert.com/en/type/2300) | 过程与控制阀 / Control Valves > Angle Seat Valves > Pneumatic | 气动控制的二通角座调节阀 ELEMENT | CIP/SIP辅助回路及洁净公用工程 | MEDIUM |
| [2380](https://www.burkert.com/en/type/2380) | 过程与控制阀 / Control Valves > Globe Valves > Pneumatic | 卫生型两通波纹管调节阀 | 无菌输送/隔离；CIP/SIP；制药用水 | HIGH |
| [2702](https://www.burkert.com/en/type/2702) | 过程与控制阀 / Control Valves > Angle Seat Valves > Pneumatic | 手动操作二通斜座调节阀 | CIP/SIP辅助回路及洁净公用工程 | MEDIUM |
| [2707](https://www.burkert.com/en/type/2707) | 过程与控制阀 / Hygienic / Pharma / Hydrogen / Speciality Process Valves > Pinch valve | Hose pinch valve with pneumatic actuator | 无菌输送/隔离；CIP/SIP；制药用水 | HIGH |
| [2730](https://www.burkert.com/en/type/2730) | 过程与控制阀 / Control Valves > Diaphragm Valves | 带有塑料制成的气动位置调节驱动器的二位二通隔膜阀（CLASSIC 型） | 无菌输送/隔离；CIP/SIP；制药用水 | HIGH |
| [2731](https://www.burkert.com/en/type/2731) | 过程与控制阀 / Control Valves > Diaphragm Valves | 带有塑料制成的气动位置调节驱动器的二位二通隔膜阀（CLASSIC 型） | 无菌输送/隔离；CIP/SIP；制药用水 | HIGH |
| [2732](https://www.burkert.com/en/type/2732) | 过程与控制阀 / Control Valves > Diaphragm Valves | 气动操作的无死角 T 型阀，不锈钢一体式外壳。可组合成 Continuous Classic 系统，型号 8802-DE | 无菌输送/隔离；CIP/SIP；制药用水 | HIGH |
| [2920](https://www.burkert.com/en/type/2920) | 过程与控制阀 / Shut-off Valves (On/Off) > Angle Seat Valves > Manual | 手动两位两通斜座阀 | CIP/SIP辅助回路及洁净公用工程 | MEDIUM |
| [2933](https://www.burkert.com/en/type/2933) | 过程与控制阀 / Shut-off Valves (On/Off) > Diaphragm Valves > Manual | 带手动执行机构的两位两通隔膜阀 | 无菌输送/隔离；CIP/SIP；制药用水 | HIGH |
| [2934](https://www.burkert.com/en/type/2934) | 过程与控制阀 / Hygienic / Pharma / Hydrogen / Speciality Process Valves > T-valves | 带手动执行机构的 T 型隔膜阀 | 无菌输送/隔离；CIP/SIP；制药用水 | HIGH |
| [2935](https://www.burkert.com/en/type/2935) | 过程与控制阀 / Shut-off Valves (On/Off) > Diaphragm Valves > Manual | 带手动执行机构的罐底隔膜阀 | 无菌输送/隔离；CIP/SIP；制药用水 | HIGH |
| [2960](https://www.burkert.com/en/type/2960) | 过程与控制阀 / Control Valves > Angle Seat Valves > Manual | 手动操作二通斜座调节阀 | CIP/SIP辅助回路及洁净公用工程 | MEDIUM |
| [2973](https://www.burkert.com/en/type/2973) | 过程与控制阀 / Shut-off Valves (On/Off) > Diaphragm Valves > Manual | 带手动执行机构的两位两通隔膜阀（全功能） | 无菌输送/隔离；CIP/SIP；制药用水 | HIGH |
| [2974](https://www.burkert.com/en/type/2974) | 过程与控制阀 / Shut-off Valves (On/Off) > Diaphragm Valves > Manual | 带手动执行机构的 T 型隔膜阀（全功能） | 无菌输送/隔离；CIP/SIP；制药用水 | HIGH |
| [2975](https://www.burkert.com/en/type/2975) | 过程与控制阀 / Shut-off Valves (On/Off) > Diaphragm Valves > Manual | 带手动执行机构的罐底隔膜阀（全功能） | 无菌输送/隔离；CIP/SIP；制药用水 | HIGH |
| [3230](https://www.burkert.com/en/type/3230) | 过程与控制阀 / Shut-off Valves (On/Off) > Diaphragm Valves > Pneumatic | 气动操作的二位二通隔膜阀，带有塑料外壳 | 无菌输送/隔离；CIP/SIP；制药用水 | HIGH |
| [3232](https://www.burkert.com/en/type/3232) | 过程与控制阀 / Shut-off Valves (On/Off) > Diaphragm Valves > Manual | 带手动操作执行机构的二位二通隔膜阀 | 无菌输送/隔离；CIP/SIP；制药用水 | HIGH |
| [3233](https://www.burkert.com/en/type/3233) | 过程与控制阀 / Shut-off Valves (On/Off) > Diaphragm Valves > Manual | 带手动驱动器的两位两通隔膜阀 | 无菌输送/隔离；CIP/SIP；制药用水 | HIGH |
| [3234](https://www.burkert.com/en/type/3234) | 过程与控制阀 / Shut-off Valves (On/Off) > Diaphragm Valves > Manual | 带手动驱动器的 T 型隔膜阀 | 无菌输送/隔离；CIP/SIP；制药用水 | HIGH |
| [3235](https://www.burkert.com/en/type/3235) | 过程与控制阀 / Hygienic / Pharma / Hydrogen / Speciality Process Valves > Tank Bottom Valves | 带手动驱动器的罐底隔膜阀 | 无菌输送/隔离；CIP/SIP；制药用水 | HIGH |
| [3236](https://www.burkert.com/en/type/3236) | 过程与控制阀 / Shut-off Valves (On/Off) > Diaphragm Valves > Manual | 多通路多接口隔膜阀，手动操作 | 无菌输送/隔离；CIP/SIP；制药用水 | HIGH |
| [3260](https://www.burkert.com/en/type/3260) | 过程与控制阀 / Hygienic / Pharma / Hydrogen / Speciality Process Valves > Bellows Valves | Bellow sampling valve | 无菌输送/隔离；CIP/SIP；制药用水 | HIGH |
| [3324](https://www.burkert.com/en/type/3324) | 过程与控制阀 / Hygienic / Pharma / Hydrogen / Speciality Process Valves > T-valves | 带有电气线性驱动装置（开/关）的塑料材质 T 形隔膜阀（EVA 型） | 无菌输送/隔离；CIP/SIP；制药用水 | HIGH |
| [3325](https://www.burkert.com/en/type/3325) | 过程与控制阀 / Hygienic / Pharma / Hydrogen / Speciality Process Valves > Tank Bottom Valves | 带有电气线性驱动装置（开/关）的塑料材质罐底隔膜阀（EVA 型） | 无菌输送/隔离；CIP/SIP；制药用水 | HIGH |
| [3360](https://www.burkert.com/en/type/3360) | 过程与控制阀 / Control Valves > Angle Seat Valves > Electromotive | 二通电动角座型调节阀 | CIP/SIP辅助回路及洁净公用工程 | HIGH |
| [3363](https://www.burkert.com/en/type/3363) | 过程与控制阀 / Control Valves > Diaphragm Valves | 电动两通隔膜阀-调节阀 | 无菌输送/隔离；CIP/SIP；制药用水 | HIGH |
| [3364](https://www.burkert.com/en/type/3364) | 过程与控制阀 / Hygienic / Pharma / Hydrogen / Speciality Process Valves > T-valves | 带有电气线性驱动装置（位置调节器）的塑料材质 T 形隔膜阀（EVA 型） | 无菌输送/隔离；CIP/SIP；制药用水 | HIGH |
| [3365](https://www.burkert.com/en/type/3365) | 过程与控制阀 / Hygienic / Pharma / Hydrogen / Speciality Process Valves > Tank Bottom Valves | 带有电气线性驱动装置（位置调节器）的塑料材质罐底隔膜阀（EVA 型） | 无菌输送/隔离；CIP/SIP；制药用水 | HIGH |
| [8635](https://www.burkert.com/en/type/8635) | 过程与控制阀 / Process Valve Automation > Control | 数字电动气动定位器：SideCONTROL 定位器 | 制药设备阀门自动化/状态反馈 | MEDIUM |
| [8681](https://www.burkert.com/en/type/8681) | 过程与控制阀 / Process Valve Automation > ON/OFF | 卫生级过程调节阀控制头 | 制药设备阀门自动化/状态反馈 | HIGH |
| [8685](https://www.burkert.com/en/type/8685) | 过程与控制阀 / Hygienic / Pharma / Hydrogen / Speciality Process Valves > Robolux / Multiport valve | 可一体化安装于 Robolux 阀门 2036 型上的控制按钮和反馈按钮 | 制药设备阀门自动化/状态反馈 | HIGH |
| [8686](https://www.burkert.com/en/type/8686) | 过程与控制阀 / Hygienic / Pharma / Hydrogen / Speciality Process Valves > Robolux / Multiport valve | 可一体化安装于 Robolux 阀门 2036 型上的控制按钮和反馈按钮 | 制药设备阀门自动化/状态反馈 | HIGH |
| [8690](https://www.burkert.com/en/type/8690) | 过程与控制阀 / Hygienic / Pharma / Hydrogen / Speciality Process Valves > T-valves | 适用于 ELEMENT 过程阀离散自动化的气动控制装置 | 制药设备阀门自动化/状态反馈 | HIGH |
| [8691](https://www.burkert.com/en/type/8691) | 过程与控制阀 / Process Valve Automation > ON/OFF | 适用于 ELEMENT 过程阀离散自动化的控制头 | 制药设备阀门自动化/状态反馈 | HIGH |
| [8692](https://www.burkert.com/en/type/8692) | 过程与控制阀 / Process Valve Automation > Control | 适用于集成加装到过程控制阀的数字电动气动式位置调节器 | 制药设备阀门自动化/状态反馈 | HIGH |
| [8693](https://www.burkert.com/en/type/8693) | 过程与控制阀 / Control Valves > Positioners / Process Controllers > ELEMENT Positioner / Process Controllers | 适用于集成安装到过程控制阀上的数字式电动气动过程控制器 | 制药设备阀门自动化/状态反馈 | HIGH |
| [8694](https://www.burkert.com/en/type/8694) | 过程与控制阀 / Process Valve Automation > Control | 适用于集成安装到过程控制阀上的数字式电动气动位置调节器 | 制药设备阀门自动化/状态反馈 | MEDIUM |
| [8695](https://www.burkert.com/en/type/8695) | 过程与控制阀 / Shut-off Valves (On/Off) > Pneumatic Control | 适用于 ELEMENT 过程阀离散自动化的控制头 | 制药设备阀门自动化/状态反馈 | HIGH |
| [8696](https://www.burkert.com/en/type/8696) | 过程与控制阀 / Control Valves > Positioners / Process Controllers > ELEMENT Positioner / Process Controllers | 适用于集成安装到过程控制阀上的数字式电动气动位置调节器 | 制药设备阀门自动化/状态反馈 | MEDIUM |
| [8697](https://www.burkert.com/en/type/8697) | 过程与控制阀 / Process Valve Automation > ON/OFF | 适用于 ELEMENT 过程阀离散自动化的气动控制装置 | 制药设备阀门自动化/状态反馈 | HIGH |
| [8791](https://www.burkert.com/en/type/8791) | 过程与控制阀 / Control Valves > Positioners / Process Controllers > SideCONTROL | SideControl BASIC 数字式电动气动定位器 | 制药设备阀门自动化/状态反馈 | MEDIUM |
| [8792](https://www.burkert.com/en/type/8792) | 过程与控制阀 / Control Valves > Positioners / Process Controllers > SideCONTROL | SideControl 数字式电动气动定位器 | 制药设备阀门自动化/状态反馈 | MEDIUM |
| [8801](https://www.burkert.com/en/type/8801) | 过程与控制阀 / Shut-off Valves (On/Off) > Diaphragm Valves > Pneumatic | 带有离散自动化的 ELEMENT 开/关阀门系统概述 | 无菌输送/隔离；CIP/SIP；制药用水 | HIGH |
| [8802](https://www.burkert.com/en/type/8802) | 过程与控制阀 / Control Valves > Diaphragm Valves | ELEMENT 连续调节阀系统概述 | 无菌输送/隔离；CIP/SIP；制药用水 | HIGH |
| [8803](https://www.burkert.com/en/type/8803) | 过程与控制阀 / Control Valves > Diaphragm Valves | 带有先导阀和反馈器的过程阀系统 | 无菌输送/隔离；CIP/SIP；制药用水 | HIGH |
| [8806](https://www.burkert.com/en/type/8806) | 过程与控制阀 / Hygienic / Pharma / Hydrogen / Speciality Process Valves > Robolux / Multiport valve | 带有控制头和反馈头的 Robolux 多路多接头隔膜阀 | 无菌输送/隔离；CIP/SIP；制药用水 | HIGH |
| [8840](https://www.burkert.com/en/type/8840) | 过程与控制阀 / Shut-off Valves (On/Off) > Angle Seat Valves > Pneumatic | 模块化过程阀节点 - 分配器和收集器 | CIP/SIP辅助回路及洁净公用工程 | MEDIUM |
| [BUPLUS](https://www.burkert.com/en/type/BUPLUS) | 过程与控制阀 / Shut-off Valves (On/Off) > Robolux (Multiport valves) | Service, Maintenance and Commissioning | 制药设备调试/维护 | HIGH |
| [KK01](https://www.burkert.com/en/type/KK01) | 过程与控制阀 / Process Valve Automation > ON/OFF | 用于卫生型流程阀的配件 | 卫生过程阀自动化接口 | HIGH |
| [SV01](https://www.burkert.com/en/type/SV01) | 过程与控制阀 / Accessories > Diaphragms | 隔膜 | 卫生隔膜阀膜片维护 | HIGH |
| [SV02](https://www.burkert.com/en/type/SV02) | 过程与控制阀 / Accessories > Diaphragms | 隔膜 | 卫生隔膜阀膜片维护 | HIGH |
| [0044](https://www.burkert.com/en/type/0044) | 气动与过程接口 / Pneumatic Cylinder > Double Acting | 符合 ISO 标准的塑料材质气动缸 | 制药设备气动自动化 | MEDIUM |
| [0045](https://www.burkert.com/en/type/0045) | 气动与过程接口 / Pneumatic Cylinder > Single Acting | 符合 ISO 标准的塑料材质气动缸 | 制药设备气动自动化 | MEDIUM |
| [0450](https://www.burkert.com/en/type/0450) | 气动与过程接口 / Pneumatic Valves > 3/2 way valves | 二位三通和二位五通活塞滑阀 | 制药设备气动自动化 | MEDIUM |
| [0460](https://www.burkert.com/en/type/0460) | 气动与过程接口 / Pneumatic Valves > 5/3 way valves | 用于气动系统的两位五通脉冲电磁阀或者三位五通电磁阀 | 制药设备气动自动化 | MEDIUM |
| [0461](https://www.burkert.com/en/type/0461) | 气动与过程接口 / Pneumatic Valves > 5/3 way valves | 用于气动系统的两位五通脉冲电磁阀和三位五通电磁阀 | 制药设备气动自动化 | MEDIUM |
| [0470](https://www.burkert.com/en/type/0470) | 气动与过程接口 / Pneumatic Valves > 3/2 way valves | 二位三通或二位四通电磁阀 | 制药设备气动自动化 | MEDIUM |
| [0498](https://www.burkert.com/en/type/0498) | 气动与过程接口 / Accessories > Double Check Valve | 三位五通带双止回阀 | 制药设备气动自动化 | MEDIUM |
| [5420](https://www.burkert.com/en/type/5420) | 气动与过程接口 / Pneumatic Valves > 4/2 way valves | 适合气动系统的二位四通电磁阀 | 制药设备气动自动化 | MEDIUM |
| [5470](https://www.burkert.com/en/type/5470) | 气动与过程接口 / Pneumatic Valves > 4/2 way valves | 二位三通和二位四通气动电磁阀 | 制药设备气动自动化 | MEDIUM |
| [6115](https://www.burkert.com/en/type/6115) | 气动与过程接口 / Pneumatic Valves > 3/2 way valves | 二位三通压电阀，直动式，适合气动系统 | 制药设备气动自动化 | MEDIUM |
| [6510](https://www.burkert.com/en/type/6510) | 气动与过程接口 / Pneumatic Valves > 3/2 way valves | 用于气动装置的二位三通电磁阀 | 制药设备气动自动化 | MEDIUM |
| [6511](https://www.burkert.com/en/type/6511) | 气动与过程接口 / Pneumatic Valves > 5/2 way valves | 用于气动装置的二位五通电磁阀 | 制药设备气动自动化 | MEDIUM |
| [6516](https://www.burkert.com/en/type/6516) | 气动与过程接口 / Pneumatic Valves > 3/2 way valves | 适合气动系统的二位三通电磁阀 | 制药设备气动自动化 | MEDIUM |
| [6517](https://www.burkert.com/en/type/6517) | 气动与过程接口 / Pneumatic Valves > 5/2 way valves | 适合气动系统的二位五通电磁阀 | 制药设备气动自动化 | MEDIUM |
| [6518](https://www.burkert.com/en/type/6518) | 气动与过程接口 / Pneumatic Valves > 3/2 way valves | 6518/6519 型先导电磁阀/阀组 | 制药设备气动自动化 | MEDIUM |
| [6519](https://www.burkert.com/en/type/6519) | 气动与过程接口 / Pneumatic Valves > 5/2 way valves | 气动伺服控制式二位三通、二位五通或三位五通电磁阀 | 制药设备气动自动化 | MEDIUM |
| [6520](https://www.burkert.com/en/type/6520) | 气动与过程接口 / Pneumatic Valves > 5/2 way valves | 适合气动系统的二位三通和二位五通压电阀 | 制药设备气动自动化 | MEDIUM |
| [6521](https://www.burkert.com/en/type/6521) | 气动与过程接口 / Pneumatic Valves > 3/2 way valves | 二位三通阀门，伺服控制 | 制药设备气动自动化 | MEDIUM |
| [6523](https://www.burkert.com/en/type/6523) | 气动与过程接口 / Pneumatic Valves > 5/2 way valves | 用于气动装置的压电式阀门 | 制药设备气动自动化 | MEDIUM |
| [6524](https://www.burkert.com/en/type/6524) | 气动与过程接口 / Pneumatic Valves > 3/2 way valves | 用于气动装置的二位三通或 2 个二位三通电磁阀 | 制药设备气动自动化 | MEDIUM |
| [6525](https://www.burkert.com/en/type/6525) | 气动与过程接口 / Pneumatic Valves > 5/2 way valves | 用于气动装置的二位五通电磁阀 | 制药设备气动自动化 | MEDIUM |
| [6526](https://www.burkert.com/en/type/6526) | 气动与过程接口 / Pneumatic Valves > 3/2 way valves | 用于气动装置的二位三通电磁阀 | 制药设备气动自动化 | MEDIUM |
| [6527](https://www.burkert.com/en/type/6527) | 气动与过程接口 / Pneumatic Valves > 5/2 way valves | 用于气动装置的二位五通电磁阀 | 制药设备气动自动化 | MEDIUM |
| [8614](https://www.burkert.com/en/type/8614) | 气动与过程接口 / Control Cabinets | 卫生工艺环境的气动开关柜解决方案 | 制药设备气动自动化 | MEDIUM |
| [8644](https://www.burkert.com/en/type/8644) | 气动与过程接口 / Valve Islands | 气动自动化系统 AirLINE 阀岛 | 制药设备气动自动化 | MEDIUM |
| [8647](https://www.burkert.com/en/type/8647) | 气动与过程接口 / Valve Islands | AirLINE SP - 电动气动自动化系统 | 制药设备气动自动化 | MEDIUM |
| [8650](https://www.burkert.com/en/type/8650) | 气动与过程接口 / Valve Islands | AirLINE Ex 电气自动化系统适用于危险区域 | 制药设备气动自动化 | MEDIUM |
| [8652](https://www.burkert.com/en/type/8652) | 气动与过程接口 / Valve Islands | AirLINE 阀岛──针对过程自动化进行优化 | 制药设备气动自动化 | MEDIUM |
| [8653](https://www.burkert.com/en/type/8653) | 气动与过程接口 / Valve Islands | AirLINE Field 阀岛 – 已针对流程自动化进行了优化 | 制药设备气动自动化 | MEDIUM |
| [MKRS](https://www.burkert.com/en/type/MKRS) | 气动与过程接口 / Valve Islands | 为安全切断的冗余区块 | 制药设备气动自动化 | MEDIUM |
| [SV04](https://www.burkert.com/en/type/SV04) | 气动与过程接口 / Accessories > Various Components | 8652 型磨损零件套件气动阀 | 制药设备气动自动化 | MEDIUM |
| [SVVI](https://www.burkert.com/en/type/SVVI) | 气动与过程接口 / Accessories > Various Components | Spare part sets for Type 8640 / 8644 / 8647 / 8650 | 制药设备气动自动化 | MEDIUM |
| [TBU001](https://www.burkert.com/en/type/TBU001) | 气动与过程接口 / Pneumatic Cylinder > Accessories | 气缸的固定件 | 制药设备气动自动化 | MEDIUM |
| [TEU005](https://www.burkert.com/en/type/TEU005) | 气动与过程接口 / Pneumatic Cylinder > Accessories | 气缸开关 | 制药设备气动自动化 | MEDIUM |
| [TEU007](https://www.burkert.com/en/type/TEU007) | 气动与过程接口 / Pneumatic Cylinder > Accessories | 极限值开关 | 制药设备气动自动化 | MEDIUM |
| [TPM001](https://www.burkert.com/en/type/TPM001) | 气动与过程接口 / Accessories > Maintenance equipment and parts | 压缩空气用的保养设备 | 制药设备气动自动化 | MEDIUM |
| [TVG002](https://www.burkert.com/en/type/TVG002) | 气动与过程接口 / Accessories > Fittings and Push-ins | 插头连接器 | 制药设备气动自动化 | MEDIUM |
| [TVG003](https://www.burkert.com/en/type/TVG003) | 气动与过程接口 / Accessories > Fittings and Push-ins | 螺纹连接器 | 制药设备气动自动化 | MEDIUM |
| [TVG007](https://www.burkert.com/en/type/TVG007) | 气动与过程接口 / Accessories > Various Components | 适合气动系统的塑料软管 | 制药设备气动自动化 | MEDIUM |
| [TZG001](https://www.burkert.com/en/type/TZG001) | 气动与过程接口 / Pneumatic Cylinder > Double Acting | 气缸 | 制药设备气动自动化 | MEDIUM |
| [TZU002](https://www.burkert.com/en/type/TZU002) | 气动与过程接口 / Pneumatic Cylinder > Double Acting | 气缸 ISO 15552 | 制药设备气动自动化 | MEDIUM |
| [8007](https://www.burkert.com/en/type/8007) | 传感器、变送器与控制器 / Flow > Thermal mass flow meter | 适合气体的流量测量仪，安装在现有的管道中 | WFI/PW及CIP流量监控 | MEDIUM |
| [8008](https://www.burkert.com/en/type/8008) | 传感器、变送器与控制器 / Flow > Thermal mass flow meter | 适合气体的流量测量仪，带有集成式输入和输出管道 | WFI/PW及CIP流量监控 | MEDIUM |
| [8011](https://www.burkert.com/en/type/8011) | 传感器、变送器与控制器 / Flow > Paddle Wheel > Inline | 适合持续测量的 Inline 叶轮式流量传感器 | WFI/PW及CIP流量监控 | MEDIUM |
| [8012](https://www.burkert.com/en/type/8012) | 传感器、变送器与控制器 / Flow > Paddle Wheel > Inline | 适用于持续测量的涡轮式流量计 | WFI/PW及CIP流量监控 | MEDIUM |
| [8020](https://www.burkert.com/en/type/8020) | 传感器、变送器与控制器 / Flow > Paddle Wheel > Insertion | 适用于持续测量的插入式涡轮流量计 | WFI/PW及CIP流量监控 | MEDIUM |
| [8022](https://www.burkert.com/en/type/8022) | 传感器、变送器与控制器 / Controllers / Transmitters | 流量变送器/脉冲分配器 | WFI/PW及CIP流量监控 | MEDIUM |
| [8025](https://www.burkert.com/en/type/8025) | 传感器、变送器与控制器 / Flow > Paddle Wheel > Insertion | 插入式流量测量设备/带涡轮和流量变送器的定量设备/远程定量设备 | WFI/PW及CIP流量监控 | MEDIUM |
| [8026](https://www.burkert.com/en/type/8026) | 传感器、变送器与控制器 / Flow > Paddle Wheel > Insertion | 插入式涡轮流量计，ELEMENT 设计 | WFI/PW及CIP流量监控 | MEDIUM |
| [8030](https://www.burkert.com/en/type/8030) | 传感器、变送器与控制器 / Flow > Paddle Wheel > Inline | 适用于持续测量的管内流量计 | WFI/PW及CIP流量监控 | MEDIUM |
| [8031](https://www.burkert.com/en/type/8031) | 传感器、变送器与控制器 / Flow > Paddle Wheel > Low Flow | 适合小流量的流量传感器 | WFI/PW及CIP流量监控 | MEDIUM |
| [8032](https://www.burkert.com/en/type/8032) | 传感器、变送器与控制器 / Flow > Paddle Wheel > Inline | 管道式涡轮流量计 | WFI/PW及CIP流量监控 | MEDIUM |
| [8035](https://www.burkert.com/en/type/8035) | 传感器、变送器与控制器 / Flow > Paddle Wheel > Inline | 管道式涡轮流量计/管内定量设备 | WFI/PW及CIP流量监控 | MEDIUM |
| [8036](https://www.burkert.com/en/type/8036) | 传感器、变送器与控制器 / Flow > Paddle Wheel > Inline | 管道式涡轮流量计，ELEMENT 设计 | WFI/PW及CIP流量监控 | MEDIUM |
| [8039](https://www.burkert.com/en/type/8039) | 传感器、变送器与控制器 / Flow > Paddle Wheel > Inline | Inline 叶轮式流量测量仪，光学信号检测 | WFI/PW及CIP流量监控 | MEDIUM |
| [8041](https://www.burkert.com/en/type/8041) | 传感器、变送器与控制器 / Flow > Electromagnetic Flowmeter (EMF) > Insertion EMF | 磁感应插入式流量计 | WFI/PW及CIP流量监控 | MEDIUM |
| [8045](https://www.burkert.com/en/type/8045) | 传感器、变送器与控制器 / Flow > Electromagnetic Flowmeter (EMF) > Insertion EMF | 磁感应插入式流量计 | WFI/PW及CIP流量监控 | MEDIUM |
| [8050](https://www.burkert.com/en/type/8050) | 传感器、变送器与控制器 / Flow > Electromagnetic Flowmeter (EMF) > Inline EMF | 紧凑型流量计 | WFI/PW及CIP流量监控 | MEDIUM |
| [8051](https://www.burkert.com/en/type/8051) | 传感器、变送器与控制器 / Flow > Electromagnetic Flowmeter (EMF) > Inline EMF | 适合小流量的磁感应流量计 | WFI/PW及CIP流量监控 | MEDIUM |
| [8054](https://www.burkert.com/en/type/8054) | 传感器、变送器与控制器 / Flow > Electromagnetic Flowmeter (EMF) > Inline EMF | 带中间法兰的磁感应流量计 | WFI/PW及CIP流量监控 | MEDIUM |
| [8055](https://www.burkert.com/en/type/8055) | 传感器、变送器与控制器 / Flow > Electromagnetic Flowmeter (EMF) > Inline EMF | 带法兰的磁感应流量计 | WFI/PW及CIP流量监控 | MEDIUM |
| [8056](https://www.burkert.com/en/type/8056) | 传感器、变送器与控制器 / Flow > Electromagnetic Flowmeter (EMF) > Inline EMF | 磁感应流量计，卫生工艺接口 | WFI/PW及CIP流量监控 | HIGH |
| [8070](https://www.burkert.com/en/type/8070) | 传感器、变送器与控制器 / Flow > Oval Gear (Positive Displacement) | 管道式椭圆轮流量计 | WFI/PW及CIP流量监控 | MEDIUM |
| [8071](https://www.burkert.com/en/type/8071) | 传感器、变送器与控制器 / Flow > Oval Gear (Positive Displacement) | 用于小流量的椭圆轮流量传感器 | WFI/PW及CIP流量监控 | MEDIUM |
| [8072](https://www.burkert.com/en/type/8072) | 传感器、变送器与控制器 / Flow > Oval Gear (Positive Displacement) | 带有显示器的椭圆齿轮流量测量仪 | WFI/PW及CIP流量监控 | MEDIUM |
| [8075](https://www.burkert.com/en/type/8075) | 传感器、变送器与控制器 / Flow > Oval Gear (Positive Displacement) | 带有显示器的椭圆齿轮流量测量仪 | WFI/PW及CIP流量监控 | MEDIUM |
| [8076](https://www.burkert.com/en/type/8076) | 传感器、变送器与控制器 / Flow > Oval Gear (Positive Displacement) | 带有显示器的椭圆齿轮流量测量仪，ELEMENT 设计 | WFI/PW及CIP流量监控 | MEDIUM |
| [8077](https://www.burkert.com/en/type/8077) | 传感器、变送器与控制器 / Flow > Oval Gear (Positive Displacement) | 用于小流量的椭圆轮流量传感器 | WFI/PW及CIP流量监控 | MEDIUM |
| [8081](https://www.burkert.com/en/type/8081) | 传感器、变送器与控制器 / Flow > Ultrasonic | 适用于连续测量水流量的流量计 | WFI/PW及CIP流量监控 | MEDIUM |
| [8084](https://www.burkert.com/en/type/8084) | 传感器、变送器与控制器 / Flow > Differential pressure | 差压流量计 | WFI/PW及CIP流量监控 | MEDIUM |
| [8098](https://www.burkert.com/en/type/8098) | 传感器、变送器与控制器 / Flow > FLOWave (SAW) | FLOWave SAW 流量计 | WFI/PW及CIP流量监控 | MEDIUM |
| [8111](https://www.burkert.com/en/type/8111) | 传感器、变送器与控制器 / Level > Tuning Fork | 音叉式液位开关 | 卫生储罐液位监测 | HIGH |
| [8112](https://www.burkert.com/en/type/8112) | 传感器、变送器与控制器 / Level > Tuning Fork | 带延长管音叉式液位开关 | 卫生储罐液位监测 | HIGH |
| [8189](https://www.burkert.com/en/type/8189) | 传感器、变送器与控制器 / Level > Guided Radar | 带引导式微波的液位测量计——无菌版本 | 卫生储罐液位监测 | HIGH |
| [8200](https://www.burkert.com/en/type/8200) | 传感器、变送器与控制器 / Armatures for Analysis Sensors | 适用于分析探头的配件 | 制药用水质量监测 | HIGH |
| [8201](https://www.burkert.com/en/type/8201) | 传感器、变送器与控制器 / Liquid Analysis > pH / ORP | 卫生型PH测量仪 | 制药用水质量监测 | HIGH |
| [8202](https://www.burkert.com/en/type/8202) | 传感器、变送器与控制器 / Liquid Analysis > pH / ORP | pH 或氧化还原电位变送器，ELEMENT 设计 | 制药用水质量监测 | MEDIUM |
| [8203](https://www.burkert.com/en/type/8203) | 传感器、变送器与控制器 / Liquid Analysis > pH / ORP | pH 和 O.R.P 探针 | 制药用水质量监测 | MEDIUM |
| [8205](https://www.burkert.com/en/type/8205) | 传感器、变送器与控制器 / Controllers / Transmitters | 带有数字指示器的 pH 传送器或调节器 | 制药用水质量监测 | MEDIUM |
| [8220](https://www.burkert.com/en/type/8220) | 传感器、变送器与控制器 / Liquid Analysis > Conductivity | 电导率传感器 | 制药用水质量监测 | MEDIUM |
| [8221](https://www.burkert.com/en/type/8221) | 传感器、变送器与控制器 / Liquid Analysis > Conductivity | 用于卫生级应用的电导率传感器 | 制药用水质量监测 | HIGH |
| [8222](https://www.burkert.com/en/type/8222) | 传感器、变送器与控制器 / Liquid Analysis > Conductivity | 电导率测量仪，ELEMENT 设计 | 制药用水质量监测 | MEDIUM |
| [8223](https://www.burkert.com/en/type/8223) | 传感器、变送器与控制器 / Liquid Analysis > Conductivity | 没有显示器的感应式电导率传送器 | 制药用水质量监测 | MEDIUM |
| [8226](https://www.burkert.com/en/type/8226) | 传感器、变送器与控制器 / Liquid Analysis > Conductivity | 带有显示器的感应式电导率传送器 | 制药用水质量监测 | MEDIUM |
| [8228](https://www.burkert.com/en/type/8228) | 传感器、变送器与控制器 / Liquid Analysis > Conductivity | 感应式电导率测量仪，ELEMENT 设计 | 制药用水质量监测 | MEDIUM |
| [8232](https://www.burkert.com/en/type/8232) | 传感器、变送器与控制器 / Liquid Analysis > Chlorine | 氯传感器 | 制药用水质量监测 | MEDIUM |
| [8285](https://www.burkert.com/en/type/8285) | 传感器、变送器与控制器 / Controllers / Transmitters | 适合测量 pH、ORP 和电导率的模块化分析传送器 | 制药用水质量监测 | HIGH |
| [8611](https://www.burkert.com/en/type/8611) | 传感器、变送器与控制器 / Controllers / Transmitters | eCONTROL──通用控制器 | WFI/PW及CIP流量监控 | MEDIUM |
| [8619](https://www.burkert.com/en/type/8619) | 传感器、变送器与控制器 / Liquid Analysis > Multichannel Systems | multiCELL──多通道/多功能变送器/控制器 | 制药用水质量监测 | HIGH |
| [8700](https://www.burkert.com/en/type/8700) | 传感器、变送器与控制器 / Flow > Thermal mass flow meter | 气体质量流量计 (MFM) | WFI/PW及CIP流量监控 | MEDIUM |
| [8701](https://www.burkert.com/en/type/8701) | 传感器、变送器与控制器 / Flow > Thermal mass flow meter | 气体质量流量测量仪 (MFM) | WFI/PW及CIP流量监控 | MEDIUM |
| [8703](https://www.burkert.com/en/type/8703) | 传感器、变送器与控制器 / Flow > Thermal mass flow meter | 气体质量流量测量仪 (Mass Flow Meter) | WFI/PW及CIP流量监控 | MEDIUM |
| [8708](https://www.burkert.com/en/type/8708) | 传感器、变送器与控制器 / Flow > Differential pressure | 液体流量测量仪 LFM Liquid Flow Meter | WFI/PW及CIP流量监控 | MEDIUM |
| [8735](https://www.burkert.com/en/type/8735) | 传感器、变送器与控制器 / Flow > Thermal mass flow meter | 多通道-气体质量流量控制器（MFC）/气体质量流量计（MFM） | WFI/PW及CIP流量监控 | MEDIUM |
| [8742](https://www.burkert.com/en/type/8742) | 传感器、变送器与控制器 / Flow > Thermal mass flow meter | 气体质量流量控制器 (MFC)/气体质量流量计 (MFM) | WFI/PW及CIP流量监控 | MEDIUM |
| [8743](https://www.burkert.com/en/type/8743) | 传感器、变送器与控制器 / Flow > Thermal mass flow meter | 气体质量流量控制器 (MFC)/气体质量流量计 (MFM) | WFI/PW及CIP流量监控 | MEDIUM |
| [8905](https://www.burkert.com/en/type/8905) | 传感器、变送器与控制器 / Liquid Analysis > Multichannel Systems | 在线水分析系统 | 制药用水质量监测 | MEDIUM |
| [8906](https://www.burkert.com/en/type/8906) | 传感器、变送器与控制器 / Liquid Analysis > Multichannel Systems | 在线水分析系统 | 制药用水质量监测 | MEDIUM |
| [ME2X](https://www.burkert.com/en/type/ME2X) | 传感器、变送器与控制器 / Liquid Analysis > Multichannel Systems | 系统控制单元 | 制药用水质量监测 | MEDIUM |
| [MS01](https://www.burkert.com/en/type/MS01) | 传感器、变送器与控制器 / Liquid Analysis > Multichannel Systems | pH 值传感器立方体 | 制药用水质量监测 | MEDIUM |
| [MS02](https://www.burkert.com/en/type/MS02) | 传感器、变送器与控制器 / Liquid Analysis > Multichannel Systems | 氯 (Cl2) 或二氧化氯 (ClO2) 传感器立方体 | 制药用水质量监测 | MEDIUM |
| [MS03](https://www.burkert.com/en/type/MS03) | 传感器、变送器与控制器 / Liquid Analysis > Multichannel Systems | 电导率传感器 | 制药用水质量监测 | MEDIUM |
| [MS04](https://www.burkert.com/en/type/MS04) | 传感器、变送器与控制器 / Liquid Analysis > Multichannel Systems | 氧化还原传感器立方体 | 制药用水质量监测 | MEDIUM |
| [MS05](https://www.burkert.com/en/type/MS05) | 传感器、变送器与控制器 / Liquid Analysis > Multichannel Systems | 浊度传感器立方体 | 制药用水质量监测 | MEDIUM |
| [MS06](https://www.burkert.com/en/type/MS06) | 传感器、变送器与控制器 / Liquid Analysis > Multichannel Systems | 用于溶解铁的 Sensor-Cube（传感器立方体） - 流动注射分析 | 制药用水质量监测 | MEDIUM |
| [MS08](https://www.burkert.com/en/type/MS08) | 传感器、变送器与控制器 / Liquid Analysis > SAC254 | SAK 254 传感器 | 制药用水质量监测 | MEDIUM |
| [MS09](https://www.burkert.com/en/type/MS09) | 传感器、变送器与控制器 / Liquid Analysis > Nitrate | 硝酸盐传感器 | 制药用水质量监测 | MEDIUM |
| [S020](https://www.burkert.com/en/type/S020) | 传感器、变送器与控制器 / Flow > Flow Fittings / Armature | 用于流量测量或分析测量的插入式接头 | WFI/PW及CIP流量监控 | MEDIUM |
| [S051](https://www.burkert.com/en/type/S051) | 传感器、变送器与控制器 / Flow > Electromagnetic Flowmeter (EMF) > Inline EMF | 电磁感应流量传感器，适用于小流量 | WFI/PW及CIP流量监控 | MEDIUM |
| [S054](https://www.burkert.com/en/type/S054) | 传感器、变送器与控制器 / Flow > Electromagnetic Flowmeter (EMF) > Inline EMF | 不带法兰的电磁感应流量传感器（中间法兰型号） | WFI/PW及CIP流量监控 | MEDIUM |
| [S055](https://www.burkert.com/en/type/S055) | 传感器、变送器与控制器 / Flow > Electromagnetic Flowmeter (EMF) > Inline EMF | 带法兰的电磁感应传感器 | WFI/PW及CIP流量监控 | MEDIUM |
| [S056](https://www.burkert.com/en/type/S056) | 传感器、变送器与控制器 / Flow > Electromagnetic Flowmeter (EMF) > Inline EMF | 带卫生型管道接口的电磁感应流量传感器 | WFI/PW及CIP流量监控 | HIGH |
| [SE56](https://www.burkert.com/en/type/SE56) | 传感器、变送器与控制器 / Flow > Transmitter | 适合磁感式流量传感器的变送器 | WFI/PW及CIP流量监控 | MEDIUM |
| [SE58](https://www.burkert.com/en/type/SE58) | 传感器、变送器与控制器 / Flow > Electromagnetic Flowmeter (EMF) > Inline EMF | 用于电磁感应流量传感器的变送器 | WFI/PW及CIP流量监控 | MEDIUM |
| [TAU003](https://www.burkert.com/en/type/TAU003) | 传感器、变送器与控制器 / Flow > Rotameter | 浮子式流量测量仪 | WFI/PW及CIP流量监控 | MEDIUM |
| [0375](https://www.burkert.com/en/type/0375) | 微流体产品与泵 / 2/2 and 3/2 way Micro Solenoids > Not media separated | 2 位 2 通或 2 位 3 通气动摇臂阀 | 实验室/分析及精密定量 | MEDIUM |
| [5120](https://www.burkert.com/en/type/5120) | 微流体产品与泵 / Time-Pressure Dosing | 计量头和电子装置，可实现精确的压力-时间定量添加 | 实验室/分析及精密定量 | MEDIUM |
| [5550](https://www.burkert.com/en/type/5550) | 微流体产品与泵 / 2/2 and 3/2 way Micro Solenoids > Media Separated | 带介质隔离功能的泄压阀 | 实验室/分析及精密定量 | MEDIUM |
| [6114](https://www.burkert.com/en/type/6114) | 微流体产品与泵 / 2/2 and 3/2 way Micro Solenoids > Not media separated | 二位二通和二位三通 Flipper 电磁阀，带有介质分离 | 实验室/分析及精密定量 | MEDIUM |
| [6144](https://www.burkert.com/en/type/6144) | 微流体产品与泵 / 2/2 and 3/2 way Micro Solenoids > Not media separated | 二位三通挡板式电磁阀，直动式 | 实验室/分析及精密定量 | MEDIUM |
| [6164](https://www.burkert.com/en/type/6164) | 微流体产品与泵 / 2/2 and 3/2 way Micro Solenoids > Not media separated | 两位三通气动式插装电磁阀 | 实验室/分析及精密定量 | MEDIUM |
| [6606](https://www.burkert.com/en/type/6606) | 微流体产品与泵 / 2/2 and 3/2 way Micro Solenoids > Media Separated | 二位二通和二位三通摇臂电磁阀，带有隔膜 | 实验室/分析及精密定量 | MEDIUM |
| [6626](https://www.burkert.com/en/type/6626) | 微流体产品与泵 / 2/2 and 3/2 way Micro Solenoids > Media Separated | 带隔离膜片的二位二通和二位三通 Bürkert TwinPower 摇臂电磁阀 | 实验室/分析及精密定量 | MEDIUM |
| [7604](https://www.burkert.com/en/type/7604) | 微流体产品与泵 / Membrane / Micro-dosing Pumps | 适合持续输送的微型隔膜泵 | 实验室/分析及精密定量 | MEDIUM |
| [7615](https://www.burkert.com/en/type/7615) | 微流体产品与泵 / Membrane / Micro-dosing Pumps | 精确的微量（微升）滴定单元 | 实验室/分析及精密定量 | MEDIUM |
| [8006](https://www.burkert.com/en/type/8006) | 质量流量控制器与流量计 / Mass Flow Meters (Gas) | 质量流量测量仪 (MFM) | 发酵/生物反应器供气 | MEDIUM |
| [8626](https://www.burkert.com/en/type/8626) | 质量流量控制器与流量计 / Mass Flow Controllers (Gas) | 气体质量流量控制器 (MFC) | 发酵/生物反应器供气 | MEDIUM |
| [8702](https://www.burkert.com/en/type/8702) | 质量流量控制器与流量计 / Mass Flow Meters (Gas) | 气体质量流量测量仪 (MFM) | 发酵/生物反应器供气 | MEDIUM |
| [8705](https://www.burkert.com/en/type/8705) | 质量流量控制器与流量计 / Mass Flow Meters (Gas) | 气体质量流量测量仪 (Mass Flow Meter) | 发酵/生物反应器供气 | MEDIUM |
| [8710](https://www.burkert.com/en/type/8710) | 质量流量控制器与流量计 / Mass Flow Controllers (Gas) | 气体质量流量控制器 (MFC) | 发酵/生物反应器供气 | MEDIUM |
| [8711](https://www.burkert.com/en/type/8711) | 质量流量控制器与流量计 / Mass Flow Controllers (Gas) | 气体质量流量控制器 (MFC) | 发酵/生物反应器供气 | MEDIUM |
| [8712](https://www.burkert.com/en/type/8712) | 质量流量控制器与流量计 / Mass Flow Controllers (Gas) | 气体质量流量控制器 (MFC) | 发酵/生物反应器供气 | MEDIUM |
| [8713](https://www.burkert.com/en/type/8713) | 质量流量控制器与流量计 / Mass Flow Controllers (Gas) | 气体质量流量控制器 (MFC) | 发酵/生物反应器供气 | MEDIUM |
| [8715](https://www.burkert.com/en/type/8715) | 质量流量控制器与流量计 / Mass Flow Controllers (Gas) | 气体质量流量调节器 (Mass Flow Controller) | 发酵/生物反应器供气 | MEDIUM |
| [8716](https://www.burkert.com/en/type/8716) | 质量流量控制器与流量计 / Mass Flow Controllers (Gas) | 气体质量流量调节器 (MFC) | 发酵/生物反应器供气 | MEDIUM |
| [8741](https://www.burkert.com/en/type/8741) | 质量流量控制器与流量计 / Mass Flow Meters (Gas) | 气体质量流量控制器 (MFC)/气体质量流量计 (MFM) | 发酵/生物反应器供气 | MEDIUM |
| [8744](https://www.burkert.com/en/type/8744) | 质量流量控制器与流量计 / Mass Flow Controllers (Gas) | 气体质量流量控制器 (MFC)/气体质量流量计 (MFM) | 发酵/生物反应器供气 | MEDIUM |
| [8745](https://www.burkert.com/en/type/8745) | 质量流量控制器与流量计 / Mass Flow Controllers (Gas) | 气体质量流量控制器 (MFC)/气体质量流量计 (MFM) | 发酵/生物反应器供气 | MEDIUM |
| [8746](https://www.burkert.com/en/type/8746) | 质量流量控制器与流量计 / Mass Flow Controllers (Gas) | 气体质量流量控制器 (MFC)/气体质量流量计 (MFM) | 发酵/生物反应器供气 | MEDIUM |
| [8756](https://www.burkert.com/en/type/8756) | 质量流量控制器与流量计 / Liquid Flow Controllers | 液体质量流量控制器 (MFC)/质量流量计 (MFM) | 发酵/生物反应器供气 | MEDIUM |
| [BBS-03](https://www.burkert.com/en/type/BBS-03) | 附加产品 / BBS Hygienic Fittings | 采用 Steril Orbital 或 Aseptik 设计的焊接接头 | 卫生管路连接 | HIGH |
| [BBS-05](https://www.burkert.com/en/type/BBS-05) | 附加产品 / BBS Hygienic Fittings | 采用 Quick Connect 或 Aseptik 设计的压合接头 | 卫生管路连接 | HIGH |
| [BBS-06](https://www.burkert.com/en/type/BBS-06) | 附加产品 / BBS Hygienic Fittings | 采用 Steril Orbital 或 Aseptik 设计的法兰接头 | 卫生管路连接 | HIGH |
| [BBS-07](https://www.burkert.com/en/type/BBS-07) | 附加产品 / BBS Hygienic Fittings | 滑块法兰适用于 Steril Orbital 或无菌法兰。夹持滑块法兰适用于夹持套管或无菌夹紧套管 | 卫生管路连接 | HIGH |
| [BBS-10](https://www.burkert.com/en/type/BBS-10) | 附加产品 / BBS Hygienic Fittings | 无菌止回阀 | 卫生管路连接 | HIGH |
| [BBS-25](https://www.burkert.com/en/type/BBS-25) | 附加产品 / BBS Hygienic Fittings | 夹持套管、夹具和密封件 - DIN 32676 | 卫生管路连接 | HIGH |
| [CUT-01](https://www.burkert.com/en/type/CUT-01) | 附加产品 / Various Components | S-CUT 4S 或 4I 设计，用于微过滤、超过滤和纳米过滤的螺旋卷绕模块 | 生物工艺过滤/分离 | HIGH |

## 7. 竞品系列映射

| Bürkert方向 | Bürkert Type | GEMÜ | Fujikin | ESG精锐 | 重叠 | 可信度 |
|---|---|---|---|---|---|---|
| 过程与控制阀 / 卫生隔膜阀 | 2030|2031|2032|2033|2034|2035|2103|2104|2105|2106 | GEMÜ 605/616/629/639/649/650/651/653/654/D40/D41 | BNW manual and automatic diaphragm valves | A00 pneumatic diaphragm valve | DIRECT | HIGH |
| 过程与控制阀 / 多通阀块与特殊卫生阀体 | 2034|2035|2036|2104|2105|2106 | P600M/P600S/P500M and custom multiport blocks | 未发现同等清晰的制药多通阀块系列 | T阀、三通及取样阀；复杂阀块能力待证 | DIRECT_FOR_GEMU | HIGH |
| 过程与控制阀 / 角座阀/截止阀/调节阀 | 2000|2002|2012|2100|2101|2300|2301 | GEMÜ 550/554/555 and control-valve portfolio | MINUCON and general control/globe/needle valve portfolio | 100 angle-seat valve|105 proportional control valve | DIRECT | MEDIUM |
| 过程与控制阀 / 球阀/蝶阀/其他隔离阀 | 8804|8805 | GEMÜ D480/D488/490/491 butterfly and B20/B22/B42/B52 ball-valve families | Ball/check/general industrial valve portfolio | 300 butterfly|400 ball|500 check series | DIRECT_OR_ADJACENT | MEDIUM |
| 执行与控制 / 控制头/定位器/过程控制器 | 8681|8685|8690|8691|8692|8693|8694|8695|8696 | GEMÜ 1232/1234/1236/1240/1241/1242 feedback and 1434/1435/1436/1441 controllers | Valve actuation and control accessories; public series mapping incomplete | 0P0/0P1 positioners | DIRECT | HIGH |
| 气动与过程接口 / 阀岛与气动系统 | 8640|8644|8650|8652 | 阀门执行与控制附件；未发现同等广度阀岛系列 | 未发现完整阀岛产品族证据 | 未发现阀岛产品族证据 | BURKERT_DIFFERENTIATOR | HIGH |
| 传感器、变送器与控制器 / 卫生及工业流量测量 | 8020|8025|8030|8031|8035|8041|8045|8051|8055|8070|8071|8072|8075|8081|8098 | GEMÜ 3020 and 801/805/806/807/811/815/816/817/820/822/825/830/831/832/835/840/841/845/851/855/857/865/875 flowmeter portfolio | Measurement offering exists but pharma process-flow mapping is limited | 未发现自有流量传感器产品族 | DIRECT_OR_ADJACENT | HIGH |
| 传感器、变送器与控制器 / 压力/温度/液位 | 8110|8111|8112|8188|8314|8316|8325 | GEMÜ pressure/temperature/level measurement portfolio | 公开主产品更偏阀件和高纯系统；具体系列待映射 | 未发现自有过程传感器产品族 | ADJACENT | MEDIUM |
| 传感器、变送器与控制器 / 液体分析与多通道系统 | 8200|8201|8202|8220|8221|8222|8228|8232|8905 | GEMÜ measurement products; public liquid-analysis breadth limited | 生命科学和分析业务不能直接等同于在线过程分析产品族 | 未发现自有分析测量产品族 | BURKERT_DIFFERENTIATOR | MEDIUM |
| 质量流量控制器与流量计 / 气体/液体MFC与MFM | 8700|8701|8702|8703|8710|8711|8712|8713|8718|8719|8741|8742|8743|8744|8745|8756 | MFC不是GEMÜ公开核心产品线 | FCS Thermal mass-flow controller family | 未发现自有MFC/MFM产品族 | DIRECT_FOR_FUJIKIN | HIGH |
| 微流体产品与泵 / 微型阀/泵/时间压力定量 | 6624|6650|6712|6724|7604|7615 | SUMONDO/夹管阀等一次性流路产品，但技术路线不同 | MINUCON及高纯微小流量阀件；微泵映射待补 | 灌装及小型过程阀；微流体证据不足 | ADJACENT | MEDIUM |
| 比例阀 / 电磁比例阀 | 2861|2863|2865|2871|2873|2875|6024|6223 | Control-valve and positioner portfolio | MINUCON and precision control valves | 105 proportional control valve | DIRECT_OR_ADJACENT | MEDIUM |
| 工业通信 / 网关/I/O/EDIP与设备集成 | ME43|ME44|ME61|ME63|ME64|ME66 | CONEXO|RFID|IO-Link and valve-device integration | CAD/specification support; plant asset platform evidence limited | 基础定位器；未发现系统级资产管理 | BURKERT_AND_GEMU_LEAD | HIGH |
| 附加产品 / 服务/维护/调试 | BUPLUS | Installation/commissioning/maintenance/training services | China service centers and technical support | 本地技术销售支持；公开SLA有限 | SERVICE_OVERLAP | MEDIUM |

## 8. 快速记忆与训练

### 必须脱口而出的十组锚点

1. 2030–2036、2103–2106：卫生隔膜阀、T型/罐底/多通等制药核心方向。
2. 2000/2002/2012、2100/2101、2300/2301：过程隔离与调节阀骨架。
3. 8681/8685、8690–8696：阀门控制头、反馈和定位。
4. 8640/8644/8650/8652：阀岛与气动自动化。
5. 8098：FLOWave卫生流量测量代表。
6. 8200–8232、8905：液体分析与多通道系统。
7. 8700–8756当前在售相关Type：MFC/MFM与精密流量控制。
8. 6624/6650/6712/6724/7604/7615：微流体阀、泵和定量方向。
9. 2861–2875、6024、6223：比例阀方向。
10. ME43–ME66、BUPLUS：通信、I/O及生命周期服务。

### 每次选型必须回答

1. 客户要测量、开关、调节，还是完整闭环？
2. 介质、温度、压力、压差和流量范围是什么？
3. 接液材料、密封/膜片、连接和卫生等级是什么？
4. 失效位、反馈、诊断和通信要求是什么？
5. 当前比较的是 Type、具体订货号还是完整系统？
6. 中国页面/中文资料可见，还是已确认中国库存和交期？
7. 对手对应的是同一技术路线和同一风险等级吗？

## 9. 当前知识缺口

- Article Number级配置、价格、库存、产地和交期不在本目录范围内。
- Type页没有明确披露的数值参数保持空缺，不能从相邻型号外推。
- 竞品本轮只映射到系列级，下一阶段再逐家公司建立全量型号目录。
- 制药适用性最终取决于具体配置、证书范围、项目工况和验证要求。
