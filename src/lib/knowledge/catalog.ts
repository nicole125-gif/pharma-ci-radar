import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { parse } from "csv-parse/sync";
import type {
  ApplicationScenario,
  CurriculumDay,
  KnowledgeCatalog,
  KnowledgeProduct,
  PharmaRelevance,
  ValidationStatus,
  ValidationTaskDefinition
} from "./types";

const DEFAULT_RESEARCH_DIRECTORY = path.join(process.cwd(), "docs", "research");
const SOURCE_FILES = [
  "burkert-type-catalog.csv",
  "gemu-series-catalog.csv",
  "fujikin-series-catalog.csv",
  "esg-series-catalog.csv",
  "2026-06-pharma-application-selection-matrix.csv",
  "2026-06-product-knowledge-30-day-curriculum.csv",
  "2026-06-internal-validation-backlog.csv",
  "2026-06-internal-validation-execution.csv"
] as const;

const cache = new Map<
  string,
  { signature: string; value: KnowledgeCatalog }
>();

interface BurkertRow {
  type_id: string;
  name_en: string;
  name_zh: string;
  category: string;
  subcategory: string;
  product_role: string;
  pharma_applications: string;
  pharma_relevance: string;
  china_visibility: string;
  evidence_grade: string;
  global_product_url: string;
  china_product_url: string;
  notes: string;
}

interface GemuRow {
  series_id: string;
  name_en: string;
  category: string;
  subcategory: string;
  product_role: string;
  pharma_applications: string;
  pharma_relevance: string;
  evidence_grade: string;
  official_url: string;
  notes: string;
}

interface FujikinRow {
  record_id: string;
  catalogue_title: string;
  category: string;
  subcategory: string;
  product_group: string;
  model_numbers: string;
  pharma_applications: string;
  pharma_relevance: string;
  evidence_grade: string;
  english_catalogue_url: string;
  chinese_catalogue_url: string;
  official_index_url: string;
  notes: string;
}

interface EsgRow {
  series_id: string;
  name_en: string;
  name_zh: string;
  category: string;
  subcategory: string;
  product_role: string;
  pharma_applications: string;
  pharma_relevance: string;
  fact_status: string;
  source_access: string;
  evidence_grade: string;
  official_url: string;
  notes: string;
}

interface ScenarioRow {
  scenario_id: string;
  customer_task: string;
  process_stage: string;
  decision_unit: string;
  burkert_candidates: string;
  gemu_candidates: string;
  fujikin_candidates: string;
  esg_candidates: string;
  must_ask_conditions: string;
  burkert_exclusion_or_caution: string;
  competitor_watchpoint: string;
  comparison_dimensions: string;
  evidence_ids: string;
  internal_validation: string;
}

interface CurriculumRow {
  day: string;
  week: string;
  module: string;
  learning_objective: string;
  primary_material: string;
  exercise: string;
  required_output: string;
  coach_review: string;
  pass_criteria: string;
}

interface ValidationBacklogRow {
  validation_id: string;
  priority: string;
  company: string;
  topic: string;
  question: string;
  evidence_required: string;
  recommended_owner: string;
  decision_supported: string;
  status: string;
}

interface ValidationExecutionRow {
  validation_id: string;
  workstream: string;
  execution_owner: string;
  contributors: string;
  minimum_verified_records: string;
  evidence_types: string;
  collection_method: string;
  acceptance_rule: string;
  rejection_or_insufficient_rule: string;
  decision_output: string;
  review_cadence: string;
  target_window: string;
}

async function readCsv<T extends object>(
  researchDirectory: string,
  filename: string,
  requiredHeaders: string[]
): Promise<T[]> {
  const filePath = path.join(researchDirectory, filename);

  try {
    const content = await readFile(filePath, "utf8");
    const [actualHeaders = []] = parse(content, {
      bom: true,
      relax_column_count: false,
      skip_empty_lines: true,
      to_line: 1
    }) as string[][];

    for (const header of requiredHeaders) {
      if (!actualHeaders.includes(header)) {
        throw new Error(`missing required header ${header}`);
      }
    }

    return parse(content, {
      bom: true,
      columns: true,
      relax_column_count: false,
      skip_empty_lines: true,
      trim: false
    }) as unknown as T[];
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`${filename}: ${message}`, { cause: error });
  }
}

function normalizeRelevance(value: string): PharmaRelevance {
  return value === "HIGH" || value === "MEDIUM" || value === "LOW"
    ? value
    : "UNKNOWN";
}

function optional(value: string): string | undefined {
  return value === "" ? undefined : value;
}

function required(
  value: string,
  filename: string,
  field: string,
  recordContext: string
): string {
  if (value.trim() === "") {
    throw new Error(
      `${filename}: required field ${field} is blank in ${recordContext}`
    );
  }
  return value;
}

function parseInteger(
  value: string,
  filename: string,
  field: string,
  recordId: string
): number {
  const parsed = Number(value);
  if (value.trim() === "" || !Number.isInteger(parsed)) {
    throw new Error(
      `${filename}: invalid integer ${JSON.stringify(value)} for ${field} in ${recordId}`
    );
  }
  return parsed;
}

function validationStatus(
  value: string,
  filename: string,
  recordId: string
): ValidationStatus {
  if (
    value === "OPEN" ||
    value === "IN_PROGRESS" ||
    value === "VERIFIED" ||
    value === "REJECTED" ||
    value === "INSUFFICIENT"
  ) {
    return value;
  }
  throw new Error(
    `${filename}: invalid validation status ${JSON.stringify(value)} in ${recordId}`
  );
}

function validationPriority(
  value: string,
  filename: string,
  recordId: string
): ValidationTaskDefinition["priority"] {
  if (value === "P0" || value === "P1" || value === "P2") {
    return value;
  }
  throw new Error(
    `${filename}: invalid priority ${JSON.stringify(value)} in ${recordId}`
  );
}

function mapBurkert(row: BurkertRow, index: number): KnowledgeProduct {
  const filename = "burkert-type-catalog.csv";
  const productId = required(row.type_id, filename, "type_id", `row ${index + 2}`);
  return {
    recordType: "PRODUCT",
    company: "Bürkert",
    productId,
    name: required(row.name_en, filename, "name_en", productId),
    secondaryName: optional(row.name_zh),
    category: row.category,
    subcategory: row.subcategory,
    productRole: row.product_role,
    applications: row.pharma_applications,
    pharmaRelevance: normalizeRelevance(row.pharma_relevance),
    chinaOrEvidenceStatus: row.china_visibility,
    evidenceGrade: row.evidence_grade,
    sourceUrl: optional(row.global_product_url || row.china_product_url),
    boundary: row.notes
  };
}

function mapGemu(row: GemuRow, index: number): KnowledgeProduct {
  const filename = "gemu-series-catalog.csv";
  const productId = required(
    row.series_id,
    filename,
    "series_id",
    `row ${index + 2}`
  );
  return {
    recordType: "PRODUCT",
    company: "GEMÜ",
    productId,
    name: required(row.name_en, filename, "name_en", productId),
    category: row.category,
    subcategory: row.subcategory,
    productRole: row.product_role,
    applications: row.pharma_applications,
    pharmaRelevance: normalizeRelevance(row.pharma_relevance),
    chinaOrEvidenceStatus: "",
    evidenceGrade: row.evidence_grade,
    sourceUrl: optional(row.official_url),
    boundary: row.notes
  };
}

function mapFujikin(row: FujikinRow, index: number): KnowledgeProduct {
  const filename = "fujikin-series-catalog.csv";
  const productId = required(
    row.record_id,
    filename,
    "record_id",
    `row ${index + 2}`
  );
  return {
    recordType: "PRODUCT",
    company: "Fujikin",
    productId,
    name: required(
      row.catalogue_title,
      filename,
      "catalogue_title",
      productId
    ),
    secondaryName: optional(row.model_numbers),
    category: row.category,
    subcategory: row.subcategory,
    productRole: row.product_group,
    applications: row.pharma_applications,
    pharmaRelevance: normalizeRelevance(row.pharma_relevance),
    chinaOrEvidenceStatus: "",
    evidenceGrade: row.evidence_grade,
    sourceUrl: optional(
      row.english_catalogue_url ||
        row.chinese_catalogue_url ||
        row.official_index_url
    ),
    boundary: row.notes
  };
}

function mapEsg(row: EsgRow, index: number): KnowledgeProduct {
  const filename = "esg-series-catalog.csv";
  const productId = required(
    row.series_id,
    filename,
    "series_id",
    `row ${index + 2}`
  );
  return {
    recordType: "PRODUCT",
    company: "ESG 精锐",
    productId,
    name: required(row.name_en, filename, "name_en", productId),
    secondaryName: optional(row.name_zh),
    category: row.category,
    subcategory: row.subcategory,
    productRole: row.product_role,
    applications: row.pharma_applications,
    pharmaRelevance: normalizeRelevance(row.pharma_relevance),
    chinaOrEvidenceStatus: row.source_access,
    evidenceGrade: row.evidence_grade,
    sourceUrl: optional(row.official_url),
    boundary: `fact_status=${row.fact_status}; ${row.notes}`
  };
}

function mapScenario(row: ScenarioRow, index: number): ApplicationScenario {
  const filename = "2026-06-pharma-application-selection-matrix.csv";
  const scenarioId = required(
    row.scenario_id,
    filename,
    "scenario_id",
    `row ${index + 2}`
  );
  return {
    recordType: "SCENARIO",
    scenarioId,
    customerTask: required(
      row.customer_task,
      filename,
      "customer_task",
      scenarioId
    ),
    processStage: row.process_stage,
    decisionUnit: row.decision_unit,
    candidates: {
      Bürkert: row.burkert_candidates,
      GEMÜ: row.gemu_candidates,
      Fujikin: row.fujikin_candidates,
      "ESG 精锐": row.esg_candidates
    },
    mustAskConditions: row.must_ask_conditions,
    burkertCaution: row.burkert_exclusion_or_caution,
    competitorWatchpoint: row.competitor_watchpoint,
    comparisonDimensions: row.comparison_dimensions,
    evidenceIds: row.evidence_ids === "" ? [] : row.evidence_ids.split("|"),
    internalValidation: row.internal_validation
  };
}

function mapCurriculum(row: CurriculumRow, index: number): CurriculumDay {
  const filename = "2026-06-product-knowledge-30-day-curriculum.csv";
  const recordContext = `row ${index + 2}`;
  const day = parseInteger(row.day, filename, "day", recordContext);
  return {
    day,
    week: parseInteger(row.week, filename, "week", `day ${day}`),
    module: required(row.module, filename, "module", `day ${day}`),
    learningObjective: row.learning_objective,
    primaryMaterial: row.primary_material,
    exercise: row.exercise,
    requiredOutput: row.required_output,
    coachReview: row.coach_review,
    passCriteria: row.pass_criteria
  };
}

function mapValidationTasks(
  backlogRows: ValidationBacklogRow[],
  executionRows: ValidationExecutionRow[]
): ValidationTaskDefinition[] {
  const backlogFilename = "2026-06-internal-validation-backlog.csv";
  const executionFilename = "2026-06-internal-validation-execution.csv";
  const validatedBacklogRows = backlogRows.map((row, index) => ({
    row,
    validationId: required(
      row.validation_id,
      backlogFilename,
      "validation_id",
      `row ${index + 2}`
    )
  }));
  const validatedExecutionRows = executionRows.map((row, index) => ({
    row,
    validationId: required(
      row.validation_id,
      executionFilename,
      "validation_id",
      `row ${index + 2}`
    )
  }));
  const executionById = new Map(
    validatedExecutionRows.map(({ row, validationId }) => [validationId, row])
  );
  const backlogIds = new Set(
    validatedBacklogRows.map(({ validationId }) => validationId)
  );
  const executionIds = new Set(
    validatedExecutionRows.map(({ validationId }) => validationId)
  );

  if (
    backlogIds.size !== validatedBacklogRows.length ||
    executionIds.size !== validatedExecutionRows.length ||
    backlogIds.size !== executionIds.size ||
    [...backlogIds].some((id) => !executionIds.has(id))
  ) {
    throw new Error(
      "2026-06-internal-validation-backlog.csv and 2026-06-internal-validation-execution.csv: validation_id sets differ or contain duplicates"
    );
  }

  return validatedBacklogRows.map(({ row: backlog, validationId }) => {
    const execution = executionById.get(validationId);
    if (!execution) {
      throw new Error(
        `2026-06-internal-validation-backlog.csv and 2026-06-internal-validation-execution.csv: missing execution row ${validationId}`
      );
    }

    return {
      validationId,
      priority: validationPriority(
        backlog.priority,
        "2026-06-internal-validation-backlog.csv",
        validationId
      ),
      company: backlog.company,
      topic: backlog.topic,
      question: backlog.question,
      evidenceRequired: backlog.evidence_required,
      recommendedOwner: backlog.recommended_owner,
      decisionSupported: backlog.decision_supported,
      defaultStatus: validationStatus(
        backlog.status,
        "2026-06-internal-validation-backlog.csv",
        validationId
      ),
      workstream: execution.workstream,
      executionOwner: execution.execution_owner,
      contributors: execution.contributors,
      minimumVerifiedRecords: parseInteger(
        execution.minimum_verified_records,
        "2026-06-internal-validation-execution.csv",
        "minimum_verified_records",
        validationId
      ),
      evidenceTypes: execution.evidence_types,
      collectionMethod: execution.collection_method,
      acceptanceRule: execution.acceptance_rule,
      rejectionRule: execution.rejection_or_insufficient_rule,
      decisionOutput: execution.decision_output,
      reviewCadence: execution.review_cadence,
      targetWindow: execution.target_window
    };
  });
}

async function sourceSignature(researchDirectory: string): Promise<string> {
  const mtimes = await Promise.all(
    SOURCE_FILES.map(async (filename) => {
      const metadata = await stat(path.join(researchDirectory, filename));
      return `${filename}:${metadata.mtimeMs}`;
    })
  );
  return mtimes.join("|");
}

export async function loadKnowledgeCatalog(
  researchDirectory = DEFAULT_RESEARCH_DIRECTORY
): Promise<KnowledgeCatalog> {
  const signature = await sourceSignature(researchDirectory);
  const cached = cache.get(researchDirectory);
  if (cached?.signature === signature) {
    return cached.value;
  }

  const [
    burkertRows,
    gemuRows,
    fujikinRows,
    esgRows,
    scenarioRows,
    curriculumRows,
    validationBacklogRows,
    validationExecutionRows
  ] = await Promise.all([
    readCsv<BurkertRow>(researchDirectory, SOURCE_FILES[0], [
      "type_id",
      "name_en",
      "name_zh",
      "category",
      "subcategory",
      "product_role",
      "pharma_relevance",
      "pharma_applications",
      "china_visibility",
      "global_product_url",
      "china_product_url",
      "evidence_grade",
      "notes"
    ]),
    readCsv<GemuRow>(researchDirectory, SOURCE_FILES[1], [
      "series_id",
      "name_en",
      "category",
      "subcategory",
      "product_role",
      "pharma_relevance",
      "pharma_applications",
      "official_url",
      "evidence_grade",
      "notes"
    ]),
    readCsv<FujikinRow>(researchDirectory, SOURCE_FILES[2], [
      "record_id",
      "catalogue_title",
      "category",
      "subcategory",
      "product_group",
      "model_numbers",
      "pharma_relevance",
      "pharma_applications",
      "english_catalogue_url",
      "chinese_catalogue_url",
      "official_index_url",
      "evidence_grade",
      "notes"
    ]),
    readCsv<EsgRow>(researchDirectory, SOURCE_FILES[3], [
      "series_id",
      "name_en",
      "name_zh",
      "category",
      "subcategory",
      "product_role",
      "pharma_relevance",
      "pharma_applications",
      "fact_status",
      "source_access",
      "official_url",
      "evidence_grade",
      "notes"
    ]),
    readCsv<ScenarioRow>(researchDirectory, SOURCE_FILES[4], [
      "scenario_id",
      "customer_task",
      "process_stage",
      "decision_unit",
      "burkert_candidates",
      "gemu_candidates",
      "fujikin_candidates",
      "esg_candidates",
      "must_ask_conditions",
      "burkert_exclusion_or_caution",
      "competitor_watchpoint",
      "comparison_dimensions",
      "evidence_ids",
      "internal_validation"
    ]),
    readCsv<CurriculumRow>(researchDirectory, SOURCE_FILES[5], [
      "day",
      "week",
      "module",
      "learning_objective",
      "primary_material",
      "exercise",
      "required_output",
      "coach_review",
      "pass_criteria"
    ]),
    readCsv<ValidationBacklogRow>(researchDirectory, SOURCE_FILES[6], [
      "validation_id",
      "priority",
      "company",
      "topic",
      "question",
      "evidence_required",
      "recommended_owner",
      "decision_supported",
      "status"
    ]),
    readCsv<ValidationExecutionRow>(researchDirectory, SOURCE_FILES[7], [
      "validation_id",
      "workstream",
      "execution_owner",
      "contributors",
      "minimum_verified_records",
      "evidence_types",
      "collection_method",
      "acceptance_rule",
      "rejection_or_insufficient_rule",
      "decision_output",
      "review_cadence",
      "target_window"
    ])
  ]);

  const burkertProducts = burkertRows.map(mapBurkert);
  const gemuProducts = gemuRows.map(mapGemu);
  const fujikinProducts = fujikinRows.map(mapFujikin);
  const esgProducts = esgRows.map(mapEsg);
  const value: KnowledgeCatalog = {
    products: [
      ...burkertProducts,
      ...gemuProducts,
      ...fujikinProducts,
      ...esgProducts
    ],
    burkertProducts,
    gemuProducts,
    fujikinProducts,
    esgProducts,
    scenarios: scenarioRows.map(mapScenario),
    curriculum: curriculumRows.map(mapCurriculum),
    validationTasks: mapValidationTasks(
      validationBacklogRows,
      validationExecutionRows
    )
  };

  cache.set(researchDirectory, { signature, value });
  return value;
}
