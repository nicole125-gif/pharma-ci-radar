import { describe, expect, it } from "vitest";
import { loadKnowledgeCatalog } from "../catalog";
import {
  buildExecutiveEvidenceBrief,
  renderExecutiveEvidenceBriefMarkdown
} from "../executive-brief";

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

  it("exports a markdown draft for executive review", async () => {
    const catalog = await loadKnowledgeCatalog();
    const brief = buildExecutiveEvidenceBrief(catalog);
    const markdown = renderExecutiveEvidenceBriefMarkdown(brief, "2026-06-22");

    expect(markdown).toContain("# Bürkert Pharma CI Executive Brief");
    expect(markdown).toContain("生成日期：2026-06-22");
    expect(markdown).toContain("## 证据可信度总览");
    expect(markdown).toContain("## Top 风险判断");
    expect(markdown).toContain("## 判断使用边界");
    expect(markdown).toContain(brief.topRiskEvidence[0].evidenceId);
    expect(markdown).not.toContain("undefined");
    expect(markdown).not.toContain("TBD");
  });
});
