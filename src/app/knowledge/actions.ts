"use server";

import { revalidatePath } from "next/cache";
import { ZodError } from "zod";
import {
  createTrainingLearner,
  recordTrainingScore,
  registerInternalEvidence,
  saveTrainingProgress,
  saveValidationTaskState
} from "@/lib/knowledge/service";
import type {
  CoachResult,
  EvidenceVerificationStatus,
  TrainingCheckpoint,
  TrainingCompletionStatus,
  ValidationStatus
} from "@/lib/knowledge/types";

export type KnowledgeActionState = {
  ok: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
};

export const initialKnowledgeActionState: KnowledgeActionState = {
  ok: false,
  message: ""
};

function text(formData: FormData, key: string) {
  const value = String(formData.get(key) ?? "").trim();
  return value || undefined;
}

function number(formData: FormData, key: string) {
  return Number(formData.get(key) ?? 0);
}

function actionError(error: unknown): KnowledgeActionState {
  if (error instanceof ZodError) {
    const fieldErrors = Object.fromEntries(
      Object.entries(error.flatten().fieldErrors).filter(
        (entry): entry is [string, string[]] => entry[1] !== undefined
      )
    );
    return {
      ok: false,
      message: "请检查必填项和格式。",
      fieldErrors
    };
  }
  if (
    error instanceof Error &&
    (error.message === "DATABASE_NOT_CONFIGURED" ||
      error.message === "DATABASE_ERROR")
  ) {
    return {
      ok: false,
      message:
        error.message === "DATABASE_NOT_CONFIGURED"
          ? "当前为只读模式：未配置 PostgreSQL。"
          : "数据库暂时不可用，请稍后重试。"
    };
  }
  return {
    ok: false,
    message: error instanceof Error ? error.message : "保存失败。"
  };
}

async function run(action: () => Promise<unknown>) {
  try {
    await action();
    revalidatePath("/knowledge");
    return { ok: true, message: "已保存。" };
  } catch (error) {
    return actionError(error);
  }
}

export async function createLearnerAction(
  _state: KnowledgeActionState,
  formData: FormData
) {
  return run(() =>
    createTrainingLearner({
      name: text(formData, "name") ?? "",
      cohort: text(formData, "cohort") ?? ""
    })
  );
}

export async function saveProgressAction(
  _state: KnowledgeActionState,
  formData: FormData
) {
  return run(() =>
    saveTrainingProgress({
      learnerId: text(formData, "learnerId") ?? "",
      day: number(formData, "day"),
      scheduledDate: text(formData, "scheduledDate"),
      completionStatus: (text(formData, "completionStatus") ??
        "NOT_STARTED") as TrainingCompletionStatus,
      outputLocation: text(formData, "outputLocation"),
      selfReflection: text(formData, "selfReflection"),
      coach: text(formData, "coach"),
      coachResult: (text(formData, "coachResult") ??
        "NOT_REVIEWED") as CoachResult,
      coachFeedback: text(formData, "coachFeedback"),
      completedDate: text(formData, "completedDate")
    })
  );
}

export async function recordScoreAction(
  _state: KnowledgeActionState,
  formData: FormData
) {
  return run(() =>
    recordTrainingScore({
      learnerId: text(formData, "learnerId") ?? "",
      checkpoint: (text(formData, "checkpoint") ??
        "BASELINE") as TrainingCheckpoint,
      recordDate: text(formData, "recordDate") ?? "",
      productSkeleton: number(formData, "productSkeleton"),
      parameterEvidence: number(formData, "parameterEvidence"),
      applicationJudgment: number(formData, "applicationJudgment"),
      competitiveStrategy: number(formData, "competitiveStrategy"),
      totalScore: 0,
      fatalError: formData.get("fatalError") === "on",
      result: "NOT_ASSESSED",
      assessor: text(formData, "assessor") ?? "",
      evidenceLocation: text(formData, "evidenceLocation") ?? "",
      remediationDue: text(formData, "remediationDue"),
      notes: text(formData, "notes")
    })
  );
}

export async function saveValidationAction(
  _state: KnowledgeActionState,
  formData: FormData
) {
  return run(() =>
    saveValidationTaskState(
      {
        validationId: text(formData, "validationId") ?? "",
        owner: text(formData, "owner"),
        status: (text(formData, "status") ?? "OPEN") as ValidationStatus,
        targetDate: text(formData, "targetDate"),
        conclusion: text(formData, "conclusion"),
        updatedBy: text(formData, "updatedBy") ?? ""
      },
      { acceptanceConfirmed: formData.get("acceptanceConfirmed") === "on" }
    )
  );
}

export async function registerEvidenceAction(
  _state: KnowledgeActionState,
  formData: FormData
) {
  return run(() =>
    registerInternalEvidence({
      validationId: text(formData, "validationId") ?? "",
      receivedDate: text(formData, "receivedDate") ?? "",
      collector: text(formData, "collector") ?? "",
      company: text(formData, "company") ?? "",
      evidenceType: text(formData, "evidenceType") ?? "",
      subjectProduct: text(formData, "subjectProduct"),
      modelOrConfiguration: text(formData, "modelOrConfiguration"),
      marketScope: text(formData, "marketScope"),
      sourceOwner: text(formData, "sourceOwner"),
      sourceDate: text(formData, "sourceDate") ?? "",
      fileLocation: text(formData, "fileLocation") ?? "",
      confidentiality: (text(formData, "confidentiality") ??
        "INTERNAL") as "INTERNAL" | "RESTRICTED" | "PUBLIC",
      factSummary: text(formData, "factSummary") ?? "",
      supportsOrContradicts: (text(formData, "supportsOrContradicts") ??
        "CONTEXT_ONLY") as "SUPPORTS" | "CONTRADICTS" | "CONTEXT_ONLY",
      verificationStatus: (text(formData, "verificationStatus") ??
        "PENDING") as EvidenceVerificationStatus,
      verifier: text(formData, "verifier"),
      verifiedDate: text(formData, "verifiedDate"),
      rejectionReason: text(formData, "rejectionReason"),
      notes: text(formData, "notes")
    })
  );
}
