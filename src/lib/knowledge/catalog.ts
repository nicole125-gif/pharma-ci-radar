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

type CsvRow = Record<string, string>;

async function readCsv<T extends CsvRow>(
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
    }) as T[];
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

function parseInteger(
  value: string,
  filename: string,
  field: string,
  recordId: string
): number {
  const parsed = Number(value);
  if (!Number.isInteger(parsed)) {
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

function mapBurkert(row: CsvRow): KnowledgeProduct {
  return {
    recordType: "PRODUCT",
    company: "Bürkert",
    productId: row.type_id,
    name: row.name_en,
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

function mapGemu(row: CsvRow): KnowledgeProduct {
  return {
    recordType: "PRODUCT",
    company: "GEMÜ",
    productId: row.series_id,
    name: row.name_en,
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

function mapFujikin(row: CsvRow): KnowledgeProduct {
  return {
    recordType: "PRODUCT",
    company: "Fujikin",
    productId: row.record_id,
    name: row.catalogue_title,
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

function mapEsg(row: CsvRow): KnowledgeProduct {
  return {
    recordType: "PRODUCT",
    company: "ESG 精锐",
    productId: row.series_id,
    name: row.name_en,
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

function mapScenario(row: CsvRow): ApplicationScenario {
  return {
    recordType: "SCENARIO",
    scenarioId: row.scenario_id,
    customerTask: row.customer_task,
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

function mapCurriculum(row: CsvRow): CurriculumDay {
  const filename = "2026-06-product-knowledge-30-day-curriculum.csv";
  return {
    day: parseInteger(row.day, filename, "day", row.day),
    week: parseInteger(row.week, filename, "week", row.day),
    module: row.module,
    learningObjective: row.learning_objective,
    primaryMaterial: row.primary_material,
    exercise: row.exercise,
    requiredOutput: row.required_output,
    coachReview: row.coach_review,
    passCriteria: row.pass_criteria
  };
}

function mapValidationTasks(
  backlogRows: CsvRow[],
  executionRows: CsvRow[]
): ValidationTaskDefinition[] {
  const executionById = new Map(
    executionRows.map((row) => [row.validation_id, row])
  );
  const backlogIds = new Set(backlogRows.map((row) => row.validation_id));
  const executionIds = new Set(executionRows.map((row) => row.validation_id));

  if (
    backlogIds.size !== backlogRows.length ||
    executionIds.size !== executionRows.length ||
    backlogIds.size !== executionIds.size ||
    [...backlogIds].some((id) => !executionIds.has(id))
  ) {
    throw new Error(
      "validation task sources: validation_id sets differ or contain duplicates"
    );
  }

  return backlogRows.map((backlog) => {
    const execution = executionById.get(backlog.validation_id);
    if (!execution) {
      throw new Error(
        `validation task sources: missing execution row ${backlog.validation_id}`
      );
    }

    return {
      validationId: backlog.validation_id,
      priority: validationPriority(
        backlog.priority,
        "2026-06-internal-validation-backlog.csv",
        backlog.validation_id
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
        backlog.validation_id
      ),
      workstream: execution.workstream,
      executionOwner: execution.execution_owner,
      contributors: execution.contributors,
      minimumVerifiedRecords: parseInteger(
        execution.minimum_verified_records,
        "2026-06-internal-validation-execution.csv",
        "minimum_verified_records",
        backlog.validation_id
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
    readCsv(researchDirectory, SOURCE_FILES[0], [
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
    readCsv(researchDirectory, SOURCE_FILES[1], [
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
    readCsv(researchDirectory, SOURCE_FILES[2], [
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
    readCsv(researchDirectory, SOURCE_FILES[3], [
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
    readCsv(researchDirectory, SOURCE_FILES[4], [
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
    readCsv(researchDirectory, SOURCE_FILES[5], [
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
    readCsv(researchDirectory, SOURCE_FILES[6], [
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
    readCsv(researchDirectory, SOURCE_FILES[7], [
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
