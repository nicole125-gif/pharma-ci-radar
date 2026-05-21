import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { getRepository } from "@/lib/repository";

export default function MatrixPage() {
  const { competitors, dimensions, scores } = getRepository().getMatrix();
  const scoreMap = new Map(scores.map((score) => [`${score.competitorId}:${score.dimensionId}`, score.value]));

  return (
    <AppShell>
      <PageHeader
        eyebrow="CI matrix"
        title="历史评分参考"
        description="沿用 Excel 的 P&B 维度，但这些分数只作为专家历史参考。真正的管理判断以竞品详情页的战略解读、证据可信度和建议动作为准。"
      />
      <div className="mb-4 rounded border border-amber-300/25 bg-amber-300/10 p-4 text-sm leading-6 text-amber-50">
        分数不再作为自动排名或结论输出；它们帮助理解历史认知差异，但不会替代对公开信号、客户影响和 Bürkert 应对动作的分析。
      </div>
      <section className="panel overflow-auto">
        <table className="w-full min-w-[1080px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-[var(--line)] bg-white/[0.03]">
              <th className="sticky left-0 bg-[#1a1d18] p-3 text-left font-semibold">维度</th>
              {competitors.map((competitor) => (
                <th key={competitor.id} className={`p-3 text-left font-semibold ${competitor.role === "OWN_COMPANY" ? "text-[var(--accent)]" : ""}`}>
                  {competitor.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dimensions.map((dimension) => (
              <tr key={dimension.id} className="border-b border-[var(--line)] last:border-b-0">
                <td className="sticky left-0 max-w-[280px] bg-[#171a16] p-3">
                  <div className="font-medium">{dimension.name}</div>
                  <div className="mt-1 text-xs leading-5 text-[var(--muted)]">{dimension.description}</div>
                </td>
                {competitors.map((competitor) => {
                  const value = scoreMap.get(`${competitor.id}:${dimension.id}`) ?? 0;
                  return (
                    <td key={competitor.id} className="p-3">
                      <span className={`metric-number rounded px-2 py-1 ${value >= 8 ? "bg-emerald-400/15 text-emerald-100" : value <= 5 ? "bg-red-400/15 text-red-100" : "bg-white/5"}`}>
                        {value.toFixed(1)}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </AppShell>
  );
}
