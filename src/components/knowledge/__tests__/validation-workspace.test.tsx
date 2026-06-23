import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ValidationWorkspace } from "../validation-workspace";
import type { ValidationTaskDefinition } from "@/lib/knowledge/types";

function task(
  validationId: string,
  company: string,
  topic: string,
  counts?: {
    verifiedEvidenceCount?: number;
    minimumVerifiedRecords?: number;
    totalEvidenceCount?: number;
    priority?: "P0" | "P1" | "P2";
    status?: "OPEN" | "IN_PROGRESS" | "VERIFIED";
  }
): {
  definition: ValidationTaskDefinition;
  state: { validationId: string; status: "OPEN" | "IN_PROGRESS" | "VERIFIED" };
  verifiedEvidenceCount: number;
  totalEvidenceCount: number;
} {
  return {
    definition: {
      validationId,
      priority: counts?.priority ?? "P0",
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
      minimumVerifiedRecords: counts?.minimumVerifiedRecords ?? 1,
      evidenceTypes: "Interview",
      collectionMethod: "CRM",
      acceptanceRule: "One verified record",
      rejectionRule: "No evidence",
      decisionOutput: "Decision",
      reviewCadence: "Weekly",
      targetWindow: "2026-Q3"
    },
    state: { validationId, status: counts?.status ?? "OPEN" },
    verifiedEvidenceCount: counts?.verifiedEvidenceCount ?? 0,
    totalEvidenceCount: counts?.totalEvidenceCount ?? 0
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

  it("shows the remaining verified evidence needed before closure", () => {
    render(
      <ValidationWorkspace
        tasks={[
          task("VAL-GEMU-001", "GEMÜ", "交付能力", {
            verifiedEvidenceCount: 1,
            minimumVerifiedRecords: 3
          })
        ]}
        evidence={[]}
        readOnly
      />
    );

    expect(screen.getByText("关闭条件")).toBeTruthy();
    expect(screen.getByText("需要 3 条 VERIFIED 内部证据，目前 1/3。")).toBeTruthy();
    expect(screen.getByText("还缺 2 条 VERIFIED 内部证据。")).toBeTruthy();
  });

  it("marks tasks as ready to close when verified evidence meets the threshold", () => {
    render(
      <ValidationWorkspace
        tasks={[
          task("VAL-GEMU-001", "GEMÜ", "交付能力", {
            verifiedEvidenceCount: 2,
            minimumVerifiedRecords: 2
          })
        ]}
        evidence={[]}
        readOnly
      />
    );

    expect(screen.getByText("已满足证据数量，可更新为 VERIFIED。")).toBeTruthy();
  });

  it("summarizes and sorts the priority queue by closure urgency", () => {
    render(
      <ValidationWorkspace
        tasks={[
          task("VAL-P1-READY", "GEMÜ", "P1 ready", {
            priority: "P1",
            verifiedEvidenceCount: 2,
            minimumVerifiedRecords: 2,
            totalEvidenceCount: 2
          }),
          task("VAL-P0-EMPTY", "Fujikin", "P0 empty", {
            priority: "P0",
            verifiedEvidenceCount: 0,
            minimumVerifiedRecords: 2,
            totalEvidenceCount: 0
          }),
          task("VAL-P0-NEAR", "ESG 精锐", "P0 near", {
            priority: "P0",
            verifiedEvidenceCount: 1,
            minimumVerifiedRecords: 2,
            totalEvidenceCount: 1
          }),
          task("VAL-CLOSED", "Bürkert", "Closed", {
            priority: "P0",
            verifiedEvidenceCount: 2,
            minimumVerifiedRecords: 2,
            totalEvidenceCount: 2,
            status: "VERIFIED"
          })
        ]}
        evidence={[]}
        readOnly
      />
    );

    expect(screen.getByText("待验证优先队列")).toBeTruthy();
    expect(screen.getByText("P0 未关闭")).toBeTruthy();
    expect(screen.getAllByText("2").length).toBeGreaterThan(0);
    expect(screen.getAllByText("可关闭").length).toBeGreaterThan(0);
    expect(screen.getAllByText("1").length).toBeGreaterThan(0);
    expect(screen.getByText("证据不足")).toBeTruthy();
    expect(screen.getAllByText("缺 1 条证据").length).toBeGreaterThan(0);
    expect(screen.getByText("无内部证据")).toBeTruthy();
    expect(screen.getByText("已关闭")).toBeTruthy();

    const ids = screen
      .getAllByText(/^VAL-/)
      .map((item) => item.textContent);
    expect(ids.slice(0, 4)).toEqual([
      "VAL-P0-NEAR",
      "VAL-P0-EMPTY",
      "VAL-P1-READY",
      "VAL-CLOSED"
    ]);
  });
});
