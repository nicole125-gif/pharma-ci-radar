import { describe, expect, it } from "vitest";
import { createAppRepository } from "../repository";

describe("sales intelligence pool", () => {
  it("keeps sales-submitted competitor intel pending until it is accepted", () => {
    const repo = createAppRepository();

    const intel = repo.createSalesIntel({
      competitorId: "gemu",
      accountContext: "匿名制药客户改造项目",
      region: "华东",
      submittedBy: "Sales team",
      signalType: "DELIVERY",
      reliability: "MEDIUM",
      impactLevel: "HIGH",
      summary: "客户反馈 Gemu 在同类隔膜阀机会中的交期更快。",
      sensitive: true
    });

    expect(intel.status).toBe("PENDING");
    expect(repo.getCompetitorDetail("gemu")?.events.some((event) => event.id.includes(intel.id))).toBe(false);

    const accepted = repo.reviewSalesIntel(intel.id, "ACCEPTED");

    expect(accepted.status).toBe("ACCEPTED");
    expect(repo.getCompetitorDetail("gemu")?.events.some((event) => event.id.includes(intel.id))).toBe(true);
  });

  it("surfaces repeated sales signals by competitor and signal type", () => {
    const repo = createAppRepository();

    repo.createSalesIntel({
      competitorId: "gemu",
      accountContext: "匿名项目 A",
      region: "华东",
      submittedBy: "Sales team",
      signalType: "DELIVERY",
      reliability: "MEDIUM",
      impactLevel: "MEDIUM",
      summary: "销售反馈 Gemu 交期更快。",
      sensitive: true
    });
    repo.createSalesIntel({
      competitorId: "gemu",
      accountContext: "匿名项目 B",
      region: "华南",
      submittedBy: "Sales team",
      signalType: "DELIVERY",
      reliability: "HIGH",
      impactLevel: "HIGH",
      summary: "另一客户也提到 Gemu 本地交付更快。",
      sensitive: true
    });

    const board = repo.getSalesIntelBoard();

    expect(board.repeatedSignals[0]).toMatchObject({
      competitorId: "gemu",
      competitorName: "Gemu",
      signalType: "DELIVERY"
    });
    expect(board.repeatedSignals[0].count).toBeGreaterThanOrEqual(2);
  });
});
