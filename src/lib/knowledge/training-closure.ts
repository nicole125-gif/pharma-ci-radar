export interface TrainingClosureDefinition {
  day: number;
  title: string;
  deliverable: string;
  requiredEvidenceIds: string[];
  submissionChecklist: string[];
  scoringRubric: Array<{
    dimension: string;
    points: number;
    passSignal: string;
  }>;
  reworkTriggers: string[];
  reflectionPrompts: string[];
  validationTaskIds?: string[];
}

const closures: TrainingClosureDefinition[] = [
  {
    day: 6,
    title: "Fujikin 制药适配边界学习闭环",
    deliverable:
      "提交三能力线分类表，覆盖 BNW/BSW/LPS、FCS Thermal、MINUCON、FINE PURE 与 IGS，并标出制药适配结论、证据编号和内部验证问题。",
    requiredEvidenceIds: [
      "FUJIKIN-COMPANY-001",
      "FUJIKIN-PHARMA-001",
      "FUJIKIN-CHINA-001",
      "FUJIKIN-CHINA-002",
      "FUJIKIN-BNW-001",
      "FUJIKIN-FCS-001",
      "FUJIKIN-MINUCON-001",
      "FUJIKIN-PRICE-001"
    ],
    submissionChecklist: [
      "至少覆盖 5 个方向：BNW/BSW/LPS 卫生阀、FCS Thermal MFC、MINUCON 微小流量控制、FINE PURE/FCS Pressure 高纯系统和 IGS 高纯气体系统。",
      "把每个方向标成 direct、adjacent 或 not enough evidence，并写出对应客户任务。",
      "对每一类写明不能外推到制药主工艺的边界，尤其是半导体高纯、通用精密流控和生命科学卫生产品的区别。",
      "引用至少 6 个证据编号，且至少包含 BNW、FCS Thermal、MINUCON 和中国业务证据。",
      "列出至少 3 个内部验证问题：制药装机、常熟工厂实际生产系列、卫生认证或材料文件、价格交期和项目证据。"
    ],
    scoringRubric: [
      {
        dimension: "产品骨架",
        points: 20,
        passSignal:
          "能正确区分生命科学卫生阀、精密流量控制和半导体/高纯系统能力线。"
      },
      {
        dimension: "参数证据",
        points: 20,
        passSignal:
          "系列和型号证据可追溯，没有把集团能力、官网可见性或跨行业描述外推成制药项目事实。"
      },
      {
        dimension: "应用判断",
        points: 30,
        passSignal:
          "能把 BNW、FCS Thermal 和 MINUCON 映射到客户任务，并为 FINE PURE/IGS 写出排除条件。"
      },
      {
        dimension: "竞争策略",
        points: 30,
        passSignal:
          "能说明 Bürkert 面对 Fujikin 卫生阀、MFC 和微流控时的回应动作，以及哪些结论必须内部验证。"
      }
    ],
    reworkTriggers: [
      "把半导体高纯或 IGS 能力直接等同于制药主工艺能力。",
      "把常熟制造或中国法人存在写成具体制药系列的本地生产、库存、价格或交期。",
      "没有具体型号、口径、介质或工况就做参数优劣比较。",
      "把 FCS Pressure、FINE PURE、IGS 与 FCS Thermal/MFC 当成等价产品。",
      "直接沿用低价、关系型竞争或交付优势结论，但没有公开证据或内部验证问题。"
    ],
    reflectionPrompts: [
      "哪条 Fujikin 能力线最容易被客户或销售误读成制药主工艺优势？",
      "本次结论里哪三项必须让销售、应用工程或供应链内部验证？",
      "下次客户提到 Fujikin 高纯经验时，你会先追问哪三项工况或证据？"
    ],
    validationTaskIds: [
      "VAL-FUJIKIN-001",
      "VAL-FUJIKIN-002",
      "VAL-FUJIKIN-003",
      "VAL-CROSS-001",
      "VAL-CROSS-002"
    ]
  },
  {
    day: 7,
    title: "ESG 精锐本土竞争边界学习闭环",
    deliverable:
      "提交四张证据卡，覆盖 A00/A01 卫生隔膜阀、100 系列角座阀、800/801 疏水阀和 0P1 定位器，并标出 FACT、CLAIM、GAP 与内部验证问题。",
    requiredEvidenceIds: [
      "ESG-COMPANY-001",
      "ESG-PRODUCT-001",
      "ESG-CHINA-001",
      "ESG-PHARMA-001",
      "ESG-DIAPHRAGM-001",
      "ESG-CERT-001",
      "ESG-AUTOMATION-001",
      "ESG-100-001",
      "ESG-801-001",
      "ESG-PORTFOLIO-GAP-001"
    ],
    submissionChecklist: [
      "制作 A00/A01、100、800/801 和 0P1 四张证据卡，每张卡都标明 FACT、CLAIM、GAP 或 INTERNAL_VALIDATION。",
      "区分直接重叠、邻近重叠和不可等价：卫生隔膜阀、角座阀、公用工程疏水阀、基础定位器不能混成一个能力结论。",
      "对每条卫生认证、材料、Ra、膜片、压力温度和自动化声明写出证据等级，并说明是否取得证书或当前数据表原件。",
      "列出至少 4 个内部验证问题，覆盖证书原件、批次文件、真实净价、实际交期、制药案例和备件服务。",
      "明确 ESG 可能形成商业压力的场景，同时写出不能预设价格交期优势的条件。"
    ],
    scoringRubric: [
      {
        dimension: "产品骨架",
        points: 20,
        passSignal:
          "能正确说明 ESG 以本土不锈钢过程阀为主，重点覆盖卫生阀、公用工程阀和基础自动化。"
      },
      {
        dimension: "证据分级",
        points: 20,
        passSignal:
          "能把官网事实、企业认证声明、失效页面和缺口分别标成 FACT、CLAIM、GAP 或内部验证。"
      },
      {
        dimension: "应用判断",
        points: 30,
        passSignal:
          "能按标准阀包、低风险公用工程、关键卫生阀和自动化调节分别给出候选与排除条件。"
      },
      {
        dimension: "竞争策略",
        points: 30,
        passSignal:
          "能说明 Bürkert 面对 ESG 时如何拆分技术准入、商业验证和本地响应，而不是简单压价。"
      }
    ],
    reworkTriggers: [
      "预设国产厂商一定具备价格交期优势，但没有同规格报价、订单或交付证据。",
      "把普通工业阀、公用工程阀或疏水阀直接写成关键无菌主工艺适配。",
      "把 FDA、USP、EC 1935/2004 等官网表述当成已独立验证的证书事实。",
      "把 103 三通角座阀或 T 阀信号等同于复杂低死区多通隔膜阀块。",
      "没有索取当前数据表、证书原件、材料批次或 Ra 报告，就给出高威胁结论。"
    ],
    reflectionPrompts: [
      "ESG 最可能在哪类客户任务里给 Bürkert 造成商业压力？",
      "哪些 ESG 声明只能作为 CLAIM，必须由质量或应用工程复核？",
      "下次销售说 ESG 更便宜或更快时，你会要求补哪三类证据？"
    ],
    validationTaskIds: [
      "VAL-ESG-001",
      "VAL-ESG-002",
      "VAL-ESG-003",
      "VAL-ESG-004",
      "VAL-ESG-005",
      "VAL-CROSS-001",
      "VAL-CROSS-002"
    ]
  },
  {
    day: 8,
    title: "Bürkert-GEMÜ 卫生阀自动化学习闭环",
    deliverable:
      "提交一页对标表，覆盖 2103/2034/8652 与 650/649/P600/1441，并附证据编号、不可比较边界和内部验证问题。",
    requiredEvidenceIds: [
      "BURKERT-DIAPHRAGM-001",
      "BURKERT-AUTOMATION-001",
      "BURKERT-8652-001",
      "GEMU-650-001",
      "GEMU-649-001",
      "GEMU-MULTIPORT-001",
      "GEMU-1441-001"
    ],
    submissionChecklist: [
      "列出至少 3 个 Bürkert 候选 Type 和 3 个 GEMÜ 对标系列。",
      "把客户任务分成隔离、T 型分支、罐底、多通阀块、电动阀、阀顶反馈或阀岛架构。",
      "写出至少 5 个必问工况：介质、DN、温压、CIP/SIP、Ra、膜片、连接、排空或通信。",
      "明确至少 3 个不可直接比较边界，例如气动对电动、二位二通对多通阀块、全球产品对中国现货。",
      "引用至少 5 个证据编号，并把价格、交期、库存和客户装机量列入内部验证。"
    ],
    scoringRubric: [
      {
        dimension: "产品骨架",
        points: 20,
        passSignal:
          "能正确区分 2103、2034、8652 与 650、649、P600、1441 的产品角色。"
      },
      {
        dimension: "参数证据",
        points: 20,
        passSignal:
          "参数和证据编号可追溯，没有把宣传、全球可见性或系列总范围写成项目事实。"
      },
      {
        dimension: "应用判断",
        points: 30,
        passSignal:
          "能按客户任务输出候选、必问工况和排除条件，而不是直接说某品牌更好。"
      },
      {
        dimension: "竞争策略",
        points: 30,
        passSignal:
          "能说明 Bürkert 如何回应 GEMÜ 650、649 和 P600，并提出内部验证动作。"
      }
    ],
    reworkTriggers: [
      "把 GEMÜ 649 与 Bürkert 2103 当成直接同类单品比较。",
      "用几个普通三通阀直接替代 P600 多通阀块。",
      "把中国可见性、官网页面或全球目录写成中国库存、产地、价格或交期。",
      "没有引用证据编号，或引用少于 5 条。",
      "没有列出内部验证问题，却给出价格、交付或客户覆盖结论。"
    ],
    reflectionPrompts: [
      "这次对标里哪一个判断最容易被客户追问证据？",
      "如果客户只给了品牌和系列，没有给 P&ID，你会先拒绝比较哪几项？",
      "下一次客户会议前，你需要销售、应用工程或产品团队补哪两类内部信息？"
    ],
    validationTaskIds: [
      "VAL-GEMU-001",
      "VAL-GEMU-002",
      "VAL-BURKERT-001",
      "VAL-BURKERT-002",
      "VAL-CROSS-001",
      "VAL-CROSS-002"
    ]
  }
];

export function getTrainingClosure(
  day: number
): TrainingClosureDefinition | undefined {
  return closures.find((closure) => closure.day === day);
}

export function getTrainingClosures(): TrainingClosureDefinition[] {
  return [...closures];
}
