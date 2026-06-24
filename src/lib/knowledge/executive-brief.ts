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

export function renderExecutiveEvidenceBriefMarkdown(
  brief: ExecutiveEvidenceBrief,
  generatedDate = new Date().toISOString().slice(0, 10)
): string {
  const lines = [
    "# Bürkert Pharma CI Executive Brief",
    "",
    `生成日期：${generatedDate}`,
    "",
    "## 一句话结论",
    "",
    brief.headline,
    "",
    "## 证据可信度总览",
    "",
    `- 可直接引用证据：${brief.directlyUsableEvidence} 条`,
    `- 需内部验证证据：${brief.riskyEvidence} 条`,
    `- 未归档风险证据：${brief.unlinkedRiskyEvidence} 条`,
    "",
    "## 四家公司证据风险排序",
    "",
    "| 公司 | 强证据 | 风险证据 | 未归档风险 |",
    "|---|---:|---:|---:|",
    ...brief.companyRiskRanking.map(
      (item) =>
        `| ${escapeMarkdownTableCell(item.company)} | ${item.strongEvidence} | ${item.riskyEvidence} | ${item.unlinkedRiskyEvidence} |`
    ),
    "",
    "## Top 风险判断",
    "",
    ...formatRiskEvidence(brief.topRiskEvidence),
    "",
    "## Top 内部验证任务",
    "",
    ...formatValidationActions(brief.topValidationActions),
    "",
    "## 判断使用边界",
    "",
    ...brief.usageBoundaries.map(
      (item) => `- **${item.label}**（${item.count} 条）：${item.rule}`
    ),
    "",
    "## 使用提醒",
    "",
    "- 本简报为公开证据草稿，适合管理层、销售、产品和市场团队进行内部讨论。",
    "- 价格、交期、客户份额和未公开客户名称仍需内部验证，不应直接对外引用。",
    "- 所有高影响判断应回到证据编号、来源链接和验证任务后再进入正式材料。"
  ];

  return `${lines.join("\n")}\n`;
}

function formatRiskEvidence(items: ExecutiveRiskEvidence[]): string[] {
  if (!items.length) return ["暂无风险证据。"];

  return items.flatMap((item, index) => [
    `${index + 1}. **${item.evidenceId}**（${item.company} / ${item.topic}，${item.grade} · ${item.status}）`,
    `   - 摘要：${item.summary}`,
    `   - 已关联产品或场景：${item.linkedProductsOrScenarios}`,
    `   - 验证任务：${item.validationTaskIds.length ? item.validationTaskIds.join(", ") : "未归档"}`,
    `   - 链接：${item.href}`,
    ""
  ]);
}

function formatValidationActions(items: EvidenceActionItem[]): string[] {
  if (!items.length) return ["暂无内部验证任务。"];

  return items.flatMap((item, index) => [
    `${index + 1}. **${item.priority} · ${item.id}**`,
    `   - 任务：${item.title}`,
    `   - 说明：${item.detail}`,
    `   - 链接：${item.href}`,
    ""
  ]);
}

function escapeMarkdownTableCell(value: string): string {
  return value.replace(/\|/g, "\\|");
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
