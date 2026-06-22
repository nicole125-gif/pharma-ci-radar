import React from "react";
import Link from "next/link";
import { BookOpenCheck, ExternalLink, Search } from "lucide-react";
import type { KnowledgeSearchFilters, KnowledgeSearchResult } from "@/lib/knowledge/search";
import type { ProductLearningCard } from "@/lib/knowledge/types";
import { evidenceHref } from "@/lib/knowledge/traceability";

export function ProductSearch({
  filters,
  results,
  categories
}: {
  filters: KnowledgeSearchFilters;
  results: KnowledgeSearchResult[];
  categories: string[];
}) {
  return (
    <div className="grid gap-4">
      <form className="panel grid grid-cols-[2fr_repeat(3,minmax(130px,1fr))_auto] gap-3 p-4 max-[1000px]:grid-cols-2 max-[620px]:grid-cols-1">
        <input type="hidden" name="view" value="products" />
        <label className="grid gap-1 text-xs text-[var(--muted)]">关键词<div className="relative"><Search className="absolute left-3 top-2.5" size={16} /><input name="q" defaultValue={filters.query} className="w-full rounded border border-[var(--line)] bg-black/20 py-2 pl-9 pr-3 text-sm" placeholder="Type、系列、WFI、CIP..." /></div></label>
        <Select name="company" label="公司" value={filters.company} options={["ALL", "Bürkert", "GEMÜ", "Fujikin", "ESG 精锐"]} />
        <Select name="relevance" label="制药相关性" value={filters.pharmaRelevance} options={["ALL", "HIGH", "MEDIUM", "LOW", "UNKNOWN"]} />
        <Select name="category" label="类别" value={filters.category} options={["", ...categories]} />
        <button className="self-end rounded bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-black">检索</button>
      </form>
      <div className="flex gap-2 overflow-x-auto">
        {[["ALL", "全部"], ["PRODUCT", "产品"], ["SCENARIO", "场景"]].map(([value, label]) => (
          <Link key={value} href={`/knowledge?view=products&type=${value}`} className={`shrink-0 rounded border px-3 py-1.5 text-xs ${filters.recordType === value || (!filters.recordType && value === "ALL") ? "border-[var(--accent)] text-[var(--accent)]" : "border-[var(--line)] text-[var(--muted)]"}`}>{label}</Link>
        ))}
      </div>
      <div className="text-sm text-[var(--muted)]">找到 {results.length} 条记录</div>
      <div className="panel divide-y divide-[var(--line)] overflow-hidden">
        {results.map((result) => result.recordType === "PRODUCT" ? (
          <article key={`${result.company}-${result.productId}`} className="p-4">
            <div className="grid grid-cols-[170px_1fr_190px] gap-4 max-[850px]:grid-cols-1">
              <div><div className="metric-number text-[var(--accent)]">{result.productId}</div><div className="mt-1 text-xs text-[var(--muted)]">{result.company}</div></div>
              <div><h2 className="font-semibold">{result.name}</h2>{result.secondaryName && <p className="mt-1 text-sm">{result.secondaryName}</p>}<p className="mt-2 text-xs leading-5 text-[var(--muted)]">{result.category} / {result.subcategory} · {result.productRole}</p><p className="mt-2 text-xs leading-5 text-[var(--muted)]">{result.boundary}</p></div>
              <div className="text-xs text-[var(--muted)]"><div>{result.pharmaRelevance} · 证据 {result.evidenceGrade}</div><div className="mt-2">{result.chinaOrEvidenceStatus || "中国可见性未确认"}</div>{result.sourceUrl && <a href={result.sourceUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 text-[var(--accent-2)]">官方来源<ExternalLink size={13} /></a>}</div>
            </div>
            {result.learningCard?.evidenceIds.length ? <EvidenceLinks evidenceIds={result.learningCard.evidenceIds} /> : null}
            {result.learningCard && <LearningCard card={result.learningCard} />}
          </article>
        ) : (
          <article key={result.scenarioId} className="p-4">
            <div className="flex flex-wrap items-center gap-3"><span className="metric-number text-[var(--accent)]">{result.scenarioId}</span><h2 className="font-semibold">{result.customerTask}</h2><span className="text-xs text-[var(--muted)]">{result.processStage}</span></div>
            <div className="mt-4 grid grid-cols-4 gap-3 text-xs max-[900px]:grid-cols-2 max-[540px]:grid-cols-1">{Object.entries(result.candidates).map(([company, candidates]) => <div key={company}><div className="font-semibold text-[var(--accent-2)]">{company}</div><div className="mt-1 leading-5 text-[var(--muted)]">{candidates || "无明确候选"}</div></div>)}</div>
            <p className="mt-4 text-sm leading-6"><span className="text-[var(--muted)]">必问工况：</span>{result.mustAskConditions}</p>
            <p className="mt-2 text-sm leading-6"><span className="text-[var(--muted)]">Bürkert 边界：</span>{result.burkertCaution}</p>
            <p className="mt-2 text-sm leading-6"><span className="text-[var(--muted)]">内部验证：</span>{result.internalValidation}</p>
            {result.evidenceIds.length ? <EvidenceLinks evidenceIds={result.evidenceIds} /> : null}
          </article>
        ))}
      </div>
    </div>
  );
}

function EvidenceLinks({ evidenceIds }: { evidenceIds: string[] }) {
  const visible = evidenceIds.slice(0, 12);
  const remaining = evidenceIds.length - visible.length;
  return (
    <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[var(--line)] pt-3 text-xs">
      <span className="font-semibold text-[var(--muted)]">证据追溯</span>
      {visible.map((evidenceId) => (
        <Link
          key={evidenceId}
          href={evidenceHref(evidenceId)}
          className="rounded border border-[var(--line)] px-2 py-1 text-[var(--accent-2)] hover:border-[var(--accent-2)]"
        >
          {evidenceId}
        </Link>
      ))}
      {remaining > 0 && <span className="text-[var(--muted)]">另 {remaining} 条</span>}
    </div>
  );
}

function LearningCard({ card }: { card: ProductLearningCard }) {
  return (
    <details className="mt-4 border-t border-[var(--line)] pt-3">
      <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-semibold text-[var(--accent-2)]">
        <BookOpenCheck size={16} />
        深度学习卡
        <span className="ml-auto text-xs font-normal text-[var(--muted)]">{card.sourceAccessedDate} · 规则复核</span>
      </summary>
      <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4 text-sm max-[760px]:grid-cols-1">
        <CardField label="客户任务" value={card.customerJobs} />
        <CardField label="工作原理" value={card.operatingPrinciple} />
        <CardField label="公开规格" value={card.keySpecifications} />
        <CardField label="选型必问" value={card.selectionQuestions} />
        <CardField label="排除条件" value={card.exclusionConditions} />
        <CardField label="竞品重叠" value={card.competitorOverlap} />
        <CardField label="比较维度" value={card.comparisonDimensions} />
        <CardField label="相邻产品" value={card.adjacentOrRelatedProducts} />
        <CardField label="事实边界" value={card.factBoundary} />
        <CardField label="待内部验证" value={card.knowledgeGaps} />
        <CardField label="快速记忆" value={card.memoryHook} />
        <CardField label="自测题" value={card.quizQuestion} />
      </div>
      {card.sourceUrls.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-3 border-t border-[var(--line)] pt-3 text-xs">
          {card.sourceUrls.map((url, index) => (
            <a key={url} href={url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[var(--accent-2)]">
              来源 {index + 1}<ExternalLink size={12} />
            </a>
          ))}
        </div>
      )}
    </details>
  );
}

function CardField({ label, value }: { label: string; value: string }) {
  return <div><div className="text-xs font-semibold text-[var(--muted)]">{label}</div><p className="mt-1 leading-6">{value}</p></div>;
}

function Select({ name, label, value, options }: { name: string; label: string; value?: string; options: string[] }) {
  return <label className="grid gap-1 text-xs text-[var(--muted)]">{label}<select name={name} defaultValue={value ?? ""} className="rounded border border-[var(--line)] bg-[var(--panel)] px-3 py-2 text-sm">{options.map((option) => <option key={option} value={option}>{option || "全部"}</option>)}</select></label>;
}
