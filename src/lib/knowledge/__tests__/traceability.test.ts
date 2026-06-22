import { describe, expect, it } from "vitest";
import { loadKnowledgeCatalog } from "../catalog";
import { buildEvidenceTraceMap, evidenceHref } from "../traceability";

describe("knowledge traceability", () => {
  it("links evidence ids back to products and scenarios", async () => {
    const catalog = await loadKnowledgeCatalog();
    const traceMap = buildEvidenceTraceMap(catalog);

    expect(evidenceHref("BURKERT-2103-001")).toBe(
      "/knowledge?view=evidence&q=BURKERT-2103-001"
    );
    expect(traceMap["BURKERT-2103-001"]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          kind: "PRODUCT",
          company: "Bürkert",
          label: "Bürkert 2030"
        }),
        expect.objectContaining({
          kind: "SCENARIO",
          label: "APP-001"
        })
      ])
    );
  });
});
