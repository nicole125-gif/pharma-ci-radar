export type Industry = "Pharma & Biotech";

export type CompetitorRole = "OWN_COMPANY" | "COMPETITOR";
export type EntityStatus = "ACTIVE" | "PAUSED";

export type SourceType = "OFFICIAL_SITE" | "PRICING" | "BLOG" | "NEWS" | "CAREERS" | "SOCIAL" | "OTHER";
export type ReviewStatus = "CANDIDATE" | "APPROVED" | "REJECTED";
export type ImpactLevel = "LOW" | "MEDIUM" | "HIGH";
export type EventType = "PRODUCT" | "PRICING" | "HIRING" | "NEWS" | "CONTENT" | "POSITIONING";
export type ScoreSuggestionStatus = "PENDING" | "APPROVED" | "REJECTED";
export type ThreatLevel = "LOW" | "MEDIUM" | "HIGH" | "WATCHING";
export type ConfidenceLevel = "LOW" | "MEDIUM" | "HIGH";
export type SalesIntelStatus = "PENDING" | "ACCEPTED" | "REJECTED";
export type SalesIntelSignalType = "DELIVERY" | "PRICE" | "SERVICE" | "PRODUCT" | "RELATIONSHIP" | "OTHER";
export type SalesIntelReliability = "LOW" | "MEDIUM" | "HIGH";

export interface Competitor {
  id: string;
  name: string;
  normalizedName: string;
  industry: Industry;
  role: CompetitorRole;
  status: EntityStatus;
  differentiation: string;
}

export interface Dimension {
  id: string;
  name: string;
  description: string;
}

export interface CompetitorScore {
  competitorId: string;
  dimensionId: string;
  value: number;
}

export interface RecommendedAction {
  owner: "Management" | "Sales" | "Product" | "Marketing";
  action: string;
}

export interface CompetitorAnalysis {
  competitorId: string;
  oneLineJudgment: string;
  currentPositioning: string;
  strategicIntent: string;
  threatLevel: ThreatLevel;
  confidence: ConfidenceLevel;
  evidenceBasis: string[];
  impactOnBurkert: {
    product: string;
    price: string;
    delivery: string;
    customerRelationship: string;
    channel: string;
    localization: string;
  };
  weaknesses: string[];
  recommendedActions: RecommendedAction[];
  updatedAt: string;
}

export interface BriefThreat {
  competitorId: string;
  competitorName: string;
  threatLevel: ThreatLevel;
  confidence: ConfidenceLevel;
  judgment: string;
  strategicIntent: string;
}

export interface StrategicBrief {
  headline: string;
  priorityThreats: BriefThreat[];
  watchlist: BriefThreat[];
  actionPlan: Record<RecommendedAction["owner"], string[]>;
  evidenceHighlights: string[];
  scoreReferenceNote: string;
  generatedAt: string;
}

export interface Battlecard {
  competitorId: string;
  competitorName: string;
  threatLevel: ThreatLevel;
  confidence: ConfidenceLevel;
  defenseNarrative: string;
  talkTracks: string[];
  watchSignals: string[];
  proofPoints: string[];
  trapsToAvoid: string[];
  nextActionOwner: RecommendedAction["owner"];
  updatedAt: string;
}

export interface Source {
  id: string;
  competitorId: string;
  url: string;
  sourceType: SourceType;
  reviewStatus: ReviewStatus;
  discoveredAt: string;
  reviewedAt?: string;
}

export interface Snapshot {
  id: string;
  sourceId: string;
  fetchedAt: string;
  contentHash: string;
  title: string;
  extractedText: string;
  rawMetadata: Record<string, string | number | boolean | null>;
}

export interface IntelEvent {
  id: string;
  competitorId: string;
  sourceId: string;
  eventType: EventType;
  summary: string;
  evidenceUrl: string;
  impactLevel: ImpactLevel;
  relatedDimensions: string[];
  detectedAt: string;
}

export interface ScoreSuggestion {
  id: string;
  competitorId: string;
  dimensionId: string;
  previousScore: number;
  suggestedScore: number;
  approvedScore?: number;
  rationale: string;
  status: ScoreSuggestionStatus;
  createdAt: string;
  reviewedAt?: string;
}

export interface Alert {
  id: string;
  title: string;
  body: string;
  impactLevel: ImpactLevel;
  linkedEventId: string;
  createdAt: string;
  readAt?: string;
}

export interface WeeklyBrief {
  id: string;
  weekStart: string;
  executiveSummary: string;
  keyRisks: string[];
  keyOpportunities: string[];
  approvedEvents: IntelEvent[];
  approvedScoreSuggestions: ScoreSuggestion[];
}

export interface SalesIntel {
  id: string;
  competitorId: string;
  accountContext: string;
  region: string;
  submittedBy: string;
  signalType: SalesIntelSignalType;
  reliability: SalesIntelReliability;
  impactLevel: ImpactLevel;
  summary: string;
  sensitive: boolean;
  status: SalesIntelStatus;
  submittedAt: string;
  reviewedAt?: string;
}

export interface RepeatedSalesSignal {
  competitorId: string;
  competitorName: string;
  signalType: SalesIntelSignalType;
  count: number;
  latestSummary: string;
  impactLevel: ImpactLevel;
}

export interface SalesIntelBoard {
  competitors: Competitor[];
  pending: SalesIntel[];
  accepted: SalesIntel[];
  rejected: SalesIntel[];
  repeatedSignals: RepeatedSalesSignal[];
}

export interface ActionQueueItem {
  id: string;
  category: "FIELD_INTEL" | "SOURCE_REVIEW" | "SCORE_REVIEW" | "ALERT";
  title: string;
  detail: string;
  href: string;
  impactLevel: ImpactLevel;
  status: "OPEN";
}

export interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  role: "ADMIN" | "VIEWER";
}
