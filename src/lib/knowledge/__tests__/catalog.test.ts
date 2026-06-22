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
  "2026-06-internal-validation-execution.csv",
  "2026-06-high-relevance-product-learning-cards.csv",
  "2026-06-four-company-evidence.csv",
  "gemu-series-evidence.csv",
  "fujikin-series-evidence.csv",
  "esg-series-evidence.csv"
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
    expect(catalog.learningCards).toHaveLength(136);
    expect(catalog.evidenceRecords.length).toBeGreaterThan(300);
  });

  it("keeps the Bürkert-GEMÜ pharma valve automation deep dive in the training plan", async () => {
    const catalog = await loadKnowledgeCatalog();
    const day8 = catalog.curriculum.find((item) => item.day === 8);

    expect(day8).toMatchObject({
      module: "Bürkert-GEMÜ卫生阀自动化深挖",
      primaryMaterial:
        "2026-06-burkert-gemu-pharma-valve-automation-deep-dive.md"
    });
    expect(day8?.exercise).toContain("2103/2034/8652");
    expect(day8?.passCriteria).toContain("直接对标");
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
    expect(type2103?.learningCard).toMatchObject({
      productId: "2103",
      reviewStatus: "GENERATED_REVIEWED_BY_RULES"
    });
    expect(type2103?.learningCard?.selectionQuestions).toContain("介质");
  });

  it("loads public evidence records with normalized grades and fact status", async () => {
    const catalog = await loadKnowledgeCatalog();

    expect(catalog.evidenceRecords).toContainEqual(
      expect.objectContaining({
        evidenceId: "BURKERT-COMPANY-001",
        company: "Bürkert",
        factStatus: "FACT",
        evidenceGrade: "B",
        sourceFile: "2026-06-four-company-evidence.csv"
      })
    );
    expect(catalog.evidenceRecords).toContainEqual(
      expect.objectContaining({
        evidenceId: "GEMU-SERIES-P600M-P600S-P500M",
        company: "GEMÜ",
        factStatus: "FACT",
        evidenceGrade: "A"
      })
    );
    expect(catalog.evidenceRecords).toContainEqual(
      expect.objectContaining({
        evidenceId: "ESG-SERIES-A00",
        company: "ESG 精锐"
      })
    );
    expect(catalog.evidenceRecords.some((record) => record.company === "ESG Jingrui")).toBe(false);
  });

  it("normalizes validation task company labels for filtering", async () => {
    const catalog = await loadKnowledgeCatalog();

    expect(catalog.validationTasks).toContainEqual(
      expect.objectContaining({
        validationId: "VAL-ESG-001",
        company: "ESG 精锐"
      })
    );
    expect(catalog.validationTasks).toContainEqual(
      expect.objectContaining({
        validationId: "VAL-CROSS-001",
        company: "四家公司"
      })
    );
    expect(catalog.validationTasks.some((task) => task.company === "ESG Jingrui")).toBe(false);
    expect(catalog.validationTasks.some((task) => task.company === "All")).toBe(false);
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

  it("rejects blank integer fields instead of coercing them to zero", async () => {
    const researchDirectory = await copyResearchSources();
    const curriculumPath = path.join(
      researchDirectory,
      "2026-06-product-knowledge-30-day-curriculum.csv"
    );
    const content = await readFile(curriculumPath, "utf8");

    await writeFile(
      curriculumPath,
      content.replace("1,1,基线与方法", "   ,1,基线与方法")
    );

    await expect(loadKnowledgeCatalog(researchDirectory)).rejects.toThrow(
      /2026-06-product-knowledge-30-day-curriculum\.csv.*day.*row 2/
    );
  });

  it("rejects blank required fields with source and record context", async () => {
    const cases = [
      {
        filename: "burkert-type-catalog.csv",
        from: "0044,Pneumatic cylinder in plastic according to ISO",
        to: "0044,   ",
        expected: /burkert-type-catalog\.csv.*name_en.*0044/
      },
      {
        filename: "gemu-series-catalog.csv",
        from: "P600M/P600S/P500M,Multi-port valve blocks made of stainless steel",
        to: "   ,Multi-port valve blocks made of stainless steel",
        expected: /gemu-series-catalog\.csv.*series_id.*row 2/
      },
      {
        filename: "fujikin-series-catalog.csv",
        from: "FUBFL-FUB-FUBFN-8D68C619,FINE series PURE Bellows・Metal Diaphragm series",
        to: "FUBFL-FUB-FUBFN-8D68C619,   ",
        expected:
          /fujikin-series-catalog\.csv.*catalogue_title.*FUBFL-FUB-FUBFN-8D68C619/
      },
      {
        filename: "esg-series-catalog.csv",
        from: "A00,Pneumatic diaphragm valve",
        to: "A00,   ",
        expected: /esg-series-catalog\.csv.*name_en.*A00/
      },
      {
        filename: "2026-06-pharma-application-selection-matrix.csv",
        from: "APP-001,WFI/PW循环回路的卫生隔离与流量监控",
        to: "APP-001,   ",
        expected:
          /2026-06-pharma-application-selection-matrix\.csv.*customer_task.*APP-001/
      },
      {
        filename: "2026-06-product-knowledge-30-day-curriculum.csv",
        from: "1,1,基线与方法",
        to: "1,1,   ",
        expected:
          /2026-06-product-knowledge-30-day-curriculum\.csv.*module.*day 1/
      },
      {
        filename: "2026-06-internal-validation-backlog.csv",
        from: "VAL-CROSS-001,P0",
        to: "   ,P0",
        expected:
          /2026-06-internal-validation-backlog\.csv.*validation_id.*row 2/
      }
    ] as const;

    for (const testCase of cases) {
      const researchDirectory = await copyResearchSources();
      const filePath = path.join(researchDirectory, testCase.filename);
      const content = await readFile(filePath, "utf8");

      await writeFile(filePath, content.replace(testCase.from, testCase.to));

      await expect(loadKnowledgeCatalog(researchDirectory)).rejects.toThrow(
        testCase.expected
      );
    }
  });
});
