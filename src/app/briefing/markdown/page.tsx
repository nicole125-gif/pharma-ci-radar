import Link from "next/link";
import { ArrowLeft, Download } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { loadKnowledgeCatalog } from "@/lib/knowledge/catalog";
import {
  buildExecutiveEvidenceBrief,
  renderExecutiveEvidenceBriefMarkdown
} from "@/lib/knowledge/executive-brief";

export default async function BriefingMarkdownPage() {
  const catalog = await loadKnowledgeCatalog();
  const markdown = renderExecutiveEvidenceBriefMarkdown(
    buildExecutiveEvidenceBrief(catalog)
  );

  return (
    <AppShell>
      <PageHeader
        eyebrow="Markdown Draft"
        title="管理层简报草稿"
        description="面向内部审稿的 Markdown 版本，保留证据边界、风险判断和验证任务。"
      />

      <div className="mb-4 flex flex-wrap gap-3">
        <Link
          href="/briefing"
          className="inline-flex items-center gap-2 rounded border border-[var(--line)] px-3 py-2 text-sm hover:bg-white/5"
        >
          <ArrowLeft size={16} />
          返回简报
        </Link>
        <a
          href="/api/briefing/markdown"
          className="inline-flex items-center gap-2 rounded bg-[var(--accent)] px-3 py-2 text-sm font-semibold text-black"
        >
          <Download size={16} />
          打开 Markdown
        </a>
      </div>

      <section className="panel overflow-hidden">
        <div className="border-b border-[var(--line)] px-4 py-3 text-sm font-semibold">
          Markdown 预览
        </div>
        <pre className="max-h-[72vh] overflow-auto whitespace-pre-wrap p-4 text-sm leading-6 text-[var(--muted)]">
          {markdown}
        </pre>
      </section>
    </AppShell>
  );
}
