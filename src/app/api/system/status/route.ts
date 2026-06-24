import { NextResponse } from "next/server";
import { getAppStateStore } from "@/lib/app-state-store";
import { getKnowledgeStore } from "@/lib/knowledge/postgres-store";

export async function GET() {
  const [appStore, knowledgeStore] = await Promise.all([
    getAppStateStore(),
    getKnowledgeStore()
  ]);

  const appState = appStore.available
    ? await appStore.loadState()
    : null;

  return NextResponse.json({
    appState: appStore.available
      ? {
          available: true,
          initialized: Boolean(appState),
          sources: appState?.sources.length ?? 0,
          approvedSources:
            appState?.sources.filter((source) => source.reviewStatus === "APPROVED")
              .length ?? 0,
          events: appState?.events.length ?? 0,
          alerts: appState?.alerts.length ?? 0,
          scoreSuggestions: appState?.scoreSuggestions.length ?? 0,
          monitorRuns: appState?.monitorRuns?.length ?? 0,
          lastMonitorRun: appState?.monitorRuns?.[0] ?? null
        }
      : {
          available: false,
          reason: appStore.reason
        },
    knowledgeExecution: knowledgeStore.available
      ? {
          available: true
        }
      : {
          available: false,
          reason: knowledgeStore.reason
        }
  });
}
