import { randomUUID } from "node:crypto";
import type { QueryResultRow } from "@vercel/postgres";
import { getSql } from "../postgres";
import type {
  InternalEvidenceInput,
  InternalEvidenceRecord,
  TrainingLearner,
  TrainingProgress,
  TrainingProgressInput,
  TrainingScore,
  TrainingScoreInput,
  ValidationTaskState,
  ValidationTaskStateInput
} from "./types";
import type { KnowledgeExecutionStore, KnowledgeStore } from "./store";

type Sql = NonNullable<ReturnType<typeof getSql>>;
type DateValue = string | Date;

interface LearnerRow extends QueryResultRow {
  id: string;
  name: string;
  cohort: string;
  active: boolean;
  created_at: DateValue;
}

interface ProgressRow extends QueryResultRow {
  learner_id: string;
  day: number;
  scheduled_date: DateValue | null;
  completion_status: TrainingProgress["completionStatus"];
  output_location: string | null;
  self_reflection: string | null;
  coach: string | null;
  coach_result: TrainingProgress["coachResult"];
  coach_feedback: string | null;
  completed_date: DateValue | null;
  updated_at: DateValue;
}

interface ScoreRow extends QueryResultRow {
  id: string;
  learner_id: string;
  checkpoint: TrainingScore["checkpoint"];
  record_date: DateValue;
  product_skeleton: number;
  parameter_evidence: number;
  application_judgment: number;
  competitive_strategy: number;
  total_score: number;
  fatal_error: boolean;
  result: TrainingScore["result"];
  assessor: string;
  evidence_location: string;
  remediation_due: DateValue | null;
  notes: string | null;
  created_at: DateValue;
}

interface ValidationStateRow extends QueryResultRow {
  validation_id: string;
  owner: string | null;
  status: ValidationTaskState["status"];
  target_date: DateValue | null;
  conclusion: string | null;
  updated_by: string;
  updated_at: DateValue;
}

interface EvidenceRow extends QueryResultRow {
  id: string;
  validation_id: string;
  received_date: DateValue;
  collector: string;
  company: string;
  evidence_type: string;
  subject_product: string | null;
  model_or_configuration: string | null;
  market_scope: string | null;
  source_owner: string | null;
  source_date: DateValue;
  file_location: string;
  confidentiality: InternalEvidenceRecord["confidentiality"];
  fact_summary: string;
  supports_or_contradicts: InternalEvidenceRecord["supportsOrContradicts"];
  verification_status: InternalEvidenceRecord["verificationStatus"];
  verifier: string | null;
  verified_date: DateValue | null;
  rejection_reason: string | null;
  notes: string | null;
  created_at: DateValue;
  updated_at: DateValue;
}

function toTimestamp(value: DateValue) {
  return value instanceof Date ? value.toISOString() : value;
}

function toDate(value: DateValue) {
  return value instanceof Date ? value.toISOString().slice(0, 10) : value;
}

function optional<T>(key: string, value: T | null) {
  return value === null ? {} : { [key]: value };
}

export function mapLearnerRow(row: LearnerRow): TrainingLearner {
  return {
    id: row.id,
    name: row.name,
    cohort: row.cohort,
    active: row.active,
    createdAt: toTimestamp(row.created_at)
  };
}

export function mapProgressRow(row: ProgressRow): TrainingProgress {
  return {
    learnerId: row.learner_id,
    day: row.day,
    ...optional(
      "scheduledDate",
      row.scheduled_date === null ? null : toDate(row.scheduled_date)
    ),
    completionStatus: row.completion_status,
    ...optional("outputLocation", row.output_location),
    ...optional("selfReflection", row.self_reflection),
    ...optional("coach", row.coach),
    coachResult: row.coach_result,
    ...optional("coachFeedback", row.coach_feedback),
    ...optional(
      "completedDate",
      row.completed_date === null ? null : toDate(row.completed_date)
    ),
    updatedAt: toTimestamp(row.updated_at)
  };
}

export function mapScoreRow(row: ScoreRow): TrainingScore {
  return {
    id: row.id,
    learnerId: row.learner_id,
    checkpoint: row.checkpoint,
    recordDate: toDate(row.record_date),
    productSkeleton: row.product_skeleton,
    parameterEvidence: row.parameter_evidence,
    applicationJudgment: row.application_judgment,
    competitiveStrategy: row.competitive_strategy,
    totalScore: row.total_score,
    fatalError: row.fatal_error,
    result: row.result,
    assessor: row.assessor,
    evidenceLocation: row.evidence_location,
    ...optional(
      "remediationDue",
      row.remediation_due === null ? null : toDate(row.remediation_due)
    ),
    ...optional("notes", row.notes),
    createdAt: toTimestamp(row.created_at)
  };
}

export function mapValidationStateRow(
  row: ValidationStateRow
): ValidationTaskState {
  return {
    validationId: row.validation_id,
    ...optional("owner", row.owner),
    status: row.status,
    ...optional(
      "targetDate",
      row.target_date === null ? null : toDate(row.target_date)
    ),
    ...optional("conclusion", row.conclusion),
    updatedBy: row.updated_by,
    updatedAt: toTimestamp(row.updated_at)
  };
}

export function mapEvidenceRow(row: EvidenceRow): InternalEvidenceRecord {
  return {
    id: row.id,
    validationId: row.validation_id,
    receivedDate: toDate(row.received_date),
    collector: row.collector,
    company: row.company,
    evidenceType: row.evidence_type,
    ...optional("subjectProduct", row.subject_product),
    ...optional("modelOrConfiguration", row.model_or_configuration),
    ...optional("marketScope", row.market_scope),
    ...optional("sourceOwner", row.source_owner),
    sourceDate: toDate(row.source_date),
    fileLocation: row.file_location,
    confidentiality: row.confidentiality,
    factSummary: row.fact_summary,
    supportsOrContradicts: row.supports_or_contradicts,
    verificationStatus: row.verification_status,
    ...optional("verifier", row.verifier),
    ...optional(
      "verifiedDate",
      row.verified_date === null ? null : toDate(row.verified_date)
    ),
    ...optional("rejectionReason", row.rejection_reason),
    ...optional("notes", row.notes),
    createdAt: toTimestamp(row.created_at),
    updatedAt: toTimestamp(row.updated_at)
  };
}

export function createPostgresKnowledgeStore(
  sql: Sql
): KnowledgeExecutionStore {
  return {
    available: true,

    async listLearners() {
      const result = await sql<LearnerRow>`
        select * from training_learners
        order by cohort, name, id
      `;
      return result.rows.map(mapLearnerRow);
    },

    async createLearner(input) {
      const id = randomUUID();
      const result = await sql<LearnerRow>`
        insert into training_learners (id, name, cohort)
        values (${id}, ${input.name}, ${input.cohort})
        returning *
      `;
      return mapLearnerRow(result.rows[0]);
    },

    async listProgress(learnerId) {
      const result = await sql<ProgressRow>`
        select * from training_progress
        where learner_id = ${learnerId}
        order by day
      `;
      return result.rows.map(mapProgressRow);
    },

    async upsertProgress(input: TrainingProgressInput) {
      const result = await sql<ProgressRow>`
        insert into training_progress (
          learner_id, day, scheduled_date, completion_status, output_location,
          self_reflection, coach, coach_result, coach_feedback, completed_date
        )
        values (
          ${input.learnerId}, ${input.day}, ${input.scheduledDate ?? null},
          ${input.completionStatus}, ${input.outputLocation ?? null},
          ${input.selfReflection ?? null}, ${input.coach ?? null},
          ${input.coachResult}, ${input.coachFeedback ?? null},
          ${input.completedDate ?? null}
        )
        on conflict (learner_id, day) do update set
          scheduled_date = excluded.scheduled_date,
          completion_status = excluded.completion_status,
          output_location = excluded.output_location,
          self_reflection = excluded.self_reflection,
          coach = excluded.coach,
          coach_result = excluded.coach_result,
          coach_feedback = excluded.coach_feedback,
          completed_date = excluded.completed_date,
          updated_at = now()
        returning *
      `;
      return mapProgressRow(result.rows[0]);
    },

    async listScores(learnerId) {
      const result = await sql<ScoreRow>`
        select * from training_scores
        where learner_id = ${learnerId}
        order by record_date, created_at
      `;
      return result.rows.map(mapScoreRow);
    },

    async createScore(input: TrainingScoreInput) {
      const id = randomUUID();
      const result = await sql<ScoreRow>`
        insert into training_scores (
          id, learner_id, checkpoint, record_date, product_skeleton,
          parameter_evidence, application_judgment, competitive_strategy,
          total_score, fatal_error, result, assessor, evidence_location,
          remediation_due, notes
        )
        values (
          ${id}, ${input.learnerId}, ${input.checkpoint}, ${input.recordDate},
          ${input.productSkeleton}, ${input.parameterEvidence},
          ${input.applicationJudgment}, ${input.competitiveStrategy},
          ${input.totalScore}, ${input.fatalError}, ${input.result},
          ${input.assessor}, ${input.evidenceLocation},
          ${input.remediationDue ?? null}, ${input.notes ?? null}
        )
        returning *
      `;
      return mapScoreRow(result.rows[0]);
    },

    async listValidationStates() {
      const result = await sql<ValidationStateRow>`
        select * from validation_task_states
        order by validation_id
      `;
      return result.rows.map(mapValidationStateRow);
    },

    async upsertValidationState(input: ValidationTaskStateInput) {
      const result = await sql<ValidationStateRow>`
        insert into validation_task_states (
          validation_id, owner, status, target_date, conclusion, updated_by
        )
        values (
          ${input.validationId}, ${input.owner ?? null}, ${input.status},
          ${input.targetDate ?? null}, ${input.conclusion ?? null},
          ${input.updatedBy}
        )
        on conflict (validation_id) do update set
          owner = excluded.owner,
          status = excluded.status,
          target_date = excluded.target_date,
          conclusion = excluded.conclusion,
          updated_by = excluded.updated_by,
          updated_at = now()
        returning *
      `;
      return mapValidationStateRow(result.rows[0]);
    },

    async listEvidence(validationId) {
      if (validationId) {
        const result = await sql<EvidenceRow>`
          select * from internal_evidence_records
          where validation_id = ${validationId}
          order by received_date desc, created_at desc
        `;
        return result.rows.map(mapEvidenceRow);
      }

      const result = await sql<EvidenceRow>`
        select * from internal_evidence_records
        order by received_date desc, created_at desc
      `;
      return result.rows.map(mapEvidenceRow);
    },

    async createEvidence(input: InternalEvidenceInput) {
      const id = randomUUID();
      const result = await sql<EvidenceRow>`
        insert into internal_evidence_records (
          id, validation_id, received_date, collector, company, evidence_type,
          subject_product, model_or_configuration, market_scope, source_owner,
          source_date, file_location, confidentiality, fact_summary,
          supports_or_contradicts, verification_status, verifier, verified_date,
          rejection_reason, notes
        )
        values (
          ${id}, ${input.validationId}, ${input.receivedDate},
          ${input.collector}, ${input.company}, ${input.evidenceType},
          ${input.subjectProduct ?? null}, ${input.modelOrConfiguration ?? null},
          ${input.marketScope ?? null}, ${input.sourceOwner ?? null},
          ${input.sourceDate}, ${input.fileLocation}, ${input.confidentiality},
          ${input.factSummary}, ${input.supportsOrContradicts},
          ${input.verificationStatus}, ${input.verifier ?? null},
          ${input.verifiedDate ?? null}, ${input.rejectionReason ?? null},
          ${input.notes ?? null}
        )
        returning *
      `;
      return mapEvidenceRow(result.rows[0]);
    }
  };
}

export async function getKnowledgeStore(): Promise<KnowledgeStore> {
  const sql = getSql();
  if (!sql) {
    return { available: false, reason: "DATABASE_NOT_CONFIGURED" };
  }

  try {
    await sql`select 1`;
    return createPostgresKnowledgeStore(sql);
  } catch {
    return { available: false, reason: "DATABASE_ERROR" };
  }
}
