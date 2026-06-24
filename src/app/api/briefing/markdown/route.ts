import { loadKnowledgeCatalog } from "@/lib/knowledge/catalog";
import {
  buildExecutiveEvidenceBrief,
  renderExecutiveEvidenceBriefMarkdown
} from "@/lib/knowledge/executive-brief";

export async function GET() {
  const catalog = await loadKnowledgeCatalog();
  const brief = buildExecutiveEvidenceBrief(catalog);
  const markdown = renderExecutiveEvidenceBriefMarkdown(brief);

  return new Response(markdown, {
    headers: {
      "content-disposition": 'inline; filename="burkert-pharma-ci-executive-brief.md"',
      "content-type": "text/markdown; charset=utf-8"
    }
  });
}
