import React from "react";
import type { EvidenceRecord, InternalEvidenceRecord, ValidationTaskDefinition, ValidationTaskState } from "@/lib/knowledge/types";
import { EvidenceRecordForm, ValidationStateForm } from "./knowledge-forms";
import { evidenceHref } from "@/lib/knowledge/traceability";

export function ValidationWorkspace({
  tasks,
  evidence,
  readOnly,
  priority,
  company,
  query,
  publicEvidenceByTask = {}
}: {
  tasks: Array<{ definition: ValidationTaskDefinition; state: ValidationTaskState; verifiedEvidenceCount: number; totalEvidenceCount: number }>;
  evidence: InternalEvidenceRecord[];
  readOnly: boolean;
  priority?: string;
  company?: string;
  query?: string;
  publicEvidenceByTask?: Record<string, EvidenceRecord[]>;
}) {
  const normalizedQuery = query?.trim().toLocaleLowerCase("zh-CN") ?? "";
  const visible = tasks.filter((task) => {
    const publicEvidence = publicEvidenceByTask[task.definition.validationId] ?? [];
    const body = [
      task.definition.validationId,
      task.definition.company,
      task.definition.topic,
      task.definition.question,
      task.definition.evidenceRequired,
      ...publicEvidence.map((record) => `${record.evidenceId} ${record.summary}`)
    ].join(" ").toLocaleLowerCase("zh-CN");
    return (
      (!priority || priority === "ALL" || task.definition.priority === priority) &&
      (!company || company === "ALL" || task.definition.company === company) &&
      (!normalizedQuery || body.includes(normalizedQuery))
    );
  });
  return (
    <div className="grid gap-4">
      <form className="panel flex flex-wrap gap-3 p-4"><input type="hidden" name="view" value="validation" /><label className="grid min-w-64 gap-1 text-xs text-[var(--muted)]">关键词<input name="q" defaultValue={query} className="rounded border border-[var(--line)] bg-black/20 px-3 py-2 text-sm" placeholder="任务、证据编号、主题..." /></label><Filter name="priority" label="优先级" value={priority} values={["ALL", "P0", "P1", "P2"]} /><Filter name="company" label="公司" value={company} values={["ALL", "Bürkert", "GEMÜ", "Fujikin", "ESG 精锐"]} /><button className="self-end rounded bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-black">筛选</button></form>
      <div className="grid gap-4">{visible.map((task) => {
        const records = evidence.filter((item) => item.validationId === task.definition.validationId);
        const publicEvidence = publicEvidenceByTask[task.definition.validationId] ?? [];
        return <details key={task.definition.validationId} className="panel overflow-hidden"><summary className="grid cursor-pointer grid-cols-[130px_1fr_180px_auto] gap-4 p-4 max-[850px]:grid-cols-1"><div><div className="metric-number text-[var(--accent)]">{task.definition.validationId}</div><div className="mt-1 text-xs">{task.definition.priority} · {task.definition.company}</div></div><div><div className="font-semibold">{task.definition.topic}</div><p className="mt-1 text-sm leading-6 text-[var(--muted)]">{task.definition.question}</p>{publicEvidence.length > 0 && <div className="mt-2 text-xs text-amber-300">{publicEvidence.length} 条公开证据需内部验证</div>}</div><div className="text-xs text-[var(--muted)]">负责人 {task.state.owner ?? task.definition.executionOwner}<br />目标 {task.state.targetDate ?? task.definition.targetWindow}</div><div className="text-right text-xs"><div className="text-[var(--accent-2)]">{task.state.status}</div><div className="mt-1">{task.verifiedEvidenceCount}/{task.definition.minimumVerifiedRecords} 已验证</div></div></summary><div className="grid grid-cols-2 gap-5 border-t border-[var(--line)] p-4 max-[900px]:grid-cols-1"><div><div className="mb-3 text-sm font-semibold">更新任务</div><ValidationClosureStatus verifiedEvidenceCount={task.verifiedEvidenceCount} minimumVerifiedRecords={task.definition.minimumVerifiedRecords} /><p className="mb-4 text-xs leading-5 text-[var(--muted)]">验收规则：{task.definition.acceptanceRule}</p><ValidationStateForm validationId={task.definition.validationId} state={task.state} disabled={readOnly} /></div><div><div className="mb-3 text-sm font-semibold">登记内部证据</div><EvidenceRecordForm validationId={task.definition.validationId} disabled={readOnly} /></div></div>{publicEvidence.length > 0 && <div className="border-t border-[var(--line)] px-4 py-3"><div className="mb-2 text-sm font-semibold">关联公开证据</div>{publicEvidence.slice(0, 12).map((record) => <a key={record.evidenceId} href={evidenceHref(record.evidenceId)} className="grid grid-cols-[150px_90px_1fr] gap-3 py-2 text-xs hover:text-[var(--accent-2)] max-[760px]:grid-cols-1"><span className="text-[var(--accent-2)]">{record.evidenceId}</span><span>{record.evidenceGrade} · {record.factStatus}</span><span className="text-[var(--muted)]">{record.summary}</span></a>)}</div>}{records.length > 0 && <div className="border-t border-[var(--line)] px-4 py-3"><div className="mb-2 text-sm font-semibold">已登记内部证据</div>{records.map((record) => <div key={record.id} className="grid grid-cols-[130px_1fr_auto] gap-3 py-2 text-xs"><span>{record.receivedDate}</span><span>{record.factSummary}</span><span className="text-[var(--accent-2)]">{record.verificationStatus}</span></div>)}</div>}</details>;
      })}</div>
    </div>
  );
}

function ValidationClosureStatus({
  verifiedEvidenceCount,
  minimumVerifiedRecords
}: {
  verifiedEvidenceCount: number;
  minimumVerifiedRecords: number;
}) {
  const remaining = Math.max(minimumVerifiedRecords - verifiedEvidenceCount, 0);
  return (
    <div className="mb-4 rounded border border-[var(--line)] p-3 text-xs leading-5">
      <div className="mb-1 font-semibold text-[var(--accent-2)]">关闭条件</div>
      <p className="text-[var(--muted)]">
        需要 {minimumVerifiedRecords} 条 VERIFIED 内部证据，目前 {verifiedEvidenceCount}/{minimumVerifiedRecords}。
      </p>
      <p className={remaining === 0 ? "text-emerald-200" : "text-amber-300"}>
        {remaining === 0
          ? "已满足证据数量，可更新为 VERIFIED。"
          : `还缺 ${remaining} 条 VERIFIED 内部证据。`}
      </p>
    </div>
  );
}
function Filter({ name, label, value, values }: { name: string; label: string; value?: string; values: string[] }) { return <label className="grid gap-1 text-xs text-[var(--muted)]">{label}<select name={name} defaultValue={value ?? "ALL"} className="rounded border border-[var(--line)] bg-[var(--panel)] px-3 py-2 text-sm">{values.map((item) => <option key={item}>{item}</option>)}</select></label>; }
