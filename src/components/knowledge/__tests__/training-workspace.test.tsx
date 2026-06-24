import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TrainingWorkspace } from "../training-workspace";

const validationTasks = [
  {
    definition: {
      validationId: "VAL-FUJIKIN-001",
      priority: "P0",
      company: "Fujikin",
      topic: "Pharma MFC installations",
      question: "FCS Thermal是否有中国发酵供气或制药配气安装？",
      evidenceRequired: "客户/OEM访谈；项目BOM",
      recommendedOwner: "销售与应用工程",
      decisionSupported: "MFC竞争定位",
      defaultStatus: "OPEN",
      executionOwner: "销售与应用工程",
      targetWindow: "OPEN",
      acceptanceRule: "必须锁定型号",
      minimumVerifiedRecords: 1
    },
    state: { validationId: "VAL-FUJIKIN-001", status: "OPEN" },
    verifiedEvidenceCount: 0,
    totalEvidenceCount: 0
  },
  {
    definition: {
      validationId: "VAL-FUJIKIN-002",
      priority: "P0",
      company: "Fujikin",
      topic: "China manufacturing",
      question: "常熟工厂实际生产哪些BNW、阀件或制药相关系列？",
      evidenceRequired: "产地证；订单",
      recommendedOwner: "供应链",
      decisionSupported: "本地化与交期判断",
      defaultStatus: "OPEN",
      executionOwner: "供应链",
      targetWindow: "OPEN",
      acceptanceRule: "不能由公司实体存在推断",
      minimumVerifiedRecords: 1
    },
    state: { validationId: "VAL-FUJIKIN-002", status: "OPEN" },
    verifiedEvidenceCount: 0,
    totalEvidenceCount: 0
  },
  {
    definition: {
      validationId: "VAL-ESG-001",
      priority: "P0",
      company: "ESG 精锐",
      topic: "Certificate originals",
      question: "A00/A01/A31的FDA、USP和EC 1935/2004声明覆盖哪些材料和型号？",
      evidenceRequired: "证书原件",
      recommendedOwner: "质量与应用工程",
      decisionSupported: "供应商资格",
      defaultStatus: "OPEN",
      executionOwner: "质量与应用工程",
      targetWindow: "OPEN",
      acceptanceRule: "网页文字不能替代证书",
      minimumVerifiedRecords: 1
    },
    state: { validationId: "VAL-ESG-001", status: "OPEN" },
    verifiedEvidenceCount: 0,
    totalEvidenceCount: 0
  },
  {
    definition: {
      validationId: "VAL-GEMU-001",
      priority: "P0",
      company: "GEMÜ",
      topic: "Multi-port delivery",
      question: "P600/P500阀块的中国设计、加工、验证和交付边界是什么？",
      evidenceRequired: "竞争报价；图纸",
      recommendedOwner: "销售与应用工程",
      decisionSupported: "阀块竞争策略",
      defaultStatus: "OPEN",
      executionOwner: "销售与应用工程",
      targetWindow: "OPEN",
      acceptanceRule: "区分中国设计与海外加工",
      minimumVerifiedRecords: 1
    },
    state: { validationId: "VAL-GEMU-001", status: "OPEN" },
    verifiedEvidenceCount: 0,
    totalEvidenceCount: 0
  }
] as const;

describe("training workspace", () => {
  it("renders a weekly overview of configured training closure loops", () => {
    render(
      <TrainingWorkspace
        curriculum={[
          {
            day: 6,
            week: 1,
            module: "Fujikin骨架",
            learningObjective:
              "区分生命科学卫生跨行业精密流控与半导体高纯",
            primaryMaterial: "fujikin-product-series-handbook.md",
            exercise:
              "将BNW、FCS Thermal、MINUCON、FINE PURE、IGS分类",
            requiredOutput: "三能力线分类表",
            coachReview: "产品经理检查是否泛化高纯能力",
            passCriteria: "全部分类正确且制药适用结论均有限定条件"
          },
          {
            day: 7,
            week: 1,
            module: "ESG骨架",
            learningObjective: "掌握可核验系列与低成熟证据边界",
            primaryMaterial: "esg-jingrui-product-handbook.md",
            exercise: "制作A00、100、800/801、0P1证据卡",
            requiredOutput: "四张证据卡含FACT CLAIM GAP",
            coachReview: "质量或产品经理复核证据等级",
            passCriteria: "每项声明正确标记且未预设价格交期优势"
          },
          {
            day: 8,
            week: 2,
            module: "Bürkert-GEMÜ卫生阀自动化深挖",
            learningObjective: "掌握直接对标与排除逻辑",
            primaryMaterial:
              "2026-06-burkert-gemu-pharma-valve-automation-deep-dive.md",
            exercise: "围绕2103/2034/8652与650/649/P600/1441完成对标演练",
            requiredOutput: "一页对标表",
            coachReview: "应用工程检查",
            passCriteria: "能解释直接对标邻近对标和不可替代边界"
          }
        ]}
        learners={[]}
        progress={[]}
        scores={[]}
        validationTasks={validationTasks}
        readOnly
      />
    );

    expect(screen.getByText("训练闭环总览")).toBeTruthy();
    expect(screen.getByText("3 个闭环任务")).toBeTruthy();
    expect(screen.getByText("25 条必须引用证据")).toBeTruthy();
    expect(screen.getByText("4 个待验证问题")).toBeTruthy();
    expect(screen.getByText("0 / 4 已验证")).toBeTruthy();
    expect(screen.getByText("DAY 6 · Fujikin骨架")).toBeTruthy();
    expect(screen.getByText("DAY 7 · ESG骨架")).toBeTruthy();
    expect(screen.getByText("DAY 8 · Bürkert-GEMÜ卫生阀自动化深挖")).toBeTruthy();
    expect(screen.getAllByText(/价格交期优势/).length).toBeGreaterThan(0);
    expect(screen.getByText("VAL-FUJIKIN-001")).toBeTruthy();
    expect(screen.getByText("VAL-ESG-001")).toBeTruthy();
    expect(screen.getByText("VAL-GEMU-001")).toBeTruthy();
    expect(screen.getAllByText("0/1 已验证").length).toBeGreaterThan(0);
    expect(
      screen
        .getByRole("link", { name: /VAL-FUJIKIN-001/ })
        .getAttribute("href")
    ).toBe("/knowledge?view=validation&q=VAL-FUJIKIN-001");
  });

  it("shows learner progress status in the closure overview", () => {
    render(
      <TrainingWorkspace
        curriculum={[
          {
            day: 6,
            week: 1,
            module: "Fujikin骨架",
            learningObjective:
              "区分生命科学卫生跨行业精密流控与半导体高纯",
            primaryMaterial: "fujikin-product-series-handbook.md",
            exercise:
              "将BNW、FCS Thermal、MINUCON、FINE PURE、IGS分类",
            requiredOutput: "三能力线分类表",
            coachReview: "产品经理检查是否泛化高纯能力",
            passCriteria: "全部分类正确且制药适用结论均有限定条件"
          },
          {
            day: 7,
            week: 1,
            module: "ESG骨架",
            learningObjective: "掌握可核验系列与低成熟证据边界",
            primaryMaterial: "esg-jingrui-product-handbook.md",
            exercise: "制作A00、100、800/801、0P1证据卡",
            requiredOutput: "四张证据卡含FACT CLAIM GAP",
            coachReview: "质量或产品经理复核证据等级",
            passCriteria: "每项声明正确标记且未预设价格交期优势"
          },
          {
            day: 8,
            week: 2,
            module: "Bürkert-GEMÜ卫生阀自动化深挖",
            learningObjective: "掌握直接对标与排除逻辑",
            primaryMaterial:
              "2026-06-burkert-gemu-pharma-valve-automation-deep-dive.md",
            exercise: "围绕2103/2034/8652与650/649/P600/1441完成对标演练",
            requiredOutput: "一页对标表",
            coachReview: "应用工程检查",
            passCriteria: "能解释直接对标邻近对标和不可替代边界"
          }
        ]}
        learners={[]}
        selectedLearner={{
          id: "learner-1",
          name: "Ada",
          cohort: "PM",
          active: true,
          createdAt: "2026-06-23"
        }}
        progress={[
          {
            learnerId: "learner-1",
            day: 6,
            completionStatus: "COMPLETE",
            coachResult: "PASS",
            updatedAt: "2026-06-23"
          },
          {
            learnerId: "learner-1",
            day: 7,
            completionStatus: "IN_PROGRESS",
            coachResult: "NOT_REVIEWED",
            updatedAt: "2026-06-23"
          }
        ]}
        scores={[]}
        readOnly
      />
    );

    expect(screen.getByText("1 / 3 已完成")).toBeTruthy();
    expect(screen.getAllByText("COMPLETE").length).toBeGreaterThan(0);
    expect(screen.getAllByText("IN_PROGRESS").length).toBeGreaterThan(0);
    expect(screen.getAllByText("NOT_STARTED").length).toBeGreaterThan(0);
  });

  it("renders the learning loop for the day 7 ESG local competitor exercise", () => {
    render(
      <TrainingWorkspace
        curriculum={[
          {
            day: 7,
            week: 1,
            module: "ESG骨架",
            learningObjective: "掌握可核验系列与低成熟证据边界",
            primaryMaterial: "esg-jingrui-product-handbook.md",
            exercise: "制作A00、100、800/801、0P1证据卡",
            requiredOutput: "四张证据卡含FACT CLAIM GAP",
            coachReview: "质量或产品经理复核证据等级",
            passCriteria: "每项声明正确标记且未预设价格交期优势"
          }
        ]}
        learners={[]}
        progress={[]}
        scores={[]}
        readOnly
      />
    );

    expect(
      screen.getAllByText("ESG 精锐本土竞争边界学习闭环").length
    ).toBeGreaterThan(0);
    expect(screen.getByText("返工红线")).toBeTruthy();
    expect(screen.getByText(/ESG-DIAPHRAGM-001/)).toBeTruthy();
    expect(screen.getByText(/ESG-100-001/)).toBeTruthy();
    expect(screen.getByText(/ESG-801-001/)).toBeTruthy();
    expect(screen.getAllByText(/价格交期优势/).length).toBeGreaterThan(0);
  });

  it("renders the learning loop for the day 6 Fujikin boundary exercise", () => {
    render(
      <TrainingWorkspace
        curriculum={[
          {
            day: 6,
            week: 1,
            module: "Fujikin骨架",
            learningObjective:
              "区分生命科学卫生跨行业精密流控与半导体高纯",
            primaryMaterial: "fujikin-product-series-handbook.md",
            exercise:
              "将BNW、FCS Thermal、MINUCON、FINE PURE、IGS分类",
            requiredOutput: "三能力线分类表",
            coachReview: "产品经理检查是否泛化高纯能力",
            passCriteria: "全部分类正确且制药适用结论均有限定条件"
          }
        ]}
        learners={[]}
        progress={[]}
        scores={[]}
        readOnly
      />
    );

    expect(
      screen.getAllByText("Fujikin 制药适配边界学习闭环").length
    ).toBeGreaterThan(0);
    expect(screen.getByText("返工红线")).toBeTruthy();
    expect(screen.getByText(/FUJIKIN-BNW-001/)).toBeTruthy();
    expect(screen.getByText(/FUJIKIN-FCS-001/)).toBeTruthy();
    expect(screen.getAllByText(/半导体高纯/).length).toBeGreaterThan(0);
  });

  it("renders the learning loop for the day 8 pharma valve deep dive", () => {
    render(
      <TrainingWorkspace
        curriculum={[
          {
            day: 8,
            week: 2,
            module: "Bürkert-GEMÜ卫生阀自动化深挖",
            learningObjective: "掌握直接对标与排除逻辑",
            primaryMaterial:
              "2026-06-burkert-gemu-pharma-valve-automation-deep-dive.md",
            exercise: "围绕2103/2034/8652与650/649/P600/1441完成对标演练",
            requiredOutput: "一页对标表",
            coachReview: "应用工程检查",
            passCriteria: "能解释直接对标邻近对标和不可替代边界"
          }
        ]}
        learners={[]}
        progress={[]}
        scores={[]}
        readOnly
      />
    );

    expect(
      screen.getAllByText("Bürkert-GEMÜ 卫生阀自动化学习闭环").length
    ).toBeGreaterThan(0);
    expect(screen.getByText("提交清单")).toBeTruthy();
    expect(screen.getByText("返工红线")).toBeTruthy();
    expect(screen.getByText("必须引用证据")).toBeTruthy();
    expect(screen.getAllByText(/BURKERT-AUTOMATION-001/).length).toBeGreaterThan(0);
    expect(screen.getByText(/GEMU-650-001/)).toBeTruthy();
    expect(screen.getByText(/竞争策略/)).toBeTruthy();
  });
});
