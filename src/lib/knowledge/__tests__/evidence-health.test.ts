import { describe, expect, it } from "vitest";
import { loadKnowledgeCatalog } from "../catalog";
import { buildEvidenceHealthSummary } from "../evidence-health";

describe("knowledge evidence health", () => {
  it("summarizes usable evidence, risky evidence, and priority actions", async () => {
    const catalog = await loadKnowledgeCatalog();
    const summary = buildEvidenceHealthSummary(
      catalog.evidenceRecords,
      catalog.validationTasks
    );

    expect(summary.totalEvidence).toBe(catalog.evidenceRecords.length);
    expect(summary.directlyUsableEvidence).toBeGreaterThan(300);
    expect(summary.riskyEvidence).toBeGreaterThan(0);
    expect(summary.p0ValidationTasks).toBe(10);
    expect(summary.companyHealth).toContainEqual(
      expect.objectContaining({ company: "ESG 精锐", riskyEvidence: expect.any(Number) })
    );
    expect(summary.priorityActions.length).toBeGreaterThan(0);
    expect(summary.priorityActions[0]).toEqual(
      expect.objectContaining({ priority: "P0" })
    );
  });
});
