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
import type { EvidenceHealthSummary } from "@/lib/knowledge/evidence-health";
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
  evidenceHealth,
  database,
  validationTasks,
  learners
}: {
  summary: { burkertTypes: number; competitorRecords: number; scenarios: number; validationTasks: number; p0Tasks: number };
  evidenceHealth: EvidenceHealthSummary;
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
      <section className="grid gap-3">
        <div className="flex items-center justify-between gap-3 max-[640px]:grid">
          <div className="text-sm font-semibold text-[var(--accent-2)]">证据健康与优先行动</div>
          <div className="flex gap-3 text-xs">
            <Link href="/briefing" className="text-[var(--accent-2)]">管理层简报</Link>
            <Link href="/knowledge?view=evidence&risk=NEEDS_VALIDATION" className="text-[var(--accent-2)]">查看需验证证据</Link>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-3 max-[900px]:grid-cols-2 max-[560px]:grid-cols-1">
          <Metric label="可直接引用证据" value={evidenceHealth.directlyUsableEvidence} />
          <Metric label="需内部验证证据" value={evidenceHealth.riskyEvidence} tone="warning" />
          <Metric label="未归档风险证据" value={evidenceHealth.unlinkedRiskyEvidence} tone={evidenceHealth.unlinkedRiskyEvidence > 0 ? "warning" : "good"} />
          <Metric label="P0 验证任务" value={evidenceHealth.p0ValidationTasks} />
        </div>
        <div className="grid grid-cols-[1fr_1fr] gap-5 max-[1000px]:grid-cols-1">
          <div className="panel overflow-hidden">
            <div className="border-b border-[var(--line)] px-4 py-3 font-semibold">公司级风险分布</div>
            <div className="divide-y divide-[var(--line)]">
              {evidenceHealth.companyHealth.map((item) => (
                <div key={item.company} className="grid grid-cols-[1fr_repeat(4,80px)] gap-3 px-4 py-3 text-xs max-[760px]:grid-cols-2">
                  <span className="font-semibold">{item.company}</span>
                  <span><span className="text-[var(--muted)]">强</span> {item.strongEvidence}</span>
                  <span><span className="text-[var(--muted)]">风险</span> {item.riskyEvidence}</span>
                  <span><span className="text-[var(--muted)]">已归档</span> {item.linkedRiskyEvidence}</span>
                  <span className={item.unlinkedRiskyEvidence > 0 ? "text-amber-300" : "text-[var(--muted)]"}><span>未归档</span> {item.unlinkedRiskyEvidence}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="panel overflow-hidden">
            <div className="border-b border-[var(--line)] px-4 py-3 font-semibold">优先行动</div>
            <div className="divide-y divide-[var(--line)]">
              {evidenceHealth.priorityActions.map((action) => (
                <Link key={action.id} href={action.href} className="grid grid-cols-[72px_1fr_auto] gap-3 px-4 py-3 text-sm hover:bg-white/5 max-[700px]:grid-cols-1">
                  <span className={`rounded border px-2 py-1 text-center text-xs ${action.priority === "UNLINKED" ? "border-amber-300/70 text-amber-300" : "border-[var(--accent-2)] text-[var(--accent-2)]"}`}>{action.priority}</span>
                  <span><span className="font-semibold">{action.title}</span><br /><span className="text-xs text-[var(--muted)]">{action.detail}</span></span>
                  <ArrowUpRight size={15} className="text-[var(--muted)]" />
                </Link>
              ))}
            </div>
          </div>
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

function Metric({ label, value, tone = "default" }: { label: string; value: number; tone?: "default" | "warning" | "good" }) {
  const toneClass = tone === "warning" ? "text-amber-300" : tone === "good" ? "text-[var(--accent-2)]" : "";
  return <div className="panel p-4"><div className={`metric-number text-3xl ${toneClass}`}>{value}</div><div className="mt-2 text-xs text-[var(--muted)]">{label}</div></div>;
}
