import { describe, expect, it } from "vitest";
import { PHARMA_BIOTECH_COMPETITORS, CI_DIMENSIONS, getOwnCompany } from "../seed";

describe("Pharma & Biotech seed data", () => {
  it("maps the Excel-derived Pharma & Biotech competitors and dimensions", () => {
    expect(PHARMA_BIOTECH_COMPETITORS.map((competitor) => competitor.name)).toEqual([
      "Bürkert",
      "Gemu",
      "Fujikin",
      "SED",
      "E+H",
      "METTLER",
      "Bronkhorst",
      "Alicat",
      "Vogtlin",
      "Festo"
    ]);

    expect(CI_DIMENSIONS.map((dimension) => dimension.name)).toContain("Price");
    expect(CI_DIMENSIONS).toHaveLength(11);
  });

  it("treats Bürkert as the own-company baseline", () => {
    expect(getOwnCompany().name).toBe("Bürkert");
    expect(getOwnCompany().role).toBe("OWN_COMPANY");
    expect(PHARMA_BIOTECH_COMPETITORS.filter((competitor) => competitor.role === "COMPETITOR")).toHaveLength(9);
  });
});
