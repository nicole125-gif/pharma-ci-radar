"use client";

import { useActionState } from "react";
import { Save } from "lucide-react";
import {
  createLearnerAction,
  initialKnowledgeActionState,
  recordScoreAction,
  registerEvidenceAction,
  saveProgressAction,
  saveValidationAction
} from "@/app/knowledge/actions";
import type {
  CurriculumDay,
  TrainingProgress,
  ValidationTaskState
} from "@/lib/knowledge/types";

const inputClass =
  "w-full rounded border border-[var(--line)] bg-black/20 px-3 py-2 text-sm outline-none focus:border-[var(--accent-2)] disabled:cursor-not-allowed disabled:opacity-50";

function SubmitButton({ disabled }: { disabled: boolean }) {
  return (
    <button
      disabled={disabled}
      className="inline-flex items-center gap-2 rounded bg-[var(--accent)] px-3 py-2 text-sm font-semibold text-black disabled:cursor-not-allowed disabled:opacity-50"
    >
      <Save size={15} />
      保存
    </button>
  );
}

function Message({
  state,
  disabled
}: {
  state: { ok: boolean; message: string };
  disabled: boolean;
}) {
  return (
    <div
      aria-live="polite"
      className={`text-xs ${state.ok ? "text-emerald-200" : "text-[var(--danger)]"}`}
    >
      {disabled ? "当前为只读模式，配置 PostgreSQL 后可保存。" : state.message}
    </div>
  );
}

export function CreateLearnerForm({ disabled }: { disabled: boolean }) {
  const [state, action] = useActionState(
    createLearnerAction,
    initialKnowledgeActionState
  );
  return (
    <form action={action} className="grid gap-3">
      <label className="grid gap-1 text-xs text-[var(--muted)]">
        姓名
        <input name="name" disabled={disabled} className={inputClass} />
      </label>
      <label className="grid gap-1 text-xs text-[var(--muted)]">
        班次或角色
        <input name="cohort" disabled={disabled} className={inputClass} />
      </label>
      <div className="flex items-center justify-between gap-3">
        <Message state={state} disabled={disabled} />
        <SubmitButton disabled={disabled} />
      </div>
    </form>
  );
}

export function TrainingProgressForm({
  learnerId,
  day,
  progress,
  disabled
}: {
  learnerId: string;
  day: CurriculumDay;
  progress?: TrainingProgress;
  disabled: boolean;
}) {
  const [state, action] = useActionState(
    saveProgressAction,
    initialKnowledgeActionState
  );
  return (
    <form action={action} className="grid grid-cols-2 gap-3 max-[620px]:grid-cols-1">
      <input type="hidden" name="learnerId" value={learnerId} />
      <input type="hidden" name="day" value={day.day} />
      <label className="grid gap-1 text-xs text-[var(--muted)]">
        进度
        <select
          name="completionStatus"
          defaultValue={progress?.completionStatus ?? "NOT_STARTED"}
          disabled={disabled}
          className={inputClass}
        >
          <option value="NOT_STARTED">未开始</option>
          <option value="IN_PROGRESS">进行中</option>
          <option value="SUBMITTED">已提交</option>
          <option value="COMPLETE">已完成</option>
        </select>
      </label>
      <label className="grid gap-1 text-xs text-[var(--muted)]">
        计划日期
        <input type="date" name="scheduledDate" defaultValue={progress?.scheduledDate} disabled={disabled} className={inputClass} />
      </label>
      <label className="grid gap-1 text-xs text-[var(--muted)]">
        产出位置
        <input name="outputLocation" defaultValue={progress?.outputLocation} disabled={disabled} className={inputClass} />
      </label>
      <label className="grid gap-1 text-xs text-[var(--muted)]">
        教练
        <input name="coach" defaultValue={progress?.coach} disabled={disabled} className={inputClass} />
      </label>
      <label className="grid gap-1 text-xs text-[var(--muted)]">
        教练结果
        <select name="coachResult" defaultValue={progress?.coachResult ?? "NOT_REVIEWED"} disabled={disabled} className={inputClass}>
          <option value="NOT_REVIEWED">未审核</option>
          <option value="PASS">通过</option>
          <option value="REWORK">返工</option>
        </select>
      </label>
      <label className="grid gap-1 text-xs text-[var(--muted)]">
        完成日期
        <input type="date" name="completedDate" defaultValue={progress?.completedDate} disabled={disabled} className={inputClass} />
      </label>
      <label className="col-span-2 grid gap-1 text-xs text-[var(--muted)] max-[620px]:col-span-1">
        自我复盘
        <textarea name="selfReflection" defaultValue={progress?.selfReflection} disabled={disabled} className={inputClass} rows={2} />
      </label>
      <label className="col-span-2 grid gap-1 text-xs text-[var(--muted)] max-[620px]:col-span-1">
        教练反馈
        <textarea name="coachFeedback" defaultValue={progress?.coachFeedback} disabled={disabled} className={inputClass} rows={2} />
      </label>
      <div className="col-span-2 flex items-center justify-between gap-3 max-[620px]:col-span-1">
        <Message state={state} disabled={disabled} />
        <SubmitButton disabled={disabled} />
      </div>
    </form>
  );
}

export function TrainingScoreForm({
  learnerId,
  disabled
}: {
  learnerId: string;
  disabled: boolean;
}) {
  const [state, action] = useActionState(
    recordScoreAction,
    initialKnowledgeActionState
  );
  return (
    <form action={action} className="grid grid-cols-2 gap-3 max-[620px]:grid-cols-1">
      <input type="hidden" name="learnerId" value={learnerId} />
      <label className="grid gap-1 text-xs text-[var(--muted)]">检查点<select name="checkpoint" disabled={disabled} className={inputClass}><option>BASELINE</option><option>DAY-10</option><option>DAY-20</option><option>DAY-30</option><option>RETEST</option></select></label>
      <label className="grid gap-1 text-xs text-[var(--muted)]">记录日期<input type="date" name="recordDate" disabled={disabled} className={inputClass} /></label>
      <ScoreInput name="productSkeleton" label="产品骨架 /20" max={20} disabled={disabled} />
      <ScoreInput name="parameterEvidence" label="参数证据 /20" max={20} disabled={disabled} />
      <ScoreInput name="applicationJudgment" label="应用判断 /30" max={30} disabled={disabled} />
      <ScoreInput name="competitiveStrategy" label="竞争策略 /30" max={30} disabled={disabled} />
      <label className="grid gap-1 text-xs text-[var(--muted)]">评估人<input name="assessor" disabled={disabled} className={inputClass} /></label>
      <label className="grid gap-1 text-xs text-[var(--muted)]">证据位置<input name="evidenceLocation" disabled={disabled} className={inputClass} /></label>
      <label className="flex items-center gap-2 text-xs text-[var(--muted)]"><input type="checkbox" name="fatalError" disabled={disabled} />存在致命错误</label>
      <div className="flex items-center justify-between gap-3"><Message state={state} disabled={disabled} /><SubmitButton disabled={disabled} /></div>
    </form>
  );
}

function ScoreInput({ name, label, max, disabled }: { name: string; label: string; max: number; disabled: boolean }) {
  return <label className="grid gap-1 text-xs text-[var(--muted)]">{label}<input type="number" name={name} min={0} max={max} defaultValue={0} disabled={disabled} className={inputClass} /></label>;
}

export function ValidationStateForm({
  validationId,
  state: current,
  disabled
}: {
  validationId: string;
  state: ValidationTaskState;
  disabled: boolean;
}) {
  const [state, action] = useActionState(
    saveValidationAction,
    initialKnowledgeActionState
  );
  return (
    <form action={action} className="grid grid-cols-2 gap-3 max-[620px]:grid-cols-1">
      <input type="hidden" name="validationId" value={validationId} />
      <label className="grid gap-1 text-xs text-[var(--muted)]">状态<select name="status" defaultValue={current.status} disabled={disabled} className={inputClass}><option value="OPEN">OPEN</option><option value="IN_PROGRESS">IN_PROGRESS</option><option value="VERIFIED">VERIFIED</option><option value="REJECTED">REJECTED</option><option value="INSUFFICIENT">INSUFFICIENT</option></select></label>
      <label className="grid gap-1 text-xs text-[var(--muted)]">负责人<input name="owner" defaultValue={current.owner} disabled={disabled} className={inputClass} /></label>
      <label className="grid gap-1 text-xs text-[var(--muted)]">目标日期<input type="date" name="targetDate" defaultValue={current.targetDate} disabled={disabled} className={inputClass} /></label>
      <label className="grid gap-1 text-xs text-[var(--muted)]">更新人<input name="updatedBy" disabled={disabled} className={inputClass} /></label>
      <label className="col-span-2 grid gap-1 text-xs text-[var(--muted)] max-[620px]:col-span-1">结论<textarea name="conclusion" defaultValue={current.conclusion} disabled={disabled} className={inputClass} rows={2} /></label>
      <label className="flex items-center gap-2 text-xs text-[var(--muted)]"><input type="checkbox" name="acceptanceConfirmed" disabled={disabled} />确认满足验收规则</label>
      <div className="flex items-center justify-between gap-3"><Message state={state} disabled={disabled} /><SubmitButton disabled={disabled} /></div>
    </form>
  );
}

export function EvidenceRecordForm({
  validationId,
  disabled
}: {
  validationId: string;
  disabled: boolean;
}) {
  const [state, action] = useActionState(
    registerEvidenceAction,
    initialKnowledgeActionState
  );
  return (
    <form action={action} className="grid grid-cols-2 gap-3 max-[620px]:grid-cols-1">
      <input type="hidden" name="validationId" value={validationId} />
      <label className="grid gap-1 text-xs text-[var(--muted)]">收到日期<input type="date" name="receivedDate" disabled={disabled} className={inputClass} /></label>
      <label className="grid gap-1 text-xs text-[var(--muted)]">来源日期<input type="date" name="sourceDate" disabled={disabled} className={inputClass} /></label>
      <label className="grid gap-1 text-xs text-[var(--muted)]">收集人<input name="collector" disabled={disabled} className={inputClass} /></label>
      <label className="grid gap-1 text-xs text-[var(--muted)]">公司<input name="company" disabled={disabled} className={inputClass} /></label>
      <label className="grid gap-1 text-xs text-[var(--muted)]">证据类型<input name="evidenceType" disabled={disabled} className={inputClass} /></label>
      <label className="grid gap-1 text-xs text-[var(--muted)]">文件或记录位置<input name="fileLocation" disabled={disabled} className={inputClass} /></label>
      <label className="grid gap-1 text-xs text-[var(--muted)]">保密级别<select name="confidentiality" disabled={disabled} className={inputClass}><option>INTERNAL</option><option>RESTRICTED</option><option>PUBLIC</option></select></label>
      <label className="grid gap-1 text-xs text-[var(--muted)]">验证状态<select name="verificationStatus" disabled={disabled} className={inputClass}><option>PENDING</option><option>VERIFIED</option><option>REJECTED</option><option>INSUFFICIENT</option></select></label>
      <label className="col-span-2 grid gap-1 text-xs text-[var(--muted)] max-[620px]:col-span-1">事实摘要<textarea name="factSummary" disabled={disabled} className={inputClass} rows={2} /></label>
      <input type="hidden" name="supportsOrContradicts" value="CONTEXT_ONLY" />
      <div className="col-span-2 flex items-center justify-between gap-3 max-[620px]:col-span-1"><Message state={state} disabled={disabled} /><SubmitButton disabled={disabled} /></div>
    </form>
  );
}
