import { ExternalLink, Search } from "lucide-react";
import type { EvidenceGrade, EvidenceRecord, FactStatus } from "@/lib/knowledge/types";

export interface EvidenceQaFilters {
  query?: string;
  company?: string;
  grade?: EvidenceGrade | "ALL";
  status?: FactStatus | "ALL";
}

export function EvidenceQa({
  evidence,
  filters
}: {
  evidence: EvidenceRecord[];
  filters: EvidenceQaFilters;
}) {
  const companies = Array.from(new Set(evidence.map((item) => item.company))).sort((a, b) =>
    a.localeCompare(b, "zh-CN")
  );
  const visible = filterEvidence(evidence, filters).slice(0, 200);
  const strong = evidence.filter((item) => item.evidenceGrade === "A" || item.evidenceGrade === "B").length;
  const weak = evidence.filter((item) => item.evidenceGrade === "C" || item.evidenceGrade === "D").length;
  const needsValidation = evidence.filter(
    (item) => item.factStatus === "GAP" || item.factStatus === "INTERNAL_VALIDATION"
  ).length;
  const claims = evidence.filter((item) => item.factStatus === "CLAIM").length;

  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-4 gap-3 max-[900px]:grid-cols-2 max-[560px]:grid-cols-1">
        <Metric label="证据总量" value={evidence.length} />
        <Metric label="A/B 可引用" value={strong} tone="strong" />
        <Metric label="C/D 慎用" value={weak} tone="caution" />
        <Metric label="待验证/宣传" value={needsValidation + claims} tone="warning" />
      </div>

      <form className="panel grid grid-cols-[2fr_repeat(3,minmax(130px,1fr))_auto] gap-3 p-4 max-[1000px]:grid-cols-2 max-[620px]:grid-cols-1">
        <input type="hidden" name="view" value="evidence" />
        <label className="grid gap-1 text-xs text-[var(--muted)]">
          关键词
          <div className="relative">
            <Search className="absolute left-3 top-2.5" size={16} />
            <input
              name="q"
              defaultValue={filters.query}
              className="w-full rounded border border-[var(--line)] bg-black/20 py-2 pl-9 pr-3 text-sm"
              placeholder="证据编号、主题、结论..."
            />
          </div>
        </label>
        <Select name="company" label="公司" value={filters.company} options={["ALL", ...companies]} />
        <Select name="grade" label="证据等级" value={filters.grade} options={["ALL", "A", "B", "C", "D", "UNKNOWN"]} />
        <Select
          name="status"
          label="事实状态"
          value={filters.status}
          options={["ALL", "FACT", "INFERENCE", "CLAIM", "GAP", "INTERNAL_VALIDATION", "UNKNOWN"]}
        />
        <button className="self-end rounded bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-black">
          筛选
        </button>
      </form>

      <div className="text-sm text-[var(--muted)]">
        显示 {visible.length} / {evidence.length} 条公开证据
      </div>

      <div className="panel divide-y divide-[var(--line)] overflow-hidden">
        {visible.map((record) => (
          <article key={`${record.sourceFile}-${record.evidenceId}`} className="grid grid-cols-[170px_130px_1fr_190px] gap-4 p-4 max-[980px]:grid-cols-1">
            <div>
              <div className="metric-number text-[var(--accent)]">{record.evidenceId}</div>
              <div className="mt-1 text-xs text-[var(--muted)]">{record.company}</div>
            </div>
            <div className="flex flex-wrap items-start gap-2 text-xs">
              <Badge label={record.evidenceGrade} tone={gradeTone(record.evidenceGrade)} />
              <Badge label={record.factStatus} tone={statusTone(record.factStatus)} />
            </div>
            <div>
              <h2 className="font-semibold">{record.topic}</h2>
              {record.productCategory && (
                <div className="mt-1 text-xs text-[var(--muted)]">{record.productCategory}</div>
              )}
              <p className="mt-2 text-sm leading-6">{record.summary}</p>
              {record.supportsConclusion && (
                <p className="mt-2 text-xs leading-5 text-[var(--muted)]">支持结论：{record.supportsConclusion}</p>
              )}
              {record.notes && <p className="mt-1 text-xs leading-5 text-[var(--muted)]">边界：{record.notes}</p>}
            </div>
            <div className="text-xs leading-5 text-[var(--muted)]">
              <div>{record.sourceType || "来源类型未标注"}</div>
              <div className="mt-1">{record.sourceTitle || record.sourceFile}</div>
              {record.accessedDate && <div className="mt-1">访问：{record.accessedDate}</div>}
              {record.sourceUrl && (
                <a
                  href={record.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex items-center gap-1 text-[var(--accent-2)]"
                >
                  打开来源
                  <ExternalLink size={13} />
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function filterEvidence(evidence: EvidenceRecord[], filters: EvidenceQaFilters): EvidenceRecord[] {
  const query = filters.query?.trim().toLocaleLowerCase("zh-CN") ?? "";
  return evidence.filter((record) => {
    const body = [
      record.evidenceId,
      record.company,
      record.topic,
      record.productCategory,
      record.summary,
      record.sourceTitle,
      record.supportsConclusion,
      record.notes
    ]
      .filter(Boolean)
      .join(" ")
      .toLocaleLowerCase("zh-CN");

    return (
      (!query || body.includes(query)) &&
      (!filters.company || filters.company === "ALL" || record.company === filters.company) &&
      (!filters.grade || filters.grade === "ALL" || record.evidenceGrade === filters.grade) &&
      (!filters.status || filters.status === "ALL" || record.factStatus === filters.status)
    );
  });
}

function Metric({
  label,
  value,
  tone = "default"
}: {
  label: string;
  value: number;
  tone?: "default" | "strong" | "caution" | "warning";
}) {
  const toneClass =
    tone === "strong"
      ? "text-[var(--accent-2)]"
      : tone === "caution"
        ? "text-amber-300"
        : tone === "warning"
          ? "text-rose-300"
          : "text-[var(--accent)]";
  return (
    <div className="panel p-4">
      <div className={`metric-number ${toneClass}`}>{value}</div>
      <div className="mt-1 text-xs text-[var(--muted)]">{label}</div>
    </div>
  );
}

function Badge({ label, tone }: { label: string; tone: "strong" | "caution" | "warning" | "neutral" }) {
  const className =
    tone === "strong"
      ? "border-[var(--accent-2)] text-[var(--accent-2)]"
      : tone === "caution"
        ? "border-amber-300/70 text-amber-300"
        : tone === "warning"
          ? "border-rose-300/70 text-rose-300"
          : "border-[var(--line)] text-[var(--muted)]";
  return <span className={`rounded border px-2 py-1 ${className}`}>{label}</span>;
}

function gradeTone(grade: EvidenceGrade): "strong" | "caution" | "warning" | "neutral" {
  if (grade === "A" || grade === "B") return "strong";
  if (grade === "C") return "caution";
  if (grade === "D") return "warning";
  return "neutral";
}

function statusTone(status: FactStatus): "strong" | "caution" | "warning" | "neutral" {
  if (status === "FACT") return "strong";
  if (status === "INFERENCE") return "caution";
  if (status === "CLAIM" || status === "GAP" || status === "INTERNAL_VALIDATION") return "warning";
  return "neutral";
}

function Select({
  name,
  label,
  value,
  options
}: {
  name: string;
  label: string;
  value?: string;
  options: string[];
}) {
  return (
    <label className="grid gap-1 text-xs text-[var(--muted)]">
      {label}
      <select
        name={name}
        defaultValue={value ?? "ALL"}
        className="rounded border border-[var(--line)] bg-[var(--panel)] px-3 py-2 text-sm"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option === "ALL" ? "全部" : option}
          </option>
        ))}
      </select>
    </label>
  );
}
