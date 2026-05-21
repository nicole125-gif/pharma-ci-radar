import { Check, Play, X } from "lucide-react";
import { reviewSalesIntelAction, runMonitorAction, reviewScoreSuggestionAction, reviewSourceAction } from "@/app/actions";

export function RunMonitorButton() {
  return (
    <form action={runMonitorAction}>
      <button className="inline-flex items-center gap-2 rounded bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-black transition hover:brightness-110">
        <Play size={16} />
        运行一次监测
      </button>
    </form>
  );
}

export function SourceReviewButtons({ sourceId }: { sourceId: string }) {
  return (
    <div className="flex gap-2">
      <form action={reviewSourceAction}>
        <input type="hidden" name="sourceId" value={sourceId} />
        <input type="hidden" name="reviewStatus" value="APPROVED" />
        <button className="inline-flex items-center gap-1 rounded border border-emerald-300/40 px-3 py-1.5 text-xs text-emerald-100 hover:bg-emerald-400/10">
          <Check size={14} />
          批准
        </button>
      </form>
      <form action={reviewSourceAction}>
        <input type="hidden" name="sourceId" value={sourceId} />
        <input type="hidden" name="reviewStatus" value="REJECTED" />
        <button className="inline-flex items-center gap-1 rounded border border-red-300/40 px-3 py-1.5 text-xs text-red-100 hover:bg-red-400/10">
          <X size={14} />
          拒绝
        </button>
      </form>
    </div>
  );
}

export function ScoreSuggestionButtons({ suggestionId }: { suggestionId: string }) {
  return (
    <div className="flex gap-2">
      <form action={reviewScoreSuggestionAction}>
        <input type="hidden" name="suggestionId" value={suggestionId} />
        <input type="hidden" name="approve" value="true" />
        <button className="inline-flex items-center gap-1 rounded border border-emerald-300/40 px-3 py-1.5 text-xs text-emerald-100 hover:bg-emerald-400/10">
          <Check size={14} />
          采用
        </button>
      </form>
      <form action={reviewScoreSuggestionAction}>
        <input type="hidden" name="suggestionId" value={suggestionId} />
        <input type="hidden" name="approve" value="false" />
        <button className="inline-flex items-center gap-1 rounded border border-zinc-300/40 px-3 py-1.5 text-xs text-zinc-100 hover:bg-zinc-400/10">
          <X size={14} />
          驳回
        </button>
      </form>
    </div>
  );
}

export function SalesIntelReviewButtons({ intelId }: { intelId: string }) {
  return (
    <div className="flex gap-2">
      <form action={reviewSalesIntelAction}>
        <input type="hidden" name="intelId" value={intelId} />
        <input type="hidden" name="status" value="ACCEPTED" />
        <button className="inline-flex items-center gap-1 rounded border border-emerald-300/40 px-3 py-1.5 text-xs text-emerald-100 hover:bg-emerald-400/10">
          <Check size={14} />
          采纳
        </button>
      </form>
      <form action={reviewSalesIntelAction}>
        <input type="hidden" name="intelId" value={intelId} />
        <input type="hidden" name="status" value="REJECTED" />
        <button className="inline-flex items-center gap-1 rounded border border-zinc-300/40 px-3 py-1.5 text-xs text-zinc-100 hover:bg-zinc-400/10">
          <X size={14} />
          不采纳
        </button>
      </form>
    </div>
  );
}
