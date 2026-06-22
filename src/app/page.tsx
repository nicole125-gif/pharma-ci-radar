import Link from "next/link";
import { AlertTriangle, ArrowUpRight, CheckCircle2, Clock3, ListChecks, ShieldAlert } from "lucide-react";
import { buildDashboardView } from "@/lib/dashboard-view";
import { AppShell } from "@/components/app-shell";
import { RunMonitorButton } from "@/components/forms";
import { MetricCard } from "@/components/metric-card";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { getRepository } from "@/lib/repository";
import type { ActionQueueItem, CompetitorAnalysis, IntelEvent } from "@/lib/types";

export default async function DashboardPage({
  searchParams
}: {
  searchParams?: Promise<{ monitor?: string; scanned?: string; events?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const repo = await getRepository();
  const dashboard = repo.getDashboard();
  const externalCompetitors = dashboard.competitors.filter((competitor) => competitor.role === "COMPETITOR");
  const ownCompany = dashboard.competitors.find((competitor) => competitor.role === "OWN_COMPANY");
  const view = buildDashboardView(dashboard);
  const monitorResult =
    resolvedSearchParams?.monitor === "done"
      ? {
          scannedSources: Number(resolvedSearchParams.scanned ?? 0),
          createdEvents: Number(resolvedSearchParams.events ?? 0)
        }
      : null;

  return (
    <AppShell>
      <PageHeader
        eyebrow="Executive radar"
        title="Pharma & Biotech 竞争情报解读"
        description="分数只是历史专家参考；首页优先展示对竞品意图、威胁等级、证据可信度和 Bürkert 应对动作的判断。"
        action={<RunMonitorButton />}
      />

      {monitorResult ? <MonitorResult scannedSources={monitorResult.scannedSources} createdEvents={monitorResult.createdEvents} /> : null}

      <section className="grid grid-cols-4 gap-4 max-[1100px]:grid-cols-2 max-[620px]:grid-cols-1">
        <MetricCard label="我方基准" value={ownCompany?.name ?? "Bürkert"} detail="矩阵和周报均以 Bürkert 为比较对象" />
        <MetricCard label="外部竞品" value={externalCompetitors.length} detail="来自 CI Summary 的 Pharma & Biotech sheet" />
        <MetricCard label="重点解读" value={dashboard.topAnalyses.length} detail="按威胁等级和证据可信度优先展示" />
        <MetricCard label="未读重大提醒" value={dashboard.unreadAlerts.length} detail="站内提醒，V1 暂不推送邮件或 IM" />
      </section>

      <section className="mt-5 grid grid-cols-[1.15fr_0.85fr] gap-5 max-[1050px]:grid-cols-1">
        <div className="panel p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-[var(--accent-2)]">本周重点判断</div>
              <h2 className="mt-2 text-2xl font-semibold leading-tight">{view.heroVerdict}</h2>
            </div>
            <span className="rounded border border-[var(--line)] px-3 py-1 text-xs text-[var(--muted)]">管理层视图</span>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-3 max-[760px]:grid-cols-1">
            {view.heroSignals.map((signal) => (
              <MiniSignal key={signal.label} label={signal.label} value={signal.value} detail={signal.detail} />
            ))}
          </div>
          <p className="mt-4 text-sm leading-6 text-[var(--muted)]">{dashboard.referenceScoreNotice}</p>
        </div>

        <div className="panel p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-[var(--accent)]">
              <ListChecks size={18} />
              今日行动队列
            </div>
            <span className="metric-number rounded border border-[var(--line)] px-2 py-1 text-xs text-[var(--muted)]">
              {view.actionQueue.length} OPEN
            </span>
          </div>
          <div className="grid gap-3">
            {view.actionQueue.map((item) => (
              <ActionRow key={item.id} item={item} />
            ))}
          </div>
          <Link href="/sales-intel" className="mt-4 inline-flex items-center gap-2 text-sm text-[var(--accent-2)]">
            处理一线情报
            <ArrowUpRight size={15} />
          </Link>
        </div>
      </section>

      <section className="mt-5 grid grid-cols-[1.15fr_0.85fr] gap-5 max-[1050px]:grid-cols-1">
        <div className="panel p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">本周管理层摘要</h2>
              <p className="text-sm text-[var(--muted)]">{dashboard.weeklyBrief.weekStart}</p>
            </div>
            <Clock3 className="text-[var(--accent-2)]" size={20} />
          </div>
          <p className="text-base leading-7">{dashboard.weeklyBrief.executiveSummary}</p>
          <div className="mt-5 grid grid-cols-2 gap-4 max-[760px]:grid-cols-1">
            <SummaryColumn title="风险" items={dashboard.weeklyBrief.keyRisks} tone="danger" />
            <SummaryColumn title="机会" items={dashboard.weeklyBrief.keyOpportunities} tone="success" />
          </div>
        </div>

        <div className="panel p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">高优先级解读</h2>
            <Link href="/competitors" className="text-sm text-[var(--accent-2)]">
              查看竞品
            </Link>
          </div>
          <div className="grid gap-3">
            {dashboard.topAnalyses.slice(0, 4).map((analysis) => {
              const competitor = dashboard.competitors.find((item) => item.id === analysis.competitorId);
              return <AnalysisRow key={analysis.competitorId} competitorName={competitor?.name ?? analysis.competitorId} analysis={analysis} />;
            })}
          </div>
        </div>
      </section>

      <section className="mt-5 panel overflow-hidden">
        <div className="border-b border-[var(--line)] p-5">
          <h2 className="text-lg font-semibold">重大变化</h2>
        </div>
        <div className="divide-y divide-[var(--line)]">
          {view.recentEvents.map((event) => {
            const competitor = dashboard.competitors.find((item) => item.id === event.competitorId);
            return <EventRow key={event.id} competitorName={competitor?.name ?? event.competitorId} event={event} />;
          })}
        </div>
      </section>

      <section className="mt-5 grid grid-cols-3 gap-4 max-[1050px]:grid-cols-1">
        <Link href="/briefing" className="panel p-4 transition hover:border-[var(--accent-2)]">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-[var(--accent-2)]">
            <ShieldAlert size={17} />
            战略简报
          </div>
          <p className="text-sm leading-6 text-[var(--muted)]">打开管理层周报，先看判断，再看风险和分工。</p>
        </Link>
        <Link href="/battlecards" className="panel p-4 transition hover:border-[var(--accent-2)]">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-[var(--accent-2)]">
            <ListChecks size={17} />
            竞品战术卡
          </div>
          <p className="text-sm leading-6 text-[var(--muted)]">查看销售话术、Bürkert 证据和避免误区。</p>
        </Link>
        <Link href="/sales-intel" className="panel p-4 transition hover:border-[var(--accent-2)]">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-[var(--accent-2)]">
            <AlertTriangle size={17} />
            一线情报池
          </div>
          <p className="text-sm leading-6 text-[var(--muted)]">提交和确认销售反馈，再进入正式分析链路。</p>
        </Link>
      </section>
    </AppShell>
  );
}

function MiniSignal({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="rounded border border-[var(--line)] p-3">
      <div className="text-xs text-[var(--muted)]">{label}</div>
      <div className="mt-2 font-semibold">{value}</div>
      <div className="mt-1 text-xs leading-5 text-[var(--muted)]">{detail}</div>
    </div>
  );
}

function MonitorResult({ scannedSources, createdEvents }: { scannedSources: number; createdEvents: number }) {
  const hasApprovedSources = scannedSources > 0;

  return (
    <section className="mb-5 rounded border border-[var(--line)] bg-[var(--panel-strong)] p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          {hasApprovedSources ? (
            <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-200" size={18} />
          ) : (
            <AlertTriangle className="mt-0.5 shrink-0 text-amber-200" size={18} />
          )}
          <div>
            <div className="text-sm font-semibold">{hasApprovedSources ? "监测已运行" : "监测已运行，但没有可扫描来源"}</div>
            <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
              本次扫描 {scannedSources} 个已批准来源，生成 {createdEvents} 条变化事件。
              {hasApprovedSources ? " 如有新事件，会进入重大变化、提醒和评分建议。" : " 请先在来源审核中批准候选来源，再运行监测。"}
            </p>
          </div>
        </div>
        {!hasApprovedSources ? (
          <Link href="/sources" className="rounded border border-[var(--line)] px-3 py-2 text-sm text-[var(--accent-2)] hover:bg-white/5">
            去审核来源
          </Link>
        ) : null}
      </div>
    </section>
  );
}

function ActionRow({ item }: { item: ActionQueueItem }) {
  return (
    <Link href={item.href} className="rounded border border-[var(--line)] p-3 transition hover:border-[var(--accent-2)] hover:bg-white/[0.03]">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="text-sm font-semibold">{item.title}</span>
        <StatusBadge value={item.impactLevel} />
      </div>
      <p className="line-clamp-2 text-xs leading-5 text-[var(--muted)]">{item.detail}</p>
    </Link>
  );
}

function SummaryColumn({
  title,
  items,
  tone
}: {
  title: string;
  items: string[];
  tone: "danger" | "success";
}) {
  const color = tone === "danger" ? "text-red-100" : "text-emerald-100";
  const icon = tone === "danger" ? <AlertTriangle size={16} /> : <CheckCircle2 size={16} />;

  return (
    <div>
      <div className={`mb-2 flex items-center gap-2 text-sm font-semibold ${color}`}>
        {icon}
        {title}
      </div>
      <ul className="grid gap-2 text-sm leading-6 text-[var(--muted)]">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function AnalysisRow({
  competitorName,
  analysis
}: {
  competitorName: string;
  analysis: Pick<CompetitorAnalysis, "competitorId" | "oneLineJudgment" | "threatLevel" | "confidence">;
}) {
  return (
    <Link href={`/competitors/${analysis.competitorId}`} className="rounded border border-[var(--line)] p-3 transition hover:border-[var(--accent-2)]">
      <div className="flex items-center justify-between gap-3">
        <span className="font-medium">{competitorName}</span>
        <StatusBadge value={analysis.threatLevel} />
      </div>
      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{analysis.oneLineJudgment}</p>
      <p className="mt-2 text-xs text-[var(--muted)]">Confidence: {analysis.confidence}</p>
    </Link>
  );
}

function EventRow({ competitorName, event }: { competitorName: string; event: Pick<IntelEvent, "id" | "eventType" | "summary" | "impactLevel" | "competitorId"> }) {
  return (
    <Link href={`/competitors/${event.competitorId}`} className="grid grid-cols-[150px_1fr_auto] gap-4 p-4 hover:bg-white/[0.03] max-[760px]:grid-cols-1">
      <div>
        <div className="font-medium">{competitorName}</div>
        <div className="text-xs text-[var(--muted)]">{event.eventType}</div>
      </div>
      <div className="text-sm leading-6 text-[var(--muted)]">{event.summary}</div>
      <div className="flex items-center gap-3">
        <StatusBadge value={event.impactLevel} />
        <ArrowUpRight size={16} />
      </div>
    </Link>
  );
}
