import { describe, expect, it } from "vitest";
import { createAppRepository } from "../repository";

describe("battlecards", () => {
  it("turns priority competitor analysis into sales-ready battlecards", () => {
    const repo = createAppRepository();

    const cards = repo.getBattlecards();
    const gemu = cards.find((card) => card.competitorId === "gemu");

    expect(cards.length).toBeGreaterThanOrEqual(4);
    expect(gemu?.competitorName).toBe("Gemu");
    expect(gemu?.threatLevel).toBe("HIGH");
    expect(gemu?.defenseNarrative).toContain("Bürkert");
    expect(gemu?.talkTracks.length).toBeGreaterThanOrEqual(3);
    expect(gemu?.watchSignals.some((signal) => signal.includes("delivery") || signal.includes("local"))).toBe(true);
    expect(gemu?.proofPoints.some((point) => point.includes("full-loop") || point.includes("system"))).toBe(true);
  });
});
