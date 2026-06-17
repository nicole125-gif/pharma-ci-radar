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
  learningCard?: ProductLearningCard;
}

export interface ProductLearningCard {
  cardId: string;
  company: KnowledgeCompany;
  productId: string;
  operatingPrinciple: string;
  customerJobs: string;
  pharmaApplications: string;
  keySpecifications: string;
  selectionQuestions: string;
  exclusionConditions: string;
  adjacentOrRelatedProducts: string;
  competitorOverlap: string;
  comparisonDimensions: string;
  factBoundary: string;
  sourceUrls: string[];
  evidenceIds: string[];
  knowledgeGaps: string;
  memoryHook: string;
  quizQuestion: string;
  reviewStatus: "GENERATED_REVIEWED_BY_RULES";
  sourceAccessedDate: string;
  generatedDate: string;
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

export interface TrainingLearner {
  id: string;
  name: string;
  cohort: string;
  active: boolean;
  createdAt: string;
}

export interface TrainingLearnerInput {
  name: string;
  cohort: string;
}

export interface TrainingProgress {
  learnerId: string;
  day: number;
  scheduledDate?: string;
  completionStatus: TrainingCompletionStatus;
  outputLocation?: string;
  selfReflection?: string;
  coach?: string;
  coachResult: CoachResult;
  coachFeedback?: string;
  completedDate?: string;
  updatedAt: string;
}

export interface TrainingProgressInput {
  learnerId: string;
  day: number;
  scheduledDate?: string;
  completionStatus: TrainingCompletionStatus;
  outputLocation?: string;
  selfReflection?: string;
  coach?: string;
  coachResult: CoachResult;
  coachFeedback?: string;
  completedDate?: string;
}

export interface TrainingScore {
  id: string;
  learnerId: string;
  checkpoint: TrainingCheckpoint;
  recordDate: string;
  productSkeleton: number;
  parameterEvidence: number;
  applicationJudgment: number;
  competitiveStrategy: number;
  totalScore: number;
  fatalError: boolean;
  result: TrainingResult;
  assessor: string;
  evidenceLocation: string;
  remediationDue?: string;
  notes?: string;
  createdAt: string;
}

export interface TrainingScoreInput {
  learnerId: string;
  checkpoint: TrainingCheckpoint;
  recordDate: string;
  productSkeleton: number;
  parameterEvidence: number;
  applicationJudgment: number;
  competitiveStrategy: number;
  totalScore: number;
  fatalError: boolean;
  result: TrainingResult;
  assessor: string;
  evidenceLocation: string;
  remediationDue?: string;
  notes?: string;
}

export interface ValidationTaskState {
  validationId: string;
  owner?: string;
  status: ValidationStatus;
  targetDate?: string;
  conclusion?: string;
  updatedBy: string;
  updatedAt: string;
}

export interface ValidationTaskStateInput {
  validationId: string;
  owner?: string;
  status: ValidationStatus;
  targetDate?: string;
  conclusion?: string;
  updatedBy: string;
}

export interface InternalEvidenceRecord {
  id: string;
  validationId: string;
  receivedDate: string;
  collector: string;
  company: string;
  evidenceType: string;
  subjectProduct?: string;
  modelOrConfiguration?: string;
  marketScope?: string;
  sourceOwner?: string;
  sourceDate: string;
  fileLocation: string;
  confidentiality: "INTERNAL" | "RESTRICTED" | "PUBLIC";
  factSummary: string;
  supportsOrContradicts: "SUPPORTS" | "CONTRADICTS" | "CONTEXT_ONLY";
  verificationStatus: EvidenceVerificationStatus;
  verifier?: string;
  verifiedDate?: string;
  rejectionReason?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InternalEvidenceInput {
  validationId: string;
  receivedDate: string;
  collector: string;
  company: string;
  evidenceType: string;
  subjectProduct?: string;
  modelOrConfiguration?: string;
  marketScope?: string;
  sourceOwner?: string;
  sourceDate: string;
  fileLocation: string;
  confidentiality: "INTERNAL" | "RESTRICTED" | "PUBLIC";
  factSummary: string;
  supportsOrContradicts: "SUPPORTS" | "CONTRADICTS" | "CONTEXT_ONLY";
  verificationStatus: EvidenceVerificationStatus;
  verifier?: string;
  verifiedDate?: string;
  rejectionReason?: string;
  notes?: string;
}

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
  learningCards: ProductLearningCard[];
  curriculum: CurriculumDay[];
  validationTasks: ValidationTaskDefinition[];
}
