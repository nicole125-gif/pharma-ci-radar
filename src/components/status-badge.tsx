import type { ImpactLevel, ReviewStatus, ScoreSuggestionStatus } from "@/lib/types";

const styles: Record<string, string> = {
  HIGH: "border-red-400/35 bg-red-500/15 text-red-100",
  MEDIUM: "border-amber-300/35 bg-amber-400/15 text-amber-100",
  LOW: "border-emerald-300/35 bg-emerald-400/15 text-emerald-100",
  WATCHING: "border-blue-300/35 bg-blue-400/15 text-blue-100",
  CANDIDATE: "border-blue-300/35 bg-blue-400/15 text-blue-100",
  APPROVED: "border-emerald-300/35 bg-emerald-400/15 text-emerald-100",
  REJECTED: "border-zinc-400/35 bg-zinc-400/15 text-zinc-200",
  PENDING: "border-amber-300/35 bg-amber-400/15 text-amber-100"
};

export function StatusBadge({ value }: { value: ImpactLevel | ReviewStatus | ScoreSuggestionStatus | string }) {
  return (
    <span className={`inline-flex items-center rounded px-2 py-1 text-xs font-medium ${styles[value] ?? styles.LOW}`}>
      {value}
    </span>
  );
}
