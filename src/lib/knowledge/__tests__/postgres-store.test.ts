import { describe, expect, it } from "vitest";
import type { QueryResultRow } from "@vercel/postgres";
import {
  classifyKnowledgeDatabaseConnection,
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

  it("classifies pooled, direct, and localhost connection strings", () => {
    expect(
      classifyKnowledgeDatabaseConnection(
        "postgres://user:pass@ep-name-pooler.us-east-1.aws.neon.tech/db"
      )
    ).toBe("POOL");
    expect(
      classifyKnowledgeDatabaseConnection(
        "postgres://user:pass@ep-name.us-east-1.aws.neon.tech/db"
      )
    ).toBe("CLIENT");
    expect(
      classifyKnowledgeDatabaseConnection(
        "postgres://user:pass@localhost:5432/db"
      )
    ).toBe("CLIENT");
  });

  it("uses a pool for pooled URLs without calling client connect", async () => {
    const poolConnections: string[] = [];
    let clientCreations = 0;
    const sql = async () => ({ rows: [], rowCount: 0 });

    const store = await getKnowledgeStore({
      env: {
        DATABASE_URL:
          "postgres://user:pass@ep-name-pooler.us-east-1.aws.neon.tech/db"
      },
      createPool: ({ connectionString }) => {
        poolConnections.push(connectionString);
        return { sql };
      },
      createClient: () => {
        clientCreations += 1;
        throw new Error("client should not be created");
      }
    });

    expect(poolConnections).toHaveLength(1);
    expect(clientCreations).toBe(0);
    expect(store.available).toBe(true);
  });

  it("connects a client for direct DATABASE_URL and reuses the store", async () => {
    let clientCreations = 0;
    let connectCalls = 0;
    let probeCalls = 0;
    const sql = async () => {
      probeCalls += 1;
      return { rows: [], rowCount: 0 };
    };
    const dependencies = {
      env: {
        DATABASE_URL:
          "postgres://user:pass@ep-name.us-east-1.aws.neon.tech/db"
      },
      createPool: () => {
        throw new Error("pool should not be created");
      },
      createClient: () => {
        clientCreations += 1;
        return {
          connect: async () => {
            connectCalls += 1;
          },
          end: async () => undefined,
          sql
        };
      }
    };

    const first = await getKnowledgeStore(dependencies);
    const second = await getKnowledgeStore(dependencies);

    expect(first.available).toBe(true);
    expect(second).toBe(first);
    expect(clientCreations).toBe(1);
    expect(connectCalls).toBe(1);
    expect(probeCalls).toBe(1);
  });

  it("uses a connected client for localhost URLs", async () => {
    let connectCalls = 0;
    const store = await getKnowledgeStore({
      env: { DATABASE_URL: "postgres://user:pass@localhost:5432/db" },
      createPool: () => {
        throw new Error("pool should not be created");
      },
      createClient: () => ({
        connect: async () => {
          connectCalls += 1;
        },
        end: async () => undefined,
        sql: async () => ({ rows: [], rowCount: 0 })
      })
    });

    expect(store.available).toBe(true);
    expect(connectCalls).toBe(1);
  });

  it("closes and does not cache a direct client after probe failure", async () => {
    let clientCreations = 0;
    let connectCalls = 0;
    let endCalls = 0;
    const dependencies = {
      env: {
        DATABASE_URL:
          "postgres://user:pass@retry-direct.us-east-1.aws.neon.tech/db"
      },
      createPool: () => {
        throw new Error("pool should not be created");
      },
      createClient: () => {
        clientCreations += 1;
        const attempt = clientCreations;
        return {
          connect: async () => {
            connectCalls += 1;
          },
          end: async () => {
            endCalls += 1;
          },
          sql: async () => {
            if (attempt === 1) throw new Error("probe failed");
            return { rows: [], rowCount: 0 };
          }
        };
      }
    };

    const first = await getKnowledgeStore(dependencies);
    const second = await getKnowledgeStore(dependencies);

    expect(first).toEqual({ available: false, reason: "DATABASE_ERROR" });
    expect(second.available).toBe(true);
    expect(clientCreations).toBe(2);
    expect(connectCalls).toBe(2);
    expect(endCalls).toBe(1);
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
      env: {
        POSTGRES_URL:
          "postgres://user:pass@unreachable-pooler.us-east-1.aws.neon.tech/db"
      },
      createPool: () => ({
        sql: async () => {
          throw new Error("connection failed");
        }
      }),
      createClient: () => {
        throw new Error("client should not be created");
      }
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
