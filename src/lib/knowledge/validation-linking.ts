import type { EvidenceRecord, ValidationTaskDefinition } from "./types";

export interface EvidenceValidationLink {
  validationId: string;
  priority: ValidationTaskDefinition["priority"];
  topic: string;
  owner: string;
  href: string;
}

export type EvidenceValidationMap = Record<string, EvidenceValidationLink[]>;
export type ValidationEvidenceMap = Record<string, EvidenceRecord[]>;

export function isRiskyEvidence(record: EvidenceRecord): boolean {
  return (
    record.factStatus === "CLAIM" ||
    record.factStatus === "GAP" ||
    record.factStatus === "INTERNAL_VALIDATION" ||
    record.evidenceGrade === "C" ||
    record.evidenceGrade === "D"
  );
}

export function validationHref(validationId: string): string {
  return `/knowledge?view=validation&q=${encodeURIComponent(validationId)}`;
}

export function buildEvidenceValidationMap(
  evidence: EvidenceRecord[],
  tasks: ValidationTaskDefinition[]
): EvidenceValidationMap {
  const tasksById = new Map(tasks.map((task) => [task.validationId, task]));
  const result: EvidenceValidationMap = {};

  for (const record of evidence) {
    const linkedIds = inferValidationIds(record);
    const links = linkedIds
      .map((validationId) => tasksById.get(validationId))
      .filter((task): task is ValidationTaskDefinition => Boolean(task))
      .map((task) => ({
        validationId: task.validationId,
        priority: task.priority,
        topic: task.topic,
        owner: task.executionOwner,
        href: validationHref(task.validationId)
      }));

    if (links.length > 0) {
      result[record.evidenceId] = links;
    }
  }

  return result;
}

export function buildValidationEvidenceMap(
  evidence: EvidenceRecord[],
  tasks: ValidationTaskDefinition[]
): ValidationEvidenceMap {
  const evidenceValidationMap = buildEvidenceValidationMap(evidence, tasks);
  const result: Map<string, EvidenceRecord[]> = new Map();

  for (const record of evidence) {
    for (const link of evidenceValidationMap[record.evidenceId] ?? []) {
      const current = result.get(link.validationId) ?? [];
      current.push(record);
      result.set(link.validationId, current);
    }
  }

  return Object.fromEntries(
    [...result.entries()].map(([validationId, records]) => [
      validationId,
      records.sort(compareEvidence)
    ])
  );
}

export function inferValidationIds(record: EvidenceRecord): string[] {
  if (!isRiskyEvidence(record)) return [];

  const text = normalize(
    [
      record.evidenceId,
      record.company,
      record.topic,
      record.productCategory,
      record.summary,
      record.supportsConclusion,
      record.notes
    ].join(" ")
  );
  const ids = new Set<string>();

  if (textIncludesAny(text, ["price", "pricing", "净价", "报价", "价格"])) {
    ids.add(record.company === "GEMÜ" ? "VAL-GEMU-002" : record.company === "ESG 精锐" ? "VAL-ESG-003" : "VAL-CROSS-001");
  }
  if (textIncludesAny(text, ["lead time", "交期", "delivery", "到货"])) {
    ids.add(record.company === "ESG 精锐" ? "VAL-ESG-003" : "VAL-CROSS-002");
  }
  if (textIncludesAny(text, ["service", "售后", "备件", "response"])) {
    ids.add("VAL-CROSS-003");
  }

  if (record.company === "Bürkert") {
    if (textIncludesAny(text, ["china", "中国", "库存", "产地", "供应"])) ids.add("VAL-BURKERT-001");
    if (textIncludesAny(text, ["installed", "客户", "案例", "复购"])) ids.add("VAL-BURKERT-002");
  }

  if (record.company === "GEMÜ") {
    if (textIncludesAny(text, ["p600", "p500", "multi-port", "阀块", "multiport"])) ids.add("VAL-GEMU-001");
    if (textIncludesAny(text, ["sumondo", "single-use", "一次性"])) ids.add("VAL-GEMU-003");
  }

  if (record.company === "Fujikin") {
    if (textIncludesAny(text, ["mfc", "mfm", "fcs", "fcst", "质量流量", "配气", "发酵"])) ids.add("VAL-FUJIKIN-001");
    if (textIncludesAny(text, ["常熟", "china", "中国", "manufacturing", "产地", "制造"])) ids.add("VAL-FUJIKIN-002");
    if (textIncludesAny(text, ["bnw", "fda", "usp", "asme", "bpe", "材料", "documentation", "certificate", "证书"])) ids.add("VAL-FUJIKIN-003");
  }

  if (record.company === "ESG 精锐") {
    if (textIncludesAny(text, ["fda", "usp", "ec 1935", "certificate", "cert", "认证", "证书", "a00", "a01", "a31"])) ids.add("VAL-ESG-001");
    if (textIncludesAny(text, ["ra", "材质", "膜片", "批次", "泄漏", "压力测试", "quality"])) ids.add("VAL-ESG-002");
    if (textIncludesAny(text, ["t-valve", "103", "complex", "多通", "阀块", "罐底", "死区"])) ids.add("VAL-ESG-004");
    if (textIncludesAny(text, ["0p1", "positioner", "定位器", "自动化", "automation", "现场总线"])) ids.add("VAL-ESG-005");
  }

  if (record.company === "四家公司") {
    if (textIncludesAny(text, ["价格", "price"])) ids.add("VAL-CROSS-001");
    if (textIncludesAny(text, ["交期", "delivery", "lead"])) ids.add("VAL-CROSS-002");
  }

  return [...ids].sort();
}

function normalize(value: string): string {
  return value.toLocaleLowerCase("zh-CN");
}

function textIncludesAny(text: string, needles: string[]): boolean {
  return needles.some((needle) => text.includes(normalize(needle)));
}

function compareEvidence(left: EvidenceRecord, right: EvidenceRecord): number {
  return (
    left.evidenceGrade.localeCompare(right.evidenceGrade) ||
    left.evidenceId.localeCompare(right.evidenceId)
  );
}
