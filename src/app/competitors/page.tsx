import Link from "next/link";
import { ArrowUpRight, Plus } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { getRepository } from "@/lib/repository";

export default function CompetitorsPage() {
  const competitors = getRepository().getCompetitors();

  return (
    <AppShell>
      <PageHeader
        eyebrow="Competitive set"
        title="竞品列表"
        description="V1 聚焦 Pharma & Biotech，Bürkert 保留为我方基准，其余公司作为外部竞品监测。"
        action={
          <Link
            href="/competitors/new"
            className="inline-flex items-center gap-2 rounded bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-black hover:brightness-110"
          >
            <Plus size={16} />
            新增竞品
          </Link>
        }
      />
      <section className="grid grid-cols-3 gap-4 max-[1100px]:grid-cols-2 max-[720px]:grid-cols-1">
        {competitors.map((competitor) => (
          <Link key={competitor.id} href={`/competitors/${competitor.id}`} className="panel p-4 transition hover:border-[var(--accent-2)]">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="font-semibold">{competitor.name}</h2>
                <p className="text-xs text-[var(--muted)]">{competitor.role === "OWN_COMPANY" ? "我方基准" : "外部竞品"}</p>
              </div>
              <ArrowUpRight size={17} />
            </div>
            <p className="text-sm leading-6 text-[var(--muted)]">{competitor.differentiation}</p>
          </Link>
        ))}
      </section>
    </AppShell>
  );
}
