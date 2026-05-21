import type { Competitor, CompetitorAnalysis, CompetitorScore, Dimension, Source, User } from "./types";

export const INDUSTRY = "Pharma & Biotech" as const;

export const CI_DIMENSIONS: Dimension[] = [
  {
    id: "industry-knowledge",
    name: "Industry & application knowledge",
    description: "Application-specific portfolio, pharma process knowledge, and ability to speak with customers on eye level."
  },
  {
    id: "systems",
    name: "Systems",
    description: "Customized solutions, skid building, outsourcing interest, and engineering depth."
  },
  {
    id: "quality",
    name: "Quality of products, systems & services",
    description: "Reliability, durability, service quality, and risk reduction."
  },
  {
    id: "fluid-loop",
    name: "Complete fluid control loop",
    description: "Access to sensors, actuators, and control as a market entry barrier or enabler."
  },
  {
    id: "stability",
    name: "Stability",
    description: "Vertical integration, supply reliability, and quality control."
  },
  {
    id: "customer-intimacy",
    name: "Customer intimacy: global presence",
    description: "Market access, local variations, ecosystem partners, and approval management across geographies."
  },
  {
    id: "fast-response",
    name: "fast response time at all customer touchpoints",
    description: "Quick delivery, quotation speed, pre-sales consulting, and agility around specification changes."
  },
  {
    id: "digital-services",
    name: "(digital) services and product support",
    description: "Digital twin readiness, connectivity, standards, and product support."
  },
  {
    id: "sustainability",
    name: "sustainability, circularity",
    description: "Efficient solutions, material cost exposure, circularity, recycling, and regulation readiness."
  },
  {
    id: "post-sales",
    name: "Services post-sales",
    description: "Post-sales service strength and field support."
  },
  {
    id: "price",
    name: "Price",
    description: "Relative price competitiveness for Pharma & Biotech applications."
  }
];

export const PHARMA_BIOTECH_COMPETITORS: Competitor[] = [
  {
    id: "burkert",
    name: "Bürkert",
    normalizedName: "burkert",
    industry: INDUSTRY,
    role: "OWN_COMPANY",
    status: "ACTIVE",
    differentiation:
      "Full portfolio, strong combinations, and good automation capability. Known brand choice in pharma; response speed trails Gemu in some cases."
  },
  {
    id: "gemu",
    name: "Gemu",
    normalizedName: "gemu",
    industry: INDUSTRY,
    role: "COMPETITOR",
    status: "ACTIVE",
    differentiation:
      "Strong diaphragm valve specialist with high-end pharma influence, strong EU customer pull, local production, price and speed advantages."
  },
  {
    id: "fujikin",
    name: "Fujikin",
    normalizedName: "fujikin",
    industry: INDUSTRY,
    role: "COMPETITOR",
    status: "ACTIVE",
    differentiation:
      "Valve-focused competitor with low price and strong commercial relationships, but product design recognition is weaker."
  },
  {
    id: "sed",
    name: "SED",
    normalizedName: "sed",
    industry: INDUSTRY,
    role: "COMPETITOR",
    status: "ACTIVE",
    differentiation: "Valve-only portfolio with competitive diaphragm and control valves, supported by a smaller but loyal EU base."
  },
  {
    id: "eh",
    name: "E+H",
    normalizedName: "e-h",
    industry: INDUSTRY,
    role: "COMPETITOR",
    status: "ACTIVE",
    differentiation: "Broad instrument portfolio with strong quality and stability; electromagnetic and mass flow are relevant in pharma."
  },
  {
    id: "mettler",
    name: "METTLER",
    normalizedName: "mettler",
    industry: INDUSTRY,
    role: "COMPETITOR",
    status: "ACTIVE",
    differentiation: "Top-tier analytical instruments and weighing strength."
  },
  {
    id: "bronkhorst",
    name: "Bronkhorst",
    normalizedName: "bronkhorst",
    industry: INDUSTRY,
    role: "COMPETITOR",
    status: "ACTIVE",
    differentiation: "Top gas mass flow controller specialist."
  },
  {
    id: "alicat",
    name: "Alicat",
    normalizedName: "alicat",
    industry: INDUSTRY,
    role: "COMPETITOR",
    status: "ACTIVE",
    differentiation: "MFC niche player with broad range claims and OEM exposure."
  },
  {
    id: "vogtlin",
    name: "Vogtlin",
    normalizedName: "vogtlin",
    industry: INDUSTRY,
    role: "COMPETITOR",
    status: "ACTIVE",
    differentiation: "Strong position in glass fermenter MFC use cases."
  },
  {
    id: "festo",
    name: "Festo",
    normalizedName: "festo",
    industry: INDUSTRY,
    role: "COMPETITOR",
    status: "ACTIVE",
    differentiation: "Common valve island choice with high price-performance, but less pharma-focused."
  }
];

const scoreRows: Record<string, number[]> = {
  "industry-knowledge": [7.9, 7.8, 5.6, 5.8333333333, 7.5, 8.25, 8, 7, 9, 6],
  systems: [8.1, 6.8, 4.8, 4.8333333333, 6.625, 6.75, 6, 6, 6, 4],
  quality: [7.2, 7.6, 6.25, 5.3333333333, 8.25, 8, 8, 5, 8, 8],
  "fluid-loop": [8.4, 6.375, 4.8, 4.1666666667, 6.875, 6.75, 7, 5, 5, 2],
  stability: [7, 7.1666666667, 5.5, 5.5, 7.6666666667, 8, 8, 4, 7, 9],
  "customer-intimacy": [7.4, 7.4, 6.9, 6.8333333333, 7.25, 7.375, 8, 7, 7, 7],
  "fast-response": [7.1, 7.125, 7.1, 6.3333333333, 7, 6.75, 8, 7, 8, 6],
  "digital-services": [8, 6.2, 4.6, 4.8333333333, 8.25, 7.875, 8, 6, 6, 7],
  sustainability: [7.5, 7.4, 6.2, 5.6666666667, 7.5, 7.5, 7, 6, 6, 8],
  "post-sales": [7.2, 7.1, 5.4, 5.2, 7.4, 7.2, 7.3, 5.8, 6.3, 7.1],
  price: [5.8, 7.8, 8.5, 7.2, 5.4, 5.2, 6.5, 7.6, 7.4, 8.1]
};

export const INITIAL_SCORES: CompetitorScore[] = Object.entries(scoreRows).flatMap(([dimensionId, values]) =>
  values.map((value, index) => ({
    competitorId: PHARMA_BIOTECH_COMPETITORS[index].id,
    dimensionId,
    value: Number(value.toFixed(2))
  }))
);

export const INITIAL_SOURCE_CANDIDATES: Source[] = PHARMA_BIOTECH_COMPETITORS.filter((competitor) => competitor.role === "COMPETITOR").flatMap(
  (competitor) => {
    const base = `https://www.${competitor.normalizedName.replace("e-h", "endress").replace("gemu", "gemu-group")}.com`;
    const now = "2026-05-18T00:00:00.000Z";
    return [
      {
        id: `source-${competitor.id}-official`,
        competitorId: competitor.id,
        url: base,
        sourceType: "OFFICIAL_SITE",
        reviewStatus: "CANDIDATE",
        discoveredAt: now
      },
      {
        id: `source-${competitor.id}-careers`,
        competitorId: competitor.id,
        url: `${base}/careers`,
        sourceType: "CAREERS",
        reviewStatus: "CANDIDATE",
        discoveredAt: now
      }
    ];
  }
);

export const INITIAL_ANALYSES: CompetitorAnalysis[] = [
  {
    competitorId: "gemu",
    oneLineJudgment:
      "Gemu is Bürkert's most direct competitor in high-end pharma diaphragm valve applications, especially where local delivery speed matters.",
    currentPositioning: "High-end pharma sanitary valve specialist with strong EU recognition and improving local production speed.",
    strategicIntent:
      "Defend its top-of-mind position in diaphragm valves while using localization, agent relationships, and delivery speed to reduce switching friction.",
    threatLevel: "HIGH",
    confidence: "HIGH",
    evidenceBasis: [
      "Excel expert comments identify Gemu as a high-end pharma influence leader.",
      "Historical scores show strong industry knowledge, quality, and local response.",
      "Seed intelligence flags local delivery and quotation speed as a live competitive pressure."
    ],
    impactOnBurkert: {
      product: "Direct overlap in diaphragm valves and sanitary pharma valve applications.",
      price: "Can combine recognized quality with stronger price and speed perception in local accounts.",
      delivery: "Localization and agent coverage pressure Bürkert on response time.",
      customerRelationship: "Specified by major EU pharma customers and maintained through local agents.",
      channel: "Agent relationships can protect installed accounts and accelerate quotes.",
      localization: "Local production and China responsiveness are central to the threat."
    },
    weaknesses: ["Portfolio is more valve-focused than Bürkert.", "System-level offering appears narrower than Bürkert's broader fluid control loop."],
    recommendedActions: [
      { owner: "Management", action: "Treat Gemu as the primary P&B defense account benchmark in quarterly reviews." },
      { owner: "Sales", action: "Prepare response-time and local delivery proof points for Gemu-contested accounts." },
      { owner: "Product", action: "Package Bürkert's full-loop capability as a system advantage, not only a valve comparison." }
    ],
    updatedAt: "2026-05-18T00:00:00.000Z"
  },
  {
    competitorId: "fujikin",
    oneLineJudgment:
      "Fujikin is a price and relationship-driven valve competitor, relevant when commercial flexibility matters more than full-system confidence.",
    currentPositioning: "Valve-focused competitor with low-price perception and strong commercial relationships.",
    strategicIntent: "Win selected pharma valve opportunities through price, relationship access, and sales flexibility.",
    threatLevel: "MEDIUM",
    confidence: "MEDIUM",
    evidenceBasis: [
      "Excel expert comments describe low price and strong business relationships.",
      "Historical reference scores show weaker systems and product recognition."
    ],
    impactOnBurkert: {
      product: "Overlap is concentrated in valve opportunities rather than full fluid control systems.",
      price: "Can create pressure in price-sensitive bids.",
      delivery: "Flexible sales motion may shorten decision cycles.",
      customerRelationship: "Relationship-led selling can open doors even when product recognition is weaker.",
      channel: "Distribution and agency motion should be watched by region.",
      localization: "Threat is situational and account-specific."
    },
    weaknesses: ["Product design recognition is comparatively weak.", "System capability is not the core proposition."],
    recommendedActions: [
      { owner: "Sales", action: "Flag Fujikin-competed opportunities where price pressure is the main buying criterion." },
      { owner: "Management", action: "Track whether relationship-led wins expand beyond isolated accounts." }
    ],
    updatedAt: "2026-05-18T00:00:00.000Z"
  },
  {
    competitorId: "sed",
    oneLineJudgment:
      "SED is a focused sanitary valve competitor with narrower scale, worth monitoring for diaphragm and control-valve niches.",
    currentPositioning: "Valve-only specialist with diaphragm and control-valve relevance in selected pharma accounts.",
    strategicIntent: "Protect specialist valve niches through loyal EU customers rather than broad portfolio expansion.",
    threatLevel: "MEDIUM",
    confidence: "MEDIUM",
    evidenceBasis: ["Excel notes describe valve-only focus, competitive diaphragm/control valves, and a smaller loyal EU base."],
    impactOnBurkert: {
      product: "Relevant in diaphragm and control-valve comparisons.",
      price: "Moderate risk where specialist alternatives are acceptable.",
      delivery: "No strong evidence of delivery-led disruption.",
      customerRelationship: "Loyal EU base may defend selected accounts.",
      channel: "Niche channel effects should be monitored.",
      localization: "No clear localization threat yet."
    },
    weaknesses: ["Narrow product line.", "Limited evidence of broad account expansion."],
    recommendedActions: [
      { owner: "Product", action: "Track SED messaging around diaphragm and control-valve differentiation." },
      { owner: "Sales", action: "Use Bürkert system breadth when SED appears in valve-only comparisons." }
    ],
    updatedAt: "2026-05-18T00:00:00.000Z"
  },
  {
    competitorId: "festo",
    oneLineJudgment:
      "Festo is not the most pharma-focused competitor, but its valve-island reputation and price-performance can influence automation-side decisions.",
    currentPositioning: "Strong general automation and valve island brand with high price-performance perception.",
    strategicIntent: "Enter pharma opportunities through automation familiarity and broader installed-base trust.",
    threatLevel: "MEDIUM",
    confidence: "MEDIUM",
    evidenceBasis: ["Excel comments describe Festo as a common valve island choice with high price-performance but limited pharma focus."],
    impactOnBurkert: {
      product: "More relevant around valve islands and automation components than sanitary pharma valves.",
      price: "Price-performance perception can influence standard component choices.",
      delivery: "General automation scale may support availability.",
      customerRelationship: "Benefits from broad industrial familiarity.",
      channel: "Strong general channel can create pull in mixed automation projects.",
      localization: "Not enough evidence of pharma-specific localization threat."
    },
    weaknesses: ["Less pharma-specialized.", "May lack application-specific depth in P&B compared with Bürkert and Gemu."],
    recommendedActions: [
      { owner: "Marketing", action: "Differentiate Bürkert's pharma application knowledge against generic automation positioning." },
      { owner: "Product", action: "Monitor whether Festo starts packaging pharma-specific solutions." }
    ],
    updatedAt: "2026-05-18T00:00:00.000Z"
  }
];

export const DEMO_USER: User = {
  id: "user-admin",
  email: "strategy@burkert.local",
  name: "Strategy Team",
  passwordHash: "demo-ci",
  role: "ADMIN"
};

export function getOwnCompany() {
  return PHARMA_BIOTECH_COMPETITORS.find((competitor) => competitor.role === "OWN_COMPANY")!;
}
