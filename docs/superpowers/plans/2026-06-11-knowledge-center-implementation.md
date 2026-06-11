# Product Knowledge Center Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a task-first `/knowledge` workspace that searches the four-company product knowledge base and persists training and internal-validation execution state in PostgreSQL.

**Architecture:** Keep research CSV files as immutable product and rule masters, parsed through a server-only knowledge catalog module. Add a separate knowledge execution repository backed by PostgreSQL, with a typed unavailable/read-only mode when no database is configured. Page writes use scoped Server Actions and pure domain validators; the existing in-memory CI repository remains unchanged.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, Zod, `csv-parse`, `@vercel/postgres`, Vitest, Testing Library, Tailwind CSS 4, Lucide React.

---

## File Structure

Create:

```text
src/lib/knowledge/types.ts
src/lib/knowledge/catalog.ts
src/lib/knowledge/search.ts
src/lib/knowledge/rules.ts
src/lib/knowledge/store.ts
src/lib/knowledge/postgres-store.ts
src/lib/knowledge/service.ts
src/lib/knowledge/__tests__/catalog.test.ts
src/lib/knowledge/__tests__/search.test.ts
src/lib/knowledge/__tests__/rules.test.ts
src/lib/knowledge/__tests__/service.test.ts
src/app/knowledge/page.tsx
src/app/knowledge/actions.ts
src/components/knowledge/knowledge-nav.tsx
src/components/knowledge/knowledge-workbench.tsx
src/components/knowledge/product-search.tsx
src/components/knowledge/training-workspace.tsx
src/components/knowledge/validation-workspace.tsx
src/components/knowledge/knowledge-forms.tsx
src/components/knowledge/__tests__/knowledge-workbench.test.tsx
```

Modify:

```text
package.json
package-lock.json
db/schema.sql
src/components/app-shell.tsx
```

Do not modify:

```text
src/app/competitors/[id]/page.tsx
src/app/sources/page.tsx
docs/research/*.csv
src/lib/repository.ts
```

## Task 1: Add CSV Parsing and Stable Knowledge Types

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Create: `src/lib/knowledge/types.ts`
- Create: `src/lib/knowledge/catalog.ts`
- Create: `src/lib/knowledge/__tests__/catalog.test.ts`

- [ ] **Step 1: Install the structured CSV parser**

Run:

```bash
npm install csv-parse
```

Expected: `csv-parse` appears in `dependencies`; `package-lock.json` updates without unrelated package churn.

- [ ] **Step 2: Write failing catalog tests**

Create `src/lib/knowledge/__tests__/catalog.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { loadKnowledgeCatalog } from "../catalog";

describe("knowledge catalog", () => {
  it("loads the complete current research masters", async () => {
    const catalog = await loadKnowledgeCatalog();

    expect(catalog.burkertProducts).toHaveLength(511);
    expect(catalog.gemuProducts).toHaveLength(164);
    expect(catalog.fujikinProducts).toHaveLength(127);
    expect(catalog.esgProducts).toHaveLength(16);
    expect(catalog.scenarios).toHaveLength(12);
    expect(catalog.curriculum).toHaveLength(30);
    expect(catalog.validationTasks).toHaveLength(16);
  });

  it("maps source-specific rows to stable product records", async () => {
    const catalog = await loadKnowledgeCatalog();
    const type2103 = catalog.products.find(
      (item) => item.company === "Bürkert" && item.productId === "2103"
    );

    expect(type2103).toMatchObject({
      name: "2/2-way diaphragm valve with pneumatic stainless steel actuator (Type ELEMENT) for decentralised automation",
      pharmaRelevance: "HIGH",
      category: "过程与控制阀"
    });
    expect(type2103?.sourceUrl).toContain("/type/2103");
  });
});
```

- [ ] **Step 3: Run the test to verify red**

Run:

```bash
npx vitest run src/lib/knowledge/__tests__/catalog.test.ts
```

Expected: FAIL because `../catalog` does not exist.

- [ ] **Step 4: Define stable knowledge view models**

Create `src/lib/knowledge/types.ts` with these exported contracts:

```ts
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
```

Also define the execution-state enums used by later tasks:

```ts
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
```

- [ ] **Step 5: Implement strict CSV loading**

Create `src/lib/knowledge/catalog.ts`:

```ts
import "server-only";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { parse } from "csv-parse/sync";
import type {
  ApplicationScenario,
  CurriculumDay,
  KnowledgeCatalog,
  KnowledgeProduct,
  PharmaRelevance,
  ValidationTaskDefinition
} from "./types";

const RESEARCH_DIR = path.join(process.cwd(), "docs", "research");
let cache:
  | { signature: string; value: KnowledgeCatalog }
  | undefined;

async function readCsv<T extends Record<string, string>>(
  filename: string,
  requiredHeaders: string[]
): Promise<T[]> {
  const filePath = path.join(RESEARCH_DIR, filename);
  const content = await readFile(filePath, "utf8");
  const rows = parse(content, {
    bom: true,
    columns: true,
    skip_empty_lines: true,
    relax_column_count: false,
    trim: false
  }) as T[];
  const actualHeaders = rows.length
    ? Object.keys(rows[0])
    : parse(content, { bom: true, to_line: 1 })[0];
  for (const header of requiredHeaders) {
    if (!actualHeaders.includes(header)) {
      throw new Error(`${filename}: missing required header ${header}`);
    }
  }
  return rows;
}
```

Implement one mapper per source. Preserve only source facts:

```ts
function normalizeRelevance(value: string): PharmaRelevance {
  return value === "HIGH" || value === "MEDIUM" || value === "LOW"
    ? value
    : "UNKNOWN";
}
```

Use these boundaries:

- Bürkert: `china_visibility` is public visibility only, never delivery.
- GEMÜ/Fujikin: evidence grade and notes do not prove China availability.
- ESG: `fact_status=CLAIM` stays visible in `boundary`.

Join backlog and execution rows by `validation_id`; throw if ID sets differ. Build a file signature from `mtimeMs` of all source files and reuse cache only when unchanged.

- [ ] **Step 6: Run catalog tests**

Run:

```bash
npx vitest run src/lib/knowledge/__tests__/catalog.test.ts
```

Expected: 2 tests pass.

- [ ] **Step 7: Commit Task 1**

```bash
git add package.json package-lock.json src/lib/knowledge/types.ts src/lib/knowledge/catalog.ts src/lib/knowledge/__tests__/catalog.test.ts
git commit -m "feat: load product knowledge catalog"
```

## Task 2: Build Unified Search and Workbench Summaries

**Files:**
- Create: `src/lib/knowledge/search.ts`
- Create: `src/lib/knowledge/__tests__/search.test.ts`

- [ ] **Step 1: Write failing search tests**

Create `src/lib/knowledge/__tests__/search.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { loadKnowledgeCatalog } from "../catalog";
import { buildKnowledgeSummary, searchKnowledge } from "../search";

describe("knowledge search", () => {
  it("prioritizes exact product identifiers", async () => {
    const catalog = await loadKnowledgeCatalog();
    const results = searchKnowledge(catalog, { query: "2103" });

    expect(results[0]).toMatchObject({
      recordType: "PRODUCT",
      company: "Bürkert",
      productId: "2103"
    });
  });

  it("finds competitor series and application scenarios", async () => {
    const catalog = await loadKnowledgeCatalog();

    expect(searchKnowledge(catalog, { query: "P600" }).some(
      (item) => item.recordType === "PRODUCT" && item.company === "GEMÜ"
    )).toBe(true);
    expect(searchKnowledge(catalog, { query: "WFI" }).some(
      (item) => item.recordType === "SCENARIO"
    )).toBe(true);
  });

  it("reports the current master-data scale", async () => {
    const summary = buildKnowledgeSummary(await loadKnowledgeCatalog());

    expect(summary).toMatchObject({
      burkertTypes: 511,
      competitorRecords: 307,
      scenarios: 12,
      validationTasks: 16
    });
  });
});
```

- [ ] **Step 2: Verify red**

Run:

```bash
npx vitest run src/lib/knowledge/__tests__/search.test.ts
```

Expected: FAIL because `../search` does not exist.

- [ ] **Step 3: Implement deterministic search**

Create `src/lib/knowledge/search.ts` with:

```ts
export interface KnowledgeSearchFilters {
  query?: string;
  company?: KnowledgeCompany | "ALL";
  category?: string;
  pharmaRelevance?: PharmaRelevance | "ALL";
  recordType?: KnowledgeRecordType | "ALL";
  limit?: number;
}

export type KnowledgeSearchResult = KnowledgeProduct | ApplicationScenario;
```

Score product matches:

```ts
function productScore(product: KnowledgeProduct, query: string) {
  const needle = query.toLocaleLowerCase("zh-CN");
  const id = product.productId.toLocaleLowerCase("zh-CN");
  const name = `${product.name} ${product.secondaryName ?? ""}`.toLocaleLowerCase("zh-CN");
  const body = `${product.category} ${product.subcategory} ${product.productRole} ${product.applications}`.toLocaleLowerCase("zh-CN");

  if (!needle) return product.pharmaRelevance === "HIGH" ? 20 : 10;
  if (id === needle) return 1000;
  if (name === needle) return 900;
  if (id.startsWith(needle) || name.startsWith(needle)) return 700;
  if (name.includes(needle)) return 500;
  if (body.includes(needle)) return 250;
  return -1;
}
```

Score scenarios from customer task, process stage, candidates, must-ask conditions, and comparison dimensions. Sort by score descending, then company and product ID for stable results. Default limit is 100.

Implement:

```ts
export function buildKnowledgeSummary(catalog: KnowledgeCatalog) {
  return {
    burkertTypes: catalog.burkertProducts.length,
    competitorRecords:
      catalog.gemuProducts.length +
      catalog.fujikinProducts.length +
      catalog.esgProducts.length,
    scenarios: catalog.scenarios.length,
    validationTasks: catalog.validationTasks.length,
    p0Tasks: catalog.validationTasks.filter((task) => task.priority === "P0").length
  };
}
```

- [ ] **Step 4: Run search tests**

Run:

```bash
npx vitest run src/lib/knowledge/__tests__/search.test.ts
```

Expected: 3 tests pass.

- [ ] **Step 5: Commit Task 2**

```bash
git add src/lib/knowledge/search.ts src/lib/knowledge/__tests__/search.test.ts
git commit -m "feat: search product knowledge"
```

## Task 3: Add PostgreSQL Schema and Execution Store Boundary

**Files:**
- Modify: `db/schema.sql`
- Create: `src/lib/knowledge/store.ts`
- Create: `src/lib/knowledge/postgres-store.ts`
- Create: `src/lib/knowledge/__tests__/service.test.ts`

- [ ] **Step 1: Extend execution-state TypeScript contracts**

Add to `src/lib/knowledge/types.ts`:

```ts
export interface TrainingLearner {
  id: string;
  name: string;
  cohort: string;
  active: boolean;
  createdAt: string;
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

export interface ValidationTaskState {
  validationId: string;
  owner?: string;
  status: ValidationStatus;
  targetDate?: string;
  conclusion?: string;
  updatedBy: string;
  updatedAt: string;
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
```

- [ ] **Step 2: Add idempotent schema statements**

Append to `db/schema.sql`:

```sql
create table if not exists training_learners (
  id text primary key,
  name text not null,
  cohort text not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists training_progress (
  learner_id text references training_learners(id) on delete cascade,
  day integer not null check (day between 1 and 30),
  scheduled_date date,
  completion_status text not null check (completion_status in ('NOT_STARTED', 'IN_PROGRESS', 'SUBMITTED', 'COMPLETE')),
  output_location text,
  self_reflection text,
  coach text,
  coach_result text not null check (coach_result in ('NOT_REVIEWED', 'PASS', 'REWORK')),
  coach_feedback text,
  completed_date date,
  updated_at timestamptz not null default now(),
  primary key (learner_id, day)
);

create table if not exists training_scores (
  id text primary key,
  learner_id text references training_learners(id) on delete cascade,
  checkpoint text not null check (checkpoint in ('BASELINE', 'DAY-10', 'DAY-20', 'DAY-30', 'RETEST')),
  record_date date not null,
  product_skeleton integer not null check (product_skeleton between 0 and 20),
  parameter_evidence integer not null check (parameter_evidence between 0 and 20),
  application_judgment integer not null check (application_judgment between 0 and 30),
  competitive_strategy integer not null check (competitive_strategy between 0 and 30),
  total_score integer not null check (total_score between 0 and 100),
  fatal_error boolean not null,
  result text not null check (result in ('PASS', 'REMEDIATE', 'NOT_ASSESSED')),
  assessor text not null,
  evidence_location text not null,
  remediation_due date,
  notes text,
  created_at timestamptz not null default now()
);

create unique index if not exists training_scores_checkpoint_record_idx
  on training_scores (learner_id, checkpoint, record_date);

create table if not exists validation_task_states (
  validation_id text primary key,
  owner text,
  status text not null check (status in ('OPEN', 'IN_PROGRESS', 'VERIFIED', 'REJECTED', 'INSUFFICIENT')),
  target_date date,
  conclusion text,
  updated_by text not null,
  updated_at timestamptz not null default now()
);

create table if not exists internal_evidence_records (
  id text primary key,
  validation_id text not null,
  received_date date not null,
  collector text not null,
  company text not null,
  evidence_type text not null,
  subject_product text,
  model_or_configuration text,
  market_scope text,
  source_owner text,
  source_date date not null,
  file_location text not null,
  confidentiality text not null check (confidentiality in ('INTERNAL', 'RESTRICTED', 'PUBLIC')),
  fact_summary text not null,
  supports_or_contradicts text not null check (supports_or_contradicts in ('SUPPORTS', 'CONTRADICTS', 'CONTEXT_ONLY')),
  verification_status text not null check (verification_status in ('PENDING', 'VERIFIED', 'REJECTED', 'INSUFFICIENT')),
  verifier text,
  verified_date date,
  rejection_reason text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists internal_evidence_validation_idx
  on internal_evidence_records (validation_id, verification_status);
```

- [ ] **Step 3: Define the store interface and unavailable mode**

Create `src/lib/knowledge/store.ts`:

```ts
export interface KnowledgeExecutionStore {
  available: true;
  listLearners(): Promise<TrainingLearner[]>;
  createLearner(input: { name: string; cohort: string }): Promise<TrainingLearner>;
  listProgress(learnerId: string): Promise<TrainingProgress[]>;
  upsertProgress(input: TrainingProgressInput): Promise<TrainingProgress>;
  listScores(learnerId: string): Promise<TrainingScore[]>;
  createScore(input: TrainingScoreInput): Promise<TrainingScore>;
  listValidationStates(): Promise<ValidationTaskState[]>;
  upsertValidationState(input: ValidationTaskStateInput): Promise<ValidationTaskState>;
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
```

Export input interfaces from `types.ts` without generated IDs or timestamps.

- [ ] **Step 4: Implement PostgreSQL row mapping**

Create `src/lib/knowledge/postgres-store.ts`. Use `getSql()` and return:

```ts
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
```

Use parameterized tagged-template queries for every operation. Generate IDs with `crypto.randomUUID()`. Map snake_case database columns to camelCase types in focused helper functions. `upsertProgress` and `upsertValidationState` use `on conflict ... do update`; scores and evidence are append-only.

- [ ] **Step 5: Add store-free service test scaffolding**

Create `src/lib/knowledge/__tests__/service.test.ts` with a small fake store implementing the interface. The first test only proves unavailable mode does not fabricate execution data:

```ts
import { describe, expect, it } from "vitest";
import { buildKnowledgeWorkspace } from "../service";

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
});
```

- [ ] **Step 6: Verify the expected service red**

Run:

```bash
npx vitest run src/lib/knowledge/__tests__/service.test.ts
```

Expected: FAIL because `../service` does not exist. Leave implementation for Task 5 after domain rules exist.

- [ ] **Step 7: Commit Task 3**

```bash
git add db/schema.sql src/lib/knowledge/types.ts src/lib/knowledge/store.ts src/lib/knowledge/postgres-store.ts src/lib/knowledge/__tests__/service.test.ts
git commit -m "feat: add knowledge execution store"
```

## Task 4: Implement Training and Validation Domain Rules

**Files:**
- Create: `src/lib/knowledge/rules.ts`
- Create: `src/lib/knowledge/__tests__/rules.test.ts`

- [ ] **Step 1: Write failing rule tests**

Create `src/lib/knowledge/__tests__/rules.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import {
  assertTrainingProgressInput,
  assessTrainingScore,
  assertValidationTransition
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
    ).toThrow("COMPLETE requires output location, coach, PASS review, and completed date");
  });

  it("uses checkpoint-specific score thresholds", () => {
    expect(assessTrainingScore({
      checkpoint: "DAY-20",
      productSkeleton: 14,
      parameterEvidence: 14,
      applicationJudgment: 21,
      competitiveStrategy: 21,
      fatalError: false
    })).toMatchObject({ totalScore: 70, result: "PASS" });
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
});
```

- [ ] **Step 2: Verify red**

Run:

```bash
npx vitest run src/lib/knowledge/__tests__/rules.test.ts
```

Expected: FAIL because `../rules` does not exist.

- [ ] **Step 3: Implement pure rules with Zod**

Create `src/lib/knowledge/rules.ts`. Define Zod schemas for learner, progress, score, task-state, and evidence inputs. Export:

```ts
export function assertTrainingProgressInput(input: TrainingProgressInput) {
  const parsed = trainingProgressSchema.parse(input);
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
```

Implement score calculation:

```ts
export function assessTrainingScore(input: TrainingScoreAssessmentInput) {
  const totalScore =
    input.productSkeleton +
    input.parameterEvidence +
    input.applicationJudgment +
    input.competitiveStrategy;

  if (input.checkpoint === "BASELINE") {
    return { totalScore, result: "NOT_ASSESSED" as const };
  }
  if (input.fatalError) {
    return { totalScore, result: "REMEDIATE" as const };
  }
  if (input.checkpoint === "DAY-10") {
    return { totalScore, result: totalScore >= 60 ? "PASS" : "REMEDIATE" };
  }
  if (input.checkpoint === "DAY-20") {
    return {
      totalScore,
      result:
        totalScore >= 70 && input.applicationJudgment >= 21
          ? "PASS"
          : "REMEDIATE"
    };
  }
  const modulesPass =
    input.productSkeleton >= 14 &&
    input.parameterEvidence >= 14 &&
    input.applicationJudgment >= 21 &&
    input.competitiveStrategy >= 21;
  return {
    totalScore,
    result: totalScore >= 75 && modulesPass ? "PASS" : "REMEDIATE"
  };
}
```

Implement validation transition:

```ts
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
    (!input.acceptanceConfirmed || !input.conclusion.trim())
  ) {
    throw new Error("VERIFIED requires acceptance confirmation and conclusion");
  }
  if (
    (input.requestedStatus === "REJECTED" ||
      input.requestedStatus === "INSUFFICIENT") &&
    !input.conclusion.trim()
  ) {
    throw new Error(`${input.requestedStatus} requires a conclusion`);
  }
  return input;
}
```

Evidence rules:

- `VERIFIED` requires verifier and verified date.
- `REJECTED`/`INSUFFICIENT` requires rejection reason.
- file location, fact summary, source date, company, evidence type, collector, and validation ID are always required.

- [ ] **Step 4: Run rule tests**

Run:

```bash
npx vitest run src/lib/knowledge/__tests__/rules.test.ts
```

Expected: 3 tests pass.

- [ ] **Step 5: Commit Task 4**

```bash
git add src/lib/knowledge/rules.ts src/lib/knowledge/__tests__/rules.test.ts
git commit -m "feat: enforce knowledge workflow rules"
```

## Task 5: Build the Knowledge Workspace Service

**Files:**
- Create: `src/lib/knowledge/service.ts`
- Modify: `src/lib/knowledge/__tests__/service.test.ts`

- [ ] **Step 1: Extend failing service tests**

Add a fake available store and tests:

```ts
it("merges validation definitions with execution state and evidence counts", async () => {
  const store = createFakeKnowledgeStore({
    validationStates: [{
      validationId: "VAL-GEMU-001",
      owner: "Product",
      status: "IN_PROGRESS",
      updatedBy: "strategy",
      updatedAt: "2026-06-11T00:00:00.000Z"
    }],
    evidence: [
      verifiedEvidence("ev-1", "VAL-GEMU-001"),
      rejectedEvidence("ev-2", "VAL-GEMU-001")
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
```

Add a test that `updateValidationTask` rejects unknown CSV IDs and insufficient verified samples.

- [ ] **Step 2: Verify red**

Run:

```bash
npx vitest run src/lib/knowledge/__tests__/service.test.ts
```

Expected: FAIL because service functions are missing.

- [ ] **Step 3: Implement workspace composition**

Create `src/lib/knowledge/service.ts` with:

```ts
export async function buildKnowledgeWorkspace(options?: {
  store?: KnowledgeStore;
  learnerId?: string;
}) {
  const catalog = await loadKnowledgeCatalog();
  const store = options?.store ?? (await getKnowledgeStore());
  const summary = buildKnowledgeSummary(catalog);

  if (!store.available) {
    return {
      catalog,
      summary,
      database: store,
      training: { learners: [], selectedLearner: undefined, progress: [], scores: [] },
      validation: {
        tasks: catalog.validationTasks.map((definition) => ({
          definition,
          state: {
            validationId: definition.validationId,
            status: definition.defaultStatus
          },
          verifiedEvidenceCount: 0,
          totalEvidenceCount: 0
        })),
        evidence: []
      }
    };
  }
```

For available stores, load learners, selected learner progress/scores, validation states, and evidence in parallel. Merge CSV definitions with database state. Database state wins only for owner, status, target date, conclusion, and audit fields.

Export command functions:

```ts
createTrainingLearner
saveTrainingProgress
recordTrainingScore
saveValidationTaskState
registerInternalEvidence
```

Every command:

1. Loads the catalog.
2. Requires an available store.
3. Runs the pure rule.
4. Confirms referenced learner/day/validation ID exists.
5. Writes through the store.

`saveValidationTaskState` counts verified evidence immediately before applying the transition.

- [ ] **Step 4: Run service tests**

Run:

```bash
npx vitest run src/lib/knowledge/__tests__/service.test.ts
```

Expected: all service tests pass.

- [ ] **Step 5: Run all knowledge tests**

```bash
npx vitest run src/lib/knowledge
```

Expected: catalog, search, rules, and service tests all pass.

- [ ] **Step 6: Commit Task 5**

```bash
git add src/lib/knowledge/service.ts src/lib/knowledge/__tests__/service.test.ts
git commit -m "feat: compose knowledge workspace data"
```

## Task 6: Add Server Actions and Forms

**Files:**
- Create: `src/app/knowledge/actions.ts`
- Create: `src/components/knowledge/knowledge-forms.tsx`
- Test: `src/lib/knowledge/__tests__/service.test.ts`

- [ ] **Step 1: Add command tests for invalid and valid writes**

Extend service tests to cover:

- learner name/cohort required;
- complete progress requires coach approval;
- score result is computed server-side, ignoring any submitted result;
- evidence with unknown `validationId` is rejected;
- unavailable store returns a stable `DATABASE_NOT_CONFIGURED` error.

- [ ] **Step 2: Verify one new test fails**

Run:

```bash
npx vitest run src/lib/knowledge/__tests__/service.test.ts
```

Expected: FAIL on the first missing command behavior.

- [ ] **Step 3: Implement scoped Server Actions**

Create `src/app/knowledge/actions.ts`:

```ts
"use server";

import { revalidatePath } from "next/cache";
import {
  createTrainingLearner,
  recordTrainingScore,
  registerInternalEvidence,
  saveTrainingProgress,
  saveValidationTaskState
} from "@/lib/knowledge/service";

export type KnowledgeActionState = {
  ok: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
};
```

Implement one action per command. Convert `FormData` explicitly; do not pass raw form data to the service. On Zod errors return field errors. On unavailable database return:

```ts
{ ok: false, message: "当前为只读模式：未配置 PostgreSQL。" }
```

On success call:

```ts
revalidatePath("/knowledge");
return { ok: true, message: "已保存。" };
```

- [ ] **Step 4: Build accessible forms**

Create `src/components/knowledge/knowledge-forms.tsx` as a client component using `useActionState`. Include:

- `CreateLearnerForm`
- `TrainingProgressForm`
- `TrainingScoreForm`
- `ValidationStateForm`
- `EvidenceRecordForm`

Rules:

- Every input has a label.
- Disabled forms display the read-only reason.
- Save buttons use Lucide `Save`.
- Statuses use native selects.
- Numeric score inputs have correct min/max.
- No file upload control.
- Form success/error appears in an `aria-live="polite"` region.

- [ ] **Step 5: Run service tests**

```bash
npx vitest run src/lib/knowledge/__tests__/service.test.ts
```

Expected: all command tests pass.

- [ ] **Step 6: Commit Task 6**

```bash
git add src/app/knowledge/actions.ts src/components/knowledge/knowledge-forms.tsx src/lib/knowledge/__tests__/service.test.ts
git commit -m "feat: add knowledge workflow actions"
```

## Task 7: Build the Task-First Knowledge Center UI

**Files:**
- Create: `src/app/knowledge/page.tsx`
- Create: `src/components/knowledge/knowledge-nav.tsx`
- Create: `src/components/knowledge/knowledge-workbench.tsx`
- Create: `src/components/knowledge/product-search.tsx`
- Create: `src/components/knowledge/training-workspace.tsx`
- Create: `src/components/knowledge/validation-workspace.tsx`
- Create: `src/components/knowledge/__tests__/knowledge-workbench.test.tsx`
- Modify: `src/components/app-shell.tsx`

- [ ] **Step 1: Write failing UI tests**

Create `src/components/knowledge/__tests__/knowledge-workbench.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { KnowledgeWorkbench } from "../knowledge-workbench";

describe("knowledge workbench", () => {
  it("starts from five product-manager tasks", () => {
    render(
      <KnowledgeWorkbench
        summary={{
          burkertTypes: 511,
          competitorRecords: 307,
          scenarios: 12,
          validationTasks: 16,
          p0Tasks: 10
        }}
        database={{ available: false, reason: "DATABASE_NOT_CONFIGURED" }}
        validationTasks={[]}
        learners={[]}
      />
    );

    expect(screen.getByText("为客户选型")).toBeInTheDocument();
    expect(screen.getByText("比较竞品")).toBeInTheDocument();
    expect(screen.getByText("准备客户拜访")).toBeInTheDocument();
    expect(screen.getByText("继续训练")).toBeInTheDocument();
    expect(screen.getByText("验证一个判断")).toBeInTheDocument();
    expect(screen.getByText(/只读模式/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Verify red**

Run:

```bash
npx vitest run src/components/knowledge/__tests__/knowledge-workbench.test.tsx
```

Expected: FAIL because the component does not exist.

- [ ] **Step 3: Add the navigation item**

Modify `src/components/app-shell.tsx`:

- Import `BookOpenCheck`.
- Add `{ href: "/knowledge", label: "知识中心", icon: BookOpenCheck }`.
- Place it after “分析中心” and before “战术卡”.
- Do not change any other navigation label or sidebar styling.

- [ ] **Step 4: Implement view navigation**

Create `knowledge-nav.tsx` with four icon tabs:

```text
工作台     /knowledge
产品与场景 /knowledge?view=products
训练       /knowledge?view=training
验证       /knowledge?view=validation
```

Use exact query-derived active state and horizontal overflow on narrow screens.

- [ ] **Step 5: Implement the task-first workbench**

Create `knowledge-workbench.tsx`:

- Five task links:
  - 为客户选型 → `?view=products&type=SCENARIO`
  - 比较竞品 → `?view=products`
  - 准备客户拜访 → `/battlecards`
  - 继续训练 → `?view=training`
  - 验证一个判断 → `?view=validation`
- Metrics for 511, 307, 12, 16 using passed summary, never hard-coded in rendered values.
- Current P0 validation task list.
- Learner progress summary when available.
- Read-only banner when the store is unavailable.

Keep all cards at 8px radius or less and avoid cards inside cards.

- [ ] **Step 6: Implement product and scenario search**

Create `product-search.tsx` as a server-rendered component receiving filters and results. Include:

- search input;
- company select;
- relevance select;
- record-type segmented links;
- category select populated from product results;
- result count;
- product rows and scenario rows.

Product rows show ID, company, name, category, role, relevance, evidence status, source link, and boundary. Scenario rows show candidates, must-ask conditions, caution, watchpoint, and internal validation.

Do not render empty links. External source links use `target="_blank"` and `rel="noreferrer"`.

- [ ] **Step 7: Implement training workspace**

Create `training-workspace.tsx`:

- Learner selection links.
- Create learner form.
- 30-day list grouped by week.
- Current progress status and required output.
- Expandable edit form per day.
- Score history and new score form.
- Read-only controls when database unavailable.

Use curriculum CSV as the source for objectives and criteria; never copy course text into component constants.

- [ ] **Step 8: Implement validation workspace**

Create `validation-workspace.tsx`:

- P0/P1 and company filters.
- Each row shows definition, merged state, verified/required sample count, owner, target date, acceptance rule, and conclusion.
- Task update form.
- Evidence count and evidence list.
- Evidence registration form.
- `VERIFIED` option remains visible, but server rejection message explains unmet thresholds.

- [ ] **Step 9: Compose the page**

Create `src/app/knowledge/page.tsx`:

```tsx
export default async function KnowledgePage({
  searchParams
}: {
  searchParams: Promise<{
    view?: string;
    q?: string;
    company?: string;
    category?: string;
    relevance?: string;
    type?: string;
    learner?: string;
    priority?: string;
  }>;
}) {
  const params = await searchParams;
  const workspace = await buildKnowledgeWorkspace({ learnerId: params.learner });
  const view = normalizeView(params.view);
  const results =
    view === "products"
      ? searchKnowledge(workspace.catalog, normalizeFilters(params))
      : [];
```

Render `PageHeader`, `KnowledgeNav`, and exactly one view component. Use `PageHeader` title “产品知识中心” and a concise operational description.

- [ ] **Step 10: Run UI and knowledge tests**

```bash
npx vitest run src/components/knowledge src/lib/knowledge
```

Expected: all tests pass.

- [ ] **Step 11: Commit Task 7**

```bash
git add src/app/knowledge/page.tsx src/components/knowledge src/components/app-shell.tsx
git commit -m "feat: add product knowledge center"
```

## Task 8: Verify Degraded Mode, Build, and Browser Layout

**Files:**
- Modify only if validation exposes defects in Task 1-7 files.

- [ ] **Step 1: Run all automated tests**

```bash
npm test
```

Expected: all existing and new Vitest test files pass.

- [ ] **Step 2: Run production build without database configuration**

```bash
env -u POSTGRES_URL -u DATABASE_URL npm run build
```

Expected: build succeeds; `/knowledge` is included; no database connection is attempted during build in a way that fails the build.

- [ ] **Step 3: Run research validators**

```bash
python3 scripts/research/validate_product_training_program.py
python3 scripts/research/validate_internal_validation_pack.py
python3 scripts/research/validate_application_selection_matrix.py
python3 scripts/research/validate_esg_catalog.py
python3 scripts/research/validate_fujikin_series.py
python3 scripts/research/validate_gemu_series.py
python3 scripts/research/validate_burkert_catalog.py
```

Expected: every validator prints `status: PASS`.

- [ ] **Step 4: Start the dev server**

Run:

```bash
npm run dev
```

Expected: Next.js prints an available localhost URL. If port 3000 is occupied, use the next available port and record it.

- [ ] **Step 5: Verify desktop in the in-app browser**

At a 1440×900 viewport:

1. Log in with the existing demo credentials.
2. Open `/knowledge`.
3. Confirm five task entries are visible without overlap.
4. Open 产品与场景 and search `2103`, `P600`, and `WFI`.
5. Confirm source links and boundary text render.
6. Open 训练 and 验证.
7. With no database configured, confirm forms are disabled and the read-only banner is visible.
8. Confirm browser console has no errors.

- [ ] **Step 6: Verify mobile in the in-app browser**

At a 390×844 viewport:

1. Open all four knowledge views.
2. Confirm tabs scroll horizontally without compressing labels.
3. Confirm no page-level horizontal overflow.
4. Confirm cards, forms, and long Type/series names do not overlap.
5. Confirm task links and filters remain keyboard-accessible.

- [ ] **Step 7: Verify database behavior when a test PostgreSQL URL is available**

Only when `POSTGRES_URL` or `DATABASE_URL` is configured:

1. Apply `db/schema.sql`.
2. Create one learner.
3. Submit day 1.
4. Approve day 1 with coach result PASS and mark COMPLETE.
5. Record a DAY-10 score.
6. Add one evidence record.
7. Attempt premature `VERIFIED` and confirm rejection.
8. Reload and confirm records persist.

If no database URL is available, state that live persistence was not exercised; rely on store/service tests and degraded-mode browser verification.

- [ ] **Step 8: Inspect scope and whitespace**

```bash
git diff --check
git status --short
git diff --name-only
```

Expected:

- no whitespace errors;
- existing uncommitted `src/app/competitors/[id]/page.tsx` and `src/app/sources/page.tsx` remain untouched;
- no research CSV modifications;
- only knowledge-center implementation, schema, dependency, navigation, and tests are staged.

- [ ] **Step 9: Commit verification fixes if any**

If Task 8 required code fixes:

```bash
git add <only Task 1-8 knowledge-center files>
git commit -m "fix: verify product knowledge center"
```

If no fixes were needed, do not create an empty commit.

- [ ] **Step 10: Push the branch**

```bash
git push origin codex/esg-jingrui-product-catalog
```

Expected: local `HEAD` and `@{u}` resolve to the same commit.
