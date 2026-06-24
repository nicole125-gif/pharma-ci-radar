import type { EvidenceRecord, ValidationTaskDefinition } from "./types";
import {
  buildEvidenceValidationMap,
  buildValidationEvidenceMap,
  isRiskyEvidence,
  validationHref
} from "./validation-linking";

export interface EvidenceCompanyHealth {
  company: string;
  strongEvidence: number;
  riskyEvidence: number;
  linkedRiskyEvidence: number;
  unlinkedRiskyEvidence: number;
}

export interface EvidenceActionItem {
  id: string;
  title: string;
  detail: string;
  href: string;
  priority: "P0" | "P1" | "P2" | "UNLINKED";
}

export interface EvidenceHealthSummary {
  totalEvidence: number;
  directlyUsableEvidence: number;
  riskyEvidence: number;
  unlinkedRiskyEvidence: number;
  p0ValidationTasks: number;
  companyHealth: EvidenceCompanyHealth[];
  priorityActions: EvidenceActionItem[];
}

export function buildEvidenceHealthSummary(
  evidence: EvidenceRecord[],
  tasks: ValidationTaskDefinition[]
): EvidenceHealthSummary {
  const evidenceValidationMap = buildEvidenceValidationMap(evidence, tasks);
  const validationEvidenceMap = buildValidationEvidenceMap(evidence, tasks);
  const riskyEvidence = evidence.filter(isRiskyEvidence);
  const unlinkedRiskyEvidence = riskyEvidence.filter(
    (record) => (evidenceValidationMap[record.evidenceId] ?? []).length === 0
  );
  const companyHealth = buildCompanyHealth(evidence, evidenceValidationMap);
  const priorityActions = buildPriorityActions({
    tasks,
    validationEvidenceMap,
    unlinkedRiskyEvidence
  });

  return {
    totalEvidence: evidence.length,
    directlyUsableEvidence: evidence.filter(
      (record) =>
        (record.evidenceGrade === "A" || record.evidenceGrade === "B") &&
        record.factStatus === "FACT"
    ).length,
    riskyEvidence: riskyEvidence.length,
    unlinkedRiskyEvidence: unlinkedRiskyEvidence.length,
    p0ValidationTasks: tasks.filter((task) => task.priority === "P0").length,
    companyHealth,
    priorityActions
  };
}

function buildCompanyHealth(
  evidence: EvidenceRecord[],
  evidenceValidationMap: ReturnType<typeof buildEvidenceValidationMap>
): EvidenceCompanyHealth[] {
  const companies = [...new Set(evidence.map((record) => record.company))].sort(
    (left, right) => left.localeCompare(right, "zh-CN")
  );

  return companies.map((company) => {
    const records = evidence.filter((record) => record.company === company);
    const riskyRecords = records.filter(isRiskyEvidence);
    const linkedRiskyEvidence = riskyRecords.filter(
      (record) => (evidenceValidationMap[record.evidenceId] ?? []).length > 0
    ).length;
    return {
      company,
      strongEvidence: records.filter(
        (record) =>
          (record.evidenceGrade === "A" || record.evidenceGrade === "B") &&
          record.factStatus === "FACT"
      ).length,
      riskyEvidence: riskyRecords.length,
      linkedRiskyEvidence,
      unlinkedRiskyEvidence: riskyRecords.length - linkedRiskyEvidence
    };
  });
}

function buildPriorityActions({
  tasks,
  validationEvidenceMap,
  unlinkedRiskyEvidence
}: {
  tasks: ValidationTaskDefinition[];
  validationEvidenceMap: ReturnType<typeof buildValidationEvidenceMap>;
  unlinkedRiskyEvidence: EvidenceRecord[];
}): EvidenceActionItem[] {
  const taskActions = tasks
    .filter((task) => task.priority === "P0")
    .map((task) => ({
      task,
      evidenceCount: (validationEvidenceMap[task.validationId] ?? []).length
    }))
    .filter((item) => item.evidenceCount > 0)
    .sort(
      (left, right) =>
        right.evidenceCount - left.evidenceCount ||
        left.task.validationId.localeCompare(right.task.validationId)
    )
    .slice(0, 4)
    .map(({ task, evidenceCount }) => ({
      id: task.validationId,
      title: `${task.validationId} · ${task.topic}`,
      detail: `${evidenceCount} 条风险证据待内部核验；负责人 ${task.executionOwner}`,
      href: validationHref(task.validationId),
      priority: task.priority
    }));

  const unlinkedActions = unlinkedRiskyEvidence.slice(0, 2).map((record) => ({
    id: record.evidenceId,
    title: `未归档 · ${record.evidenceId}`,
    detail: `${record.company} / ${record.topic} 尚未匹配验证任务`,
    href: `/knowledge?view=evidence&risk=UNLINKED&q=${encodeURIComponent(record.evidenceId)}`,
    priority: "UNLINKED" as const
  }));

  return [...taskActions, ...unlinkedActions].slice(0, 6);
}
