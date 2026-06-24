import { describe, expect, it } from "vitest";
import type { KnowledgeExecutionStore } from "../store";
import type {
  InternalEvidenceRecord,
  TrainingLearner,
  TrainingProgress,
  TrainingScore,
  ValidationTaskState
} from "../types";
import {
  buildKnowledgeWorkspace,
  createTrainingLearner,
  recordTrainingScore,
  registerInternalEvidence,
  saveTrainingProgress,
  saveValidationTaskState
} from "../service";

function fakeStore(seed?: {
  learners?: TrainingLearner[];
  progress?: TrainingProgress[];
  scores?: TrainingScore[];
  validationStates?: ValidationTaskState[];
  evidence?: InternalEvidenceRecord[];
}): KnowledgeExecutionStore {
  const learners = [...(seed?.learners ?? [])];
  const progress = [...(seed?.progress ?? [])];
  const scores = [...(seed?.scores ?? [])];
  const validationStates = [...(seed?.validationStates ?? [])];
  const evidence = [...(seed?.evidence ?? [])];
  return {
    available: true,
    async listLearners() {
      return learners;
    },
    async createLearner(input) {
      const learner = {
        id: `learner-${learners.length + 1}`,
        ...input,
        active: true,
        createdAt: "2026-06-12T00:00:00.000Z"
      };
      learners.push(learner);
      return learner;
    },
    async listProgress(learnerId) {
      return progress.filter((item) => item.learnerId === learnerId);
    },
    async upsertProgress(input) {
      const value = {
        ...input,
        updatedAt: "2026-06-12T00:00:00.000Z"
      };
      progress.splice(
        0,
        progress.length,
        ...progress.filter(
          (item) => item.learnerId !== input.learnerId || item.day !== input.day
        ),
        value
      );
      return value;
    },
    async listScores(learnerId) {
      return scores.filter((item) => item.learnerId === learnerId);
    },
    async createScore(input) {
      const value = {
        id: `score-${scores.length + 1}`,
        ...input,
        createdAt: "2026-06-12T00:00:00.000Z"
      };
      scores.push(value);
      return value;
    },
    async listValidationStates() {
      return validationStates;
    },
    async upsertValidationState(input) {
      const value = {
        ...input,
        updatedAt: "2026-06-12T00:00:00.000Z"
      };
      validationStates.splice(
        0,
        validationStates.length,
        ...validationStates.filter(
          (item) => item.validationId !== input.validationId
        ),
        value
      );
      return value;
    },
    async listEvidence(validationId) {
      return validationId
        ? evidence.filter((item) => item.validationId === validationId)
        : evidence;
    },
    async createEvidence(input) {
      const value = {
        id: `evidence-${evidence.length + 1}`,
        ...input,
        createdAt: "2026-06-12T00:00:00.000Z",
        updatedAt: "2026-06-12T00:00:00.000Z"
      };
      evidence.push(value);
      return value;
    }
  };
}

function evidence(
  id: string,
  validationId: string,
  verificationStatus: InternalEvidenceRecord["verificationStatus"]
): InternalEvidenceRecord {
  return {
    id,
    validationId,
    receivedDate: "2026-06-12",
    collector: "Nicole",
    company: "GEMÜ",
    evidenceType: "Quote",
    sourceDate: "2026-06-10",
    fileLocation: `crm/${id}`,
    confidentiality: "INTERNAL",
    factSummary: "Comparable record.",
    supportsOrContradicts: "SUPPORTS",
    verificationStatus,
    createdAt: "2026-06-12T00:00:00.000Z",
    updatedAt: "2026-06-12T00:00:00.000Z"
  };
}

describe("knowledge workspace service", () => {
  it("keeps master knowledge readable when the database is unavailable", async () => {
    const workspace = await buildKnowledgeWorkspace({
      store: { available: false, reason: "DATABASE_NOT_CONFIGURED" }
    });

    expect(workspace.database.available).toBe(false);
    expect(workspace.summary.burkertTypes).toBe(511);
    expect(workspace.training.learners).toEqual([]);
    expect(workspace.validation.tasks).toHaveLength(16);
  });

  it("merges validation definitions with execution state and evidence counts", async () => {
    const store = fakeStore({
      validationStates: [
        {
          validationId: "VAL-GEMU-001",
          owner: "Product",
          status: "IN_PROGRESS",
          updatedBy: "strategy",
          updatedAt: "2026-06-11T00:00:00.000Z"
        }
      ],
      evidence: [
        evidence("ev-1", "VAL-GEMU-001", "VERIFIED"),
        evidence("ev-2", "VAL-GEMU-001", "REJECTED")
      ]
    });

    const workspace = await buildKnowledgeWorkspace({ store });
    const task = workspace.validation.tasks.find(
      (item) => item.definition.validationId === "VAL-GEMU-001"
    );

    expect(task).toMatchObject({
      state: { status: "IN_PROGRESS" },
      verifiedEvidenceCount: 1,
      totalEvidenceCount: 2
    });
  });

  it("computes score results server-side", async () => {
    const store = fakeStore({
      learners: [
        {
          id: "learner-1",
          name: "Nicole",
          cohort: "PM",
          active: true,
          createdAt: "2026-06-12T00:00:00.000Z"
        }
      ]
    });
    const saved = await recordTrainingScore(
      {
        learnerId: "learner-1",
        checkpoint: "DAY-10",
        recordDate: "2026-06-12",
        productSkeleton: 15,
        parameterEvidence: 15,
        applicationJudgment: 20,
        competitiveStrategy: 20,
        totalScore: 0,
        fatalError: false,
        result: "REMEDIATE",
        assessor: "Coach",
        evidenceLocation: "notion/score-1"
      },
      { store }
    );

    expect(saved).toMatchObject({ totalScore: 70, result: "PASS" });
  });

  it("rejects unknown validation IDs and insufficient verified samples", async () => {
    const store = fakeStore({
      evidence: [evidence("ev-1", "VAL-GEMU-001", "VERIFIED")]
    });

    await expect(
      registerInternalEvidence(
        {
          validationId: "VAL-UNKNOWN",
          receivedDate: "2026-06-12",
          collector: "Nicole",
          company: "GEMÜ",
          evidenceType: "Quote",
          sourceDate: "2026-06-10",
          fileLocation: "crm/unknown",
          confidentiality: "INTERNAL",
          factSummary: "Unknown task.",
          supportsOrContradicts: "SUPPORTS",
          verificationStatus: "PENDING"
        },
        { store }
      )
    ).rejects.toThrow("Unknown validation task");

    await expect(
      saveValidationTaskState(
        {
          validationId: "VAL-GEMU-001",
          status: "VERIFIED",
          conclusion: "One sample.",
          updatedBy: "Nicole"
        },
        { store, acceptanceConfirmed: true }
      )
    ).rejects.toThrow("requires at least");
  });

  it("rejects invalid learners, progress, and unavailable writes", async () => {
    const store = fakeStore();
    await expect(
      createTrainingLearner({ name: "", cohort: "" }, { store })
    ).rejects.toThrow();
    await expect(
      saveTrainingProgress(
        {
          learnerId: "unknown",
          day: 1,
          completionStatus: "COMPLETE",
          coachResult: "NOT_REVIEWED"
        },
        { store }
      )
    ).rejects.toThrow();
    await expect(
      createTrainingLearner(
        { name: "Nicole", cohort: "PM" },
        {
          store: {
            available: false,
            reason: "DATABASE_NOT_CONFIGURED"
          }
        }
      )
    ).rejects.toThrow("DATABASE_NOT_CONFIGURED");
  });
});
