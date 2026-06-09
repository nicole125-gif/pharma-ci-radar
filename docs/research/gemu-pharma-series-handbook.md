# GEMÜ 制药相关系列与 Bürkert 对标手册

生成日期：2026-06-09

## 1. 使用边界

- 产品存在性与参数以 GEMÜ 当前英文官网产品页为主。
- `HIGH` 表示官网明确出现制药、生物技术、无菌、一次性或 PUPSIT 语境。
- `MEDIUM` 表示存在卫生、灭菌、FDA/USP/EHEDG/3-A 等线索，或属于制药辅助回路常见产品。
- 相关性不是适用性证明；订货前仍须核对具体配置、证书范围和中国供应。
- 当前 sitemap 未出现的历史系列不写成当前在售事实。

## 2. 目录概览

- 当前系列/方案记录：164
- HIGH：50
- MEDIUM：91
- LOW：23

## 3. 产品经理应先记住的结论

1. GEMÜ 的直接危险区是卫生隔膜阀、多通阀块、罐底阀、一次性和阀门自动化。
2. 650 BioStar 对应 Bürkert 气动卫生隔膜阀；649 eSyDrive 对应电动卫生阀。
3. P600/P500 多通阀块必须按 P&ID 和死区竞争，不能退化为单阀价格比较。
4. SUMONDO 是产品路线差异，不应拿普通夹管阀宣称等价。
5. GEMÜ 测控产品不少，但制药主工艺适配需要逐系列确认，不能把数量等同于优势。
6. CONEXO 偏资产身份、证书和维护；Bürkert EDIP/网关偏设备通信和控制，两者任务不同。

## 4. 制药高相关系列

| 系列 | 产品 | 制药相关性 | 关键范围 | 典型任务 |
|---|---|---|---|---|
| P600M/P600S/P500M | Multi-port valve blocks made of stainless steel | HIGH | 官网页未列统一范围 | 低死区分配、混合、排空与复杂无菌流路 |
| PUPSIT solutions | Integrity is not a maybe. It’s a must. | HIGH | 官网页未列统一范围 | 过滤器完整性测试与PUPSIT流路 |
| SUMONDO Multiport | Single-Use multi-port valve blocks | HIGH | 官网页未列统一范围 | 一次性生物工艺多通流路 |
| C30 | Pressure gauge with PFA pressure transmitter | HIGH | 1/4'' (DN 4) Up to 1 1/4'' (DN 25)；5 Up to 60 °C | 制药或生物技术过程；具体卫生等级需确认 |
| B22 | Manual 2/2-way metal ball valve | HIGH | DN 8 to 100；0 Up to 63 bar；-40 to 180 °C | 制药或生物技术过程；具体卫生等级需确认 |
| B26 | Manual 2/2-way metal ball valve | HIGH | DN 15 to 100；0 Up to 40 bar；-20 to 180 °C | 制药或生物技术过程；具体卫生等级需确认 |
| B27 | Manual 3/2-way metal ball valve | HIGH | DN 8 to 50；0 Up to 40 bar；-40 to 180 °C | 制药或生物技术过程；具体卫生等级需确认 |
| B2F | Manual 2/2-way metal ball valve | HIGH | DN 15 to 200；0 Up to 40 bar；-40 to 220 °C | 制药或生物技术过程；具体卫生等级需确认 |
| B42 | Pneumatic 2/2-way metal ball valve | HIGH | DN 8 to 100；0 Up to 63 bar；-40 to 180 °C | 制药或生物技术过程；具体卫生等级需确认 |
| B47 | Pneumatic 3/2-way metal ball valve | HIGH | DN 8 to 50；0 Up to 40 bar；-40 to 180 °C | 制药或生物技术过程；具体卫生等级需确认 |
| B52 | Electromotive 2/2-way metal ball valve | HIGH | DN 8 to 100；0 Up to 63 bar；-40 to 180 °C | 制药或生物技术过程；具体卫生等级需确认 |
| B54 | Electric 2/2-way metal ball valve | HIGH | DN 8 to 100；0 Up to 63 bar；-10 to 220 °C | 制药或生物技术过程；具体卫生等级需确认 |
| BB06 | 2/2-way ball valve with free shaft end made of metal | HIGH | DN 15 to 100；0 Up to 40 bar；-40 to 180 °C | 制药或生物技术过程；具体卫生等级需确认 |
| BB07 | 3/2-way ball valve with free shaft end made of metal | HIGH | DN 8 to 50；0 Up to 40 bar；-40 to 180 °C | 制药或生物技术过程；具体卫生等级需确认 |
| BB0F | 2/2-way ball valve with free shaft end made of metal | HIGH | DN 15 to 200；0 Up to 40 bar；-40 to 220 °C | 制药或生物技术过程；具体卫生等级需确认 |
| 411 | Manual metal shut-off damper | HIGH | DN 15 to 50；0 to 10 bar；-20 to 160 °C | 制药或生物技术过程；具体卫生等级需确认 |
| 415 | Pneumatic metal butterfly valve | HIGH | DN 15 to 50；0 to 10 bar；-20 to 160 °C | 制药或生物技术过程；具体卫生等级需确认 |
| 490 | Butterfly valve with free shaft end made of metal | HIGH | DN 25 to 1200；0 Up to 10 bar；-20 to 200 °C | 制药或生物技术过程；具体卫生等级需确认 |
| 491 | Pneumatic metal butterfly valve | HIGH | DN 25 to 600；0 Up to 10 bar；-20 to 200 °C | 制药或生物技术过程；具体卫生等级需确认 |
| 498 | Electromotive metal shut-off damper | HIGH | DN 25 to 1200；0 to 10 bar；-20 to 200 °C | 制药或生物技术过程；具体卫生等级需确认 |
| R470 | Butterfly valve with free shaft end made of metal | HIGH | DN 50 to 600；0 to 40 bar；-10 to 230 °C | 制药或生物技术过程；具体卫生等级需确认 |
| R477 | Manual metal shut-off damper | HIGH | DN 50 to 600；0 to 40 bar；-10 to 230 °C | 制药或生物技术过程；具体卫生等级需确认 |
| R478 | Electromotive metal shut-off damper | HIGH | DN 50 to 600；0 to 40 bar；-10 to 230 °C | 制药或生物技术过程；具体卫生等级需确认 |
| 567 | 2/2-way diaphragm globe valve with PD technology | HIGH | DN 8 to 65；0 to 10 bar；-10 to 160 °C | 无菌主工艺、配液、纯化或卫生输送 |
| C53 | Motorized 2/2-way diaphragm globe valve | HIGH | 0 to 6 bar；10 to 150 °C | 制药或生物技术过程；具体卫生等级需确认 |
| C58 | Pneumatic 3/2-way diaphragm globe valve | HIGH | DN 4 to 10；0 to 5,5 bar；-10 to 130 °C | 制药或生物技术过程；具体卫生等级需确认 |
| F40 | Pneumatic 2/2-way diaphragm globe valve with PD technology | HIGH | DN 8 to 25；0 to 7 bar；-10 to 140 °C | 无菌主工艺、配液、纯化或卫生输送 |
| F60 | Electromotive 2/2-way diaphragm globe valve with PD technology | HIGH | DN 8 to 25；0 Up to 7 bar；-10 to 140 °C | 无菌主工艺、配液、纯化或卫生输送 |
| 605 | Pneumatic 2/2-way diaphragm valve with metal body | HIGH | DN 4 to 15；0 to 8 bar；-10 to 100 °C；max. 150 °C | 制药或生物技术过程；具体卫生等级需确认；CIP/SIP与蒸汽灭菌 |
| 612 | Manual 2/2-way diaphragm valve with metal body | HIGH | DN 10 to 20；0 to 10 bar；-10 to 100 °C；Max. 150 °C | 制药或生物技术过程；具体卫生等级需确认；CIP/SIP与蒸汽灭菌 |
| 615 | Pneumatic 2/2-way diaphragm valve with metal body | HIGH | DN 10 to 20；0 to 6 bar；-10 to 80 °C | 制药或生物技术过程；具体卫生等级需确认；CIP/SIP与蒸汽灭菌 |
| 616 | Manual 2/2-way diaphragm valve made of metal | HIGH | DN 4 to 20；0 to 10 bar；-10 to 100 °C；max. 150 °C | 无菌主工艺、配液、纯化或卫生输送；CIP/SIP与蒸汽灭菌 |
| 629 | Electromotive 2/2-way diaphragm valve | HIGH | DN 4 to 65；0 Up to 6 bar；-10 to 80 °C | 无菌主工艺、配液、纯化或卫生输送 |
| 639 | Electromotive 2/2-way diaphragm valve | HIGH | DN 4 to 40；0 Up to 10 bar；-10 to 100 °C；max. 150 °C | 无菌主工艺、配液、纯化或卫生输送；CIP/SIP与蒸汽灭菌 |
| 649 | Electromotive 2/2-way diaphragm valve with metal body | HIGH | DN 4 to 65；0 Up to 10 bar；-10 to 100 °C；max. 150 °C | 制药或生物技术过程；具体卫生等级需确认；CIP/SIP与蒸汽灭菌 |
| 650 | Pneumatic 2/2-way diaphragm valve made of metal | HIGH | DN 4 to 150；0 to 10 bar；-30 to 130 °C；max. 150 °C | 无菌主工艺、配液、纯化或卫生输送；CIP/SIP与蒸汽灭菌 |
| 650TL | Manual 2/2-way diaphragm valve with metal body | HIGH | DN 4 to 25；0 to 10 bar；-10 to 100 °C；Max. 150 °C | 制药或生物技术过程；具体卫生等级需确认；CIP/SIP与蒸汽灭菌 |
| 651 | Pneumatic 2/2-way diaphragm valve with metal body | HIGH | DN 4 to 25；0 to 10 bar；-10 to 100 °C；Max. 150 °C | 无菌主工艺、配液、纯化或卫生输送；CIP/SIP与蒸汽灭菌 |
| 653 | Manual 2/2-way diaphragm valve with metal body | HIGH | DN 10 to 100；0 Up to 10 bar；-10 to 100 °C；Max. 150 °C | 制药或生物技术过程；具体卫生等级需确认；CIP/SIP与蒸汽灭菌 |
| 658 | Pneumatic 2/2-way diaphragm valve made of metal | HIGH | DN 10 to 65；0 to 10 bar；-10 to 100 °C；Max. 150 °C | 制药或生物技术过程；具体卫生等级需确认；CIP/SIP与蒸汽灭菌 |
| 660 | Pneumatic 2/2-way diaphragm valve made of metal | HIGH | DN 4 to 25；0 to 5 bar；-10 to 100 °C；Max. 150 °C | 制药或生物技术过程；具体卫生等级需确认；CIP/SIP与蒸汽灭菌 |
| 673 | Manual 2/2-way diaphragm valve made of metal | HIGH | DN 15 to 65；0 to 10 bar；-10 to 100 °C；Max. 150 °C | 制药或生物技术过程；具体卫生等级需确认；CIP/SIP与蒸汽灭菌 |
| 673P9 | Manual 2/2-way diaphragm valve made of metal | HIGH | DN 4 to 65；0 Up to 10 bar；-10 to 100 °C；Max. 150 °C | 制药或生物技术过程；具体卫生等级需确认；CIP/SIP与蒸汽灭菌 |
| 687 | Pneumatic 2/2-way diaphragm valve with metal body | HIGH | DN 10 to 100；0 Up to 10 bar；-30 to 130 °C；max. 150 °C | 制药或生物技术过程；具体卫生等级需确认；CIP/SIP与蒸汽灭菌 |
| 695 | Pneumatic 2/2-way diaphragm valve with metal body | HIGH | DN 15 to 65；0 to 10 bar；-10 to 80 °C | 制药或生物技术过程；具体卫生等级需确认；CIP/SIP与蒸汽灭菌 |
| D40 | Pneumatic 2/2-way diaphragm valve made of metal | HIGH | DN 10 to 40；0 to 16 bar；-10 to 100 °C；max. 150 °C | 无菌主工艺、配液、纯化或卫生输送；CIP/SIP与蒸汽灭菌 |
| D41 | Pneumatic 2/2-way diaphragm valve made of metal | HIGH | DN 10 to 40；0 to 10 bar；-10 to 100 °C；max. 150 °C | 无菌主工艺、配液、纯化或卫生输送；CIP/SIP与蒸汽灭菌 |
| SU40 | Pneumatic actuator for Single-Use valve bodies | HIGH | DN 8 to 25；0 to 4,9 bar；5 to 40 °C | 无菌主工艺、配液、纯化或卫生输送；一次性生物工艺流路 |
| SUB | Diaphragm valve body for Single-Use applications | HIGH | 1/4'' (DN 8) Up to 1'' (DN 25)；0 Up to 4,9 bar；5 Up to 40 °C | 无菌主工艺、配液、纯化或卫生输送；一次性生物工艺流路 |
| P40 | Radial-sealing pneumatic bottom outlet valve made of metal | HIGH | DN 6 to 65；0 Up to 6 bar；-20 to 160 °C | 无菌主工艺、配液、纯化或卫生输送；CIP/SIP与蒸汽灭菌；罐底排放与低残留 |

## 5. 完整当前系列树

### Customised product solutions

#### Multi-port block valves（1）

| 系列 | 产品 | 制药相关性 | 关键范围 | 典型任务 |
|---|---|---|---|---|
| P600M/P600S/P500M | Multi-port valve blocks made of stainless steel | HIGH | 官网页未列统一范围 | 低死区分配、混合、排空与复杂无菌流路 |

#### PUPSIT（1）

| 系列 | 产品 | 制药相关性 | 关键范围 | 典型任务 |
|---|---|---|---|---|
| PUPSIT solutions | Integrity is not a maybe. It’s a must. | HIGH | 官网页未列统一范围 | 过滤器完整性测试与PUPSIT流路 |

#### Single-use solutions（1）

| 系列 | 产品 | 制药相关性 | 关键范围 | 典型任务 |
|---|---|---|---|---|
| SUMONDO Multiport | Single-Use multi-port valve blocks | HIGH | 官网页未列统一范围 | 一次性生物工艺多通流路 |

#### System solutions（1）

| 系列 | 产品 | 制药相关性 | 关键范围 | 典型任务 |
|---|---|---|---|---|
| GEMÜ Systems | System solutions with depth and vision | MEDIUM | 官网页未列统一范围 | 定制模块与系统集成；制药范围需按项目确认 |

### Digital solutions

#### Asset lifecycle management（1）

| 系列 | 产品 | 制药相关性 | 关键范围 | 典型任务 |
|---|---|---|---|---|
| CONEXO | Structured management of digital maintenance | MEDIUM | 官网页未列统一范围 | 阀门追溯、证书访问和维护生命周期 |

### Measurement And Control Technology

#### Flow Meters（24）

| 系列 | 产品 | 制药相关性 | 关键范围 | 典型任务 |
|---|---|---|---|---|
| 3020 | Electrical flow meter | MEDIUM | DN 25 to 50；0 to 10 bar；-20 to 80 °C | 过程流量测量；制药适配需逐系列确认 |
| 801 | Variable area flow meter with plastic measuring tube | MEDIUM | DN 20 to 65；0 to 15 bar；-20 to 120 °C | 过程流量测量；制药适配需逐系列确认 |
| 805 | Variable area flow meter with plastic measuring tube | MEDIUM | DN 20 to 65；0 to 15 bar；-20 to 120 °C | 过程流量测量；制药适配需逐系列确认 |
| 806 | Variable area flow meter with plastic measuring tube | MEDIUM | DN 20 to 65；0 to 15 bar；-20 to 120 °C | 过程流量测量；制药适配需逐系列确认 |
| 807 | Variable area flow meter with plastic measuring tube | MEDIUM | DN 20 to 65；0 to 15 bar；-20 to 120 °C | 过程流量测量；制药适配需逐系列确认 |
| 811 | Variable area flow meter with plastic measuring tube | MEDIUM | 官网页未列统一范围 | 过程流量测量；制药适配需逐系列确认 |
| 815 | Variable area flow meter with plastic measuring tube | MEDIUM | 官网页未列统一范围 | 过程流量测量；制药适配需逐系列确认 |
| 816 | Variable area flow meter with plastic measuring tube | MEDIUM | DN 20 to 65；0 to 15 bar；-20 to 120 °C | 过程流量测量；制药适配需逐系列确认 |
| 817 | Variable area flow meter with plastic measuring tube | MEDIUM | DN 20 to 65；0 to 15 bar；-20 to 120 °C | 过程流量测量；制药适配需逐系列确认 |
| 820 | Variable area flow meter with plastic measuring tube | MEDIUM | DN 20 to 50；0 to 15 bar；-20 to 120 °C | 过程流量测量；制药适配需逐系列确认 |
| 822 | Variable area flow meter with plastic measuring tube | MEDIUM | DN 50 to 50；0 to 15 bar；-20 to 120 °C | 过程流量测量；制药适配需逐系列确认 |
| 825 | Variable area flow meter with plastic measuring tube | MEDIUM | DN 20 to 65；0 to 15 bar；-20 to 120 °C | 过程流量测量；制药适配需逐系列确认 |
| 830 | Variable area flow meter with plastic measuring tube | MEDIUM | DN 20 to 50；0 to 15 bar；-20 to 120 °C | 过程流量测量；制药适配需逐系列确认 |
| 831 | Variable area flow meter with plastic measuring tube | MEDIUM | DN 20 to 65；0 to 15 bar；-20 to 120 °C | 过程流量测量；制药适配需逐系列确认 |
| 832 | Variable area flow meter with plastic measuring tube | MEDIUM | DN 20 to 65；0 to 15 bar；-20 to 120 °C | 过程流量测量；制药适配需逐系列确认 |
| 835 | Variable area flow meter with plastic measuring tube | MEDIUM | DN 20 to 65；0 to 15 bar；-20 to 120 °C | 过程流量测量；制药适配需逐系列确认 |
| 840 | Partial flow variable area flow meter | MEDIUM | DN 65 to 65；0 to 10 bar；5 to 90 °C | 过程流量测量；制药适配需逐系列确认 |
| 841 | Partial flow variable area flow meter | MEDIUM | DN 65 to 65；0 to 10 bar；5 to 90 °C | 过程流量测量；制药适配需逐系列确认 |
| 845 | Partial flow variable area flow meter | MEDIUM | DN 65 to 65；0 to 10 bar；5 to 90 °C | 过程流量测量；制药适配需逐系列确认 |
| 851 | Variable area flow meter with plastic measuring tube | MEDIUM | DN 15 to 25；0 to 15 bar；-20 to 120 °C | 过程流量测量；制药适配需逐系列确认 |
| 855 | Variable area flow meter with plastic measuring tube | MEDIUM | DN 10 to 25；0 to 15 bar；-20 to 120 °C | 过程流量测量；制药适配需逐系列确认 |
| 857 | Variable area flow meter with plastic measuring tube | MEDIUM | DN 10 to 25；0 to 15 bar；-20 to 120 °C | 过程流量测量；制药适配需逐系列确认 |
| 865 | Variable area flow meter with plastic measuring tube | MEDIUM | DN 10 to 25；0 to 15 bar；-20 to 120 °C | 过程流量测量；制药适配需逐系列确认 |
| 875 | Variable area flow meter with plastic measuring tube | MEDIUM | DN 10 to 25；0 to 15 bar；-20 to 120 °C | 过程流量测量；制药适配需逐系列确认 |

#### Pilot Valves（4）

| 系列 | 产品 | 制药相关性 | 关键范围 | 典型任务 |
|---|---|---|---|---|
| 0322 | Electrically actuated pilot solenoid valve made of plastic | MEDIUM | 0 to 10 bar；-10 to 50 °C | 需按应用确认 |
| 8303 | Electrically actuated metal pilot solenoid valve | MEDIUM | 1 to 10 bar；-10 to 60 °C | 需按应用确认 |
| 8500 | Electrically actuated pilot solenoid valve made of aluminium | MEDIUM | 2,5 to 10 bar；-10 to 60 °C | 需按应用确认 |
| 8506 | Electrically actuated pilot solenoid valve made of aluminium | MEDIUM | 2 to 8 bar；-10 to 50 °C | 需按应用确认 |

#### Position And Process Controllers（5）

| 系列 | 产品 | 制药相关性 | 关键范围 | 典型任务 |
|---|---|---|---|---|
| 1434 | Intelligent electro-pneumatic positioner | MEDIUM | 0 to 10 bar | 阀门自动化、状态反馈与调节 |
| 1435 | Intelligent electro-pneumatic positioner | MEDIUM | 0 to 6 bar | 阀门自动化、状态反馈与调节 |
| 1436 | Intelligent positioner and integrated process controller | MEDIUM | 1,5 to 7 bar | 阀门自动化、状态反馈与调节 |
| 1436-ECO | Intelligent electro-pneumatic positioner | MEDIUM | 1,5 to 7 bar | 阀门自动化、状态反馈与调节 |
| 1441 | Intelligent electro-pneumatic positioner | MEDIUM | 1,5 to 7 bar | 阀门自动化、状态反馈与调节 |

#### Position Feedback Devices And Valve Connections（15）

| 系列 | 产品 | 制药相关性 | 关键范围 | 典型任务 |
|---|---|---|---|---|
| 1205 | Electrical position indicator with microswitch | MEDIUM | 官网页未列统一范围 | 阀门自动化、状态反馈与调节 |
| 1215 | Electrical position indicator with microswitch | MEDIUM | 官网页未列统一范围 | 阀门自动化、状态反馈与调节 |
| 1232 | Electrical position indicator with inductive proximity switch | MEDIUM | 官网页未列统一范围 | 阀门自动化、状态反馈与调节 |
| 1234 | Microprocessor-controlled electrical position indicator | MEDIUM | 官网页未列统一范围 | 阀门自动化、状态反馈与调节 |
| 1236 | Microprocessor-controlled electrical position indicator | MEDIUM | 官网页未列统一范围 | 阀门自动化、状态反馈与调节 |
| 1240 | Electrical position indicator with microswitch or inductive proximity switch | MEDIUM | 官网页未列统一范围 | 阀门自动化、状态反馈与调节 |
| 1241 | Electrical position indicator with inductive proximity switch | MEDIUM | 官网页未列统一范围 | 阀门自动化、状态反馈与调节 |
| 1242 | Microprocessor-controlled electrical position indicator | MEDIUM | 官网页未列统一范围 | 阀门自动化、状态反馈与调节 |
| 12A0 | Intelligent electrical position indicator | MEDIUM | 官网页未列统一范围 | 阀门自动化、状态反馈与调节 |
| 4240 | Valve activation with microswitch or inductive proximity switch | MEDIUM | 官网页未列统一范围 | 阀门自动化、状态反馈与调节 |
| 4241 | Valve actuation with inductive proximity switch | MEDIUM | 官网页未列统一范围 | 阀门自动化、状态反馈与调节 |
| 4242 | Microprocessor-controlled valve control | MEDIUM | 官网页未列统一范围 | 阀门自动化、状态反馈与调节 |
| 44A0 | Multi-functional combi switchbox | MEDIUM | 0,5 to 7 bar | 阀门自动化、状态反馈与调节 |
| C12A | Light barrier-based electrical position indicator | MEDIUM | 官网页未列统一范围 | 阀门自动化、状态反馈与调节 |
| LSC | Limit switch box for quarter turn actuators | MEDIUM | 官网页未列统一范围 | 阀门自动化、状态反馈与调节 |

#### Temperature Measuring Devices And Pressure Measuring Devices（2）

| 系列 | 产品 | 制药相关性 | 关键范围 | 典型任务 |
|---|---|---|---|---|
| C30 | Pressure gauge with PFA pressure transmitter | HIGH | 1/4'' (DN 4) Up to 1 1/4'' (DN 25)；5 Up to 60 °C | 制药或生物技术过程；具体卫生等级需确认 |
| C33 | Pressure gauge with PTFE separating diaphragm | MEDIUM | 0 to 80 °C | 需按应用确认 |

### Valve Technology

#### Ball Valves（14）

| 系列 | 产品 | 制药相关性 | 关键范围 | 典型任务 |
|---|---|---|---|---|
| 710 | Pneumatic ball valve made of plastic | LOW | DN 10 to 100；0 Up to 16 bar；-20 to 100 °C | 需按应用确认 |
| 717 | Manual ball valve made of plastic | LOW | DN 10 to 100；0 to 16 bar；-20 to 100 °C | 需按应用确认 |
| B20 | Manual 2/2-way metal ball valve | MEDIUM | DN 8 to 65；0 Up to 63 bar；-40 to 180 °C | 需按应用确认 |
| B22 | Manual 2/2-way metal ball valve | HIGH | DN 8 to 100；0 Up to 63 bar；-40 to 180 °C | 制药或生物技术过程；具体卫生等级需确认 |
| B26 | Manual 2/2-way metal ball valve | HIGH | DN 15 to 100；0 Up to 40 bar；-20 to 180 °C | 制药或生物技术过程；具体卫生等级需确认 |
| B27 | Manual 3/2-way metal ball valve | HIGH | DN 8 to 50；0 Up to 40 bar；-40 to 180 °C | 制药或生物技术过程；具体卫生等级需确认 |
| B2F | Manual 2/2-way metal ball valve | HIGH | DN 15 to 200；0 Up to 40 bar；-40 to 220 °C | 制药或生物技术过程；具体卫生等级需确认 |
| B42 | Pneumatic 2/2-way metal ball valve | HIGH | DN 8 to 100；0 Up to 63 bar；-40 to 180 °C | 制药或生物技术过程；具体卫生等级需确认 |
| B47 | Pneumatic 3/2-way metal ball valve | HIGH | DN 8 to 50；0 Up to 40 bar；-40 to 180 °C | 制药或生物技术过程；具体卫生等级需确认 |
| B52 | Electromotive 2/2-way metal ball valve | HIGH | DN 8 to 100；0 Up to 63 bar；-40 to 180 °C | 制药或生物技术过程；具体卫生等级需确认 |
| B54 | Electric 2/2-way metal ball valve | HIGH | DN 8 to 100；0 Up to 63 bar；-10 to 220 °C | 制药或生物技术过程；具体卫生等级需确认 |
| BB06 | 2/2-way ball valve with free shaft end made of metal | HIGH | DN 15 to 100；0 Up to 40 bar；-40 to 180 °C | 制药或生物技术过程；具体卫生等级需确认 |
| BB07 | 3/2-way ball valve with free shaft end made of metal | HIGH | DN 8 to 50；0 Up to 40 bar；-40 to 180 °C | 制药或生物技术过程；具体卫生等级需确认 |
| BB0F | 2/2-way ball valve with free shaft end made of metal | HIGH | DN 15 to 200；0 Up to 40 bar；-40 to 220 °C | 制药或生物技术过程；具体卫生等级需确认 |

#### Butterfly Valves（17）

| 系列 | 产品 | 制药相关性 | 关键范围 | 典型任务 |
|---|---|---|---|---|
| 411 | Manual metal shut-off damper | HIGH | DN 15 to 50；0 to 10 bar；-20 to 160 °C | 制药或生物技术过程；具体卫生等级需确认 |
| 415 | Pneumatic metal butterfly valve | HIGH | DN 15 to 50；0 to 10 bar；-20 to 160 °C | 制药或生物技术过程；具体卫生等级需确认 |
| 417 | Manual plastic shut-off damper | LOW | DN 15 to 50；0 to 6 bar；0 to 60 °C | 需按应用确认 |
| 423 | Electromotive plastic shut-off damper | LOW | DN 15 to 50；0 to 6 bar；0 to 60 °C | 需按应用确认 |
| 428 | Electromotive metal shut-off damper | MEDIUM | DN 15 to 50；0 to 10 bar；-20 to 160 °C | 需按应用确认 |
| 490 | Butterfly valve with free shaft end made of metal | HIGH | DN 25 to 1200；0 Up to 10 bar；-20 to 200 °C | 制药或生物技术过程；具体卫生等级需确认 |
| 491 | Pneumatic metal butterfly valve | HIGH | DN 25 to 600；0 Up to 10 bar；-20 to 200 °C | 制药或生物技术过程；具体卫生等级需确认 |
| 498 | Electromotive metal shut-off damper | HIGH | DN 25 to 1200；0 to 10 bar；-20 to 200 °C | 制药或生物技术过程；具体卫生等级需确认 |
| D458 | Electromotive plastic shut-off damper | LOW | DN 50 to 300；0 to 10 bar；5 to 90 °C | 需按应用确认 |
| D480 | Butterfly valve with free shaft end made of metal | MEDIUM | DN 25 to 1600；0 Up to 16 bar；-60 to 210 °C | 需按应用确认 |
| D488 | Electromotive metal shut-off damper | MEDIUM | DN 25 to 1600；0 to 16 bar；-60 to 210 °C | 需按应用确认 |
| K410 | Butterfly valve with free shaft end made of plastic | LOW | DN 15 to 50；0 to 6 bar；0 to 60 °C | 需按应用确认 |
| K415 | Butterfly valve with free shaft end made of metal | MEDIUM | DN 15 to 50；0 to 10 bar；-20 to 160 °C | 需按应用确认 |
| R470 | Butterfly valve with free shaft end made of metal | HIGH | DN 50 to 600；0 to 40 bar；-10 to 230 °C | 制药或生物技术过程；具体卫生等级需确认 |
| R477 | Manual metal shut-off damper | HIGH | DN 50 to 600；0 to 40 bar；-10 to 230 °C | 制药或生物技术过程；具体卫生等级需确认 |
| R478 | Electromotive metal shut-off damper | HIGH | DN 50 to 600；0 to 40 bar；-10 to 230 °C | 制药或生物技术过程；具体卫生等级需确认 |
| R488 | Electromotive metal shut-off damper | MEDIUM | DN 25 to 600；0 to 16 bar；-10 to 160 °C | 需按应用确认 |

#### Diaphragm Seat Valves（6）

| 系列 | 产品 | 制药相关性 | 关键范围 | 典型任务 |
|---|---|---|---|---|
| 567 | 2/2-way diaphragm globe valve with PD technology | HIGH | DN 8 to 65；0 to 10 bar；-10 to 160 °C | 无菌主工艺、配液、纯化或卫生输送 |
| C53 | Motorized 2/2-way diaphragm globe valve | HIGH | 0 to 6 bar；10 to 150 °C | 制药或生物技术过程；具体卫生等级需确认 |
| C57 | Manual 2/2-way diaphragm globe valve | LOW | DN 4 to 25；0 to 6 bar；-10 to 150 °C | 需按应用确认 |
| C58 | Pneumatic 3/2-way diaphragm globe valve | HIGH | DN 4 to 10；0 to 5,5 bar；-10 to 130 °C | 制药或生物技术过程；具体卫生等级需确认 |
| F40 | Pneumatic 2/2-way diaphragm globe valve with PD technology | HIGH | DN 8 to 25；0 to 7 bar；-10 to 140 °C | 无菌主工艺、配液、纯化或卫生输送 |
| F60 | Electromotive 2/2-way diaphragm globe valve with PD technology | HIGH | DN 8 to 25；0 Up to 7 bar；-10 to 140 °C | 无菌主工艺、配液、纯化或卫生输送 |

#### Diaphragm Valves（30）

| 系列 | 产品 | 制药相关性 | 关键范围 | 典型任务 |
|---|---|---|---|---|
| 605 | Pneumatic 2/2-way diaphragm valve with metal body | HIGH | DN 4 to 15；0 to 8 bar；-10 to 100 °C；max. 150 °C | 制药或生物技术过程；具体卫生等级需确认；CIP/SIP与蒸汽灭菌 |
| 610 | Pneumatic 2/2-way diaphragm valve made of plastic | MEDIUM | DN 12 to 20；0 to 6 bar；-10 to 80 °C | 需按应用确认 |
| 611 | Manual 2/2-way diaphragm valve with metal body | MEDIUM | DN 10 to 20；0 to 10 bar；-10 to 80 °C；max. 150 °C | CIP/SIP与蒸汽灭菌 |
| 612 | Manual 2/2-way diaphragm valve with metal body | HIGH | DN 10 to 20；0 to 10 bar；-10 to 100 °C；Max. 150 °C | 制药或生物技术过程；具体卫生等级需确认；CIP/SIP与蒸汽灭菌 |
| 615 | Pneumatic 2/2-way diaphragm valve with metal body | HIGH | DN 10 to 20；0 to 6 bar；-10 to 80 °C | 制药或生物技术过程；具体卫生等级需确认；CIP/SIP与蒸汽灭菌 |
| 616 | Manual 2/2-way diaphragm valve made of metal | HIGH | DN 4 to 20；0 to 10 bar；-10 to 100 °C；max. 150 °C | 无菌主工艺、配液、纯化或卫生输送；CIP/SIP与蒸汽灭菌 |
| 620 | Pneumatic 2/2-way diaphragm valve with metal body | MEDIUM | DN 15 to 150；0 to 10 bar；0 to 100 °C | 需按应用确认 |
| 629 | Electromotive 2/2-way diaphragm valve | HIGH | DN 4 to 65；0 Up to 6 bar；-10 to 80 °C | 无菌主工艺、配液、纯化或卫生输送 |
| 639 | Electromotive 2/2-way diaphragm valve | HIGH | DN 4 to 40；0 Up to 10 bar；-10 to 100 °C；max. 150 °C | 无菌主工艺、配液、纯化或卫生输送；CIP/SIP与蒸汽灭菌 |
| 649 | Electromotive 2/2-way diaphragm valve with metal body | HIGH | DN 4 to 65；0 Up to 10 bar；-10 to 100 °C；max. 150 °C | 制药或生物技术过程；具体卫生等级需确认；CIP/SIP与蒸汽灭菌 |
| 650 | Pneumatic 2/2-way diaphragm valve made of metal | HIGH | DN 4 to 150；0 to 10 bar；-30 to 130 °C；max. 150 °C | 无菌主工艺、配液、纯化或卫生输送；CIP/SIP与蒸汽灭菌 |
| 650TL | Manual 2/2-way diaphragm valve with metal body | HIGH | DN 4 to 25；0 to 10 bar；-10 to 100 °C；Max. 150 °C | 制药或生物技术过程；具体卫生等级需确认；CIP/SIP与蒸汽灭菌 |
| 651 | Pneumatic 2/2-way diaphragm valve with metal body | HIGH | DN 4 to 25；0 to 10 bar；-10 to 100 °C；Max. 150 °C | 无菌主工艺、配液、纯化或卫生输送；CIP/SIP与蒸汽灭菌 |
| 653 | Manual 2/2-way diaphragm valve with metal body | HIGH | DN 10 to 100；0 Up to 10 bar；-10 to 100 °C；Max. 150 °C | 制药或生物技术过程；具体卫生等级需确认；CIP/SIP与蒸汽灭菌 |
| 654 | Manual 2/2-way diaphragm valve made of metal | MEDIUM | DN 4 to 100；0 Up to 10 bar；-10 to 100 °C；Max. 150 °C | CIP/SIP与蒸汽灭菌 |
| 656 | Pneumatic 2/2-way diaphragm valve made of metal | LOW | DN 25 to 250；0 to 7 bar；0 to 100 °C | 需按应用确认 |
| 658 | Pneumatic 2/2-way diaphragm valve made of metal | HIGH | DN 10 to 65；0 to 10 bar；-10 to 100 °C；Max. 150 °C | 制药或生物技术过程；具体卫生等级需确认；CIP/SIP与蒸汽灭菌 |
| 660 | Pneumatic 2/2-way diaphragm valve made of metal | HIGH | DN 4 to 25；0 to 5 bar；-10 to 100 °C；Max. 150 °C | 制药或生物技术过程；具体卫生等级需确认；CIP/SIP与蒸汽灭菌 |
| 671 | Manual 2/2-way diaphragm valve with metal body | MEDIUM | DN 15 to 100；0 to 10 bar；-10 to 80 °C；max. 150 °C | CIP/SIP与蒸汽灭菌 |
| 673 | Manual 2/2-way diaphragm valve made of metal | HIGH | DN 15 to 65；0 to 10 bar；-10 to 100 °C；Max. 150 °C | 制药或生物技术过程；具体卫生等级需确认；CIP/SIP与蒸汽灭菌 |
| 673P9 | Manual 2/2-way diaphragm valve made of metal | HIGH | DN 4 to 65；0 Up to 10 bar；-10 to 100 °C；Max. 150 °C | 制药或生物技术过程；具体卫生等级需确认；CIP/SIP与蒸汽灭菌 |
| 687 | Pneumatic 2/2-way diaphragm valve with metal body | HIGH | DN 10 to 100；0 Up to 10 bar；-30 to 130 °C；max. 150 °C | 制药或生物技术过程；具体卫生等级需确认；CIP/SIP与蒸汽灭菌 |
| 695 | Pneumatic 2/2-way diaphragm valve with metal body | HIGH | DN 15 to 65；0 to 10 bar；-10 to 80 °C | 制药或生物技术过程；具体卫生等级需确认；CIP/SIP与蒸汽灭菌 |
| C60 | Pneumatic 2/2-way diaphragm valve made of ultra pure plastic | MEDIUM | DN 4 to 50；0 to 6 bar；-10 to 150 °C | 需按应用确认 |
| D40 | Pneumatic 2/2-way diaphragm valve made of metal | HIGH | DN 10 to 40；0 to 16 bar；-10 to 100 °C；max. 150 °C | 无菌主工艺、配液、纯化或卫生输送；CIP/SIP与蒸汽灭菌 |
| D41 | Pneumatic 2/2-way diaphragm valve made of metal | HIGH | DN 10 to 40；0 to 10 bar；-10 to 100 °C；max. 150 °C | 无菌主工艺、配液、纯化或卫生输送；CIP/SIP与蒸汽灭菌 |
| R629 | Electromotive 2/2-way diaphragm valve made of plastic | MEDIUM | DN 12 to 65；0 Up to 6 bar；-10 to 80 °C | 需按应用确认 |
| R647 | Pneumatic 2/2-way diaphragm valve made of plastic | MEDIUM | DN 15 to 50；0 to 6 bar；-20 to 80 °C | 需按应用确认 |
| R677 | Manual 2/2-way diaphragm valve made of plastic | MEDIUM | DN 15 to 100；0 to 10 bar；-10 to 80 °C | 需按应用确认 |
| R690 | Pneumatic 2/2-way diaphragm valve made of plastic | MEDIUM | DN 15 to 1001/2" (DN 15) to 4" (DN 100)；0 to 10 bar0 to 150 psi；-10 to 80 °C14 to 176 °F | 需按应用确认 |

#### Pinch Valves（3）

| 系列 | 产品 | 制药相关性 | 关键范围 | 典型任务 |
|---|---|---|---|---|
| Q30 | Pneumatically actuated pinch valve with plastic piston actuator | LOW | max. 6 bar, Please observe the tube manufacturer's specifications；Please observe the tube manufacturer's specifications | 无菌主工艺、配液、纯化或卫生输送 |
| Q40 | Pneumatic pinch valve with stainless steel piston actuator | MEDIUM | max. 6 bar, Please observe the tube manufacturer's specifications；Please observe the tube manufacturer's specifications | 需按应用确认 |
| Q51 | Electromotive pinch valve | LOW | max. 4,5 bar, Please observe the tube manufacturer's specifications | 需按应用确认 |

#### Pressure Control Valves Check Valves And Strainers（8）

| 系列 | 产品 | 制药相关性 | 关键范围 | 典型任务 |
|---|---|---|---|---|
| 560 | Metal non-return valve | MEDIUM | DN 6 to 50；0,2 to 25 bar；-10 to 180 °C | 需按应用确认 |
| CV | Non-return valve made of high-purity plastic | LOW | DN 4 to 20；0 to 6 bar；0 to 130 °C | 需按应用确认 |
| N085 | Plastic overflow valve | LOW | DN 65 Up to 100；0 Up to 10 bar；-20 Up to 100 °C | 需按应用确认 |
| N086 | Plastic pressurising valve | LOW | DN 65 Up to 100；0 Up to 10 bar；-20 Up to 100 °C | 需按应用确认 |
| N182 | Plastic pressure reducer | LOW | DN 10 Up to 50；0 Up to 10 bar；-20 Up to 100 °C | 需按应用确认 |
| N185 | Plastic overflow valve | LOW | DN 10 Up to 50；0 Up to 10 bar；-20 Up to 100 °C | 需按应用确认 |
| N570 | Plastic mud flaps | LOW | DN 15 to 50；0 to 16 bar；5 to 80 °C | 需按应用确认 |
| R90 | Metal non-return valve | MEDIUM | DN 15 to 300；0 to 50 bar；-196 to 400 °C | 需按应用确认 |

#### Process Solenoid Valves（7）

| 系列 | 产品 | 制药相关性 | 关键范围 | 典型任务 |
|---|---|---|---|---|
| 102 | Direct operated process solenoid valve made of plastic | LOW | DN 6 to 10；0 to 4 bar；-20 to 100 °C | 需按应用确认 |
| 202 | Direct operated process solenoid valve made of plastic | LOW | DN 10 to 15；0 to 2 bar；-20 to 100 °C | 需按应用确认 |
| 205 | Direct operated process solenoid valve made of plastic | LOW | DN 10 to 50；0 to 6 bar；-20 to 60 °C | 需按应用确认 |
| 8253 | Force-controlled process solenoid valve made of metal | LOW | DN 8 to 50；0 to 16 bar；-10 to 110 °C | 需按应用确认 |
| 8257 | Force-controlled process solenoid valve made of metal | LOW | 0 to 10 bar；-10 to 150 °C | 需按应用确认 |
| 8258 | Auxiliary controlled process solenoid valve made of metal | LOW | DN 8 to 50；0,1 to 16 bar；-10 to 110 °C | 需按应用确认 |
| 8259 | Direct operated process solenoid valve made of metal | LOW | DN 2 to 5；0 to 20 bar；-10 to 110 °C | 需按应用确认 |

#### Pulsation Dampers（1）

| 系列 | 产品 | 制药相关性 | 关键范围 | 典型任务 |
|---|---|---|---|---|
| 652 | Stainless steel pulsation damper | MEDIUM | DN 15 to 80；0 to 10 bar；-20 to 100 °C；max. 150 °C | 无菌主工艺、配液、纯化或卫生输送；CIP/SIP与蒸汽灭菌 |

#### Seat Valves（19）

| 系列 | 产品 | 制药相关性 | 关键范围 | 典型任务 |
|---|---|---|---|---|
| 314 | Pneumatic 3/2-way metal seat valve | MEDIUM | DN 15 to 50；0 Up to 16 bar；-10 to 180 °C | CIP/SIP辅助回路与公用工程 |
| 505 | Manual 2/2-way poppet valve with metal body | MEDIUM | DN 8 to 80；0 to 10 bar；-10 to 185 °C | CIP/SIP辅助回路与公用工程 |
| 507 | Manual 2/2-way globe valve with metal body | MEDIUM | DN 6 to 80；0 to 25 bar；-10 to 210 °C | CIP/SIP辅助回路与公用工程 |
| 514 | Pneumatic 2/2-way globe valve made of metal | MEDIUM | DN 8 to 80；0 to 25 bar；-10 to 210 °C | CIP/SIP辅助回路与公用工程 |
| 514Z | Pneumatic 2/2-way metal seat valve | MEDIUM | DN 15 to 80；0 to 25 bar；-10 to 210 °C | CIP/SIP辅助回路与公用工程 |
| 519 | Electromotive 2/2-way globe valve with metal body | MEDIUM | DN 15 to 50；0 Up to 40 bar；-10 to 180 °C | CIP/SIP辅助回路与公用工程 |
| 530 | Pneumatic 2/2-way metal seat valve | MEDIUM | DN 15 to 100；0 to 40 bar；-40 to 210 °C | CIP/SIP辅助回路与公用工程 |
| 534 | Pneumatic 2/2-way poppet valve with metal body | MEDIUM | DN 15 to 100；0 to 40 bar；-10 to 180 °C | CIP/SIP辅助回路与公用工程 |
| 536 | Pneumatic 2/2-way metal seat valve | MEDIUM | DN 32 to 150；0 to 40 bar；-10 to 210 °C | CIP/SIP辅助回路与公用工程 |
| 537 | Manual 2/2-way poppet valve with metal body | MEDIUM | DN 15 to 50；0 to 40 bar；-10 to 210 °C | CIP/SIP辅助回路与公用工程 |
| 539 | Electromotive 2/2-way metal seat valve | MEDIUM | DN 15 to 100；0 Up to 40 bar；-40 to 250 °C | CIP/SIP辅助回路与公用工程 |
| 550 | Pneumatic 2/2-way metal seat valve | MEDIUM | DN 6 to 80；0 to 25 bar；-40 to 210 °C | CIP/SIP辅助回路与公用工程 |
| 553 | Modular poppet valve with flexible actuator options | MEDIUM | DN 15 to 20；0 to 25 bar；-10 to 180 °C | CIP/SIP辅助回路与公用工程 |
| 554 | Pneumatic 2/2-way poppet valve with metal body | MEDIUM | DN 6 to 80；0 to 25 bar；-10 to 180 °C | CIP/SIP辅助回路与公用工程 |
| 555 | Pneumatic 2/2-way metal seat valve | MEDIUM | DN 8 to 80；0 to 10 bar；-10 to 185 °C | CIP/SIP辅助回路与公用工程 |
| 565 | Pneumatic 2/2-way control valve with plastic body | MEDIUM | DN 3 to 15；0 to 6 bar；-20 to 80 °C | CIP/SIP辅助回路与公用工程 |
| 566 | Pneumatic or electromotive control valve with metal body | MEDIUM | DN 8 to 20；0 to 6 bar；0 to 90 °C | CIP/SIP辅助回路与公用工程 |
| R563 | Electric motor-operated control valve with plastic body | MEDIUM | DN 10 to 15；0 Up to 6 bar；0 to 80 °C | CIP/SIP辅助回路与公用工程 |
| S40 | Pneumatic 2/2-way metal seat valve | MEDIUM | DN 6 to 80；0 to 40 bar；-40 to 185 °C | CIP/SIP辅助回路与公用工程 |

#### Single Use Valves Components（2）

| 系列 | 产品 | 制药相关性 | 关键范围 | 典型任务 |
|---|---|---|---|---|
| SU40 | Pneumatic actuator for Single-Use valve bodies | HIGH | DN 8 to 25；0 to 4,9 bar；5 to 40 °C | 无菌主工艺、配液、纯化或卫生输送；一次性生物工艺流路 |
| SUB | Diaphragm valve body for Single-Use applications | HIGH | 1/4'' (DN 8) Up to 1'' (DN 25)；0 Up to 4,9 bar；5 Up to 40 °C | 无菌主工艺、配液、纯化或卫生输送；一次性生物工艺流路 |

#### Tank Bottom Valves（2）

| 系列 | 产品 | 制药相关性 | 关键范围 | 典型任务 |
|---|---|---|---|---|
| 643 | Manual 2/2-way container valve with metal body | MEDIUM | DN 15 to 40；0 to 10 bar；-10 to 100 °C；Max. 150 °C | CIP/SIP与蒸汽灭菌；罐底排放与低残留 |
| P40 | Radial-sealing pneumatic bottom outlet valve made of metal | HIGH | DN 6 to 65；0 Up to 6 bar；-20 to 160 °C | 无菌主工艺、配液、纯化或卫生输送；CIP/SIP与蒸汽灭菌；罐底排放与低残留 |

## 6. Bürkert 对标速查

| GEMÜ系列 | Bürkert候选Type | 重叠 | 场景 | 竞争要点 |
|---|---|---|---|---|
| 650 | 2030|2063|2103 | DIRECT | 无菌主工艺、配液、纯化、CIP/SIP | 不锈钢活塞执行器、广泛阀体构型与卫生符合性组合。 |
| 649 | 3324|3325|3363|3364|3365 | DIRECT | 无气源设备、卫生开关阀和精密调节 | 电动执行器集成参数化、诊断和开关/调节能力。 |
| 653|654 | 2030|2063|2103|2933|2973 | DIRECT | 无菌输送、配液、过滤和卫生设备 | BioStar家族覆盖不同执行和尺寸需求，专业系列叙事清晰。 |
| 643|P40 | 2033|2065|2105|2935|2975|3235|3325|3365 | DIRECT | 配液罐、生物反应器和储罐低残留排放 | 专用罐底阀产品族，便于围绕排空和卫生设计竞争。 |
| P600M/P600S/P500M | 2034|2035|2036|8806 | DIRECT | 低死区分配、混合、过滤、PUPSIT和复杂流路 | 成熟多通阀块工程、传感器集成和制药专业化表达。 |
| SUMONDO Multiport|SU40|SUB | 2707 | ADJACENT | 一次性上游/下游、快速换批和交叉污染控制 | 可更换接液组件、一次性多通阀块和清洁室制造证据清晰。 |
| 550|554|555 | 2000|2060|2100|2300 | DIRECT | 洁净蒸汽、CIP/SIP辅助回路、公用工程和灌装设备 | 辅助过程阀与GEMÜ卫生主工艺阀形成组合销售。 |
| 1434|1435|1436|1441 | 8692|8693|8694|8696|8791|8792 | DIRECT | 卫生阀调节、设备控制和阀门诊断 | 从基础定位到智能过程控制形成清晰产品梯度。 |
| 1232|1234|1236|1240|1241|1242 | 8681|8691|8695 | DIRECT_OR_ADJACENT | 卫生阀开关反馈、分散自动化和远程状态 | 反馈装置与自有阀门系列组合完整。 |
| 3020|801|805|806|807|811|815|816|817|820|822|825|830|831|832|835|840|841|845|851|855|857|865|875 | 8020|8025|8030|8035|8041|8045|8051|8055|8056|8070|8072|8075|8098 | DIRECT_OR_ADJACENT | 公用工程、设备流量和部分卫生液体测量 | 公开系列数量多，可与阀门组合进入设备项目。 |
| D480|D488|490|491 | 2671|2672|8804|8805 | DIRECT_OR_ADJACENT | 大口径公用工程、工艺水和设备隔离 | 中国工厂公开具备蝶阀生产能力，产品族丰富。 |
| B20|B22|B26|B27|B42|B47|B52|B54 | 2651|2652|2654|2655|2657|2658|8804|8805 | DIRECT_OR_ADJACENT | 公用工程、设备隔离和非无菌过程 | 手动、气动和电动球阀覆盖广。 |
| Q30|Q40|Q51 | 2707 | DIRECT_OR_ADJACENT | 软管流路、一次性耗材外围和颗粒敏感介质 | 夹管阀产品族与SUMONDO一次性方案可形成组合。 |
| CONEXO | ME43|ME44|ME61|ME63|ME64|ME66 | ADJACENT | 阀门追溯、证书访问、维护和资产生命周期 | RFID组件身份、文件和维护流程与制药追溯叙事贴合。 |
| GEMÜ Systems | BUPLUS|8840 | DIRECT_AT_SOLUTION_LEVEL | 模块、撬装、控制系统和已验证子组件 | 从阀门向完整子组件和系统责任延伸。 |

## 7. 客户需求到候选系列

| 客户需求 | 先看GEMÜ | 先看Bürkert | 必问条件 |
|---|---|---|---|
| 气动无菌隔膜阀 | 650/653/654 | 2030/2063/2103 | DN、阀体、膜片、Ra、灭菌、自动化 |
| 电动卫生阀 | 649 | 3324/3325/3363/3364/3365 | 推力、速度、断电位、控制、IP |
| 多通低死区阀块 | P600M/P600S/P500M | 2034/2035/2036/8806 | P&ID、排空、死区、焊点、传感器 |
| 一次性多通流路 | SUMONDO Multiport | 当前无直接完整对应 | 接液耗材、辐照、洁净室、验证 |
| 卫生阀反馈/调节 | 123x/143x/1441 | 8681/869x/879x | 安装、协议、诊断、先导阀、控制算法 |
| CIP/SIP辅助阀 | 550/554/555 | 2000/2060/2100/2300 | 蒸汽、压差、温度、阀座、寿命 |

## 8. 不可直接比较的边界

- 不同膜片尺寸、阀体构型和控制功能的总范围不能直接判优。
- 多通阀块与多个焊接单阀不是同一设计任务。
- 一次性阀体、夹管阀和可重复使用卫生隔膜阀不是同一替代关系。
- 通用流量计与卫生主工艺流量计不能只比较精度数字。
- CONEXO 与工业以太网网关不能用“数字化功能多少”笼统比较。

## 9. 内部验证清单

- GEMÜ 650、649、P600 系列在中国的实际产地、库存与交期。
- 同规格阀门净价、膜片备件价和总拥有成本。
- 中国制药客户的安装基础、验证文件接受度和失效案例。
- SUMONDO 在国内的一次性组件供应、辐照和变更管理。
- GEMÜ Systems 在中国项目中的控制柜、测量、阀岛和调试责任边界。
