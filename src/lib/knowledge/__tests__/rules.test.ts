import { describe, expect, it } from "vitest";
import {
  assertInternalEvidenceInput,
  assertTrainingProgressInput,
  assertValidationTransition,
  assessTrainingScore
} from "../rules";

describe("knowledge execution rules", () => {
  it("requires coach approval and output before completing a day", () => {
    expect(() =>
      assertTrainingProgressInput({
        learnerId: "learner-1",
        day: 12,
        completionStatus: "COMPLETE",
        coachResult: "NOT_REVIEWED"
      })
    ).toThrow(
      "COMPLETE requires output location, coach, PASS review, and completed date"
    );
  });

  it("uses checkpoint-specific score thresholds", () => {
    expect(
      assessTrainingScore({
        checkpoint: "DAY-20",
        productSkeleton: 14,
        parameterEvidence: 14,
        applicationJudgment: 21,
        competitiveStrategy: 21,
        fatalError: false
      })
    ).toMatchObject({ totalScore: 70, result: "PASS" });
  });

  it("blocks VERIFIED below the evidence threshold", () => {
    expect(() =>
      assertValidationTransition({
        requestedStatus: "VERIFIED",
        verifiedEvidenceCount: 1,
        minimumVerifiedRecords: 2,
        conclusion: "One sample suggests an advantage.",
        acceptanceConfirmed: true
      })
    ).toThrow("requires at least 2 verified evidence records");
  });

  it("requires verification metadata for verified evidence", () => {
    expect(() =>
      assertInternalEvidenceInput({
        validationId: "VAL-CROSS-001",
        receivedDate: "2026-06-12",
        collector: "Nicole",
        company: "GEMÜ",
        evidenceType: "Quote",
        sourceDate: "2026-06-10",
        fileLocation: "crm/opportunity-1",
        confidentiality: "INTERNAL",
        factSummary: "Comparable configuration received.",
        supportsOrContradicts: "SUPPORTS",
        verificationStatus: "VERIFIED"
      })
    ).toThrow("VERIFIED evidence requires verifier and verified date");
  });
});
