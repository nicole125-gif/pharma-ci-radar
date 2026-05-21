import { describe, expect, it } from "vitest";
import { createAppRepository } from "../repository";

describe("competitive analysis layer", () => {
  it("treats scores as historical reference and promotes interpretation as the primary output", () => {
    const repo = createAppRepository();

    const gemu = repo.getCompetitorDetail("gemu");
    const dashboard = repo.getDashboard();

    expect(gemu?.analysis?.threatLevel).toBe("HIGH");
    expect(gemu?.analysis?.oneLineJudgment).toContain("direct competitor");
    expect(gemu?.analysis?.recommendedActions.some((action) => action.owner === "Management")).toBe(true);
    expect(dashboard.referenceScoreNotice).toContain("historical expert reference");
    expect(dashboard.topAnalyses[0].threatLevel).toBe("HIGH");
  });

  it("creates an observation-stage analysis draft for newly added competitors", () => {
    const repo = createAppRepository();

    const competitor = repo.createCompetitor({
      name: "Watson-Marlow",
      differentiation: "Peristaltic pump specialist relevant to bioprocess fluid handling.",
      officialUrl: "https://www.wmfts.com"
    });
    const detail = repo.getCompetitorDetail(competitor.id);

    expect(detail?.analysis?.threatLevel).toBe("WATCHING");
    expect(detail?.analysis?.confidence).toBe("LOW");
    expect(detail?.analysis?.evidenceBasis).toContain("Manual competitor creation");
  });

  it("updates competitor interpretation when approved monitoring evidence arrives", async () => {
    const repo = createAppRepository();
    const competitor = repo.createCompetitor({
      name: "Watson-Marlow",
      differentiation: "Peristaltic pump specialist relevant to bioprocess fluid handling.",
      officialUrl: "https://www.wmfts.com"
    });
    const source = repo.getSources({ reviewStatus: "CANDIDATE" }).find((item) => item.competitorId === competitor.id)!;

    repo.reviewSource(source.id, "APPROVED");
    await repo.runMonitorJob("New single-use pharma pump platform with faster local service hiring");

    const detail = repo.getCompetitorDetail(competitor.id);
    expect(detail?.analysis?.threatLevel).toBe("HIGH");
    expect(detail?.analysis?.confidence).toBe("MEDIUM");
    expect(detail?.analysis?.strategicIntent).toContain("product availability");
    expect(detail?.analysis?.evidenceBasis.some((evidence) => evidence.includes("single-use pharma pump"))).toBe(true);
  });
});
