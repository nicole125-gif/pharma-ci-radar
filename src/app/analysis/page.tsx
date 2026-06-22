import Link from "next/link";
import { ArrowUpRight, BrainCircuit, ShieldAlert } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { MetricCard } from "@/components/metric-card";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { getRepository } from "@/lib/repository";

export default async function AnalysisPage() {
  const repo = await getRepository();
  const analyses = repo.getAnalyses();
  const highThreatCount = analyses.filter((analysis) => analysis.threatLevel === "HIGH").length;
  const watchingCount = analyses.filter((analysis) => analysis.threatLevel === "WATCHING").length;
  const topJudgment = analyses[0]?.oneLineJudgment ?? "当前没有分析内容。";

  return (
    <AppShell>
      <PageHeader
        eyebrow="Interpretation"
        title="竞品分析中心"
        description="这里不是分数榜，而是把每个竞品的当前定位、战略意图、证据基础和建议动作集中到一个管理层视图。"
      />

      <section className="grid grid-cols-4 gap-4 max-[1100px]:grid-cols-2 max-[620px]:grid-cols-1">
        <MetricCard label="分析对象" value={analyses.length} detail="当前纳入监测的竞品" />
        <MetricCard label="高威胁" value={highThreatCount} detail="需要主动防守" />
        <MetricCard label="观察中" value={watchingCount} detail="继续补充证据" />
        <MetricCard label="首要判断" value={analyses[0]?.threatLevel ?? "N/A"} detail="按威胁等级排序" />
      </section>

      <section className="mt-5 grid grid-cols-[1.1fr_0.9fr] gap-5 max-[1050px]:grid-cols-1">
        <article className="panel p-5">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[var(--accent-2)]">
            <BrainCircuit size={18} />
            管理层判断
          </div>
          <h2 className="text-2xl font-semibold leading-8">{topJudgment}</h2>
          <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
            每个分析都同时保留证据基础、战略意图和建议动作。首页只显示结果，这里是展开细节的地方。
          </p>
        </article>

        <article className="panel p-5">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[var(--accent)]">
            <ShieldAlert size={18} />
            处置优先级
          </div>
          <div className="grid gap-3 text-sm leading-6 text-[var(--muted)]">
            <p>1. 先处理高威胁分析，再看观察中的新增竞品。</p>
            <p>2. 管理层只看判断和动作，销售看话术，产品看证据。</p>
            <p>3. 所有结论都回到人工确认，不直接依赖历史评分。</p>
          </div>
        </article>
      </section>

      <section className="mt-5 grid gap-4">
        {analyses.map((analysis) => (
          <article key={analysis.competitorId} className="panel p-5">
            <div className="flex items-start justify-between gap-4 max-[760px]:grid">
              <div>
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <BrainCircuit size={18} className="text-[var(--accent-2)]" />
                  <h2 className="text-lg font-semibold">{analysis.competitor?.name ?? analysis.competitorId}</h2>
                  <StatusBadge value={analysis.threatLevel} />
                  <span className="rounded border border-[var(--line)] px-2 py-1 text-xs text-[var(--muted)]">
                    Confidence: {analysis.confidence}
                  </span>
                </div>
                <p className="max-w-4xl text-sm leading-6 text-[var(--muted)]">{analysis.oneLineJudgment}</p>
              </div>
              <Link
                href={`/competitors/${analysis.competitorId}`}
                className="inline-flex items-center gap-2 rounded border border-[var(--line)] px-3 py-2 text-sm text-[var(--foreground)] hover:bg-white/5"
              >
                详情
                <ArrowUpRight size={15} />
              </Link>
            </div>

            <div className="mt-5 grid grid-cols-[1fr_1fr] gap-4 max-[900px]:grid-cols-1">
              <DetailCard title="可能战略意图" body={analysis.strategicIntent} />
              <div className="rounded border border-[var(--line)] p-4">
                <div className="mb-2 text-sm font-semibold">下一步动作</div>
                <div className="grid gap-2">
                  {analysis.recommendedActions.slice(0, 2).map((item) => (
                    <p key={`${item.owner}-${item.action}`} className="text-sm leading-6 text-[var(--muted)]">
                      <span className="font-semibold text-[var(--accent-2)]">{item.owner}: </span>
                      {item.action}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </article>
        ))}
      </section>
    </AppShell>
  );
}

function DetailCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded border border-[var(--line)] p-4">
      <div className="mb-2 text-sm font-semibold">{title}</div>
      <p className="text-sm leading-6 text-[var(--muted)]">{body}</p>
    </div>
  );
}
