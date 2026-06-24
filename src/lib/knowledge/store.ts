import type {
  InternalEvidenceInput,
  InternalEvidenceRecord,
  TrainingLearner,
  TrainingLearnerInput,
  TrainingProgress,
  TrainingProgressInput,
  TrainingScore,
  TrainingScoreInput,
  ValidationTaskState,
  ValidationTaskStateInput
} from "./types";

export interface KnowledgeExecutionStore {
  available: true;
  listLearners(): Promise<TrainingLearner[]>;
  createLearner(input: TrainingLearnerInput): Promise<TrainingLearner>;
  listProgress(learnerId: string): Promise<TrainingProgress[]>;
  upsertProgress(input: TrainingProgressInput): Promise<TrainingProgress>;
  listScores(learnerId: string): Promise<TrainingScore[]>;
  createScore(input: TrainingScoreInput): Promise<TrainingScore>;
  listValidationStates(): Promise<ValidationTaskState[]>;
  upsertValidationState(
    input: ValidationTaskStateInput
  ): Promise<ValidationTaskState>;
  listEvidence(validationId?: string): Promise<InternalEvidenceRecord[]>;
  createEvidence(input: InternalEvidenceInput): Promise<InternalEvidenceRecord>;
}

export interface UnavailableKnowledgeExecutionStore {
  available: false;
  reason: "DATABASE_NOT_CONFIGURED" | "DATABASE_ERROR";
}

export type KnowledgeStore =
  | KnowledgeExecutionStore
  | UnavailableKnowledgeExecutionStore;
