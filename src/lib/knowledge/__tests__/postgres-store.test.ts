import { describe, expect, it } from "vitest";
import type { QueryResultRow } from "@vercel/postgres";
import {
  createPostgresKnowledgeStore,
  getKnowledgeStore,
  mapScoreRow,
  selectKnowledgeDatabaseUrl
} from "../postgres-store";

describe("knowledge PostgreSQL store", () => {
  it("preserves the local calendar day when mapping PostgreSQL dates", () => {
    const score = mapScoreRow({
      id: "score-1",
      learner_id: "learner-1",
      checkpoint: "DAY-10",
      record_date: new Date(2026, 5, 12),
      product_skeleton: 15,
      parameter_evidence: 15,
      application_judgment: 20,
      competitive_strategy: 20,
      total_score: 70,
      fatal_error: false,
      result: "PASS",
      assessor: "Coach",
      evidence_location: "/evidence",
      remediation_due: null,
      notes: null,
      created_at: "2026-06-12T08:00:00.000Z"
    });

    expect(score.recordDate).toBe("2026-06-12");
  });

  it("prefers POSTGRES_URL and falls back to DATABASE_URL", () => {
    expect(
      selectKnowledgeDatabaseUrl({
        POSTGRES_URL: "postgres://primary",
        DATABASE_URL: "postgres://fallback"
      })
    ).toBe("postgres://primary");
    expect(
      selectKnowledgeDatabaseUrl({
        DATABASE_URL: "postgres://fallback"
      })
    ).toBe("postgres://fallback");
    expect(
      selectKnowledgeDatabaseUrl({
        POSTGRES_URL: "",
        DATABASE_URL: "postgres://fallback"
      })
    ).toBe("postgres://fallback");
    expect(selectKnowledgeDatabaseUrl({})).toBeNull();
  });

  it("creates and probes a pool when only DATABASE_URL is configured", async () => {
    const connections: string[] = [];
    const sql = async () => ({ rows: [], rowCount: 0 });

    const store = await getKnowledgeStore({
      env: { DATABASE_URL: "postgres://database-only" },
      createPool: ({ connectionString }) => {
        connections.push(connectionString);
        return { sql };
      }
    });

    expect(connections).toEqual(["postgres://database-only"]);
    expect(store.available).toBe(true);
  });

  it("returns NOT_CONFIGURED without exposing writes", async () => {
    const store = await getKnowledgeStore({ env: {} });

    expect(store).toEqual({
      available: false,
      reason: "DATABASE_NOT_CONFIGURED"
    });
    expect("createLearner" in store).toBe(false);
  });

  it("returns DATABASE_ERROR when the pool probe fails", async () => {
    const store = await getKnowledgeStore({
      env: { POSTGRES_URL: "postgres://unreachable" },
      createPool: () => ({
        sql: async () => {
          throw new Error("connection failed");
        }
      })
    });

    expect(store).toEqual({
      available: false,
      reason: "DATABASE_ERROR"
    });
  });

  it("casts PostgreSQL date columns to text in reads and returning rows", async () => {
    const queries: string[] = [];
    const sql = async <Row extends QueryResultRow>(
      strings: TemplateStringsArray
    ) => {
      queries.push(strings.join("?"));
      return { rows: [{} as Row] };
    };
    const store = createPostgresKnowledgeStore(sql);

    await store.listProgress("learner-1");
    await store.upsertProgress({
      learnerId: "learner-1",
      day: 1,
      completionStatus: "NOT_STARTED",
      coachResult: "NOT_REVIEWED"
    });
    await store.listScores("learner-1");
    await store.createScore({
      learnerId: "learner-1",
      checkpoint: "BASELINE",
      recordDate: "2026-06-12",
      productSkeleton: 0,
      parameterEvidence: 0,
      applicationJudgment: 0,
      competitiveStrategy: 0,
      totalScore: 0,
      fatalError: false,
      result: "NOT_ASSESSED",
      assessor: "Coach",
      evidenceLocation: "/evidence"
    });
    await store.listValidationStates();
    await store.upsertValidationState({
      validationId: "VAL-001",
      status: "OPEN",
      updatedBy: "Nicole"
    });
    await store.listEvidence();
    await store.createEvidence({
      validationId: "VAL-001",
      receivedDate: "2026-06-12",
      collector: "Nicole",
      company: "GEMÜ",
      evidenceType: "Interview",
      sourceDate: "2026-06-12",
      fileLocation: "/evidence",
      confidentiality: "INTERNAL",
      factSummary: "Confirmed.",
      supportsOrContradicts: "SUPPORTS",
      verificationStatus: "PENDING"
    });

    const queryText = queries.join("\n");
    expect(queryText).toContain("scheduled_date::text as scheduled_date");
    expect(queryText).toContain("completed_date::text as completed_date");
    expect(queryText).toContain("record_date::text as record_date");
    expect(queryText).toContain("remediation_due::text as remediation_due");
    expect(queryText).toContain("target_date::text as target_date");
    expect(queryText).toContain("received_date::text as received_date");
    expect(queryText).toContain("source_date::text as source_date");
    expect(queryText).toContain("verified_date::text as verified_date");
    expect(queryText).not.toContain("updated_at::text");
    expect(queryText).not.toContain("created_at::text");
  });
});
