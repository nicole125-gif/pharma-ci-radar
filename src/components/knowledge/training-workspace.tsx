import React from "react";
import Link from "next/link";
import type { CurriculumDay, TrainingLearner, TrainingProgress, TrainingScore, ValidationTaskDefinition, ValidationTaskState } from "@/lib/knowledge/types";
import { validationHref } from "@/lib/knowledge/validation-linking";
import { getTrainingClosure, getTrainingClosures } from "@/lib/knowledge/training-closure";
import { CreateLearnerForm, TrainingProgressForm, TrainingScoreForm } from "./knowledge-forms";

type TrainingValidationTask = {
  definition: ValidationTaskDefinition;
  state: ValidationTaskState;
  verifiedEvidenceCount: number;
  totalEvidenceCount: number;
};

export function TrainingWorkspace({
  curriculum,
  learners,
  selectedLearner,
  progress,
  scores,
  validationTasks = [],
  readOnly
}: {
  curriculum: CurriculumDay[];
  learners: TrainingLearner[];
  selectedLearner?: TrainingLearner;
  progress: TrainingProgress[];
  scores: TrainingScore[];
  validationTasks?: TrainingValidationTask[];
  readOnly: boolean;
}) {
  const weeks = [...new Set(curriculum.map((day) => day.week))];
  const closureSummaries = getTrainingClosures()
    .map((closure) => ({
      closure,
      day: curriculum.find((item) => item.day === closure.day)
    }))
    .filter((item): item is { closure: NonNullable<ReturnType<typeof getTrainingClosure>>; day: CurriculumDay } => Boolean(item.day));
  return (
    <div className="grid grid-cols-[260px_1fr] gap-5 max-[900px]:grid-cols-1">
      <aside className="grid content-start gap-4">
        <div className="panel p-4"><div className="mb-3 font-semibold">学习者</div><div className="grid gap-2">{learners.map((learner) => <Link key={learner.id} href={`/knowledge?view=training&learner=${learner.id}`} className={`rounded border px-3 py-2 text-sm ${selectedLearner?.id === learner.id ? "border-[var(--accent)]" : "border-[var(--line)]"}`}>{learner.name}<span className="ml-2 text-xs text-[var(--muted)]">{learner.cohort}</span></Link>)}</div></div>
        <div className="panel p-4"><div className="mb-3 font-semibold">新建学习者</div><CreateLearnerForm disabled={readOnly} /></div>
        {selectedLearner && <div className="panel p-4"><div className="mb-3 font-semibold">记录检查点评分</div><TrainingScoreForm learnerId={selectedLearner.id} disabled={readOnly} /></div>}
      </aside>
      <div className="grid gap-5">
        {!selectedLearner && <div className="panel p-4 text-sm text-[var(--muted)]">课程可直接浏览；选择或创建学习者后可记录进度和评分。</div>}
        <TrainingClosureOverview summaries={closureSummaries} progress={progress} validationTasks={validationTasks} />
        {weeks.map((week) => (
          <section key={week} className="panel overflow-hidden">
            <div className="border-b border-[var(--line)] px-4 py-3 font-semibold">第 {week} 周</div>
            <div className="divide-y divide-[var(--line)]">{curriculum.filter((day) => day.week === week).map((day) => {
              const dayProgress = progress.find((item) => item.day === day.day);
              const closure = getTrainingClosure(day.day);
              return <details key={day.day} className="group"><summary className="grid cursor-pointer grid-cols-[70px_150px_1fr_auto] gap-3 px-4 py-3 text-sm max-[700px]:grid-cols-1"><span className="metric-number text-[var(--accent)]">DAY {day.day}</span><span className="font-semibold">{day.module}</span><span className="text-[var(--muted)]">{day.learningObjective}</span><span className="text-xs text-[var(--accent-2)]">{dayProgress?.completionStatus ?? "NOT_STARTED"}</span></summary><div className="border-t border-[var(--line)] bg-black/10 p-4"><div className="mb-4 grid grid-cols-3 gap-4 text-xs leading-5 max-[700px]:grid-cols-1"><Text label="练习" value={day.exercise} /><Text label="要求产出" value={day.requiredOutput} /><Text label="通过标准" value={day.passCriteria} /></div>{closure && <TrainingClosure closure={closure} />}{selectedLearner && <TrainingProgressForm learnerId={selectedLearner.id} day={day} progress={dayProgress} disabled={readOnly} />}</div></details>;
            })}</div>
          </section>
        ))}
        {selectedLearner && <section className="panel overflow-hidden"><div className="border-b border-[var(--line)] px-4 py-3 font-semibold">评分记录</div><div className="divide-y divide-[var(--line)]">{scores.map((score) => <div key={score.id} className="grid grid-cols-[100px_1fr_auto] gap-3 px-4 py-3 text-sm"><span>{score.checkpoint}</span><span className="text-[var(--muted)]">{score.recordDate} · {score.assessor}</span><span className="metric-number">{score.totalScore} / {score.result}</span></div>)}</div></section>}
      </div>
    </div>
  );
}
function Text({ label, value }: { label: string; value: string }) { return <div><div className="font-semibold text-[var(--accent-2)]">{label}</div><p className="mt-1 text-[var(--muted)]">{value}</p></div>; }

function TrainingClosureOverview({
  summaries,
  progress,
  validationTasks
}: {
  summaries: Array<{
    closure: NonNullable<ReturnType<typeof getTrainingClosure>>;
    day: CurriculumDay;
  }>;
  progress: TrainingProgress[];
  validationTasks: TrainingValidationTask[];
}) {
  if (summaries.length === 0) return null;

  const evidenceCount = summaries.reduce(
    (total, item) => total + item.closure.requiredEvidenceIds.length,
    0
  );
  const completedCount = summaries.filter(({ day }) => {
    const dayProgress = progress.find((item) => item.day === day.day);
    return dayProgress?.completionStatus === "COMPLETE";
  }).length;
  const validationTasksById = new Map(
    validationTasks.map((task) => [task.definition.validationId, task])
  );
  const linkedValidationTasks = [
    ...new Map(
      summaries
        .flatMap(({ closure }) => closure.validationTaskIds ?? [])
        .map((validationId) => validationTasksById.get(validationId))
        .filter((task): task is TrainingValidationTask => Boolean(task))
        .map((task) => [task.definition.validationId, task])
    ).values()
  ];
  const openValidationIds = linkedValidationTasks
    .filter((task) => task.state.status !== "VERIFIED")
    .map((task) => task.definition.validationId);
  const verifiedValidationCount = linkedValidationTasks.filter(
    (task) =>
      task.state.status === "VERIFIED" ||
      task.verifiedEvidenceCount >= task.definition.minimumVerifiedRecords
  ).length;

  return (
    <section className="panel p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-[var(--accent)]">训练闭环总览</div>
          <p className="mt-1 text-xs leading-5 text-[var(--muted)]">
            聚合当前课程里的闭环任务、必须证据和返工红线。
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="rounded border border-[var(--line)] px-3 py-1 text-[var(--accent-2)]">
            {summaries.length} 个闭环任务
          </span>
          <span className="rounded border border-[var(--line)] px-3 py-1 text-[var(--accent-2)]">
            {evidenceCount} 条必须引用证据
          </span>
          <span className="rounded border border-[var(--line)] px-3 py-1 text-[var(--accent-2)]">
            {completedCount} / {summaries.length} 已完成
          </span>
          {linkedValidationTasks.length > 0 && (
            <span className="rounded border border-[var(--line)] px-3 py-1 text-[var(--accent-2)]">
              {verifiedValidationCount} / {linkedValidationTasks.length} 已验证
            </span>
          )}
          {openValidationIds.length > 0 && (
            <span className="rounded border border-[var(--line)] px-3 py-1 text-[var(--accent-2)]">
              {openValidationIds.length} 个待验证问题
            </span>
          )}
        </div>
      </div>
      <div className="grid gap-3">
        {summaries.map(({ closure, day }) => {
          const status =
            progress.find((item) => item.day === day.day)?.completionStatus ??
            "NOT_STARTED";
          const linkedValidationTasks = (closure.validationTaskIds ?? [])
            .map((validationId) => validationTasksById.get(validationId))
            .filter((task): task is TrainingValidationTask => Boolean(task))
            .filter((task) => task.state.status !== "VERIFIED");
          return (
            <div key={closure.day} className="rounded border border-[var(--line)] p-3">
              <div className="mb-1 flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-[var(--accent-2)]">
                <span>DAY {day.day} · {day.module}</span>
                <span>{status}</span>
              </div>
              <div className="text-sm font-semibold">{closure.title}</div>
              <p className="mt-2 text-xs leading-5 text-[var(--muted)]">{closure.deliverable}</p>
              <div className="mt-3 grid grid-cols-[1fr_1fr] gap-3 max-[700px]:grid-cols-1">
                <div className="text-xs leading-5 text-[var(--muted)]">
                  <span className="font-semibold text-[var(--accent-2)]">证据：</span>
                  {closure.requiredEvidenceIds.slice(0, 3).join(" / ")}
                  {closure.requiredEvidenceIds.length > 3 ? " ..." : ""}
                </div>
                <div className="text-xs leading-5 text-[var(--muted)]">
                  <span className="font-semibold text-[var(--accent-2)]">红线：</span>
                  {closure.reworkTriggers[0]}
                </div>
              </div>
              {linkedValidationTasks.length > 0 && (
                <div className="mt-3 border-t border-[var(--line)] pt-3">
                  <div className="mb-2 text-xs font-semibold text-[var(--accent-2)]">
                    待验证
                  </div>
                  <div className="grid gap-2">
                    {linkedValidationTasks.slice(0, 2).map((task) => (
                      <Link
                        key={task.definition.validationId}
                        href={validationHref(task.definition.validationId)}
                        className="grid grid-cols-[130px_1fr_auto_auto] gap-2 text-xs leading-5 hover:text-[var(--accent-2)] max-[760px]:grid-cols-1"
                      >
                        <span className="text-[var(--accent-2)]">
                          {task.definition.validationId}
                        </span>
                        <span className="text-[var(--muted)]">
                          {task.definition.topic}
                        </span>
                        <span>{task.state.status}</span>
                        <span className="text-[var(--muted)]">
                          {task.verifiedEvidenceCount}/{task.definition.minimumVerifiedRecords} 已验证
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function TrainingClosure({ closure }: { closure: NonNullable<ReturnType<typeof getTrainingClosure>> }) {
  return (
    <section className="mb-4 rounded border border-[var(--line)] bg-black/10 p-4">
      <div className="mb-2 text-sm font-semibold text-[var(--accent)]">{closure.title}</div>
      <p className="mb-4 text-sm leading-6 text-[var(--muted)]">{closure.deliverable}</p>
      <div className="grid grid-cols-2 gap-4 max-[760px]:grid-cols-1">
        <ClosureList title="提交清单" items={closure.submissionChecklist} />
        <ClosureList title="返工红线" items={closure.reworkTriggers} />
      </div>
      <div className="mt-4 grid grid-cols-4 gap-3 max-[900px]:grid-cols-2 max-[560px]:grid-cols-1">
        {closure.scoringRubric.map((item) => (
          <div key={item.dimension} className="rounded border border-[var(--line)] p-3 text-xs leading-5">
            <div className="mb-1 font-semibold text-[var(--accent-2)]">{item.dimension} / {item.points}</div>
            <p className="text-[var(--muted)]">{item.passSignal}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-[1fr_1fr] gap-4 max-[760px]:grid-cols-1">
        <ClosureList title="必须引用证据" items={closure.requiredEvidenceIds} />
        <ClosureList title="自我复盘问题" items={closure.reflectionPrompts} />
      </div>
    </section>
  );
}

function ClosureList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <div className="mb-2 text-xs font-semibold text-[var(--accent-2)]">{title}</div>
      <ul className="grid gap-2 text-xs leading-5 text-[var(--muted)]">
        {items.map((item) => <li key={item}>- {item}</li>)}
      </ul>
    </div>
  );
}
