import React from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  BookOpenCheck,
  ClipboardCheck,
  GitCompareArrows,
  SearchCheck,
  UsersRound
} from "lucide-react";
import type { TrainingLearner, ValidationTaskDefinition } from "@/lib/knowledge/types";
import type { KnowledgeStore } from "@/lib/knowledge/store";

const taskItems = [
  { label: "为客户选型", detail: "从客户任务和工况进入候选 Type 与边界", href: "/knowledge?view=products&type=SCENARIO", icon: SearchCheck },
  { label: "比较竞品", detail: "按产品族、系列和制药相关性检索", href: "/knowledge?view=products", icon: GitCompareArrows },
  { label: "准备客户拜访", detail: "进入战术卡，整理证据与提问路径", href: "/battlecards", icon: UsersRound },
  { label: "继续训练", detail: "推进 30 天课程和检查点评分", href: "/knowledge?view=training", icon: BookOpenCheck },
  { label: "验证一个判断", detail: "补齐价格、交付、服务与客户证据", href: "/knowledge?view=validation", icon: ClipboardCheck }
];

export function KnowledgeWorkbench({
  summary,
  database,
  validationTasks,
  learners
}: {
  summary: { burkertTypes: number; competitorRecords: number; scenarios: number; validationTasks: number; p0Tasks: number };
  database: KnowledgeStore;
  validationTasks: Array<{ definition: ValidationTaskDefinition; state: { status: string }; verifiedEvidenceCount: number; totalEvidenceCount: number }>;
  learners: TrainingLearner[];
}) {
  return (
    <div className="grid gap-5">
      {!database.available && (
        <div className="rounded border border-amber-300/30 bg-amber-300/5 px-4 py-3 text-sm text-amber-100">
          当前为只读模式：产品知识可正常使用，训练进度和验证任务需要配置 PostgreSQL 后更新。
        </div>
      )}
      <section>
        <div className="mb-3 text-sm font-semibold text-[var(--accent-2)]">今天要完成什么</div>
        <div className="grid grid-cols-5 gap-3 max-[1200px]:grid-cols-3 max-[760px]:grid-cols-1">
          {taskItems.map((item) => (
            <Link key={item.label} href={item.href} className="panel min-h-36 p-4 transition hover:border-[var(--accent-2)]">
              <div className="flex items-center justify-between">
                <item.icon size={20} className="text-[var(--accent)]" />
                <ArrowUpRight size={15} className="text-[var(--muted)]" />
              </div>
              <div className="mt-5 font-semibold">{item.label}</div>
              <p className="mt-2 text-xs leading-5 text-[var(--muted)]">{item.detail}</p>
            </Link>
          ))}
        </div>
      </section>
      <section className="grid grid-cols-4 gap-3 max-[760px]:grid-cols-2">
        <Metric label="Bürkert Type" value={summary.burkertTypes} />
        <Metric label="竞品系列记录" value={summary.competitorRecords} />
        <Metric label="制药场景" value={summary.scenarios} />
        <Metric label="验证任务" value={summary.validationTasks} />
      </section>
      <section className="grid grid-cols-[1.2fr_0.8fr] gap-5 max-[900px]:grid-cols-1">
        <div className="panel overflow-hidden">
          <div className="border-b border-[var(--line)] px-4 py-3 font-semibold">P0 验证队列</div>
          <div className="divide-y divide-[var(--line)]">
            {validationTasks.filter((task) => task.definition.priority === "P0").slice(0, 6).map((task) => (
              <div key={task.definition.validationId} className="grid grid-cols-[110px_1fr_auto] gap-3 px-4 py-3 text-sm max-[620px]:grid-cols-1">
                <span className="metric-number text-[var(--accent)]">{task.definition.validationId}</span>
                <span>{task.definition.topic}</span>
                <span className="text-xs text-[var(--muted)]">{task.verifiedEvidenceCount}/{task.definition.minimumVerifiedRecords} 已验证</span>
              </div>
            ))}
          </div>
        </div>
        <div className="panel p-4">
          <div className="font-semibold">训练执行</div>
          <div className="mt-4 metric-number text-4xl">{learners.length}</div>
          <p className="mt-2 text-sm text-[var(--muted)]">当前已建档学习者</p>
          <Link href="/knowledge?view=training" className="mt-6 inline-flex items-center gap-2 text-sm text-[var(--accent-2)]">进入训练工作区<ArrowUpRight size={15} /></Link>
        </div>
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return <div className="panel p-4"><div className="metric-number text-3xl">{value}</div><div className="mt-2 text-xs text-[var(--muted)]">{label}</div></div>;
}
