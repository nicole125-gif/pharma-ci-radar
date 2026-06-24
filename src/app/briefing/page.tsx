import Link from "next/link";
import { ArrowUpRight, CheckCircle2, ClipboardList, Target, Users } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { MetricCard } from "@/components/metric-card";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { getRepository } from "@/lib/repository";
import { loadKnowledgeCatalog } from "@/lib/knowledge/catalog";
import { buildExecutiveEvidenceBrief } from "@/lib/knowledge/executive-brief";

const ownerLabels = {
  Management: "管理层",
  Sales: "销售",
  Product: "产品",
  Marketing: "市场"
};

export default async function BriefingPage() {
  const [repo, catalog] = await Promise.all([
    getRepository(),
    loadKnowledgeCatalog()
  ]);
  const brief = repo.getStrategicBrief();
  const evidenceBrief = buildExecutiveEvidenceBrief(catalog);
  const highThreatCount = brief.priorityThreats.filter((item) => item.threatLevel === "HIGH").length;

  return (
    <AppShell>
      <PageHeader
        eyebrow="Executive Brief"
        title="战略简报"
        description="把竞品监测结果压缩成管理层可行动的判断：谁最值得关注、为什么、需要哪个团队下一步跟进。"
      />

      <section className="grid grid-cols-4 gap-4 max-[1100px]:grid-cols-2 max-[620px]:grid-cols-1">
        <MetricCard label="重点威胁" value={brief.priorityThreats.length} detail="优先进入管理层讨论" />
        <MetricCard label="高威胁" value={highThreatCount} detail="需要更主动防守" />
        <MetricCard label="观察对象" value={brief.watchlist.length} detail="暂列持续监测" />
        <MetricCard label="行动分工" value={Object.values(brief.actionPlan).flat().length} detail="跨管理、销售、产品、市场" />
      </section>

      <section className="mb-5 grid grid-cols-[1.2fr_0.8fr] gap-4 max-[980px]:grid-cols-1">
        <article className="panel p-5">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[var(--accent-2)]">
            <ClipboardList size={18} />
            本周判断
          </div>
          <h2 className="max-w-4xl text-2xl font-semibold leading-8 max-[560px]:text-xl">{brief.headline}</h2>
          <p className="mt-4 max-w-4xl text-sm leading-6 text-[var(--muted)]">{brief.scoreReferenceNote}</p>
        </article>

        <article className="panel p-5">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold">
            <Target size={18} className="text-[var(--accent)]" />
            优先威胁
          </div>
          <div className="grid gap-3">
            {brief.priorityThreats.slice(0, 3).map((item) => (
              <Link
                key={item.competitorId}
                href={`/competitors/${item.competitorId}`}
                className="group flex items-center justify-between gap-3 rounded border border-[var(--line)] px-3 py-3 hover:bg-white/5"
              >
                <div>
                  <div className="mb-1 font-semibold">{item.competitorName}</div>
                  <StatusBadge value={item.threatLevel} />
                </div>
                <ArrowUpRight size={16} className="text-[var(--muted)] group-hover:text-[var(--foreground)]" />
              </Link>
            ))}
          </div>
        </article>
      </section>

      <section className="mb-5 grid gap-4">
        <article className="panel p-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div className="text-sm font-semibold text-[var(--accent-2)]">证据型 Executive Brief</div>
            <div className="flex flex-wrap gap-2">
              <Link href="/briefing/markdown" className="rounded border border-[var(--line)] px-3 py-2 text-xs hover:bg-white/5">
                Markdown 草稿
              </Link>
              <a href="/api/briefing/markdown" className="rounded border border-[var(--line)] px-3 py-2 text-xs text-[var(--accent-2)] hover:bg-white/5">
                原始 Markdown
              </a>
            </div>
          </div>
          <h2 className="max-w-4xl text-2xl font-semibold leading-8 max-[560px]:text-xl">{evidenceBrief.headline}</h2>
          <div className="mt-5 grid grid-cols-4 gap-3 max-[980px]:grid-cols-2 max-[560px]:grid-cols-1">
            <MetricCard label="可直接引用" value={evidenceBrief.directlyUsableEvidence} detail="A/B 且 FACT" />
            <MetricCard label="需内部验证" value={evidenceBrief.riskyEvidence} detail="CLAIM、GAP、C/D 等" />
            <MetricCard label="未归档风险" value={evidenceBrief.unlinkedRiskyEvidence} detail="尚未匹配验证任务" />
            <MetricCard label="风险公司" value={evidenceBrief.companyRiskRanking.filter((item) => item.riskyEvidence > 0).length} detail="存在风险证据" />
          </div>
        </article>

        <div className="grid grid-cols-[0.9fr_1.1fr] gap-4 max-[1000px]:grid-cols-1">
          <article className="panel overflow-hidden">
            <div className="border-b border-[var(--line)] px-4 py-3 font-semibold">四家公司证据风险排序</div>
            <div className="divide-y divide-[var(--line)]">
              {evidenceBrief.companyRiskRanking.map((item) => (
                <div key={item.company} className="grid grid-cols-[1fr_repeat(3,80px)] gap-3 px-4 py-3 text-xs max-[640px]:grid-cols-2">
                  <span className="font-semibold">{item.company}</span>
                  <span><span className="text-[var(--muted)]">强</span> {item.strongEvidence}</span>
                  <span><span className="text-[var(--muted)]">风险</span> {item.riskyEvidence}</span>
                  <span className={item.unlinkedRiskyEvidence > 0 ? "text-amber-300" : "text-[var(--muted)]"}><span>未归档</span> {item.unlinkedRiskyEvidence}</span>
                </div>
              ))}
            </div>
          </article>

          <article className="panel overflow-hidden">
            <div className="border-b border-[var(--line)] px-4 py-3 font-semibold">Top 风险判断</div>
            <div className="divide-y divide-[var(--line)]">
              {evidenceBrief.topRiskEvidence.map((item) => (
                <Link key={item.evidenceId} href={item.href} className="grid grid-cols-[150px_1fr_120px] gap-3 px-4 py-3 text-sm hover:bg-white/5 max-[760px]:grid-cols-1">
                  <span className="metric-number text-[var(--accent)]">{item.evidenceId}</span>
                  <span>
                    <span className="font-semibold">{item.company} · {item.topic}</span>
                    <br />
                    <span className="text-xs leading-5 text-[var(--muted)]">{item.summary}</span>
                  </span>
                  <span className="text-xs text-[var(--muted)]">{item.grade} · {item.status}<br />引用 {item.linkedProductsOrScenarios}</span>
                </Link>
              ))}
            </div>
          </article>
        </div>

        <div className="grid grid-cols-[1fr_1fr] gap-4 max-[1000px]:grid-cols-1">
          <article className="panel overflow-hidden">
            <div className="border-b border-[var(--line)] px-4 py-3 font-semibold">Top 内部验证任务</div>
            <div className="divide-y divide-[var(--line)]">
              {evidenceBrief.topValidationActions.map((item) => (
                <Link key={item.id} href={item.href} className="grid grid-cols-[74px_1fr_auto] gap-3 px-4 py-3 text-sm hover:bg-white/5 max-[680px]:grid-cols-1">
                  <span className="rounded border border-[var(--accent-2)] px-2 py-1 text-center text-xs text-[var(--accent-2)]">{item.priority}</span>
                  <span><span className="font-semibold">{item.title}</span><br /><span className="text-xs text-[var(--muted)]">{item.detail}</span></span>
                  <ArrowUpRight size={15} className="text-[var(--muted)]" />
                </Link>
              ))}
            </div>
          </article>

          <article className="panel overflow-hidden">
            <div className="border-b border-[var(--line)] px-4 py-3 font-semibold">判断使用边界</div>
            <div className="divide-y divide-[var(--line)]">
              {evidenceBrief.usageBoundaries.map((item) => (
                <div key={item.label} className="grid grid-cols-[130px_80px_1fr] gap-3 px-4 py-3 text-sm max-[680px]:grid-cols-1">
                  <span className="font-semibold">{item.label}</span>
                  <span className="metric-number text-[var(--accent)]">{item.count}</span>
                  <span className="text-xs leading-5 text-[var(--muted)]">{item.rule}</span>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="mb-5 grid grid-cols-[1fr_1fr] gap-4 max-[980px]:grid-cols-1">
        <article className="panel p-5">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold">
            <Users size={18} className="text-[var(--accent-2)]" />
            行动清单
          </div>
          <div className="grid gap-4">
            {Object.entries(brief.actionPlan).map(([owner, actions]) => (
              <div key={owner} className="rounded border border-[var(--line)] p-4">
                <div className="mb-3 text-sm font-semibold">{ownerLabels[owner as keyof typeof ownerLabels]}</div>
                {actions.length ? (
                  <div className="grid gap-2">
                    {actions.slice(0, 3).map((action) => (
                      <p key={action} className="flex gap-2 text-sm leading-6 text-[var(--muted)]">
                        <CheckCircle2 size={15} className="mt-1 shrink-0 text-[var(--accent-2)]" />
                        {action}
                      </p>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-[var(--muted)]">暂无高优先级动作。</p>
                )}
              </div>
            ))}
          </div>
        </article>

        <article className="panel p-5">
          <div className="mb-4 text-sm font-semibold">证据摘录</div>
          <div className="grid gap-3">
            {brief.evidenceHighlights.map((item) => (
              <p key={item} className="rounded border border-[var(--line)] p-3 text-sm leading-6 text-[var(--muted)]">
                {item}
              </p>
            ))}
          </div>
        </article>
      </section>

      <section className="panel p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="text-sm font-semibold">观察名单</div>
          <span className="text-xs text-[var(--muted)]">{repo.getAnalyses().length} 个竞品正在跟踪</span>
        </div>
        <div className="grid grid-cols-2 gap-3 max-[760px]:grid-cols-1">
          {brief.watchlist.length ? (
            brief.watchlist.map((item) => (
              <Link
                key={item.competitorId}
                href={`/competitors/${item.competitorId}`}
                className="rounded border border-[var(--line)] p-4 hover:bg-white/5"
              >
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="font-semibold">{item.competitorName}</span>
                  <StatusBadge value={item.threatLevel} />
                </div>
                <p className="text-sm leading-6 text-[var(--muted)]">{item.judgment}</p>
              </Link>
            ))
          ) : (
            <p className="text-sm text-[var(--muted)]">目前没有新增观察对象。</p>
          )}
        </div>
      </section>
    </AppShell>
  );
}
