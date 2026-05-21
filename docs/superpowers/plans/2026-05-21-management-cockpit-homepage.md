# Management Cockpit Homepage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the homepage into a management-first cockpit that surfaces the weekly judgment, the most urgent actions, and the latest competitor changes in one fast-scannable screen.

**Architecture:** Keep the business data in `src/lib/repository.ts`, but move homepage-specific derivation into a tiny pure view model so the page stays readable. The page will render that view model into a tighter executive layout with a stronger first screen, a prioritized action queue, and a clearer event feed. No backend schema change is needed for this pass.

**Tech Stack:** Next.js App Router, TypeScript, React Server Components, Tailwind CSS, Vitest.

---

### Task 1: Add a homepage view model with test coverage

**Files:**
- Create: `src/lib/dashboard-view.ts`
- Create: `src/lib/__tests__/dashboard-view.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from "vitest";
import { createAppRepository } from "../repository";
import { buildDashboardView } from "../dashboard-view";

describe("dashboard view model", () => {
  it("turns repository dashboard data into an executive-first layout model", () => {
    const repo = createAppRepository();
    const dashboard = repo.getDashboard();
    const view = buildDashboardView(dashboard);

    expect(view.heroVerdict).toContain("Gemu");
    expect(view.heroSignals).toHaveLength(3);
    expect(view.actionQueue[0].category).toBe("FIELD_INTEL");
    expect(view.recentEvents[0].impactLevel).toBe("HIGH");
    expect(view.recentEvents.length).toBeLessThanOrEqual(5);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- src/lib/__tests__/dashboard-view.test.ts`
Expected: FAIL because `buildDashboardView` does not exist yet.

- [ ] **Step 3: Write the minimal implementation**

```ts
import type { DashboardData } from "./repository";

export function buildDashboardView(dashboard: DashboardData) {
  const topAnalysis = dashboard.topAnalyses[0];
  const topCompetitor = dashboard.competitors.find((competitor) => competitor.id === topAnalysis?.competitorId);

  return {
    heroVerdict: topAnalysis
      ? `${topCompetitor?.name ?? "The leading competitor"} remains the primary focus this week.`
      : "No immediate competitor requires escalation this week.",
    heroSignals: [
      {
        label: "首要防守",
        value: topCompetitor?.name ?? "None",
        detail: "优先处理最强威胁"
      },
      {
        label: "优先动作",
        value: dashboard.actionQueue[0]?.title ?? "No open work",
        detail: "今日先做什么"
      },
      {
        label: "管理原则",
        value: "人工确认",
        detail: "AI 建议不直接改分"
      }
    ],
    actionQueue: dashboard.actionQueue.slice(0, 5),
    recentEvents: dashboard.recentEvents.slice(0, 5)
  };
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- src/lib/__tests__/dashboard-view.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/dashboard-view.ts src/lib/__tests__/dashboard-view.test.ts
git commit -m "test: add dashboard view model coverage"
```

### Task 2: Rebuild the homepage as a management cockpit

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Update the failing page layout**

Replace the current stacked homepage sections with a three-part executive layout:

```tsx
const dashboard = getRepository().getDashboard();
const view = buildDashboardView(dashboard);

return (
  <AppShell>
    <PageHeader
      eyebrow="Executive radar"
      title="Pharma & Biotech 竞争情报解读"
      description="分数只是历史专家参考；首页优先展示对竞品意图、威胁等级、证据可信度和 Bürkert 应对动作的判断。"
      action={<RunMonitorButton />}
    />

    <section className="grid grid-cols-[1.15fr_0.85fr] gap-5 max-[1050px]:grid-cols-1">
      <section className="panel p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-[var(--accent-2)]">本周重点判断</div>
            <h2 className="mt-2 text-2xl font-semibold">{view.heroVerdict}</h2>
          </div>
          <span className="rounded border border-[var(--line)] px-3 py-1 text-xs text-[var(--muted)]">管理层视图</span>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-3 max-[760px]:grid-cols-1">
          {view.heroSignals.map((signal) => (
            <MiniSignal key={signal.label} label={signal.label} value={signal.value} detail={signal.detail} />
          ))}
        </div>
      </section>

      <section className="panel p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="text-sm font-semibold text-[var(--accent)]">今日行动队列</div>
          <span className="metric-number rounded border border-[var(--line)] px-2 py-1 text-xs text-[var(--muted)]">
            {view.actionQueue.length} OPEN
          </span>
        </div>
        <div className="grid gap-3">
          {view.actionQueue.map((item) => (
            <ActionRow key={item.id} item={item} />
          ))}
        </div>
      </section>
    </section>

    <section className="mt-5 grid grid-cols-[1.15fr_0.85fr] gap-5 max-[1050px]:grid-cols-1">
      <div className="panel p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">本周管理层摘要</h2>
          <Clock3 size={20} className="text-[var(--accent-2)]" />
        </div>
        <p className="text-base leading-7">{dashboard.weeklyBrief.executiveSummary}</p>
        <div className="mt-5 grid grid-cols-2 gap-4 max-[760px]:grid-cols-1">
          <SummaryColumn title="风险" items={dashboard.weeklyBrief.keyRisks} tone="danger" />
          <SummaryColumn title="机会" items={dashboard.weeklyBrief.keyOpportunities} tone="success" />
        </div>
      </div>
      <div className="panel p-5">
        <h2 className="text-lg font-semibold">高优先级解读</h2>
        <div className="mt-4 grid gap-3">
          {dashboard.topAnalyses.slice(0, 4).map((analysis) => (
            <AnalysisRow key={analysis.competitorId} analysis={analysis} competitors={dashboard.competitors} />
          ))}
        </div>
      </div>
    </section>

    <section className="mt-5 panel overflow-hidden">
      <div className="border-b border-[var(--line)] p-5">
        <h2 className="text-lg font-semibold">重大变化</h2>
      </div>
      <div className="divide-y divide-[var(--line)]">
        {view.recentEvents.map((event) => (
          <EventRow key={event.id} event={event} />
        ))}
      </div>
    </section>
  </AppShell>
);
```

Keep the existing quick-entry cards at the bottom, but tighten the wording so each card is a direct action path rather than a descriptive paragraph.

- [ ] **Step 2: Wire the page to the new view model**

Import and use `buildDashboardView` from `src/lib/dashboard-view.ts`, and keep the page-local helpers purely presentational: `MiniSignal`, `ActionRow`, `SummaryColumn`, `AnalysisRow`, and `EventRow`.

- [ ] **Step 3: Run the homepage through type-checking mentally while editing**

Pay attention to the shape of `dashboard.actionQueue`, `dashboard.recentEvents`, and `dashboard.topAnalyses` so the render code stays aligned with the repository model and does not invent new fields.

- [ ] **Step 4: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: reshape homepage into management cockpit"
```

### Task 3: Verify the full app still behaves cleanly

**Files:**
- Modify: none, verification only

- [ ] **Step 1: Run the test suite**

Run: `npm test`
Expected: all existing tests pass, including the new dashboard view model test.

- [ ] **Step 2: Run TypeScript and production build**

Run: `npx tsc --noEmit`
Expected: no errors.

Run: `npm run build`
Expected: production build succeeds and the homepage route still appears in the route summary.

- [ ] **Step 3: Open the homepage in the browser**

Check that the first screen now answers these questions without scrolling:
1. What is the main weekly judgment?
2. What needs human action today?
3. What changed most recently?

- [ ] **Step 4: Commit the verification note if needed**

```bash
git add .
git commit -m "test: verify management cockpit homepage"
```
