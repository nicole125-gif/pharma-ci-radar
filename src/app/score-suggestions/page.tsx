import { AppShell } from "@/components/app-shell";
import { ScoreSuggestionButtons } from "@/components/forms";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { getRepository } from "@/lib/repository";

export default async function ScoreSuggestionsPage() {
  const repo = await getRepository();
  const suggestions = repo.getScoreSuggestions();
  const competitors = repo.getCompetitors();
  const dimensions = repo.getMatrix().dimensions;

  return (
    <AppShell>
      <PageHeader
        eyebrow="Human approval"
        title="评分建议"
        description="AI 根据新情报提出分数变化和理由。采用后才更新评分矩阵；驳回会保留审计痕迹。"
      />
      <section className="grid gap-4">
        {suggestions.map((suggestion) => {
          const competitor = competitors.find((item) => item.id === suggestion.competitorId);
          const dimension = dimensions.find((item) => item.id === suggestion.dimensionId);
          return (
            <article key={suggestion.id} className="panel p-4">
              <div className="flex items-start justify-between gap-4 max-[760px]:grid">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-semibold">{competitor?.name}</h2>
                    <StatusBadge value={suggestion.status} />
                  </div>
                  <p className="mt-1 text-sm text-[var(--muted)]">{dimension?.name}</p>
                </div>
                <div className="metric-number rounded border border-[var(--line)] px-3 py-2">
                  {suggestion.previousScore} → {suggestion.suggestedScore}
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-[var(--muted)]">{suggestion.rationale}</p>
              {suggestion.status === "PENDING" ? (
                <div className="mt-4">
                  <ScoreSuggestionButtons suggestionId={suggestion.id} />
                </div>
              ) : null}
            </article>
          );
        })}
      </section>
    </AppShell>
  );
}
