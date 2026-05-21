import Link from "next/link";
import { ArrowUpRight, CheckCircle2, Search, ShieldAlert, Target, TriangleAlert } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { getRepository } from "@/lib/repository";

const ownerLabel = {
  Management: "管理层",
  Sales: "销售",
  Product: "产品",
  Marketing: "市场"
};

const filterOptions = ["ALL", "HIGH", "MEDIUM"] as const;

export default async function BattlecardsPage({
  searchParams
}: {
  searchParams?: Promise<{
    threat?: string;
    owner?: string;
    q?: string;
  }>;
}) {
  const resolvedSearchParams = await searchParams;
  const cards = getRepository().getBattlecards();
  const selectedThreat = resolvedSearchParams?.threat ?? "ALL";
  const selectedOwner = resolvedSearchParams?.owner ?? "ALL";
  const rawQuery = resolvedSearchParams?.q?.trim() ?? "";
  const selectedQuery = rawQuery.toLowerCase();

  const filteredCards = cards.filter((card) => {
    const threatMatch = selectedThreat === "ALL" || card.threatLevel === selectedThreat;
    const ownerMatch = selectedOwner === "ALL" || card.nextActionOwner === selectedOwner;
    const queryMatch =
      !selectedQuery ||
      [card.competitorName, card.defenseNarrative, ...card.talkTracks, ...card.watchSignals, ...card.proofPoints, ...card.trapsToAvoid]
        .join(" ")
        .toLowerCase()
        .includes(selectedQuery);
    return threatMatch && ownerMatch && queryMatch;
  });

  return (
    <AppShell>
      <PageHeader
        eyebrow="Battlecards"
        title="竞品战术卡"
        description="把分析结果转成可执行话术：销售怎么防守，产品怎么准备证据，管理层该看哪些重复信号。"
      />

      <section className="grid grid-cols-4 gap-4 max-[1100px]:grid-cols-2 max-[620px]:grid-cols-1">
        <MiniMetric label="重点竞品" value={cards.length} detail="高优先级战术卡" />
        <MiniMetric label="高威胁" value={cards.filter((card) => card.threatLevel === "HIGH").length} detail="需要主动防守" />
        <MiniMetric label="销售责任" value={cards.filter((card) => card.nextActionOwner === "Sales").length} detail="需要话术支持" />
        <MiniMetric
          label="当前筛选"
          value={filteredCards.length}
          detail={rawQuery ? `包含“${rawQuery}”` : `${selectedThreat === "ALL" ? "全部威胁" : selectedThreat} · ${selectedOwner === "ALL" ? "全部负责人" : ownerLabel[selectedOwner as keyof typeof ownerLabel]}`}
        />
      </section>

      <section className="mt-5 grid gap-3 rounded border border-[var(--line)] bg-[var(--panel-strong)] p-4">
        <form method="get" className="grid gap-3 md:grid-cols-[1fr_auto]">
          <label className="grid gap-2 text-sm">
            搜索竞品、话术或证据
            <div className="flex items-center gap-2 rounded border border-[var(--line)] bg-black/10 px-3 py-2">
              <Search size={16} className="shrink-0 text-[var(--muted)]" />
              <input
                name="q"
                defaultValue={resolvedSearchParams?.q ?? ""}
                placeholder="例如：Gemu / delivery / local"
                className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--muted)]"
              />
            </div>
          </label>
          <div className="flex items-end gap-2">
            <input type="hidden" name="threat" value={selectedThreat} />
            <input type="hidden" name="owner" value={selectedOwner} />
            <button className="rounded bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-black hover:brightness-110">
              应用搜索
            </button>
            {(selectedThreat !== "ALL" || selectedOwner !== "ALL" || selectedQuery) && (
              <Link href="/battlecards" className="rounded border border-[var(--line)] px-4 py-2 text-sm hover:bg-white/5">
                清除
              </Link>
            )}
          </div>
        </form>

        <div className="flex flex-wrap gap-2">
          {filterOptions.map((option) => (
            <FilterChip key={option} href={buildBattlecardHref(option, selectedOwner, selectedQuery)} active={selectedThreat === option}>
              {option === "ALL" ? "全部威胁" : option}
            </FilterChip>
          ))}
          {Object.entries(ownerLabel).map(([key, label]) => (
            <FilterChip key={key} href={buildBattlecardHref(selectedThreat, key, selectedQuery)} active={selectedOwner === key}>
              {label}
            </FilterChip>
          ))}
        </div>
      </section>

      <section className="mt-5 grid gap-5">
        {filteredCards.map((card) => (
          <article key={card.competitorId} className="panel overflow-hidden">
            <div className="grid grid-cols-[280px_1fr] max-[980px]:grid-cols-1">
              <div className="border-r border-[var(--line)] bg-[var(--panel-strong)] p-5 max-[980px]:border-b max-[980px]:border-r-0">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-2xl font-semibold">{card.competitorName}</h2>
                    <p className="mt-1 text-sm text-[var(--muted)]">下一负责人：{ownerLabel[card.nextActionOwner]}</p>
                  </div>
                  <StatusBadge value={card.threatLevel} />
                </div>
                <p className="text-sm leading-6 text-[var(--muted)]">{card.defenseNarrative}</p>
                <Link href={`/competitors/${card.competitorId}`} className="mt-5 inline-flex items-center gap-2 rounded border border-[var(--line)] px-3 py-2 text-sm hover:bg-white/5">
                  查看详情
                  <ArrowUpRight size={15} />
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-0 max-[760px]:grid-cols-1">
                <section className="border-b border-r border-[var(--line)] p-5 max-[760px]:border-r-0">
                  <SectionTitle icon={<Target size={17} />} title="防守话术" tone="accent" />
                  <BulletList items={card.talkTracks.slice(0, 4)} />
                </section>
                <section className="border-b border-[var(--line)] p-5">
                  <SectionTitle icon={<ShieldAlert size={17} />} title="观察信号" tone="info" />
                  <BulletList items={card.watchSignals.slice(0, 4)} />
                </section>
                <section className="border-r border-[var(--line)] p-5 max-[760px]:border-b max-[760px]:border-r-0">
                  <SectionTitle icon={<CheckCircle2 size={17} />} title="Bürkert 证据" tone="success" />
                  <BulletList items={card.proofPoints.slice(0, 3)} />
                </section>
                <section className="p-5">
                  <SectionTitle icon={<TriangleAlert size={17} />} title="避免误区" tone="danger" />
                  <BulletList items={card.trapsToAvoid.slice(0, 3)} />
                </section>
              </div>
            </div>
          </article>
        ))}
        {!filteredCards.length ? <p className="text-sm text-[var(--muted)]">没有符合当前筛选的战术卡。</p> : null}
      </section>
    </AppShell>
  );
}

function SectionTitle({ icon, title, tone }: { icon: React.ReactNode; title: string; tone: "accent" | "info" | "success" | "danger" }) {
  const color = {
    accent: "text-[var(--accent)]",
    info: "text-[var(--info)]",
    success: "text-[var(--accent-2)]",
    danger: "text-[var(--danger)]"
  }[tone];

  return (
    <div className={`mb-3 flex items-center gap-2 text-sm font-semibold ${color}`}>
      {icon}
      {title}
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <div className="grid gap-2">
      {items.map((item) => (
        <p key={item} className="text-sm leading-6 text-[var(--muted)]">
          {item}
        </p>
      ))}
    </div>
  );
}

function MiniMetric({ label, value, detail }: { label: string; value: string | number; detail: string }) {
  return (
    <div className="panel p-4">
      <div className="text-sm text-[var(--muted)]">{label}</div>
      <div className="metric-number mt-3 text-3xl font-semibold">{value}</div>
      <div className="mt-2 text-xs leading-5 text-[var(--muted)]">{detail}</div>
    </div>
  );
}

function FilterChip({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`rounded-full border px-3 py-1.5 text-xs transition ${
        active
          ? "border-[var(--accent-2)] bg-[color-mix(in_srgb,var(--accent-2)_15%,transparent)] text-[var(--foreground)]"
          : "border-[var(--line)] text-[var(--muted)] hover:bg-white/5 hover:text-[var(--foreground)]"
      }`}
    >
      {children}
    </Link>
  );
}

function buildBattlecardHref(threat: string, owner: string, q: string) {
  const params = new URLSearchParams();
  if (threat && threat !== "ALL") params.set("threat", threat);
  if (owner && owner !== "ALL") params.set("owner", owner);
  if (q) params.set("q", q);
  const query = params.toString();
  return query ? `/battlecards?${query}` : "/battlecards";
}
