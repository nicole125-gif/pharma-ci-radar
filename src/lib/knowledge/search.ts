import type {
  ApplicationScenario,
  KnowledgeCatalog,
  KnowledgeCompany,
  KnowledgeProduct,
  KnowledgeRecordType,
  PharmaRelevance
} from "./types";

export interface KnowledgeSearchFilters {
  query?: string;
  company?: KnowledgeCompany | "ALL";
  category?: string;
  pharmaRelevance?: PharmaRelevance | "ALL";
  recordType?: KnowledgeRecordType | "ALL";
  limit?: number;
}

export type KnowledgeSearchResult = KnowledgeProduct | ApplicationScenario;

function normalize(value: string): string {
  return value.toLocaleLowerCase("zh-CN");
}

function productScore(product: KnowledgeProduct, query: string): number {
  const needle = normalize(query);
  const id = normalize(product.productId);
  const name = normalize(`${product.name} ${product.secondaryName ?? ""}`);
  const body = normalize(
    `${product.category} ${product.subcategory} ${product.productRole} ${product.applications}`
  );

  if (!needle) return product.pharmaRelevance === "HIGH" ? 20 : 10;
  if (id === needle) return 1000;
  if (name === needle) return 900;
  if (id.startsWith(needle) || name.startsWith(needle)) return 700;
  if (name.includes(needle)) return 500;
  if (body.includes(needle)) return 250;
  return -1;
}

function scenarioScore(scenario: ApplicationScenario, query: string): number {
  const needle = normalize(query);
  const id = normalize(scenario.scenarioId);
  const customerTask = normalize(scenario.customerTask);
  const body = normalize(
    [
      scenario.processStage,
      ...Object.values(scenario.candidates),
      scenario.mustAskConditions,
      scenario.comparisonDimensions
    ].join(" ")
  );

  if (!needle) return 10;
  if (id === needle) return 1000;
  if (customerTask === needle) return 900;
  if (id.startsWith(needle) || customerTask.startsWith(needle)) return 700;
  if (customerTask.includes(needle)) return 500;
  if (body.includes(needle)) return 250;
  return -1;
}

function productMatchesFilters(
  product: KnowledgeProduct,
  filters: KnowledgeSearchFilters
): boolean {
  return (
    (filters.recordType === undefined ||
      filters.recordType === "ALL" ||
      filters.recordType === "PRODUCT") &&
    (filters.company === undefined ||
      filters.company === "ALL" ||
      product.company === filters.company) &&
    (filters.category === undefined ||
      product.category === filters.category) &&
    (filters.pharmaRelevance === undefined ||
      filters.pharmaRelevance === "ALL" ||
      product.pharmaRelevance === filters.pharmaRelevance)
  );
}

function scenarioMatchesFilters(
  scenario: ApplicationScenario,
  filters: KnowledgeSearchFilters
): boolean {
  return (
    (filters.recordType === undefined ||
      filters.recordType === "ALL" ||
      filters.recordType === "SCENARIO") &&
    (filters.company === undefined ||
      filters.company === "ALL" ||
      scenario.candidates[filters.company] !== "") &&
    (filters.category === undefined ||
      scenario.processStage === filters.category) &&
    (filters.pharmaRelevance === undefined ||
      filters.pharmaRelevance === "ALL")
  );
}

function compareResults(
  left: { item: KnowledgeSearchResult; score: number },
  right: { item: KnowledgeSearchResult; score: number }
): number {
  if (left.score !== right.score) {
    return right.score - left.score;
  }

  const leftKeys =
    left.item.recordType === "PRODUCT"
      ? [left.item.company, left.item.productId]
      : ["", left.item.scenarioId];
  const rightKeys =
    right.item.recordType === "PRODUCT"
      ? [right.item.company, right.item.productId]
      : ["", right.item.scenarioId];

  return (
    leftKeys[0].localeCompare(rightKeys[0], "zh-CN") ||
    leftKeys[1].localeCompare(rightKeys[1], "zh-CN")
  );
}

export function searchKnowledge(
  catalog: KnowledgeCatalog,
  filters: KnowledgeSearchFilters = {}
): KnowledgeSearchResult[] {
  const query = filters.query ?? "";
  const limit = Math.max(0, Math.trunc(filters.limit ?? 100));
  const scored = [
    ...catalog.products
      .filter((product) => productMatchesFilters(product, filters))
      .map((product) => ({ item: product, score: productScore(product, query) })),
    ...catalog.scenarios
      .filter((scenario) => scenarioMatchesFilters(scenario, filters))
      .map((scenario) => ({
        item: scenario,
        score: scenarioScore(scenario, query)
      }))
  ];

  return scored
    .filter(({ score }) => score >= 0)
    .sort(compareResults)
    .slice(0, limit)
    .map(({ item }) => item);
}

export function buildKnowledgeSummary(catalog: KnowledgeCatalog) {
  return {
    burkertTypes: catalog.burkertProducts.length,
    competitorRecords:
      catalog.gemuProducts.length +
      catalog.fujikinProducts.length +
      catalog.esgProducts.length,
    scenarios: catalog.scenarios.length,
    validationTasks: catalog.validationTasks.length,
    p0Tasks: catalog.validationTasks.filter((task) => task.priority === "P0")
      .length
  };
}
