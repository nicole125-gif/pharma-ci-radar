export type KnowledgeCompany = "Bürkert" | "GEMÜ" | "Fujikin" | "ESG 精锐";
export type PharmaRelevance = "HIGH" | "MEDIUM" | "LOW" | "UNKNOWN";
export type KnowledgeRecordType = "PRODUCT" | "SCENARIO" | "MAPPING";

export interface KnowledgeProduct {
  recordType: "PRODUCT";
  company: KnowledgeCompany;
  productId: string;
  name: string;
  secondaryName?: string;
  category: string;
  subcategory: string;
  productRole: string;
  applications: string;
  pharmaRelevance: PharmaRelevance;
  chinaOrEvidenceStatus: string;
  evidenceGrade: string;
  sourceUrl?: string;
  boundary: string;
}

export interface ApplicationScenario {
  recordType: "SCENARIO";
  scenarioId: string;
  customerTask: string;
  processStage: string;
  decisionUnit: string;
  candidates: Record<KnowledgeCompany, string>;
  mustAskConditions: string;
  burkertCaution: string;
  competitorWatchpoint: string;
  comparisonDimensions: string;
  evidenceIds: string[];
  internalValidation: string;
}

export interface CurriculumDay {
  day: number;
  week: number;
  module: string;
  learningObjective: string;
  primaryMaterial: string;
  exercise: string;
  requiredOutput: string;
  coachReview: string;
  passCriteria: string;
}

export type TrainingCompletionStatus =
  | "NOT_STARTED"
  | "IN_PROGRESS"
  | "SUBMITTED"
  | "COMPLETE";
export type CoachResult = "NOT_REVIEWED" | "PASS" | "REWORK";
export type TrainingCheckpoint =
  | "BASELINE"
  | "DAY-10"
  | "DAY-20"
  | "DAY-30"
  | "RETEST";
export type TrainingResult = "PASS" | "REMEDIATE" | "NOT_ASSESSED";
export type ValidationStatus =
  | "OPEN"
  | "IN_PROGRESS"
  | "VERIFIED"
  | "REJECTED"
  | "INSUFFICIENT";
export type EvidenceVerificationStatus =
  | "PENDING"
  | "VERIFIED"
  | "REJECTED"
  | "INSUFFICIENT";

export interface ValidationTaskDefinition {
  validationId: string;
  priority: "P0" | "P1" | "P2";
  company: string;
  topic: string;
  question: string;
  evidenceRequired: string;
  recommendedOwner: string;
  decisionSupported: string;
  defaultStatus: ValidationStatus;
  workstream: string;
  executionOwner: string;
  contributors: string;
  minimumVerifiedRecords: number;
  evidenceTypes: string;
  collectionMethod: string;
  acceptanceRule: string;
  rejectionRule: string;
  decisionOutput: string;
  reviewCadence: string;
  targetWindow: string;
}

export interface KnowledgeCatalog {
  products: KnowledgeProduct[];
  burkertProducts: KnowledgeProduct[];
  gemuProducts: KnowledgeProduct[];
  fujikinProducts: KnowledgeProduct[];
  esgProducts: KnowledgeProduct[];
  scenarios: ApplicationScenario[];
  curriculum: CurriculumDay[];
  validationTasks: ValidationTaskDefinition[];
}
