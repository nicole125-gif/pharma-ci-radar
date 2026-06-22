import { buildEvidenceHealthSummary, type EvidenceActionItem } from "./evidence-health";
import { buildEvidenceTraceMap } from "./traceability";
import {
  buildEvidenceValidationMap,
  isRiskyEvidence
} from "./validation-linking";
import type { EvidenceRecord, KnowledgeCatalog } from "./types";

export interface ExecutiveRiskEvidence {
  evidenceId: string;
  company: string;
  topic: string;
  grade: string;
  status: string;
  summary: string;
  linkedProductsOrScenarios: number;
  validationTaskIds: string[];
  href: string;
}

export interface ExecutiveUsageBoundary {
  label: string;
  count: number;
  rule: string;
}

export interface ExecutiveEvidenceBrief {
  headline: string;
  directlyUsableEvidence: number;
  riskyEvidence: number;
  unlinkedRiskyEvidence: number;
  companyRiskRanking: Array<{
    company: string;
    riskyEvidence: number;
    unlinkedRiskyEvidence: number;
    strongEvidence: number;
  }>;
  topRiskEvidence: ExecutiveRiskEvidence[];
  topValidationActions: EvidenceActionItem[];
  usageBoundaries: ExecutiveUsageBoundary[];
}

export function buildExecutiveEvidenceBrief(
  catalog: KnowledgeCatalog
): ExecutiveEvidenceBrief {
  const health = buildEvidenceHealthSummary(
    catalog.evidenceRecords,
    catalog.validationTasks
  );
  const traceMap = buildEvidenceTraceMap(catalog);
  const validationMap = buildEvidenceValidationMap(
    catalog.evidenceRecords,
    catalog.validationTasks
  );
  const topRiskEvidence = catalog.evidenceRecords
    .filter(isRiskyEvidence)
    .map((record) => ({
      record,
      linkedProductsOrScenarios: (traceMap[record.evidenceId] ?? []).length,
      validationTaskIds: (validationMap[record.evidenceId] ?? []).map(
        (link) => link.validationId
      )
    }))
    .sort(compareRiskEvidence)
    .slice(0, 5)
    .map(({ record, linkedProductsOrScenarios, validationTaskIds }) =>
      mapRiskEvidence(record, linkedProductsOrScenarios, validationTaskIds)
    );

  return {
    headline: `当前研究库共有 ${health.totalEvidence} 条公开证据，其中 ${health.directlyUsableEvidence} 条可直接引用，${health.riskyEvidence} 条需要内部验证。`,
    directlyUsableEvidence: health.directlyUsableEvidence,
    riskyEvidence: health.riskyEvidence,
    unlinkedRiskyEvidence: health.unlinkedRiskyEvidence,
    companyRiskRanking: health.companyHealth
      .map((item) => ({
        company: item.company,
        riskyEvidence: item.riskyEvidence,
        unlinkedRiskyEvidence: item.unlinkedRiskyEvidence,
        strongEvidence: item.strongEvidence
      }))
      .sort(
        (left, right) =>
          right.riskyEvidence - left.riskyEvidence ||
          right.unlinkedRiskyEvidence - left.unlinkedRiskyEvidence ||
          left.company.localeCompare(right.company, "zh-CN")
      ),
    topRiskEvidence,
    topValidationActions: health.priorityActions.slice(0, 5),
    usageBoundaries: buildUsageBoundaries(catalog.evidenceRecords)
  };
}

function compareRiskEvidence(
  left: {
    record: EvidenceRecord;
    linkedProductsOrScenarios: number;
    validationTaskIds: string[];
  },
  right: {
    record: EvidenceRecord;
    linkedProductsOrScenarios: number;
    validationTaskIds: string[];
  }
): number {
  return (
    statusWeight(right.record) - statusWeight(left.record) ||
    right.linkedProductsOrScenarios - left.linkedProductsOrScenarios ||
    right.validationTaskIds.length - left.validationTaskIds.length ||
    left.record.evidenceId.localeCompare(right.record.evidenceId)
  );
}

function statusWeight(record: EvidenceRecord): number {
  if (record.factStatus === "INTERNAL_VALIDATION") return 5;
  if (record.factStatus === "GAP") return 4;
  if (record.factStatus === "CLAIM") return 3;
  if (record.evidenceGrade === "D") return 2;
  if (record.evidenceGrade === "C") return 1;
  return 0;
}

function mapRiskEvidence(
  record: EvidenceRecord,
  linkedProductsOrScenarios: number,
  validationTaskIds: string[]
): ExecutiveRiskEvidence {
  return {
    evidenceId: record.evidenceId,
    company: record.company,
    topic: record.topic,
    grade: record.evidenceGrade,
    status: record.factStatus,
    summary: record.summary,
    linkedProductsOrScenarios,
    validationTaskIds,
    href: `/knowledge?view=evidence&q=${encodeURIComponent(record.evidenceId)}`
  };
}

function buildUsageBoundaries(
  evidence: EvidenceRecord[]
): ExecutiveUsageBoundary[] {
  return [
    {
      label: "可外部引用",
      count: evidence.filter(
        (record) =>
          (record.evidenceGrade === "A" || record.evidenceGrade === "B") &&
          record.factStatus === "FACT"
      ).length,
      rule: "A/B 级且 FACT，可用于正式材料，但仍需保留来源链接。"
    },
    {
      label: "仅内部讨论",
      count: evidence.filter(
        (record) =>
          record.factStatus === "CLAIM" ||
          record.factStatus === "INFERENCE" ||
          record.evidenceGrade === "C"
      ).length,
      rule: "企业宣传、推断或 C 级证据，仅用于内部判断和访谈准备。"
    },
    {
      label: "不应作为结论",
      count: evidence.filter(
        (record) =>
          record.factStatus === "GAP" ||
          record.factStatus === "INTERNAL_VALIDATION" ||
          record.evidenceGrade === "D"
      ).length,
      rule: "缺口、内部待验证或 D 级证据，只能触发验证任务，不能支撑优劣结论。"
    }
  ];
}
