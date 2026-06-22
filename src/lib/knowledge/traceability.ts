import type { KnowledgeCatalog } from "./types";

export interface EvidenceTraceLink {
  kind: "PRODUCT" | "SCENARIO";
  company?: string;
  label: string;
  href: string;
}

export type EvidenceTraceMap = Record<string, EvidenceTraceLink[]>;

export function evidenceHref(evidenceId: string): string {
  return `/knowledge?view=evidence&q=${encodeURIComponent(evidenceId)}`;
}

export function buildEvidenceTraceMap(catalog: KnowledgeCatalog): EvidenceTraceMap {
  const linksByEvidenceId: Map<string, EvidenceTraceLink[]> = new Map();

  for (const product of catalog.products) {
    const evidenceIds = product.learningCard?.evidenceIds ?? [];
    for (const evidenceId of evidenceIds) {
      addTraceLink(linksByEvidenceId, evidenceId, {
        kind: "PRODUCT",
        company: product.company,
        label: `${product.company} ${product.productId}`,
        href: `/knowledge?view=products&type=PRODUCT&company=${encodeURIComponent(product.company)}&q=${encodeURIComponent(product.productId)}`
      });
    }
  }

  for (const scenario of catalog.scenarios) {
    for (const evidenceId of scenario.evidenceIds) {
      addTraceLink(linksByEvidenceId, evidenceId, {
        kind: "SCENARIO",
        label: scenario.scenarioId,
        href: `/knowledge?view=products&type=SCENARIO&q=${encodeURIComponent(scenario.scenarioId)}`
      });
    }
  }

  return Object.fromEntries(
    [...linksByEvidenceId.entries()].map(([evidenceId, links]) => [
      evidenceId,
      links.sort(compareTraceLinks)
    ])
  );
}

function addTraceLink(
  linksByEvidenceId: Map<string, EvidenceTraceLink[]>,
  evidenceId: string,
  link: EvidenceTraceLink
) {
  const current = linksByEvidenceId.get(evidenceId) ?? [];
  if (!current.some((item) => item.kind === link.kind && item.href === link.href)) {
    current.push(link);
  }
  linksByEvidenceId.set(evidenceId, current);
}

function compareTraceLinks(left: EvidenceTraceLink, right: EvidenceTraceLink): number {
  return (
    left.kind.localeCompare(right.kind) ||
    (left.company ?? "").localeCompare(right.company ?? "", "zh-CN") ||
    left.label.localeCompare(right.label, "zh-CN")
  );
}
