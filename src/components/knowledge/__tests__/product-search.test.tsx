import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProductSearch } from "../product-search";

describe("product search", () => {
  it("renders an evidence-bounded deep learning card", () => {
    render(
      <ProductSearch
        filters={{ query: "2103", recordType: "PRODUCT" }}
        categories={["过程与控制阀"]}
        results={[
          {
            recordType: "PRODUCT",
            company: "Bürkert",
            productId: "2103",
            name: "Diaphragm valve",
            category: "过程与控制阀",
            subcategory: "Diaphragm Valves",
            productRole: "Pneumatic",
            applications: "无菌输送",
            pharmaRelevance: "HIGH",
            chinaOrEvidenceStatus: "CHINA_PAGE_ONLY",
            evidenceGrade: "A",
            boundary: "China visibility does not prove stock.",
            learningCard: {
              cardId: "BURKERT-2103",
              company: "Bürkert",
              productId: "2103",
              operatingPrinciple: "Pneumatic diaphragm valve",
              customerJobs: "卫生隔离",
              pharmaApplications: "无菌输送",
              keySpecifications: "body_materials=stainless steel",
              selectionQuestions: "介质；DN；膜片；温压",
              exclusionConditions: "配置未确认时不得用于关键无菌主工艺",
              adjacentOrRelatedProducts: "2030|2031",
              competitorOverlap: "GEMÜ 650",
              comparisonDimensions: "阀体；膜片；排空",
              factBoundary: "不等同于应用工程批准或验证文件",
              sourceUrls: ["https://www.burkert.com/en/type/2103"],
              evidenceIds: ["BURKERT-2103-001"],
              knowledgeGaps: "价格、库存、产地和交期需内部验证",
              memoryHook: "2103：卫生隔离",
              quizQuestion: "何时应排除 2103？",
              reviewStatus: "GENERATED_REVIEWED_BY_RULES",
              sourceAccessedDate: "2026-06-09",
              generatedDate: "2026-06-14"
            }
          }
        ]}
      />
    );

    expect(screen.getByText("深度学习卡")).toBeTruthy();
    expect(screen.getByText("选型必问")).toBeTruthy();
    expect(screen.getByText("事实边界")).toBeTruthy();
    expect(screen.getByText("何时应排除 2103？")).toBeTruthy();
  });
});
