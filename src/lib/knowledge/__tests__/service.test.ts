import { describe, expect, it } from "vitest";
import { buildKnowledgeWorkspace } from "../service";

describe("knowledge workspace service", () => {
  it("keeps master knowledge readable when the database is unavailable", async () => {
    const workspace = await buildKnowledgeWorkspace({
      store: { available: false, reason: "DATABASE_NOT_CONFIGURED" }
    });

    expect(workspace.database.available).toBe(false);
    expect(workspace.summary.burkertTypes).toBe(511);
    expect(workspace.training.learners).toEqual([]);
    expect(workspace.validation.tasks).toHaveLength(16);
  });
});
