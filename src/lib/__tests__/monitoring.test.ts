import { describe, expect, it } from "vitest";
import { createHash } from "node:crypto";
import {
  approveScoreSuggestion,
  createAlertForEvent,
  createIntelEventFromSnapshot,
  createSnapshotIfChanged,
  createWeeklyBrief
} from "../workflow";
import type { IntelEvent, ScoreSuggestion, Snapshot, Source } from "../types";

const source: Source = {
  id: "source-gemu-home",
  competitorId: "gemu",
  url: "https://www.gemu-group.com",
  sourceType: "OFFICIAL_SITE",
  reviewStatus: "APPROVED",
  discoveredAt: "2026-05-18T00:00:00.000Z"
};

describe("monitoring workflow", () => {
  it("ignores unchanged content hashes", async () => {
    const text = "Existing copy";
    const existing: Snapshot[] = [
      {
        id: "snapshot-1",
        sourceId: source.id,
        fetchedAt: "2026-05-18T00:00:00.000Z",
        contentHash: createHash("sha256").update(text).digest("hex"),
        title: "Gemu",
        extractedText: text,
        rawMetadata: {}
      }
    ];

    await expect(createSnapshotIfChanged(source, text, existing)).resolves.toBeNull();
  });

  it("converts a changed approved source into an intel event visible to the dashboard", async () => {
    const snapshot = await createSnapshotIfChanged(source, "New aseptic valve platform and faster delivery program", []);
    expect(snapshot).not.toBeNull();

    const event = createIntelEventFromSnapshot(source, snapshot!, ["Quality of products, systems & services", "fast response time at all customer touchpoints"]);

    expect(event.summary).toContain("New aseptic valve platform");
    expect(event.impactLevel).toBe("HIGH");
    expect(event.relatedDimensions).toContain("fast response time at all customer touchpoints");
  });

  it("requires manual approval before score suggestions update official scores", () => {
    const suggestion: ScoreSuggestion = {
      id: "score-1",
      competitorId: "gemu",
      dimensionId: "fast-response",
      previousScore: 7.125,
      suggestedScore: 8,
      rationale: "Public delivery messaging improved materially.",
      status: "PENDING",
      createdAt: "2026-05-18T00:00:00.000Z"
    };

    const rejected = approveScoreSuggestion(suggestion, false);
    expect(rejected.status).toBe("REJECTED");
    expect(rejected.approvedScore).toBeUndefined();

    const approved = approveScoreSuggestion(suggestion, true);
    expect(approved.status).toBe("APPROVED");
    expect(approved.approvedScore).toBe(8);
  });

  it("creates high-priority alerts only for meaningful competitor changes", () => {
    const lowEvent: IntelEvent = {
      id: "event-low",
      competitorId: "gemu",
      sourceId: source.id,
      eventType: "CONTENT",
      summary: "Published a routine event recap.",
      evidenceUrl: source.url,
      impactLevel: "LOW",
      relatedDimensions: ["Industry & application knowledge"],
      detectedAt: "2026-05-18T00:00:00.000Z"
    };
    const highEvent = { ...lowEvent, id: "event-high", eventType: "PRICING" as const, impactLevel: "HIGH" as const };

    expect(createAlertForEvent(lowEvent)).toBeNull();
    expect(createAlertForEvent(highEvent)?.impactLevel).toBe("HIGH");
  });

  it("builds weekly briefs from approved events and excludes rejected suggestions", () => {
    const event: IntelEvent = {
      id: "event-1",
      competitorId: "gemu",
      sourceId: source.id,
      eventType: "PRODUCT",
      summary: "Gemu emphasized pharma-specific diaphragm valve availability.",
      evidenceUrl: source.url,
      impactLevel: "HIGH",
      relatedDimensions: ["Industry & application knowledge"],
      detectedAt: "2026-05-18T00:00:00.000Z"
    };
    const suggestions: ScoreSuggestion[] = [
      {
        id: "approved",
        competitorId: "gemu",
        dimensionId: "industry-knowledge",
        previousScore: 7.8,
        suggestedScore: 8.2,
        approvedScore: 8.2,
        rationale: "More pharma-specific messaging.",
        status: "APPROVED",
        createdAt: "2026-05-18T00:00:00.000Z"
      },
      {
        id: "rejected",
        competitorId: "festo",
        dimensionId: "systems",
        previousScore: 4,
        suggestedScore: 6,
        rationale: "Rejected by analyst.",
        status: "REJECTED",
        createdAt: "2026-05-18T00:00:00.000Z"
      }
    ];

    const brief = createWeeklyBrief("2026-05-18", [event], suggestions);

    expect(brief.approvedEvents).toHaveLength(1);
    expect(brief.executiveSummary).toContain("1 high-impact change");
    expect(brief.executiveSummary).toContain("1 approved score move");
  });
});
