import type { InternalEvidenceRecord, ValidationTaskDefinition, ValidationTaskState } from "@/lib/knowledge/types";
import { EvidenceRecordForm, ValidationStateForm } from "./knowledge-forms";

export function ValidationWorkspace({
  tasks,
  evidence,
  readOnly,
  priority,
  company
}: {
  tasks: Array<{ definition: ValidationTaskDefinition; state: ValidationTaskState; verifiedEvidenceCount: number; totalEvidenceCount: number }>;
  evidence: InternalEvidenceRecord[];
  readOnly: boolean;
  priority?: string;
  company?: string;
}) {
  const visible = tasks.filter((task) => (!priority || priority === "ALL" || task.definition.priority === priority) && (!company || company === "ALL" || task.definition.company === company));
  return (
    <div className="grid gap-4">
      <form className="panel flex flex-wrap gap-3 p-4"><input type="hidden" name="view" value="validation" /><Filter name="priority" label="优先级" value={priority} values={["ALL", "P0", "P1", "P2"]} /><Filter name="company" label="公司" value={company} values={["ALL", "All", "Bürkert", "GEMÜ", "Fujikin", "ESG"]} /><button className="self-end rounded bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-black">筛选</button></form>
      <div className="grid gap-4">{visible.map((task) => {
        const records = evidence.filter((item) => item.validationId === task.definition.validationId);
        return <details key={task.definition.validationId} className="panel overflow-hidden"><summary className="grid cursor-pointer grid-cols-[130px_1fr_180px_auto] gap-4 p-4 max-[850px]:grid-cols-1"><div><div className="metric-number text-[var(--accent)]">{task.definition.validationId}</div><div className="mt-1 text-xs">{task.definition.priority} · {task.definition.company}</div></div><div><div className="font-semibold">{task.definition.topic}</div><p className="mt-1 text-sm leading-6 text-[var(--muted)]">{task.definition.question}</p></div><div className="text-xs text-[var(--muted)]">负责人 {task.state.owner ?? task.definition.executionOwner}<br />目标 {task.state.targetDate ?? task.definition.targetWindow}</div><div className="text-right text-xs"><div className="text-[var(--accent-2)]">{task.state.status}</div><div className="mt-1">{task.verifiedEvidenceCount}/{task.definition.minimumVerifiedRecords} 已验证</div></div></summary><div className="grid grid-cols-2 gap-5 border-t border-[var(--line)] p-4 max-[900px]:grid-cols-1"><div><div className="mb-3 text-sm font-semibold">更新任务</div><p className="mb-4 text-xs leading-5 text-[var(--muted)]">验收规则：{task.definition.acceptanceRule}</p><ValidationStateForm validationId={task.definition.validationId} state={task.state} disabled={readOnly} /></div><div><div className="mb-3 text-sm font-semibold">登记内部证据</div><EvidenceRecordForm validationId={task.definition.validationId} disabled={readOnly} /></div></div>{records.length > 0 && <div className="border-t border-[var(--line)] px-4 py-3">{records.map((record) => <div key={record.id} className="grid grid-cols-[130px_1fr_auto] gap-3 py-2 text-xs"><span>{record.receivedDate}</span><span>{record.factSummary}</span><span className="text-[var(--accent-2)]">{record.verificationStatus}</span></div>)}</div>}</details>;
      })}</div>
    </div>
  );
}
function Filter({ name, label, value, values }: { name: string; label: string; value?: string; values: string[] }) { return <label className="grid gap-1 text-xs text-[var(--muted)]">{label}<select name={name} defaultValue={value ?? "ALL"} className="rounded border border-[var(--line)] bg-[var(--panel)] px-3 py-2 text-sm">{values.map((item) => <option key={item}>{item}</option>)}</select></label>; }
