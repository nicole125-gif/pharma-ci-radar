import { describe, expect, it } from "vitest";
import { getTrainingClosure } from "../training-closure";

describe("training closure definitions", () => {
  it("defines a scorable loop for the Bürkert-GEMÜ day 8 deep dive", () => {
    const closure = getTrainingClosure(8);

    expect(closure).toMatchObject({
      day: 8,
      title: "Bürkert-GEMÜ 卫生阀自动化学习闭环"
    });
    expect(closure?.requiredEvidenceIds).toContain("BURKERT-AUTOMATION-001");
    expect(closure?.requiredEvidenceIds).toContain("GEMU-650-001");
    expect(closure?.submissionChecklist.join(" ")).toContain("内部验证");
    expect(closure?.scoringRubric.map((item) => item.points)).toEqual([
      20,
      20,
      30,
      30
    ]);
    expect(closure?.reworkTriggers.join(" ")).toContain("P600");
  });

  it("only enables closures for configured training days", () => {
    expect(getTrainingClosure(1)).toBeUndefined();
  });
});
