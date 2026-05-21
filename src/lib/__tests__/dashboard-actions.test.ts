import { describe, expect, it } from "vitest";
import { createAppRepository } from "../repository";

describe("dashboard action queue", () => {
  it("prioritizes human review work on the executive dashboard", () => {
    const repo = createAppRepository();

    const dashboard = repo.getDashboard();

    expect(dashboard.actionQueue.length).toBeGreaterThanOrEqual(3);
    expect(dashboard.actionQueue[0]).toMatchObject({
      category: "FIELD_INTEL",
      href: "/sales-intel"
    });
    expect(dashboard.actionQueue.some((item) => item.category === "SOURCE_REVIEW")).toBe(true);
    expect(dashboard.actionQueue.every((item) => item.status === "OPEN")).toBe(true);
  });
});
