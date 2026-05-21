export function PageHeader({
  eyebrow,
  title,
  description,
  action
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <header className="mb-6 flex items-start justify-between gap-4 max-[760px]:grid">
      <div>
        <div className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent-2)]">{eyebrow}</div>
        <h1 className="text-3xl font-semibold tracking-normal text-[var(--foreground)] max-[520px]:text-2xl">{title}</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--muted)]">{description}</p>
      </div>
      {action}
    </header>
  );
}
