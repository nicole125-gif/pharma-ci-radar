import { describe, expect, it } from "vitest";
import { createAppRepository } from "../repository";

describe("competitor creation", () => {
  it("creates a new Pharma & Biotech competitor with source candidates", () => {
    const repo = createAppRepository();

    const competitor = repo.createCompetitor({
      name: "Watson-Marlow",
      differentiation: "Peristaltic pump specialist relevant to bioprocess fluid handling.",
      officialUrl: "https://www.wmfts.com"
    });

    const detail = repo.getCompetitorDetail(competitor.id);
    const dashboard = repo.getDashboard();

    expect(competitor.normalizedName).toBe("watson-marlow");
    expect(competitor.role).toBe("COMPETITOR");
    expect(dashboard.competitors.map((item) => item.name)).toContain("Watson-Marlow");
    expect(detail?.sources.map((source) => source.sourceType)).toEqual(["OFFICIAL_SITE", "CAREERS"]);
    expect(detail?.sources.every((source) => source.reviewStatus === "CANDIDATE")).toBe(true);
  });
});
