import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TrainingWorkspace } from "../training-workspace";

describe("training workspace", () => {
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

    expect(screen.getByText("Bürkert-GEMÜ 卫生阀自动化学习闭环")).toBeTruthy();
    expect(screen.getByText("提交清单")).toBeTruthy();
    expect(screen.getByText("返工红线")).toBeTruthy();
    expect(screen.getByText("必须引用证据")).toBeTruthy();
    expect(screen.getByText(/BURKERT-AUTOMATION-001/)).toBeTruthy();
    expect(screen.getByText(/GEMU-650-001/)).toBeTruthy();
    expect(screen.getByText(/竞争策略/)).toBeTruthy();
  });
});
