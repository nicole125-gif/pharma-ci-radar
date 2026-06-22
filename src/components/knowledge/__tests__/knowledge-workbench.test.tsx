import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { KnowledgeWorkbench } from "../knowledge-workbench";

describe("knowledge workbench", () => {
  it("starts from five product-manager tasks", () => {
    render(
      <KnowledgeWorkbench
        summary={{
          burkertTypes: 511,
          competitorRecords: 307,
          scenarios: 12,
          validationTasks: 16,
          p0Tasks: 10
        }}
        evidenceHealth={{
          totalEvidence: 361,
          directlyUsableEvidence: 320,
          riskyEvidence: 20,
          unlinkedRiskyEvidence: 2,
          p0ValidationTasks: 10,
          companyHealth: [
            {
              company: "ESG 精锐",
              strongEvidence: 4,
              riskyEvidence: 8,
              linkedRiskyEvidence: 6,
              unlinkedRiskyEvidence: 2
            }
          ],
          priorityActions: [
            {
              id: "VAL-ESG-001",
              title: "VAL-ESG-001 · Certificate originals",
              detail: "6 条风险证据待内部核验；负责人 质量与应用工程",
              href: "/knowledge?view=validation&q=VAL-ESG-001",
              priority: "P0"
            }
          ]
        }}
        database={{ available: false, reason: "DATABASE_NOT_CONFIGURED" }}
        validationTasks={[]}
        learners={[]}
      />
    );

    expect(screen.getByText("为客户选型")).toBeTruthy();
    expect(screen.getByText("比较竞品")).toBeTruthy();
    expect(screen.getByText("准备客户拜访")).toBeTruthy();
    expect(screen.getByText("继续训练")).toBeTruthy();
    expect(screen.getByText("验证一个判断")).toBeTruthy();
    expect(screen.getByText("证据健康与优先行动")).toBeTruthy();
    expect(screen.getByText("管理层简报")).toBeTruthy();
    expect(screen.getByText("公司级风险分布")).toBeTruthy();
    expect(screen.getByText("VAL-ESG-001 · Certificate originals")).toBeTruthy();
    expect(screen.getByText(/只读模式/)).toBeTruthy();
  });
});
