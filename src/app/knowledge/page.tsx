import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { KnowledgeNav } from "@/components/knowledge/knowledge-nav";
import { KnowledgeWorkbench } from "@/components/knowledge/knowledge-workbench";
import { EvidenceQa } from "@/components/knowledge/evidence-qa";
import { ProductSearch } from "@/components/knowledge/product-search";
import { TrainingWorkspace } from "@/components/knowledge/training-workspace";
import { ValidationWorkspace } from "@/components/knowledge/validation-workspace";
import { searchKnowledge, type KnowledgeSearchFilters } from "@/lib/knowledge/search";
import { buildKnowledgeWorkspace } from "@/lib/knowledge/service";
import { buildEvidenceTraceMap } from "@/lib/knowledge/traceability";
import { buildEvidenceValidationMap, buildValidationEvidenceMap } from "@/lib/knowledge/validation-linking";
import type { EvidenceGrade, FactStatus, KnowledgeCompany, KnowledgeRecordType, PharmaRelevance } from "@/lib/knowledge/types";

type View = "workbench" | "products" | "training" | "validation" | "evidence";
function normalizeView(value?: string): View {
  return value === "products" || value === "training" || value === "validation" || value === "evidence" ? value : "workbench";
}

export default async function KnowledgePage({
  searchParams
}: {
  searchParams: Promise<{ view?: string; q?: string; company?: string; category?: string; relevance?: string; type?: string; learner?: string; priority?: string; grade?: string; status?: string; risk?: string }>;
}) {
  const params = await searchParams;
  const view = normalizeView(params.view);
  const workspace = await buildKnowledgeWorkspace({ learnerId: params.learner });
  const filters: KnowledgeSearchFilters = {
    query: params.q,
    company: (params.company || "ALL") as KnowledgeCompany | "ALL",
    category: params.category || undefined,
    pharmaRelevance: (params.relevance || "ALL") as PharmaRelevance | "ALL",
    recordType: (params.type || "ALL") as KnowledgeRecordType | "ALL"
  };
  const results = view === "products" ? searchKnowledge(workspace.catalog, filters) : [];
  const categories = [...new Set(workspace.catalog.products.map((item) => item.category))].sort((a, b) => a.localeCompare(b, "zh-CN"));
  const evidenceTraceMap = view === "evidence" ? buildEvidenceTraceMap(workspace.catalog) : {};
  const evidenceValidationMap = view === "evidence" ? buildEvidenceValidationMap(workspace.catalog.evidenceRecords, workspace.catalog.validationTasks) : {};
  const validationEvidenceMap = view === "validation" ? buildValidationEvidenceMap(workspace.catalog.evidenceRecords, workspace.catalog.validationTasks) : {};

  return (
    <AppShell>
      <PageHeader eyebrow="Product manager workspace" title="产品知识中心" description="从客户任务出发，检索四家公司产品与制药场景，并在同一处推进训练和内部验证。" />
      <KnowledgeNav activeView={view} />
      {view === "workbench" && <KnowledgeWorkbench summary={workspace.summary} evidenceHealth={workspace.evidenceHealth} database={workspace.database} validationTasks={workspace.validation.tasks} learners={workspace.training.learners} />}
      {view === "products" && <ProductSearch filters={filters} results={results} categories={categories} />}
      {view === "training" && <TrainingWorkspace curriculum={workspace.catalog.curriculum} learners={workspace.training.learners} selectedLearner={workspace.training.selectedLearner} progress={workspace.training.progress} scores={workspace.training.scores} readOnly={!workspace.database.available} />}
      {view === "validation" && <ValidationWorkspace tasks={workspace.validation.tasks} evidence={workspace.validation.evidence} publicEvidenceByTask={validationEvidenceMap} readOnly={!workspace.database.available} priority={params.priority} company={params.company} query={params.q} />}
      {view === "evidence" && <EvidenceQa evidence={workspace.catalog.evidenceRecords} traceMap={evidenceTraceMap} validationMap={evidenceValidationMap} filters={{ query: params.q, company: params.company, grade: (params.grade || "ALL") as EvidenceGrade | "ALL", status: (params.status || "ALL") as FactStatus | "ALL", risk: (params.risk || "ALL") as "ALL" | "NEEDS_VALIDATION" | "UNLINKED" }} />}
    </AppShell>
  );
}
