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
    expect(screen.getByText(/只读模式/)).toBeTruthy();
  });
});
