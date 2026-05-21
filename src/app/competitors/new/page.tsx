import { Plus } from "lucide-react";
import { createCompetitorAction } from "@/app/actions";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";

export default function NewCompetitorPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Add competitor"
        title="新增竞品"
        description="新增竞品会默认进入 Pharma & Biotech，并自动生成官网和招聘页候选来源。来源仍需人工审核后才会进入监测。"
      />

      <form action={createCompetitorAction} className="panel grid max-w-3xl gap-5 p-5">
        <label className="grid gap-2 text-sm">
          竞品名称
          <input
            name="name"
            required
            placeholder="例如 Watson-Marlow"
            className="rounded border border-[var(--line)] bg-black/20 px-3 py-2 outline-none focus:border-[var(--accent-2)]"
          />
        </label>
        <label className="grid gap-2 text-sm">
          官网 URL
          <input
            name="officialUrl"
            placeholder="https://www.example.com"
            className="rounded border border-[var(--line)] bg-black/20 px-3 py-2 outline-none focus:border-[var(--accent-2)]"
          />
        </label>
        <label className="grid gap-2 text-sm">
          差异化描述
          <textarea
            name="differentiation"
            rows={5}
            placeholder="写下它为什么值得监测、在哪些应用/产品上构成竞争。"
            className="resize-none rounded border border-[var(--line)] bg-black/20 px-3 py-2 leading-6 outline-none focus:border-[var(--accent-2)]"
          />
        </label>
        <div>
          <button className="inline-flex items-center gap-2 rounded bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-black hover:brightness-110">
            <Plus size={16} />
            创建竞品
          </button>
        </div>
      </form>
    </AppShell>
  );
}
