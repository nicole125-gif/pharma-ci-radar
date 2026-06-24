import React from "react";
import type {
  EvidenceRecord,
  InternalEvidenceRecord,
  ValidationTaskDefinition,
  ValidationTaskState
} from "@/lib/knowledge/types";
import { EvidenceRecordForm, ValidationStateForm } from "./knowledge-forms";
import { evidenceHref } from "@/lib/knowledge/traceability";

type ValidationTaskView = {
  definition: ValidationTaskDefinition;
  state: ValidationTaskState;
  verifiedEvidenceCount: number;
  totalEvidenceCount: number;
};

type QueueStatus =
  | "READY_TO_CLOSE"
  | "MISSING_EVIDENCE"
  | "NO_INTERNAL_EVIDENCE"
  | "CLOSED";

export function ValidationWorkspace({
  tasks,
  evidence,
  readOnly,
  priority,
  company,
  query,
  queue,
  publicEvidenceByTask = {}
}: {
  tasks: ValidationTaskView[];
  evidence: InternalEvidenceRecord[];
  readOnly: boolean;
  priority?: string;
  company?: string;
  query?: string;
  queue?: string;
  publicEvidenceByTask?: Record<string, EvidenceRecord[]>;
}) {
  const normalizedQuery = query?.trim().toLocaleLowerCase("zh-CN") ?? "";
  const visible = tasks
    .filter((task) => {
      const publicEvidence =
        publicEvidenceByTask[task.definition.validationId] ?? [];
      const body = [
        task.definition.validationId,
        task.definition.company,
        task.definition.topic,
        task.definition.question,
        task.definition.evidenceRequired,
        ...publicEvidence.map((record) => `${record.evidenceId} ${record.summary}`)
      ]
        .join(" ")
        .toLocaleLowerCase("zh-CN");
      const status = getQueueStatus(task);
      return (
        (!priority ||
          priority === "ALL" ||
          task.definition.priority === priority) &&
        (!company || company === "ALL" || task.definition.company === company) &&
        (!queue || queue === "ALL" || matchesQueueFilter(status, task, queue)) &&
        (!normalizedQuery || body.includes(normalizedQuery))
      );
    })
    .sort(compareValidationTasks);
  const summary = buildQueueSummary(visible);

  return (
    <div className="grid gap-4">
      <form className="panel flex flex-wrap gap-3 p-4">
        <input type="hidden" name="view" value="validation" />
        <label className="grid min-w-64 gap-1 text-xs text-[var(--muted)]">
          关键词
          <input
            name="q"
            defaultValue={query}
            className="rounded border border-[var(--line)] bg-black/20 px-3 py-2 text-sm"
            placeholder="任务、证据编号、主题..."
          />
        </label>
        <Filter
          name="priority"
          label="优先级"
          value={priority}
          values={["ALL", "P0", "P1", "P2"]}
        />
        <Filter
          name="company"
          label="公司"
          value={company}
          values={["ALL", "Bürkert", "GEMÜ", "Fujikin", "ESG 精锐"]}
        />
        <Filter
          name="queue"
          label="队列"
          value={queue}
          values={["ALL", "P0_OPEN", "READY", "INSUFFICIENT"]}
        />
        <button className="self-end rounded bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-black">
          筛选
        </button>
      </form>
      <ValidationPriorityQueue summary={summary} />
      <div className="grid gap-4">
        {visible.map((task) => {
          const records = evidence.filter(
            (item) => item.validationId === task.definition.validationId
          );
          const publicEvidence =
            publicEvidenceByTask[task.definition.validationId] ?? [];
          const queueStatus = getQueueStatus(task);
          return (
            <details key={task.definition.validationId} className="panel overflow-hidden">
              <summary className="grid cursor-pointer grid-cols-[130px_1fr_180px_auto] gap-4 p-4 max-[850px]:grid-cols-1">
                <div>
                  <div className="metric-number text-[var(--accent)]">
                    {task.definition.validationId}
                  </div>
                  <div className="mt-1 text-xs">
                    {task.definition.priority} · {task.definition.company}
                  </div>
                </div>
                <div>
                  <div className="font-semibold">{task.definition.topic}</div>
                  <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
                    {task.definition.question}
                  </p>
                  <div className="mt-2 text-xs text-[var(--accent-2)]">
                    {queueStatusLabel(queueStatus, task)}
                  </div>
                  {publicEvidence.length > 0 && (
                    <div className="mt-2 text-xs text-amber-300">
                      {publicEvidence.length} 条公开证据需内部验证
                    </div>
                  )}
                </div>
                <div className="text-xs text-[var(--muted)]">
                  负责人 {task.state.owner ?? task.definition.executionOwner}
                  <br />
                  目标 {task.state.targetDate ?? task.definition.targetWindow}
                </div>
                <div className="text-right text-xs">
                  <div className="text-[var(--accent-2)]">{task.state.status}</div>
                  <div className="mt-1">
                    {task.verifiedEvidenceCount}/{task.definition.minimumVerifiedRecords} 已验证
                  </div>
                </div>
              </summary>
              <div className="grid grid-cols-2 gap-5 border-t border-[var(--line)] p-4 max-[900px]:grid-cols-1">
                <div>
                  <div className="mb-3 text-sm font-semibold">更新任务</div>
                  <ValidationClosureStatus
                    verifiedEvidenceCount={task.verifiedEvidenceCount}
                    minimumVerifiedRecords={task.definition.minimumVerifiedRecords}
                  />
                  <p className="mb-4 text-xs leading-5 text-[var(--muted)]">
                    验收规则：{task.definition.acceptanceRule}
                  </p>
                  <ValidationStateForm
                    validationId={task.definition.validationId}
                    state={task.state}
                    disabled={readOnly}
                  />
                </div>
                <div>
                  <div className="mb-3 text-sm font-semibold">登记内部证据</div>
                  <EvidenceRecordForm
                    validationId={task.definition.validationId}
                    disabled={readOnly}
                  />
                </div>
              </div>
              {publicEvidence.length > 0 && (
                <div className="border-t border-[var(--line)] px-4 py-3">
                  <div className="mb-2 text-sm font-semibold">关联公开证据</div>
                  {publicEvidence.slice(0, 12).map((record) => (
                    <a
                      key={record.evidenceId}
                      href={evidenceHref(record.evidenceId)}
                      className="grid grid-cols-[150px_90px_1fr] gap-3 py-2 text-xs hover:text-[var(--accent-2)] max-[760px]:grid-cols-1"
                    >
                      <span className="text-[var(--accent-2)]">
                        {record.evidenceId}
                      </span>
                      <span>
                        {record.evidenceGrade} · {record.factStatus}
                      </span>
                      <span className="text-[var(--muted)]">
                        {record.summary}
                      </span>
                    </a>
                  ))}
                </div>
              )}
              {records.length > 0 && (
                <div className="border-t border-[var(--line)] px-4 py-3">
                  <div className="mb-2 text-sm font-semibold">已登记内部证据</div>
                  {records.map((record) => (
                    <div
                      key={record.id}
                      className="grid grid-cols-[130px_1fr_auto] gap-3 py-2 text-xs"
                    >
                      <span>{record.receivedDate}</span>
                      <span>{record.factSummary}</span>
                      <span className="text-[var(--accent-2)]">
                        {record.verificationStatus}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </details>
          );
        })}
      </div>
    </div>
  );
}

function ValidationPriorityQueue({
  summary
}: {
  summary: {
    p0Open: number;
    ready: number;
    insufficient: number;
  };
}) {
  return (
    <section className="panel p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-[var(--accent)]">
            待验证优先队列
          </div>
          <p className="mt-1 text-xs leading-5 text-[var(--muted)]">
            默认优先处理 P0 未关闭、接近可关闭和证据不足的任务。
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <QueueLink href="/knowledge?view=validation&queue=P0_OPEN">
            只看 P0
          </QueueLink>
          <QueueLink href="/knowledge?view=validation&queue=READY">
            只看可关闭
          </QueueLink>
          <QueueLink href="/knowledge?view=validation&queue=INSUFFICIENT">
            只看证据不足
          </QueueLink>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 max-[760px]:grid-cols-1">
        <QueueMetric label="P0 未关闭" value={summary.p0Open} />
        <QueueMetric label="可关闭" value={summary.ready} />
        <QueueMetric label="证据不足" value={summary.insufficient} />
      </div>
    </section>
  );
}

function QueueMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded border border-[var(--line)] p-3">
      <div className="text-xs text-[var(--muted)]">{label}</div>
      <div className="metric-number mt-1 text-[var(--accent-2)]">{value}</div>
    </div>
  );
}

function QueueLink({
  href,
  children
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="rounded border border-[var(--line)] px-3 py-1 text-[var(--accent-2)] hover:border-[var(--accent-2)]"
    >
      {children}
    </a>
  );
}

function buildQueueSummary(tasks: ValidationTaskView[]) {
  return tasks.reduce(
    (summary, task) => {
      const status = getQueueStatus(task);
      if (task.definition.priority === "P0" && status !== "CLOSED") {
        summary.p0Open += 1;
      }
      if (status === "READY_TO_CLOSE") summary.ready += 1;
      if (status === "MISSING_EVIDENCE" || status === "NO_INTERNAL_EVIDENCE") {
        summary.insufficient += 1;
      }
      return summary;
    },
    { p0Open: 0, ready: 0, insufficient: 0 }
  );
}

function getQueueStatus(task: ValidationTaskView): QueueStatus {
  if (task.state.status === "VERIFIED") return "CLOSED";
  if (task.verifiedEvidenceCount >= task.definition.minimumVerifiedRecords) {
    return "READY_TO_CLOSE";
  }
  if (task.totalEvidenceCount === 0) return "NO_INTERNAL_EVIDENCE";
  return "MISSING_EVIDENCE";
}

function queueStatusLabel(status: QueueStatus, task: ValidationTaskView) {
  if (status === "CLOSED") return "已关闭";
  if (status === "READY_TO_CLOSE") return "可关闭";
  if (status === "NO_INTERNAL_EVIDENCE") return "无内部证据";
  const remaining = Math.max(
    task.definition.minimumVerifiedRecords - task.verifiedEvidenceCount,
    0
  );
  return `缺 ${remaining} 条证据`;
}

function matchesQueueFilter(
  status: QueueStatus,
  task: ValidationTaskView,
  queue: string
) {
  if (queue === "P0_OPEN") {
    return task.definition.priority === "P0" && status !== "CLOSED";
  }
  if (queue === "READY") return status === "READY_TO_CLOSE";
  if (queue === "INSUFFICIENT") {
    return status === "MISSING_EVIDENCE" || status === "NO_INTERNAL_EVIDENCE";
  }
  return true;
}

function compareValidationTasks(a: ValidationTaskView, b: ValidationTaskView) {
  const statusA = getQueueStatus(a);
  const statusB = getQueueStatus(b);
  const priorityA = taskSortWeight(a, statusA);
  const priorityB = taskSortWeight(b, statusB);
  if (priorityA !== priorityB) return priorityA - priorityB;
  const remainingA = Math.max(
    a.definition.minimumVerifiedRecords - a.verifiedEvidenceCount,
    0
  );
  const remainingB = Math.max(
    b.definition.minimumVerifiedRecords - b.verifiedEvidenceCount,
    0
  );
  if (remainingA !== remainingB) return remainingA - remainingB;
  return a.definition.validationId.localeCompare(
    b.definition.validationId,
    "zh-CN"
  );
}

function taskSortWeight(task: ValidationTaskView, status: QueueStatus) {
  if (status === "CLOSED") return 5;
  if (task.definition.priority === "P0" && status === "READY_TO_CLOSE") return 0;
  if (task.definition.priority === "P0") return 1;
  if (status === "READY_TO_CLOSE") return 2;
  if (task.definition.priority === "P1") return 3;
  return 4;
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

function Filter({
  name,
  label,
  value,
  values
}: {
  name: string;
  label: string;
  value?: string;
  values: string[];
}) {
  return (
    <label className="grid gap-1 text-xs text-[var(--muted)]">
      {label}
      <select
        name={name}
        defaultValue={value ?? "ALL"}
        className="rounded border border-[var(--line)] bg-[var(--panel)] px-3 py-2 text-sm"
      >
        {values.map((item) => (
          <option key={item}>{item}</option>
        ))}
      </select>
    </label>
  );
}
