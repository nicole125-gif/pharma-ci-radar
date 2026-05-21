import { describe, expect, it } from "vitest";
import { createAppRepository } from "../repository";

describe("strategic briefing", () => {
  it("turns competitor analysis into an executive action brief", () => {
    const repo = createAppRepository();

    const brief = repo.getStrategicBrief();

    expect(brief.headline).toContain("Gemu");
    expect(brief.priorityThreats[0].competitorName).toBe("Gemu");
    expect(brief.priorityThreats[0].threatLevel).toBe("HIGH");
    expect(brief.watchlist.some((item) => item.threatLevel === "WATCHING")).toBe(false);
    expect(brief.actionPlan.Management.length).toBeGreaterThan(0);
    expect(brief.actionPlan.Sales.length).toBeGreaterThan(0);
    expect(brief.actionPlan.Product.length).toBeGreaterThan(0);
    expect(brief.evidenceHighlights.some((item) => item.includes("Gemu"))).toBe(true);
    expect(brief.scoreReferenceNote).toContain("historical expert reference");
  });
});
