import { copyFile, mkdtemp, readFile, rm, utimes, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { loadKnowledgeCatalog } from "../catalog";

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

const temporaryDirectories: string[] = [];

async function copyResearchSources(): Promise<string> {
  const targetDirectory = await mkdtemp(path.join(tmpdir(), "knowledge-catalog-"));
  const sourceDirectory = path.join(process.cwd(), "docs", "research");
  temporaryDirectories.push(targetDirectory);

  await Promise.all(
    SOURCE_FILES.map((filename) =>
      copyFile(
        path.join(sourceDirectory, filename),
        path.join(targetDirectory, filename)
      )
    )
  );

  return targetDirectory;
}

afterEach(async () => {
  await Promise.all(
    temporaryDirectories.splice(0).map((directory) =>
      rm(directory, { force: true, recursive: true })
    )
  );
});

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

  it("reuses unchanged files and reloads after a source mtime changes", async () => {
    const researchDirectory = await copyResearchSources();
    const first = await loadKnowledgeCatalog(researchDirectory);
    const unchanged = await loadKnowledgeCatalog(researchDirectory);
    const burkertPath = path.join(researchDirectory, "burkert-type-catalog.csv");
    const content = await readFile(burkertPath, "utf8");

    await writeFile(
      burkertPath,
      content.replace(
        "2/2-way diaphragm valve with pneumatic stainless steel actuator (Type ELEMENT) for decentralised automation",
        "Updated Type 2103 name"
      )
    );
    const future = new Date(Date.now() + 2_000);
    await utimes(burkertPath, future, future);

    const updated = await loadKnowledgeCatalog(researchDirectory);

    expect(unchanged).toBe(first);
    expect(updated).not.toBe(first);
    expect(
      updated.products.find(
        (item) => item.company === "Bürkert" && item.productId === "2103"
      )?.name
    ).toBe("Updated Type 2103 name");
  });

  it("fails with file context when strict CSV parsing fails", async () => {
    const researchDirectory = await copyResearchSources();
    const scenarioPath = path.join(
      researchDirectory,
      "2026-06-pharma-application-selection-matrix.csv"
    );
    const content = await readFile(scenarioPath, "utf8");

    await writeFile(scenarioPath, `${content}\nBROKEN,too-few-columns\n`);

    await expect(loadKnowledgeCatalog(researchDirectory)).rejects.toThrow(
      /2026-06-pharma-application-selection-matrix\.csv/
    );
  });

  it("rejects unknown validation task values instead of inferring them", async () => {
    const researchDirectory = await copyResearchSources();
    const backlogPath = path.join(
      researchDirectory,
      "2026-06-internal-validation-backlog.csv"
    );
    const content = await readFile(backlogPath, "utf8");

    await writeFile(backlogPath, content.replace(",P0,", ",P9,"));

    await expect(loadKnowledgeCatalog(researchDirectory)).rejects.toThrow(
      /2026-06-internal-validation-backlog\.csv: invalid priority "P9"/
    );
  });

  it("names both validation CSV files when their ID sets differ", async () => {
    const researchDirectory = await copyResearchSources();
    const executionPath = path.join(
      researchDirectory,
      "2026-06-internal-validation-execution.csv"
    );
    const content = await readFile(executionPath, "utf8");
    const rows = content.trimEnd().split("\n");

    await writeFile(executionPath, `${rows.slice(0, -1).join("\n")}\n`);

    await expect(loadKnowledgeCatalog(researchDirectory)).rejects.toThrow(
      /2026-06-internal-validation-backlog\.csv.*2026-06-internal-validation-execution\.csv/
    );
  });
});
