import { describe, expect, it } from "vitest";
import { buildDashboardView } from "../dashboard-view";
import { createAppRepository } from "../repository";

describe("dashboard view model", () => {
  it("turns repository dashboard data into an executive-first layout model", () => {
    const repo = createAppRepository();
    const dashboard = repo.getDashboard();
    const view = buildDashboardView(dashboard);

    expect(view.heroVerdict).toContain("Gemu");
    expect(view.heroSignals).toHaveLength(3);
    expect(view.actionQueue[0].category).toBe("FIELD_INTEL");
    expect(view.recentEvents[0].impactLevel).toBe("HIGH");
    expect(view.recentEvents.length).toBeLessThanOrEqual(5);
  });
});
