import { describe, expect, it } from "vitest";
import { loadKnowledgeCatalog } from "../catalog";
import { buildExecutiveEvidenceBrief } from "../executive-brief";

describe("executive evidence brief", () => {
  it("builds a management-ready evidence risk summary", async () => {
    const catalog = await loadKnowledgeCatalog();
    const brief = buildExecutiveEvidenceBrief(catalog);

    expect(brief.headline).toContain("公开证据");
    expect(brief.directlyUsableEvidence).toBeGreaterThan(300);
    expect(brief.riskyEvidence).toBeGreaterThan(0);
    expect(brief.companyRiskRanking[0]).toEqual(
      expect.objectContaining({
        company: expect.any(String),
        riskyEvidence: expect.any(Number)
      })
    );
    expect(brief.topRiskEvidence.length).toBeGreaterThan(0);
    expect(brief.topRiskEvidence[0]).toEqual(
      expect.objectContaining({
        evidenceId: expect.any(String),
        href: expect.stringContaining("/knowledge?view=evidence")
      })
    );
    expect(brief.topValidationActions.length).toBeGreaterThan(0);
    expect(brief.usageBoundaries.map((item) => item.label)).toEqual([
      "可外部引用",
      "仅内部讨论",
      "不应作为结论"
    ]);
  });
});
