import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { getRepository } from "@/lib/repository";

export default async function CompetitorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const detail = getRepository().getCompetitorDetail(id);
  const dimensions = getRepository().getMatrix().dimensions;
  if (!detail) notFound();

  return (
    <AppShell>
      <PageHeader
        eyebrow={detail.competitor.role === "OWN_COMPANY" ? "Own baseline" : "Competitor"}
        title={detail.competitor.name}
        description={detail.analysis.oneLineJudgment}
      />
      <section className="mb-5 grid grid-cols-[1fr_220px] gap-5 max-[900px]:grid-cols-1">
        <div className="panel p-5">
          <h2 className="mb-3 text-lg font-semibold">战略解读</h2>
          <div className="grid gap-4 text-sm leading-6 text-[var(--muted)]">
            <div>
              <div className="mb-1 font-semibold text-[var(--foreground)]">当前定位</div>
              {detail.analysis.currentPositioning}
            </div>
            <div>
              <div className="mb-1 font-semibold text-[var(--foreground)]">可能意图</div>
              {detail.analysis.strategicIntent}
            </div>
          </div>
        </div>
        <div className="panel p-5">
          <div className="text-sm text-[var(--muted)]">威胁等级</div>
          <div className="mt-3">
            <StatusBadge value={detail.analysis.threatLevel} />
          </div>
          <div className="mt-5 text-sm text-[var(--muted)]">证据可信度</div>
          <div className="metric-number mt-2 text-2xl font-semibold">{detail.analysis.confidence}</div>
        </div>
      </section>
      <section className="mb-5 grid grid-cols-2 gap-5 max-[980px]:grid-cols-1">
        <div className="panel p-5">
          <h2 className="mb-4 text-lg font-semibold">对 Bürkert 的影响</h2>
          <div className="grid gap-3 text-sm leading-6 text-[var(--muted)]">
            {Object.entries(detail.analysis.impactOnBurkert).map(([key, value]) => (
              <div key={key} className="rounded border border-[var(--line)] p-3">
                <div className="mb-1 font-semibold capitalize text-[var(--foreground)]">{key.replace(/([A-Z])/g, " $1")}</div>
                {value}
              </div>
            ))}
          </div>
        </div>
        <div className="panel p-5">
          <h2 className="mb-4 text-lg font-semibold">建议动作</h2>
          <div className="grid gap-3">
            {detail.analysis.recommendedActions.map((item) => (
              <div key={`${item.owner}-${item.action}`} className="rounded border border-[var(--line)] p-3">
                <div className="mb-1 text-sm font-semibold text-[var(--accent-2)]">{item.owner}</div>
                <p className="text-sm leading-6 text-[var(--muted)]">{item.action}</p>
              </div>
            ))}
          </div>
          <h3 className="mb-2 mt-5 text-sm font-semibold">可攻击点 / 不确定性</h3>
          <ul className="grid gap-2 text-sm leading-6 text-[var(--muted)]">
            {detail.analysis.weaknesses.map((weakness) => (
              <li key={weakness}>{weakness}</li>
            ))}
          </ul>
        </div>
      </section>
      <section className="grid grid-cols-[0.85fr_1.15fr] gap-5 max-[980px]:grid-cols-1">
        <div className="panel p-5">
          <h2 className="mb-4 text-lg font-semibold">来源</h2>
          <div className="grid gap-3">
            {detail.sources.length ? (
              detail.sources.map((source) => (
                <div key={source.id} className="rounded border border-[var(--line)] p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm">{source.sourceType}</span>
                    <StatusBadge value={source.reviewStatus} />
                  </div>
                  <p className="mt-2 break-words text-xs leading-5 text-[var(--muted)]">{source.url}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-[var(--muted)]">我方基准不需要自动来源审核。</p>
            )}
          </div>
        </div>
        <div className="panel p-5">
          <h2 className="mb-4 text-lg font-semibold">最新情报</h2>
          <div className="grid gap-3">
            {detail.events.map((event) => (
              <div key={event.id} className="rounded border border-[var(--line)] p-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium">{event.eventType}</span>
                  <StatusBadge value={event.impactLevel} />
                </div>
                <p className="text-sm leading-6 text-[var(--muted)]">{event.summary}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="mt-5 panel overflow-hidden">
        <div className="border-b border-[var(--line)] p-5">
          <h2 className="text-lg font-semibold">历史评分参考</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">来自 Excel 专家输入，用作背景参考，不作为系统最终判断。</p>
        </div>
        <div className="grid grid-cols-2 gap-px bg-[var(--line)] max-[760px]:grid-cols-1">
          {detail.scores.map((score) => {
            const dimension = dimensions.find((item) => item.id === score.dimensionId);
            return (
              <div key={score.dimensionId} className="bg-[var(--panel)] p-4">
                <div className="text-sm text-[var(--muted)]">{dimension?.name}</div>
                <div className="metric-number mt-2 text-2xl font-semibold">{score.value}</div>
              </div>
            );
          })}
        </div>
      </section>
    </AppShell>
  );
}
