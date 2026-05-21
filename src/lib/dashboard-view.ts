import type { DashboardData } from "./repository";
import type { ActionQueueItem, Competitor, IntelEvent, ThreatLevel } from "./types";

export interface DashboardSignal {
  label: string;
  value: string;
  detail: string;
}

export interface DashboardView {
  heroVerdict: string;
  heroSignals: DashboardSignal[];
  actionQueue: ActionQueueItem[];
  recentEvents: IntelEvent[];
  focusCompetitorName: string;
}

export function buildDashboardView(dashboard: DashboardData): DashboardView {
  const topAnalysis = dashboard.topAnalyses[0];
  const focusCompetitor = dashboard.competitors.find((competitor) => competitor.id === topAnalysis?.competitorId);
  const openActions = dashboard.actionQueue.slice(0, 5);
  const recentEvents = dashboard.recentEvents.slice(0, 5);

  return {
    heroVerdict: buildHeroVerdict(focusCompetitor, topAnalysis?.threatLevel),
    heroSignals: [
      {
        label: "首要防守",
        value: focusCompetitor?.name ?? "暂无",
        detail: focusCompetitor ? "当前最需要跟踪的直接竞品" : "还没有形成明确的首要威胁"
      },
      {
        label: "优先动作",
        value: openActions[0]?.title ?? "暂无待办",
        detail: openActions[0]?.detail ?? "没有打开的人工处理事项"
      },
      {
        label: "处理原则",
        value: "人工确认",
        detail: "AI 建议只做参考，不直接改分"
      }
    ],
    actionQueue: openActions,
    recentEvents,
    focusCompetitorName: focusCompetitor?.name ?? "暂无重点竞品"
  };
}

function buildHeroVerdict(competitor: Competitor | undefined, threatLevel: ThreatLevel | undefined) {
  if (!competitor) {
    return "当前没有足够明确的威胁信号，建议继续观察与补充证据。";
  }

  const tone = threatLevel === "HIGH" ? "最需要防守" : threatLevel === "MEDIUM" ? "值得持续关注" : "暂列观察";
  return `${competitor.name} 仍是本周 ${tone} 的竞品；首页先看人工待办，再看最新事件。`;
}
