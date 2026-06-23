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

  it("defines a scorable loop for the Fujikin day 6 pharma boundary exercise", () => {
    const closure = getTrainingClosure(6);

    expect(closure).toMatchObject({
      day: 6,
      title: "Fujikin 制药适配边界学习闭环"
    });
    expect(closure?.requiredEvidenceIds).toContain("FUJIKIN-BNW-001");
    expect(closure?.requiredEvidenceIds).toContain("FUJIKIN-FCS-001");
    expect(closure?.submissionChecklist.join(" ")).toContain("内部验证");
    expect(closure?.scoringRubric.map((item) => item.points)).toEqual([
      20,
      20,
      30,
      30
    ]);
    expect(closure?.reworkTriggers.join(" ")).toContain("半导体高纯");
  });

  it("defines a scorable loop for the ESG day 7 local competitor boundary exercise", () => {
    const closure = getTrainingClosure(7);

    expect(closure).toMatchObject({
      day: 7,
      title: "ESG 精锐本土竞争边界学习闭环"
    });
    expect(closure?.requiredEvidenceIds).toContain("ESG-DIAPHRAGM-001");
    expect(closure?.requiredEvidenceIds).toContain("ESG-100-001");
    expect(closure?.requiredEvidenceIds).toContain("ESG-801-001");
    expect(closure?.submissionChecklist.join(" ")).toContain("FACT");
    expect(closure?.submissionChecklist.join(" ")).toContain("CLAIM");
    expect(closure?.scoringRubric.map((item) => item.points)).toEqual([
      20,
      20,
      30,
      30
    ]);
    expect(closure?.reworkTriggers.join(" ")).toContain("价格交期优势");
  });

  it("only enables closures for configured training days", () => {
    expect(getTrainingClosure(1)).toBeUndefined();
  });
});
