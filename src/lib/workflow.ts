import { createHash } from "node:crypto";
import type { Alert, IntelEvent, ScoreSuggestion, Snapshot, Source, WeeklyBrief } from "./types";

function nowIso() {
  return new Date().toISOString();
}

function hashContent(content: string) {
  return createHash("sha256").update(content.trim()).digest("hex");
}

export async function createSnapshotIfChanged(source: Source, extractedText: string, existingSnapshots: Snapshot[]) {
  const contentHash = hashContent(extractedText);
  const hasSameHash = existingSnapshots.some((snapshot) => snapshot.sourceId === source.id && snapshot.contentHash === contentHash);

  if (hasSameHash) {
    return null;
  }

  return {
    id: `snapshot-${source.id}-${contentHash.slice(0, 10)}`,
    sourceId: source.id,
    fetchedAt: nowIso(),
    contentHash,
    title: new URL(source.url).hostname,
    extractedText,
    rawMetadata: {
      sourceType: source.sourceType
    }
  } satisfies Snapshot;
}

export function createIntelEventFromSnapshot(source: Source, snapshot: Snapshot, relatedDimensions: string[]) {
  const text = snapshot.extractedText;
  const eventType = inferEventType(source, text);
  const impactLevel = inferImpactLevel(eventType, text, relatedDimensions);

  return {
    id: `event-${snapshot.id}`,
    competitorId: source.competitorId,
    sourceId: source.id,
    eventType,
    summary: text.length > 160 ? `${text.slice(0, 157)}...` : text,
    evidenceUrl: source.url,
    impactLevel,
    relatedDimensions,
    detectedAt: snapshot.fetchedAt
  } satisfies IntelEvent;
}

export function approveScoreSuggestion(suggestion: ScoreSuggestion, approve: boolean) {
  return {
    ...suggestion,
    status: approve ? "APPROVED" : "REJECTED",
    approvedScore: approve ? suggestion.suggestedScore : undefined,
    reviewedAt: nowIso()
  } satisfies ScoreSuggestion;
}

export function createAlertForEvent(event: IntelEvent) {
  const alertableEventTypes = new Set(["PRICING", "PRODUCT", "HIRING", "POSITIONING"]);

  if (event.impactLevel !== "HIGH" && !alertableEventTypes.has(event.eventType)) {
    return null;
  }

  return {
    id: `alert-${event.id}`,
    title: `${event.impactLevel} impact ${event.eventType.toLowerCase()} change`,
    body: event.summary,
    impactLevel: event.impactLevel,
    linkedEventId: event.id,
    createdAt: event.detectedAt
  } satisfies Alert;
}

export function createWeeklyBrief(weekStart: string, events: IntelEvent[], suggestions: ScoreSuggestion[]) {
  const approvedScoreSuggestions = suggestions.filter((suggestion) => suggestion.status === "APPROVED");
  const approvedEvents = events.filter((event) => event.impactLevel !== "LOW");
  const highImpactCount = approvedEvents.filter((event) => event.impactLevel === "HIGH").length;
  const riskEvents = approvedEvents.filter((event) => event.eventType === "PRICING" || event.eventType === "PRODUCT");
  const opportunityEvents = approvedEvents.filter((event) => event.eventType === "HIRING" || event.eventType === "CONTENT");

  return {
    id: `weekly-${weekStart}`,
    weekStart,
    executiveSummary: `${highImpactCount} high-impact change${highImpactCount === 1 ? "" : "s"} and ${approvedScoreSuggestions.length} approved score move${approvedScoreSuggestions.length === 1 ? "" : "s"} require management attention.`,
    keyRisks: riskEvents.length ? riskEvents.map((event) => event.summary) : ["No critical pricing or product risk was confirmed this week."],
    keyOpportunities: opportunityEvents.length
      ? opportunityEvents.map((event) => event.summary)
      : ["No major hiring or content-led opportunity was confirmed this week."],
    approvedEvents,
    approvedScoreSuggestions
  } satisfies WeeklyBrief;
}

function inferEventType(source: Source, text: string): IntelEvent["eventType"] {
  const lower = text.toLowerCase();
  if (source.sourceType === "PRICING" || lower.includes("price") || lower.includes("pricing")) return "PRICING";
  if (source.sourceType === "CAREERS" || lower.includes("hiring") || lower.includes("career")) return "HIRING";
  if (lower.includes("platform") || lower.includes("product") || lower.includes("valve")) return "PRODUCT";
  if (lower.includes("positioning") || lower.includes("strategy")) return "POSITIONING";
  if (source.sourceType === "NEWS") return "NEWS";
  return "CONTENT";
}

function inferImpactLevel(eventType: IntelEvent["eventType"], text: string, relatedDimensions: string[]) {
  const lower = text.toLowerCase();
  const strongSignal = lower.includes("new") || lower.includes("faster") || lower.includes("launch") || lower.includes("pharma");
  if (eventType === "PRICING" || eventType === "PRODUCT" || strongSignal || relatedDimensions.length >= 2) return "HIGH";
  if (eventType === "HIRING" || eventType === "POSITIONING") return "MEDIUM";
  return "LOW";
}
