import { z } from "zod";
import type {
  InternalEvidenceInput,
  TrainingCheckpoint,
  TrainingLearnerInput,
  TrainingProgressInput,
  TrainingResult,
  TrainingScoreInput,
  ValidationStatus,
  ValidationTaskStateInput
} from "./types";

const requiredText = z.string().trim().min(1);
const optionalText = z.string().trim().min(1).optional();
const dateText = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

const learnerSchema = z.object({
  name: requiredText,
  cohort: requiredText
});

const progressSchema = z.object({
  learnerId: requiredText,
  day: z.number().int().min(1).max(30),
  scheduledDate: dateText.optional(),
  completionStatus: z.enum([
    "NOT_STARTED",
    "IN_PROGRESS",
    "SUBMITTED",
    "COMPLETE"
  ]),
  outputLocation: optionalText,
  selfReflection: optionalText,
  coach: optionalText,
  coachResult: z.enum(["NOT_REVIEWED", "PASS", "REWORK"]),
  coachFeedback: optionalText,
  completedDate: dateText.optional()
});

const scoreAssessmentSchema = z.object({
  checkpoint: z.enum(["BASELINE", "DAY-10", "DAY-20", "DAY-30", "RETEST"]),
  productSkeleton: z.number().int().min(0).max(20),
  parameterEvidence: z.number().int().min(0).max(20),
  applicationJudgment: z.number().int().min(0).max(30),
  competitiveStrategy: z.number().int().min(0).max(30),
  fatalError: z.boolean()
});

const scoreSchema = scoreAssessmentSchema.extend({
  learnerId: requiredText,
  recordDate: dateText,
  totalScore: z.number().int().min(0).max(100),
  result: z.enum(["PASS", "REMEDIATE", "NOT_ASSESSED"]),
  assessor: requiredText,
  evidenceLocation: requiredText,
  remediationDue: dateText.optional(),
  notes: optionalText
});

const validationStateSchema = z.object({
  validationId: requiredText,
  owner: optionalText,
  status: z.enum([
    "OPEN",
    "IN_PROGRESS",
    "VERIFIED",
    "REJECTED",
    "INSUFFICIENT"
  ]),
  targetDate: dateText.optional(),
  conclusion: optionalText,
  updatedBy: requiredText
});

const evidenceSchema = z.object({
  validationId: requiredText,
  receivedDate: dateText,
  collector: requiredText,
  company: requiredText,
  evidenceType: requiredText,
  subjectProduct: optionalText,
  modelOrConfiguration: optionalText,
  marketScope: optionalText,
  sourceOwner: optionalText,
  sourceDate: dateText,
  fileLocation: requiredText,
  confidentiality: z.enum(["INTERNAL", "RESTRICTED", "PUBLIC"]),
  factSummary: requiredText,
  supportsOrContradicts: z.enum([
    "SUPPORTS",
    "CONTRADICTS",
    "CONTEXT_ONLY"
  ]),
  verificationStatus: z.enum([
    "PENDING",
    "VERIFIED",
    "REJECTED",
    "INSUFFICIENT"
  ]),
  verifier: optionalText,
  verifiedDate: dateText.optional(),
  rejectionReason: optionalText,
  notes: optionalText
});

export interface TrainingScoreAssessmentInput {
  checkpoint: TrainingCheckpoint;
  productSkeleton: number;
  parameterEvidence: number;
  applicationJudgment: number;
  competitiveStrategy: number;
  fatalError: boolean;
}

export interface ValidationTransitionInput {
  requestedStatus: ValidationStatus;
  verifiedEvidenceCount: number;
  minimumVerifiedRecords: number;
  conclusion?: string;
  acceptanceConfirmed: boolean;
}

export function assertTrainingLearnerInput(input: TrainingLearnerInput) {
  return learnerSchema.parse(input);
}

export function assertTrainingProgressInput(input: TrainingProgressInput) {
  const parsed = progressSchema.parse(input);
  if (
    parsed.completionStatus === "COMPLETE" &&
    (!parsed.outputLocation ||
      !parsed.coach ||
      parsed.coachResult !== "PASS" ||
      !parsed.completedDate)
  ) {
    throw new Error(
      "COMPLETE requires output location, coach, PASS review, and completed date"
    );
  }
  return parsed;
}

export function assessTrainingScore(input: TrainingScoreAssessmentInput): {
  totalScore: number;
  result: TrainingResult;
} {
  const parsed = scoreAssessmentSchema.parse(input);
  const totalScore =
    parsed.productSkeleton +
    parsed.parameterEvidence +
    parsed.applicationJudgment +
    parsed.competitiveStrategy;

  if (parsed.checkpoint === "BASELINE") {
    return { totalScore, result: "NOT_ASSESSED" };
  }
  if (parsed.fatalError) {
    return { totalScore, result: "REMEDIATE" };
  }
  if (parsed.checkpoint === "DAY-10") {
    return { totalScore, result: totalScore >= 60 ? "PASS" : "REMEDIATE" };
  }
  if (parsed.checkpoint === "DAY-20") {
    return {
      totalScore,
      result:
        totalScore >= 70 && parsed.applicationJudgment >= 21
          ? "PASS"
          : "REMEDIATE"
    };
  }

  const modulesPass =
    parsed.productSkeleton >= 14 &&
    parsed.parameterEvidence >= 14 &&
    parsed.applicationJudgment >= 21 &&
    parsed.competitiveStrategy >= 21;
  return {
    totalScore,
    result: totalScore >= 75 && modulesPass ? "PASS" : "REMEDIATE"
  };
}

export function assertTrainingScoreInput(input: TrainingScoreInput) {
  return scoreSchema.parse(input);
}

export function assertValidationTaskStateInput(input: ValidationTaskStateInput) {
  return validationStateSchema.parse(input);
}

export function assertValidationTransition(input: ValidationTransitionInput) {
  if (
    input.requestedStatus === "VERIFIED" &&
    input.verifiedEvidenceCount < input.minimumVerifiedRecords
  ) {
    throw new Error(
      `VERIFIED requires at least ${input.minimumVerifiedRecords} verified evidence records`
    );
  }
  if (
    input.requestedStatus === "VERIFIED" &&
    (!input.acceptanceConfirmed || !input.conclusion?.trim())
  ) {
    throw new Error("VERIFIED requires acceptance confirmation and conclusion");
  }
  if (
    (input.requestedStatus === "REJECTED" ||
      input.requestedStatus === "INSUFFICIENT") &&
    !input.conclusion?.trim()
  ) {
    throw new Error(`${input.requestedStatus} requires a conclusion`);
  }
  return input;
}

export function assertInternalEvidenceInput(input: InternalEvidenceInput) {
  const parsed = evidenceSchema.parse(input);
  if (
    parsed.verificationStatus === "VERIFIED" &&
    (!parsed.verifier || !parsed.verifiedDate)
  ) {
    throw new Error("VERIFIED evidence requires verifier and verified date");
  }
  if (
    (parsed.verificationStatus === "REJECTED" ||
      parsed.verificationStatus === "INSUFFICIENT") &&
    !parsed.rejectionReason
  ) {
    throw new Error(
      `${parsed.verificationStatus} evidence requires a rejection reason`
    );
  }
  return parsed;
}
