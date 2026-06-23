import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ValidationWorkspace } from "../validation-workspace";
import type { ValidationTaskDefinition } from "@/lib/knowledge/types";

function task(
  validationId: string,
  company: string,
  topic: string
): {
  definition: ValidationTaskDefinition;
  state: { validationId: string; status: "OPEN" };
  verifiedEvidenceCount: number;
  totalEvidenceCount: number;
} {
  return {
    definition: {
      validationId,
      priority: "P0",
      company,
      topic,
      question: `${topic} question`,
      evidenceRequired: "Internal evidence",
      recommendedOwner: "Product",
      decisionSupported: "Validation decision",
      defaultStatus: "OPEN",
      workstream: "Product",
      executionOwner: "Product",
      contributors: "Sales",
      minimumVerifiedRecords: 1,
      evidenceTypes: "Interview",
      collectionMethod: "CRM",
      acceptanceRule: "One verified record",
      rejectionRule: "No evidence",
      decisionOutput: "Decision",
      reviewCadence: "Weekly",
      targetWindow: "2026-Q3"
    },
    state: { validationId, status: "OPEN" },
    verifiedEvidenceCount: 0,
    totalEvidenceCount: 0
  };
}

describe("validation workspace", () => {
  it("filters ESG validation tasks with the normalized Chinese company name", () => {
    render(
      <ValidationWorkspace
        tasks={[
          task("VAL-ESG-001", "ESG 精锐", "证书原件"),
          task("VAL-GEMU-001", "GEMÜ", "交付能力")
        ]}
        evidence={[]}
        readOnly
        company="ESG 精锐"
      />
    );

    expect(screen.getByText("VAL-ESG-001")).toBeTruthy();
    expect(screen.getByText("P0 · ESG 精锐")).toBeTruthy();
    expect(screen.queryByText("VAL-GEMU-001")).toBeNull();
    expect(screen.queryByText("ESG Jingrui")).toBeNull();
  });

  it("renders the internal evidence fields needed to close a validation task", () => {
    render(
      <ValidationWorkspace
        tasks={[task("VAL-GEMU-001", "GEMÜ", "交付能力")]}
        evidence={[]}
        readOnly={false}
      />
    );

    expect(screen.getByLabelText("支持/反驳")).toBeTruthy();
    expect(screen.getByLabelText("验证人")).toBeTruthy();
    expect(screen.getByLabelText("验证日期")).toBeTruthy();
    expect(screen.getByLabelText("拒绝或不足原因")).toBeTruthy();
    expect(screen.getByLabelText("备注")).toBeTruthy();
  });
});
