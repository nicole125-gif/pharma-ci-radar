import { describe, expect, it } from "vitest";
import { loadKnowledgeCatalog } from "../catalog";
import {
  buildEvidenceValidationMap,
  buildValidationEvidenceMap,
  inferValidationIds,
  isRiskyEvidence
} from "../validation-linking";

describe("knowledge validation linking", () => {
  it("identifies public evidence that needs internal validation", async () => {
    const catalog = await loadKnowledgeCatalog();
    const esgCert = catalog.evidenceRecords.find(
      (record) => record.evidenceId === "ESG-CERT-001"
    );
    const burkertCompany = catalog.evidenceRecords.find(
      (record) => record.evidenceId === "BURKERT-COMPANY-001"
    );

    expect(esgCert).toBeTruthy();
    expect(burkertCompany).toBeTruthy();
    expect(isRiskyEvidence(esgCert!)).toBe(true);
    expect(isRiskyEvidence(burkertCompany!)).toBe(false);
  });

  it("maps risky evidence to the most relevant validation task", async () => {
    const catalog = await loadKnowledgeCatalog();
    const byId = new Map(
      catalog.evidenceRecords.map((record) => [record.evidenceId, record])
    );

    expect(inferValidationIds(byId.get("ESG-CERT-001")!)).toContain("VAL-ESG-001");
    expect(inferValidationIds(byId.get("ESG-DIAPHRAGM-001")!)).toEqual(
      expect.arrayContaining(["VAL-ESG-001", "VAL-ESG-002"])
    );
    expect(inferValidationIds(byId.get("MARKET-PRICE-001")!)).toEqual(
      expect.arrayContaining(["VAL-CROSS-001", "VAL-CROSS-002"])
    );
    expect(inferValidationIds(byId.get("FUJIKIN-PRICE-001")!)).toContain(
      "VAL-CROSS-001"
    );
  });

  it("builds forward and reverse validation maps", async () => {
    const catalog = await loadKnowledgeCatalog();
    const evidenceValidationMap = buildEvidenceValidationMap(
      catalog.evidenceRecords,
      catalog.validationTasks
    );
    const validationEvidenceMap = buildValidationEvidenceMap(
      catalog.evidenceRecords,
      catalog.validationTasks
    );

    expect(evidenceValidationMap["ESG-CERT-001"]).toContainEqual(
      expect.objectContaining({ validationId: "VAL-ESG-001", priority: "P0" })
    );
    expect(validationEvidenceMap["VAL-ESG-001"]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ evidenceId: "ESG-CERT-001" })
      ])
    );
  });
});
