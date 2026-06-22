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
}

const closures: TrainingClosureDefinition[] = [
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
    ]
  }
];

export function getTrainingClosure(
  day: number
): TrainingClosureDefinition | undefined {
  return closures.find((closure) => closure.day === day);
}
