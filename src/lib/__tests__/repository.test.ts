import { describe, expect, it } from "vitest";
import { createAppRepository } from "../repository";

describe("app repository integration flow", () => {
  it("moves a candidate source to approved and surfaces monitored events on dashboard", async () => {
    const repo = createAppRepository();
    const candidate = repo.getSources({ reviewStatus: "CANDIDATE" })[0];

    const approved = repo.reviewSource(candidate.id, "APPROVED");
    expect(approved.reviewStatus).toBe("APPROVED");

    const result = await repo.runMonitorJob("New pharma valve platform with faster quotation and delivery program");
    const dashboard = repo.getDashboard();

    expect(result.createdEvents).toBeGreaterThan(0);
    expect(dashboard.recentEvents[0].summary).toContain("New pharma valve platform");
    expect(dashboard.pendingScoreSuggestions.length).toBeGreaterThan(0);
  });
});
