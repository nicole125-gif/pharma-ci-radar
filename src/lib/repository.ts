import {
  CI_DIMENSIONS,
  INITIAL_ANALYSES,
  INITIAL_SCORES,
  INITIAL_SOURCE_CANDIDATES,
  INDUSTRY,
  PHARMA_BIOTECH_COMPETITORS
} from "./seed";
import type {
  Alert,
  ActionQueueItem,
  Battlecard,
  Competitor,
  CompetitorAnalysis,
  CompetitorScore,
  Dimension,
  IntelEvent,
  ImpactLevel,
  ReviewStatus,
  SalesIntel,
  SalesIntelBoard,
  SalesIntelStatus,
  ScoreSuggestion,
  Snapshot,
  Source,
  StrategicBrief,
  WeeklyBrief
} from "./types";
import {
  approveScoreSuggestion,
  createAlertForEvent,
  createIntelEventFromSnapshot,
  createSnapshotIfChanged,
  createWeeklyBrief
} from "./workflow";
import { getAppStateStore } from "./app-state-store";

export interface AppState {
  competitors: Competitor[];
  dimensions: Dimension[];
  scores: CompetitorScore[];
  analyses: CompetitorAnalysis[];
  sources: Source[];
  snapshots: Snapshot[];
  events: IntelEvent[];
  scoreSuggestions: ScoreSuggestion[];
  alerts: Alert[];
  weeklyBriefs: WeeklyBrief[];
  salesIntel: SalesIntel[];
}

export interface DashboardData {
  competitors: Competitor[];
  dimensions: Dimension[];
  recentEvents: IntelEvent[];
  pendingScoreSuggestions: ScoreSuggestion[];
  unreadAlerts: Alert[];
  weeklyBrief: WeeklyBrief;
  scores: CompetitorScore[];
  topAnalyses: CompetitorAnalysis[];
  referenceScoreNotice: string;
  actionQueue: ActionQueueItem[];
}

function clone<T>(value: T): T {
  return structuredClone(value);
}

export function createInitialState(): AppState {
  const seedEvent: IntelEvent = {
    id: "event-seed-gemu",
    competitorId: "gemu",
    sourceId: "source-gemu-official",
    eventType: "PRODUCT",
    summary: "Gemu continues to emphasize high-end pharma diaphragm valve applications and local delivery responsiveness.",
    evidenceUrl: "https://www.gemu-group.com",
    impactLevel: "HIGH",
    relatedDimensions: ["Industry & application knowledge", "fast response time at all customer touchpoints"],
    detectedAt: "2026-05-18T00:00:00.000Z"
  };

  const seedSuggestion: ScoreSuggestion = {
    id: "score-seed-gemu-fast-response",
    competitorId: "gemu",
    dimensionId: "fast-response",
    previousScore: 7.13,
    suggestedScore: 7.6,
    rationale: "Recent messaging emphasizes faster local delivery and quotation speed in pharma applications.",
    status: "PENDING",
    createdAt: "2026-05-18T00:00:00.000Z"
  };

  const alert = createAlertForEvent(seedEvent);

  return {
    competitors: clone(PHARMA_BIOTECH_COMPETITORS),
    dimensions: clone(CI_DIMENSIONS),
    scores: clone(INITIAL_SCORES),
    analyses: clone(INITIAL_ANALYSES),
    sources: clone(INITIAL_SOURCE_CANDIDATES),
    snapshots: [],
    events: [seedEvent],
    scoreSuggestions: [seedSuggestion],
    alerts: alert ? [alert] : [],
    weeklyBriefs: [],
    salesIntel: [
      {
        id: "sales-intel-gemu-delivery-seed",
        competitorId: "gemu",
        accountContext: "匿名制药客户扩产项目",
        region: "华东",
        submittedBy: "Sales team",
        signalType: "DELIVERY",
        reliability: "MEDIUM",
        impactLevel: "HIGH",
        summary: "一线反馈 Gemu 在隔膜阀机会中被客户认为本地交付更快。",
        sensitive: true,
        status: "PENDING",
        submittedAt: "2026-05-18T00:00:00.000Z"
      }
    ]
  };
}

function createObservationAnalysis(competitor: Competitor): CompetitorAnalysis {
  return {
    competitorId: competitor.id,
    oneLineJudgment: `${competitor.name} is newly added and should stay in observation until approved sources produce stronger evidence.`,
    currentPositioning: competitor.differentiation,
    strategicIntent: "Unconfirmed. Initial monitoring should determine whether this is a product, price, channel, or localization threat.",
    threatLevel: "WATCHING",
    confidence: "LOW",
    evidenceBasis: ["Manual competitor creation", "No approved source intelligence has been analyzed yet."],
    impactOnBurkert: {
      product: "Unknown until source review and first monitoring pass.",
      price: "Unknown until pricing or commercial evidence appears.",
      delivery: "Unknown until careers, localization, or service evidence appears.",
      customerRelationship: "Unknown until account or market-facing evidence appears.",
      channel: "Unknown until partner, distributor, or hiring evidence appears.",
      localization: "Unknown until local site, hiring, or production evidence appears."
    },
    weaknesses: ["Analysis confidence is low until source evidence is approved."],
    recommendedActions: [
      { owner: "Management", action: "Keep in observation and require source approval before strategic escalation." },
      { owner: "Sales", action: "Add anecdotal account evidence if this name appears in live opportunities." }
    ],
    updatedAt: new Date().toISOString()
  };
}

function updateAnalysisFromEvent(analysis: CompetitorAnalysis, competitor: Competitor, event: IntelEvent): CompetitorAnalysis {
  const summary = event.summary;
  const lower = summary.toLowerCase();
  const productSignal = event.eventType === "PRODUCT" || lower.includes("platform") || lower.includes("pump") || lower.includes("valve");
  const serviceSignal = event.eventType === "HIRING" || lower.includes("service") || lower.includes("hiring") || lower.includes("local");
  const threatLevel = event.impactLevel === "HIGH" && (productSignal || serviceSignal) ? "HIGH" : analysis.threatLevel;

  return {
    ...analysis,
    oneLineJudgment:
      threatLevel === "HIGH"
        ? `${competitor.name} now deserves active review because monitored evidence points to stronger Pharma & Biotech product availability or local service motion.`
        : analysis.oneLineJudgment,
    strategicIntent:
      productSignal || serviceSignal
        ? "Use product availability, application-specific messaging, and local service responsiveness to reduce switching friction in Pharma & Biotech accounts."
        : analysis.strategicIntent,
    threatLevel,
    confidence: analysis.confidence === "HIGH" ? "HIGH" : "MEDIUM",
    evidenceBasis: [...analysis.evidenceBasis.filter((item) => item !== "No approved source intelligence has been analyzed yet."), `Monitored evidence: ${summary}`],
    impactOnBurkert: {
      ...analysis.impactOnBurkert,
      product: productSignal
        ? "New monitored product or platform messaging creates a more concrete comparison point against Bürkert."
        : analysis.impactOnBurkert.product,
      delivery: serviceSignal
        ? "Local service or hiring signals suggest possible pressure on response time and after-sales reassurance."
        : analysis.impactOnBurkert.delivery,
      localization: serviceSignal
        ? "Local service evidence raises the importance of Bürkert proof points around China responsiveness."
        : analysis.impactOnBurkert.localization
    },
    weaknesses: analysis.weaknesses.includes("Evidence is still based on early monitored signals.")
      ? analysis.weaknesses
      : [...analysis.weaknesses.filter((item) => item !== "Analysis confidence is low until source evidence is approved."), "Evidence is still based on early monitored signals."],
    recommendedActions: [
      { owner: "Management", action: `Review ${competitor.name} in the next P&B competitive briefing if more signals repeat.` },
      { owner: "Sales", action: "Collect account-level evidence where this competitor appears in live opportunities." },
      { owner: "Product", action: "Translate monitored product/service signals into comparison points for Bürkert's system proposition." }
    ],
    updatedAt: event.detectedAt
  };
}

function slugifyName(name: string) {
  return name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function ensureUrl(url: string) {
  const trimmed = url.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
  return `https://${trimmed}`;
}

function createSalesIntelEvent(intel: SalesIntel): IntelEvent {
  return {
    id: `event-${intel.id}`,
    competitorId: intel.competitorId,
    sourceId: "sales-intel",
    eventType: intel.signalType === "PRICE" ? "PRICING" : intel.signalType === "PRODUCT" ? "PRODUCT" : "CONTENT",
    summary: `Sales field intel: ${intel.summary}`,
    evidenceUrl: `sales-intel://${intel.id}`,
    impactLevel: intel.impactLevel,
    relatedDimensions: [salesSignalDimension(intel.signalType)],
    detectedAt: intel.reviewedAt ?? intel.submittedAt
  };
}

function salesSignalDimension(signalType: SalesIntel["signalType"]) {
  const dimensions: Record<SalesIntel["signalType"], string> = {
    DELIVERY: "fast response time at all customer touchpoints",
    PRICE: "Price",
    SERVICE: "Services post-sales",
    PRODUCT: "Quality of products, systems & services",
    RELATIONSHIP: "Customer intimacy: global presence",
    OTHER: "Industry & application knowledge"
  };

  return dimensions[signalType];
}

export function createAppRepository(initialState = createInitialState()) {
  const state = initialState;

  function getWeeklyBrief() {
    if (!state.weeklyBriefs.length) {
      const brief = createWeeklyBrief("2026-05-18", state.events, state.scoreSuggestions);
      state.weeklyBriefs.unshift(brief);
    }

    return state.weeklyBriefs[0];
  }

  function toBriefThreat(analysis: CompetitorAnalysis): StrategicBrief["priorityThreats"][number] {
    const competitor = state.competitors.find((item) => item.id === analysis.competitorId);

    return {
      competitorId: analysis.competitorId,
      competitorName: competitor?.name ?? analysis.competitorId,
      threatLevel: analysis.threatLevel,
      confidence: analysis.confidence,
      judgment: analysis.oneLineJudgment,
      strategicIntent: analysis.strategicIntent
    };
  }

  function getStrategicBrief(): StrategicBrief {
    const actionableAnalyses = state.analyses
      .filter((analysis) => analysis.threatLevel !== "LOW" && analysis.threatLevel !== "WATCHING")
      .sort((a, b) => threatRank(b.threatLevel) - threatRank(a.threatLevel));
    const watchlist = state.analyses
      .filter((analysis) => analysis.threatLevel === "WATCHING")
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

    const actionPlan: StrategicBrief["actionPlan"] = {
      Management: [],
      Sales: [],
      Product: [],
      Marketing: []
    };

    for (const analysis of actionableAnalyses) {
      const competitor = state.competitors.find((item) => item.id === analysis.competitorId);
      const name = competitor?.name ?? analysis.competitorId;
      for (const item of analysis.recommendedActions) {
        actionPlan[item.owner].push(`${name}: ${item.action}`);
      }
    }

    const topName = actionableAnalyses[0]
      ? state.competitors.find((item) => item.id === actionableAnalyses[0].competitorId)?.name ?? actionableAnalyses[0].competitorId
      : "No immediate competitor";

    return {
      headline: `${topName} is the primary Pharma & Biotech competitor to review this week; use scores only as historical context.`,
      priorityThreats: actionableAnalyses.slice(0, 4).map(toBriefThreat),
      watchlist: watchlist.slice(0, 4).map(toBriefThreat),
      actionPlan,
      evidenceHighlights: state.events
        .slice(0, 6)
        .map((event) => {
          const competitor = state.competitors.find((item) => item.id === event.competitorId);
          return `${competitor?.name ?? event.competitorId}: ${event.summary}`;
        }),
      scoreReferenceNote:
        "Excel scores are historical expert reference only. Final interpretation should follow evidence quality, market movement, and human-approved actions.",
      generatedAt: new Date().toISOString()
    };
  }

  function getBattlecards(): Battlecard[] {
    return state.analyses
      .filter((analysis) => analysis.threatLevel !== "LOW" && analysis.threatLevel !== "WATCHING")
      .sort((a, b) => threatRank(b.threatLevel) - threatRank(a.threatLevel))
      .map((analysis) => {
        const competitor = state.competitors.find((item) => item.id === analysis.competitorId);
        const name = competitor?.name ?? analysis.competitorId;
        const impact = analysis.impactOnBurkert;
        const primaryOwner = analysis.recommendedActions[0]?.owner ?? "Sales";

        return {
          competitorId: analysis.competitorId,
          competitorName: name,
          threatLevel: analysis.threatLevel,
          confidence: analysis.confidence,
          defenseNarrative: `${name} should be handled through a Bürkert system-value defense: acknowledge the competitor's specific strength, then move the discussion toward full-loop reliability, local proof, and risk reduction.`,
          talkTracks: [
            `Position Bürkert against ${name} on application risk, not only component price.`,
            impact.product,
            impact.delivery,
            impact.customerRelationship
          ].filter(Boolean),
          watchSignals: [
            analysis.strategicIntent,
            impact.localization,
            impact.channel,
            "Repeat evidence around delivery speed, local production, pricing, or account access."
          ],
          proofPoints: [
            "Show Bürkert's full-loop and system capability before discussing valve-only comparisons.",
            "Bring documented local response, quotation, and after-sales examples into contested accounts.",
            "Use approved monitoring evidence and human-confirmed scoring changes only after review."
          ],
          trapsToAvoid: [
            "Do not treat the historical score as the final argument.",
            "Do not reduce the discussion to unit price when the customer is evaluating process risk.",
            ...analysis.weaknesses.map((weakness) => `Do not overclaim: ${weakness}`)
          ],
          nextActionOwner: primaryOwner,
          updatedAt: analysis.updatedAt
        };
      });
  }

  function getRepeatedSalesSignals(): SalesIntelBoard["repeatedSignals"] {
    const groups = new Map<string, SalesIntel[]>();
    for (const item of state.salesIntel.filter((intel) => intel.status !== "REJECTED")) {
      const key = `${item.competitorId}:${item.signalType}`;
      groups.set(key, [...(groups.get(key) ?? []), item]);
    }

    return [...groups.values()]
      .filter((items) => items.length >= 2)
      .map((items) => {
        const latest = items.sort((a, b) => b.submittedAt.localeCompare(a.submittedAt))[0];
        const competitor = state.competitors.find((item) => item.id === latest.competitorId);
        const impactLevel: ImpactLevel = items.some((item) => item.impactLevel === "HIGH")
          ? "HIGH"
          : items.some((item) => item.impactLevel === "MEDIUM")
            ? "MEDIUM"
            : "LOW";

        return {
          competitorId: latest.competitorId,
          competitorName: competitor?.name ?? latest.competitorId,
          signalType: latest.signalType,
          count: items.length,
          latestSummary: latest.summary,
          impactLevel
        };
      })
      .sort((a, b) => b.count - a.count);
  }

  function getActionQueue(): ActionQueueItem[] {
    const fieldIntel = state.salesIntel
      .filter((intel) => intel.status === "PENDING")
      .map((intel) => {
        const competitor = state.competitors.find((item) => item.id === intel.competitorId);
        return {
          id: `action-${intel.id}`,
          category: "FIELD_INTEL" as const,
          title: `确认一线情报：${competitor?.name ?? intel.competitorId}`,
          detail: intel.summary,
          href: "/sales-intel",
          impactLevel: intel.impactLevel,
          status: "OPEN" as const
        };
      });

    const sourceReview = state.sources
      .filter((source) => source.reviewStatus === "CANDIDATE")
      .slice(0, 4)
      .map((source) => {
        const competitor = state.competitors.find((item) => item.id === source.competitorId);
        return {
          id: `action-${source.id}`,
          category: "SOURCE_REVIEW" as const,
          title: `审核来源：${competitor?.name ?? source.competitorId}`,
          detail: source.url,
          href: "/sources",
          impactLevel: "MEDIUM" as const,
          status: "OPEN" as const
        };
      });

    const scoreReview = state.scoreSuggestions
      .filter((suggestion) => suggestion.status === "PENDING")
      .slice(0, 3)
      .map((suggestion) => {
        const competitor = state.competitors.find((item) => item.id === suggestion.competitorId);
        return {
          id: `action-${suggestion.id}`,
          category: "SCORE_REVIEW" as const,
          title: `确认评分建议：${competitor?.name ?? suggestion.competitorId}`,
          detail: suggestion.rationale,
          href: "/score-suggestions",
          impactLevel: "MEDIUM" as const,
          status: "OPEN" as const
        };
      });

    const alerts = state.alerts
      .filter((alert) => !alert.readAt)
      .slice(0, 3)
      .map((alert) => ({
        id: `action-${alert.id}`,
        category: "ALERT" as const,
        title: alert.title,
        detail: alert.body,
        href: "/alerts",
        impactLevel: alert.impactLevel,
        status: "OPEN" as const
      }));

    const rank: Record<ActionQueueItem["category"], number> = {
      FIELD_INTEL: 4,
      ALERT: 3,
      SCORE_REVIEW: 2,
      SOURCE_REVIEW: 1
    };

    return [...fieldIntel, ...alerts, ...scoreReview, ...sourceReview].sort((a, b) => rank[b.category] - rank[a.category]);
  }

  return {
    getState() {
      return clone(state);
    },

    getStrategicBrief,
    getBattlecards,

    getSalesIntelBoard(): SalesIntelBoard {
      return {
        competitors: clone(state.competitors.filter((competitor) => competitor.role === "COMPETITOR")),
        pending: clone(state.salesIntel.filter((intel) => intel.status === "PENDING").sort((a, b) => b.submittedAt.localeCompare(a.submittedAt))),
        accepted: clone(state.salesIntel.filter((intel) => intel.status === "ACCEPTED").sort((a, b) => b.submittedAt.localeCompare(a.submittedAt))),
        rejected: clone(state.salesIntel.filter((intel) => intel.status === "REJECTED").sort((a, b) => b.submittedAt.localeCompare(a.submittedAt))),
        repeatedSignals: clone(getRepeatedSalesSignals())
      };
    },

    createSalesIntel(input: Omit<SalesIntel, "id" | "status" | "submittedAt" | "reviewedAt">) {
      const competitor = state.competitors.find((item) => item.id === input.competitorId);
      if (!competitor || competitor.role !== "COMPETITOR") throw new Error("A valid external competitor is required.");
      if (!input.summary.trim()) throw new Error("Sales intelligence summary is required.");

      const intel: SalesIntel = {
        ...input,
        accountContext: input.accountContext.trim() || "匿名客户/项目",
        region: input.region.trim() || "未指定区域",
        submittedBy: input.submittedBy.trim() || "Sales team",
        summary: input.summary.trim(),
        id: `sales-intel-${Date.now()}-${state.salesIntel.length + 1}`,
        status: "PENDING",
        submittedAt: new Date().toISOString()
      };

      state.salesIntel.unshift(intel);
      return clone(intel);
    },

    reviewSalesIntel(id: string, status: SalesIntelStatus) {
      const intel = state.salesIntel.find((item) => item.id === id);
      if (!intel) throw new Error(`Sales intelligence ${id} was not found.`);

      intel.status = status;
      intel.reviewedAt = new Date().toISOString();

      if (status === "ACCEPTED" && !state.events.some((event) => event.id === `event-${intel.id}`)) {
        const event = createSalesIntelEvent(intel);
        state.events.unshift(event);

        const analysis = state.analyses.find((item) => item.competitorId === intel.competitorId);
        if (analysis) {
          analysis.evidenceBasis = [...analysis.evidenceBasis, `Sales field intel: ${intel.summary}`];
          analysis.updatedAt = intel.reviewedAt;
        }
      }

      state.weeklyBriefs = [];
      return clone(intel);
    },

    getDashboard(): DashboardData {
      return {
        competitors: clone(state.competitors),
        dimensions: clone(state.dimensions),
        recentEvents: clone(state.events).sort((a, b) => b.detectedAt.localeCompare(a.detectedAt)).slice(0, 8),
        pendingScoreSuggestions: clone(state.scoreSuggestions).filter((suggestion) => suggestion.status === "PENDING"),
        unreadAlerts: clone(state.alerts).filter((alert) => !alert.readAt),
        weeklyBrief: clone(getWeeklyBrief()),
        scores: clone(state.scores),
        topAnalyses: clone(state.analyses)
          .filter((analysis) => analysis.threatLevel !== "LOW")
          .sort((a, b) => threatRank(b.threatLevel) - threatRank(a.threatLevel))
          .slice(0, 5),
        referenceScoreNotice:
          "Excel scores are historical expert reference only; management decisions should be based on interpretation, evidence quality, and recommended actions.",
        actionQueue: clone(getActionQueue())
      };
    },

    getCompetitors() {
      return clone(state.competitors);
    },

    getAnalyses() {
      return clone(state.analyses)
        .map((analysis) => ({
          ...analysis,
          competitor: clone(state.competitors.find((competitor) => competitor.id === analysis.competitorId) ?? null)
        }))
        .sort((a, b) => threatRank(b.threatLevel) - threatRank(a.threatLevel));
    },

    getCompetitor(id: string) {
      return clone(state.competitors.find((competitor) => competitor.id === id) ?? null);
    },

    createCompetitor(input: { name: string; differentiation: string; officialUrl?: string }) {
      const name = input.name.trim();
      if (!name) throw new Error("Competitor name is required.");

      const idBase = slugifyName(name);
      if (!idBase) throw new Error("Competitor name must include letters or numbers.");

      let id = idBase;
      let suffix = 2;
      while (state.competitors.some((competitor) => competitor.id === id)) {
        id = `${idBase}-${suffix}`;
        suffix += 1;
      }

      const competitor: Competitor = {
        id,
        name,
        normalizedName: idBase,
        industry: INDUSTRY,
        role: "COMPETITOR",
        status: "ACTIVE",
        differentiation: input.differentiation.trim() || "New competitor added by the strategy team."
      };

      state.competitors.push(competitor);
      state.analyses.push(createObservationAnalysis(competitor));
      state.scores.push(
        ...state.dimensions.map((dimension) => ({
          competitorId: id,
          dimensionId: dimension.id,
          value: 5
        }))
      );

      const officialUrl = ensureUrl(input.officialUrl ?? "");
      const baseUrl = officialUrl || `https://www.${idBase}.com`;
      const now = new Date().toISOString();
      state.sources.push(
        {
          id: `source-${id}-official`,
          competitorId: id,
          url: baseUrl,
          sourceType: "OFFICIAL_SITE",
          reviewStatus: "CANDIDATE",
          discoveredAt: now
        },
        {
          id: `source-${id}-careers`,
          competitorId: id,
          url: `${baseUrl.replace(/\/$/, "")}/careers`,
          sourceType: "CAREERS",
          reviewStatus: "CANDIDATE",
          discoveredAt: now
        }
      );

      state.weeklyBriefs = [];
      return clone(competitor);
    },

    getCompetitorDetail(id: string) {
      const competitor = state.competitors.find((item) => item.id === id);
      if (!competitor) return null;

      return {
        competitor: clone(competitor),
        analysis: clone(state.analyses.find((analysis) => analysis.competitorId === id) ?? createObservationAnalysis(competitor)),
        sources: clone(state.sources.filter((source) => source.competitorId === id)),
        events: clone(state.events.filter((event) => event.competitorId === id)),
        scoreSuggestions: clone(state.scoreSuggestions.filter((suggestion) => suggestion.competitorId === id)),
        scores: clone(state.scores.filter((score) => score.competitorId === id))
      };
    },

    getSources(filter?: { reviewStatus?: ReviewStatus }) {
      const sources = filter?.reviewStatus ? state.sources.filter((source) => source.reviewStatus === filter.reviewStatus) : state.sources;
      return clone(sources);
    },

    reviewSource(sourceId: string, reviewStatus: ReviewStatus) {
      const source = state.sources.find((item) => item.id === sourceId);
      if (!source) throw new Error(`Source ${sourceId} was not found.`);
      source.reviewStatus = reviewStatus;
      source.reviewedAt = new Date().toISOString();
      return clone(source);
    },

    getMatrix() {
      return {
        competitors: clone(state.competitors),
        dimensions: clone(state.dimensions),
        scores: clone(state.scores)
      };
    },

    getAlerts() {
      return clone(state.alerts).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    },

    getScoreSuggestions(filter?: { status?: ScoreSuggestion["status"] }) {
      const suggestions = filter?.status
        ? state.scoreSuggestions.filter((suggestion) => suggestion.status === filter.status)
        : state.scoreSuggestions;
      return clone(suggestions);
    },

    reviewScoreSuggestion(suggestionId: string, approve: boolean) {
      const index = state.scoreSuggestions.findIndex((suggestion) => suggestion.id === suggestionId);
      if (index === -1) throw new Error(`Score suggestion ${suggestionId} was not found.`);

      const reviewed = approveScoreSuggestion(state.scoreSuggestions[index], approve);
      state.scoreSuggestions[index] = reviewed;

      if (reviewed.status === "APPROVED" && reviewed.approvedScore !== undefined) {
        const score = state.scores.find(
          (item) => item.competitorId === reviewed.competitorId && item.dimensionId === reviewed.dimensionId
        );
        if (score) score.value = reviewed.approvedScore;
      }

      state.weeklyBriefs = [];
      return clone(reviewed);
    },

    async runMonitorJob(sampleContent = "New pharma valve platform with faster quotation and delivery program") {
      const approvedSources = state.sources.filter((source) => source.reviewStatus === "APPROVED");
      let createdEvents = 0;

      for (const source of approvedSources) {
        const snapshot = await createSnapshotIfChanged(source, `${sampleContent} for ${source.competitorId}`, state.snapshots);
        if (!snapshot) continue;

        state.snapshots.push(snapshot);
        const event = createIntelEventFromSnapshot(source, snapshot, [
          "Quality of products, systems & services",
          "fast response time at all customer touchpoints"
        ]);
        state.events.unshift(event);
        createdEvents += 1;

        const competitor = state.competitors.find((item) => item.id === event.competitorId);
        const analysisIndex = state.analyses.findIndex((analysis) => analysis.competitorId === event.competitorId);
        if (competitor && analysisIndex !== -1) {
          state.analyses[analysisIndex] = updateAnalysisFromEvent(state.analyses[analysisIndex], competitor, event);
        }

        const alert = createAlertForEvent(event);
        if (alert && !state.alerts.some((existing) => existing.id === alert.id)) {
          state.alerts.unshift(alert);
        }

        if (!state.scoreSuggestions.some((suggestion) => suggestion.id === `score-${event.id}`)) {
          state.scoreSuggestions.unshift({
            id: `score-${event.id}`,
            competitorId: event.competitorId,
            dimensionId: "fast-response",
            previousScore:
              state.scores.find((score) => score.competitorId === event.competitorId && score.dimensionId === "fast-response")
                ?.value ?? 5,
            suggestedScore: 8,
            rationale: "AI classified the change as a high-impact response-time and product availability signal.",
            status: "PENDING",
            createdAt: event.detectedAt
          });
        }
      }

      state.weeklyBriefs = [];
      return { scannedSources: approvedSources.length, createdEvents };
    },

    runDiscoveryJob() {
      return {
        createdCandidates: 0,
        message: "Initial public-source candidates are already seeded from the Pharma & Biotech competitor list."
      };
    },

    createWeeklyBrief(weekStart = "2026-05-18") {
      const brief = createWeeklyBrief(weekStart, state.events, state.scoreSuggestions);
      state.weeklyBriefs.unshift(brief);
      return clone(brief);
    }
  };
}

function threatRank(level: CompetitorAnalysis["threatLevel"]) {
  return { HIGH: 4, MEDIUM: 3, WATCHING: 2, LOW: 1 }[level];
}

type AppRepository = ReturnType<typeof createAppRepository>;

const globalForRepo = globalThis as typeof globalThis & {
  __pharmaCiRepo?: Promise<AppRepository>;
};

export async function getRepository() {
  const store = await getAppStateStore();
  if (store.available) {
    const persistedState = await store.loadState();
    const repo = createAppRepository(persistedState ?? createInitialState());
    if (!persistedState) {
      await store.saveState(repo.getState());
    }
    return repo;
  }

  if (!globalForRepo.__pharmaCiRepo) {
    globalForRepo.__pharmaCiRepo = Promise.resolve(createAppRepository());
  }

  return globalForRepo.__pharmaCiRepo;
}

export async function persistRepositoryState(repository: AppRepository) {
  const store = await getAppStateStore();
  if (store.available) {
    await store.saveState(repository.getState());
  }
}
