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

    expect(
      searchKnowledge(catalog, { query: "P600" }).some(
        (item) => item.recordType === "PRODUCT" && item.company === "GEMÜ"
      )
    ).toBe(true);
    expect(
      searchKnowledge(catalog, { query: "WFI" }).some(
        (item) => item.recordType === "SCENARIO"
      )
    ).toBe(true);
  });

  it("reports the current master-data scale", async () => {
    const summary = buildKnowledgeSummary(await loadKnowledgeCatalog());

    expect(summary).toEqual({
      burkertTypes: 511,
      competitorRecords: 307,
      scenarios: 12,
      validationTasks: 16,
      p0Tasks: 10
    });
  });

  it("applies every product filter", async () => {
    const catalog = await loadKnowledgeCatalog();
    const results = searchKnowledge(catalog, {
      query: "P600",
      company: "GEMÜ",
      category: "Customised product solutions",
      pharmaRelevance: "HIGH",
      recordType: "PRODUCT",
      limit: 1
    });

    expect(results).toHaveLength(1);
    expect(results[0]).toMatchObject({
      recordType: "PRODUCT",
      company: "GEMÜ",
      productId: "P600M/P600S/P500M"
    });
  });

  it("uses a stable default limit without modifying input arrays", async () => {
    const catalog = await loadKnowledgeCatalog();
    const originalProductOrder = catalog.products.map(
      (product) => `${product.company}:${product.productId}`
    );
    const originalScenarioOrder = catalog.scenarios.map(
      (scenario) => scenario.scenarioId
    );
    const reversedCatalog = {
      ...catalog,
      products: [...catalog.products].reverse(),
      scenarios: [...catalog.scenarios].reverse()
    };

    const forward = searchKnowledge(catalog, {});
    const reversed = searchKnowledge(reversedCatalog, {});

    expect(forward).toHaveLength(100);
    expect(reversed).toEqual(forward);
    expect(
      catalog.products.map(
        (product) => `${product.company}:${product.productId}`
      )
    ).toEqual(originalProductOrder);
    expect(catalog.scenarios.map((scenario) => scenario.scenarioId)).toEqual(
      originalScenarioOrder
    );
  });
});
