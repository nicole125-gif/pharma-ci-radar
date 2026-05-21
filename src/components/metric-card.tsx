export function MetricCard({ label, value, detail }: { label: string; value: string | number; detail: string }) {
  return (
    <div className="panel p-4">
      <div className="text-sm text-[var(--muted)]">{label}</div>
      <div className="metric-number mt-3 text-3xl font-semibold">{value}</div>
      <div className="mt-2 text-xs leading-5 text-[var(--muted)]">{detail}</div>
    </div>
  );
}
