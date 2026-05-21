import { AppShell } from "@/components/app-shell";
import { SourceReviewButtons } from "@/components/forms";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { getRepository } from "@/lib/repository";

export default function SourcesPage() {
  const repo = getRepository();
  const sources = repo.getSources();
  const competitors = repo.getCompetitors();

  return (
    <AppShell>
      <PageHeader
        eyebrow="Source review"
        title="来源审核"
        description="自动发现的官网、招聘页、新闻页等先进入候选池。只有批准后的来源会进入监测任务，避免抓错区域站点或同名公司。"
      />
      <section className="panel overflow-hidden">
        <div className="grid grid-cols-[150px_130px_120px_1fr_160px] gap-3 border-b border-[var(--line)] p-4 text-xs uppercase tracking-[0.12em] text-[var(--muted)] max-[900px]:hidden">
          <div>竞品</div>
          <div>类型</div>
          <div>状态</div>
          <div>URL</div>
          <div>操作</div>
        </div>
        <div className="divide-y divide-[var(--line)]">
          {sources.map((source) => {
            const competitor = competitors.find((item) => item.id === source.competitorId);
            return (
              <div key={source.id} className="grid grid-cols-[150px_130px_120px_1fr_160px] gap-3 p-4 text-sm max-[900px]:grid-cols-1">
                <div className="font-medium">{competitor?.name}</div>
                <div>{source.sourceType}</div>
                <StatusBadge value={source.reviewStatus} />
                <div className="break-words text-[var(--muted)]">{source.url}</div>
                <div>{source.reviewStatus === "CANDIDATE" ? <SourceReviewButtons sourceId={source.id} /> : null}</div>
              </div>
            );
          })}
        </div>
      </section>
    </AppShell>
  );
}
