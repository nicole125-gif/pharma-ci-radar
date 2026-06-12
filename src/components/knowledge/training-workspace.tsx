import Link from "next/link";
import type { CurriculumDay, TrainingLearner, TrainingProgress, TrainingScore } from "@/lib/knowledge/types";
import { CreateLearnerForm, TrainingProgressForm, TrainingScoreForm } from "./knowledge-forms";

export function TrainingWorkspace({
  curriculum,
  learners,
  selectedLearner,
  progress,
  scores,
  readOnly
}: {
  curriculum: CurriculumDay[];
  learners: TrainingLearner[];
  selectedLearner?: TrainingLearner;
  progress: TrainingProgress[];
  scores: TrainingScore[];
  readOnly: boolean;
}) {
  const weeks = [...new Set(curriculum.map((day) => day.week))];
  return (
    <div className="grid grid-cols-[260px_1fr] gap-5 max-[900px]:grid-cols-1">
      <aside className="grid content-start gap-4">
        <div className="panel p-4"><div className="mb-3 font-semibold">学习者</div><div className="grid gap-2">{learners.map((learner) => <Link key={learner.id} href={`/knowledge?view=training&learner=${learner.id}`} className={`rounded border px-3 py-2 text-sm ${selectedLearner?.id === learner.id ? "border-[var(--accent)]" : "border-[var(--line)]"}`}>{learner.name}<span className="ml-2 text-xs text-[var(--muted)]">{learner.cohort}</span></Link>)}</div></div>
        <div className="panel p-4"><div className="mb-3 font-semibold">新建学习者</div><CreateLearnerForm disabled={readOnly} /></div>
        {selectedLearner && <div className="panel p-4"><div className="mb-3 font-semibold">记录检查点评分</div><TrainingScoreForm learnerId={selectedLearner.id} disabled={readOnly} /></div>}
      </aside>
      <div className="grid gap-5">
        {!selectedLearner && <div className="panel p-4 text-sm text-[var(--muted)]">课程可直接浏览；选择或创建学习者后可记录进度和评分。</div>}
        {weeks.map((week) => (
          <section key={week} className="panel overflow-hidden">
            <div className="border-b border-[var(--line)] px-4 py-3 font-semibold">第 {week} 周</div>
            <div className="divide-y divide-[var(--line)]">{curriculum.filter((day) => day.week === week).map((day) => {
              const dayProgress = progress.find((item) => item.day === day.day);
              return <details key={day.day} className="group"><summary className="grid cursor-pointer grid-cols-[70px_150px_1fr_auto] gap-3 px-4 py-3 text-sm max-[700px]:grid-cols-1"><span className="metric-number text-[var(--accent)]">DAY {day.day}</span><span className="font-semibold">{day.module}</span><span className="text-[var(--muted)]">{day.learningObjective}</span><span className="text-xs text-[var(--accent-2)]">{dayProgress?.completionStatus ?? "NOT_STARTED"}</span></summary><div className="border-t border-[var(--line)] bg-black/10 p-4"><div className="mb-4 grid grid-cols-3 gap-4 text-xs leading-5 max-[700px]:grid-cols-1"><Text label="练习" value={day.exercise} /><Text label="要求产出" value={day.requiredOutput} /><Text label="通过标准" value={day.passCriteria} /></div>{selectedLearner && <TrainingProgressForm learnerId={selectedLearner.id} day={day} progress={dayProgress} disabled={readOnly} />}</div></details>;
            })}</div>
          </section>
        ))}
        {selectedLearner && <section className="panel overflow-hidden"><div className="border-b border-[var(--line)] px-4 py-3 font-semibold">评分记录</div><div className="divide-y divide-[var(--line)]">{scores.map((score) => <div key={score.id} className="grid grid-cols-[100px_1fr_auto] gap-3 px-4 py-3 text-sm"><span>{score.checkpoint}</span><span className="text-[var(--muted)]">{score.recordDate} · {score.assessor}</span><span className="metric-number">{score.totalScore} / {score.result}</span></div>)}</div></section>}
      </div>
    </div>
  );
}
function Text({ label, value }: { label: string; value: string }) { return <div><div className="font-semibold text-[var(--accent-2)]">{label}</div><p className="mt-1 text-[var(--muted)]">{value}</p></div>; }
