import Link from "next/link";
import { Filter, MessageSquarePlus, Repeat2, ShieldCheck, UserCheck } from "lucide-react";
import { createSalesIntelAction } from "@/app/actions";
import { AppShell } from "@/components/app-shell";
import { SalesIntelReviewButtons } from "@/components/forms";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { getRepository } from "@/lib/repository";
import type { SalesIntel } from "@/lib/types";

const signalLabels = {
  DELIVERY: "交付/响应",
  PRICE: "价格",
  SERVICE: "服务",
  PRODUCT: "产品",
  RELATIONSHIP: "客户关系",
  OTHER: "其他"
};

const reliabilityLabels = {
  LOW: "低可信",
  MEDIUM: "中可信",
  HIGH: "高可信"
};

const statusLabels = {
  ALL: "全部",
  PENDING: "待确认",
  ACCEPTED: "已采纳",
  REJECTED: "未采纳"
} as const;

export default async function SalesIntelPage({
  searchParams
}: {
  searchParams?: Promise<{
    status?: string;
    competitor?: string;
  }>;
}) {
  const resolvedSearchParams = await searchParams;
  const repo = await getRepository();
  const board = repo.getSalesIntelBoard();
  const selectedStatus = resolvedSearchParams?.status ?? "ALL";
  const selectedCompetitor = resolvedSearchParams?.competitor ?? "ALL";

  const filteredPending = board.pending.filter((item) => matchesIntelFilter(item, selectedStatus, selectedCompetitor));
  const filteredAccepted = board.accepted.filter((item) => matchesIntelFilter(item, selectedStatus, selectedCompetitor));
  const filteredRejected = board.rejected.filter((item) => matchesIntelFilter(item, selectedStatus, selectedCompetitor));
  const filteredRepeatedSignals = board.repeatedSignals.filter(
    (signal) => selectedCompetitor === "ALL" || signal.competitorId === selectedCompetitor
  );

  return (
    <AppShell>
      <PageHeader
        eyebrow="Field Intel"
        title="一线情报"
        description="销售每月补充竞品消息；系统先进入待确认池，采纳后才进入正式分析、战术卡和月度简报。"
      />

      <section className="grid grid-cols-4 gap-4 max-[1100px]:grid-cols-2 max-[620px]:grid-cols-1">
        <MiniMetric label="待确认" value={board.pending.length} detail="销售提交后先进入这里" />
        <MiniMetric label="已采纳" value={board.accepted.length} detail="采纳后进入正式证据链" />
        <MiniMetric label="重复信号" value={board.repeatedSignals.length} detail="同类消息重复出现才升级" />
        <MiniMetric
          label="当前筛选"
          value={selectedStatus === "ALL" ? "全部状态" : statusLabels[selectedStatus as keyof typeof statusLabels]}
          detail={selectedCompetitor === "ALL" ? "全部竞品" : board.competitors.find((item) => item.id === selectedCompetitor)?.name ?? selectedCompetitor}
        />
      </section>

      <section className="mt-5 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
          <Filter size={14} />
          快速筛选
        </span>
        {Object.entries(statusLabels).map(([status, label]) => (
          <FilterChip key={status} href={buildSalesIntelHref(status, selectedCompetitor)} active={selectedStatus === status}>
            {label}
          </FilterChip>
        ))}
        {board.competitors.map((competitor) => (
          <FilterChip key={competitor.id} href={buildSalesIntelHref(selectedStatus, competitor.id)} active={selectedCompetitor === competitor.id}>
            {competitor.name}
          </FilterChip>
        ))}
        {(selectedStatus !== "ALL" || selectedCompetitor !== "ALL") && (
          <Link href="/sales-intel" className="text-xs text-[var(--accent-2)] underline-offset-4 hover:underline">
            清除筛选
          </Link>
        )}
      </section>

      <section className="mt-5 grid grid-cols-[0.9fr_1.1fr] gap-5 max-[1050px]:grid-cols-1">
        <form action={createSalesIntelAction} className="panel grid gap-4 self-start p-5 max-[1050px]:order-2 lg:sticky lg:top-6">
          <div className="flex items-center gap-2 text-sm font-semibold text-[var(--accent-2)]">
            <MessageSquarePlus size={18} />
            新增销售反馈
          </div>

          <label className="grid gap-2 text-sm">
            竞品
            <select name="competitorId" className="rounded border border-[var(--line)] bg-transparent px-3 py-2">
              {board.competitors.map((competitor) => (
                <option key={competitor.id} value={competitor.id} className="bg-[var(--panel)]">
                  {competitor.name}
                </option>
              ))}
            </select>
          </label>

          <div className="grid grid-cols-2 gap-3 max-[640px]:grid-cols-1">
            <label className="grid gap-2 text-sm">
              区域
              <input name="region" placeholder="华东 / 华南 / 全国" className="rounded border border-[var(--line)] bg-transparent px-3 py-2" />
            </label>
            <label className="grid gap-2 text-sm">
              提交人
              <input name="submittedBy" placeholder="销售姓名或团队" className="rounded border border-[var(--line)] bg-transparent px-3 py-2" />
            </label>
          </div>

          <label className="grid gap-2 text-sm">
            客户/项目场景
            <input
              name="accountContext"
              placeholder="可写匿名客户、行业场景或项目阶段"
              className="rounded border border-[var(--line)] bg-transparent px-3 py-2"
            />
          </label>

          <div className="grid grid-cols-3 gap-3 max-[760px]:grid-cols-1">
            <label className="grid gap-2 text-sm">
              信号类型
              <select name="signalType" className="rounded border border-[var(--line)] bg-transparent px-3 py-2">
                {Object.entries(signalLabels).map(([value, label]) => (
                  <option key={value} value={value} className="bg-[var(--panel)]">
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm">
              可信度
              <select name="reliability" defaultValue="MEDIUM" className="rounded border border-[var(--line)] bg-transparent px-3 py-2">
                {Object.entries(reliabilityLabels).map(([value, label]) => (
                  <option key={value} value={value} className="bg-[var(--panel)]">
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm">
              影响
              <select name="impactLevel" defaultValue="MEDIUM" className="rounded border border-[var(--line)] bg-transparent px-3 py-2">
                <option value="LOW" className="bg-[var(--panel)]">
                  低
                </option>
                <option value="MEDIUM" className="bg-[var(--panel)]">
                  中
                </option>
                <option value="HIGH" className="bg-[var(--panel)]">
                  高
                </option>
              </select>
            </label>
          </div>

          <label className="grid gap-2 text-sm">
            情报内容
            <textarea
              name="summary"
              required
              rows={5}
              placeholder="例如：客户反馈 Gemu 在该项目交期更快，且本地代理报价响应更积极。"
              className="resize-none rounded border border-[var(--line)] bg-transparent px-3 py-2 leading-6"
            />
          </label>

          <label className="flex items-center gap-2 text-sm text-[var(--muted)]">
            <input name="sensitive" type="checkbox" defaultChecked />
            含客户或项目敏感信息，默认匿名展示
          </label>

          <button className="rounded bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-black hover:brightness-110">
            提交到待确认池
          </button>
        </form>

        <section className="grid gap-5">
          <div className="panel p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-[var(--accent)]">
                <Repeat2 size={18} />
                重复信号
              </div>
              <span className="text-xs text-[var(--muted)]">连续出现才升级关注</span>
            </div>
            <div className="grid gap-3">
              {filteredRepeatedSignals.length ? (
                filteredRepeatedSignals.map((signal) => (
                  <div key={`${signal.competitorId}-${signal.signalType}`} className="rounded border border-[var(--line)] p-3">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <div className="font-semibold">{signal.competitorName}</div>
                      <StatusBadge value={signal.impactLevel} />
                    </div>
                    <p className="text-sm text-[var(--muted)]">
                      {signalLabels[signal.signalType]}重复 {signal.count} 次：{signal.latestSummary}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-[var(--muted)]">暂无重复信号。</p>
              )}
            </div>
          </div>

          <IntelList
            title="待确认情报"
            icon={<UserCheck size={18} />}
            items={filteredPending}
            reviewable
            emptyMessage="没有符合筛选条件的待确认情报。"
          />
        </section>
      </section>

      <section className="mt-5 grid grid-cols-2 gap-5 max-[900px]:grid-cols-1">
        <IntelList title="已采纳情报" icon={<ShieldCheck size={18} />} items={filteredAccepted} emptyMessage="没有符合筛选条件的已采纳情报。" />
        <IntelList title="未采纳情报" icon={<ShieldCheck size={18} />} items={filteredRejected} emptyMessage="没有符合筛选条件的未采纳情报。" />
      </section>
    </AppShell>
  );
}

function IntelList({
  title,
  icon,
  items,
  reviewable = false,
  emptyMessage = "暂无内容。"
}: {
  title: string;
  icon: React.ReactNode;
  items: SalesIntel[];
  reviewable?: boolean;
  emptyMessage?: string;
}) {
  return (
    <section className="panel p-5">
      <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-[var(--accent-2)]">
        {icon}
        {title}
      </div>
      <div className="grid gap-3">
        {items.length ? (
          items.map((item) => (
            <article key={item.id} className="rounded border border-[var(--line)] p-4">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="font-semibold">{signalLabels[item.signalType]}</span>
                  <StatusBadge value={item.impactLevel} />
                  <span className="rounded border border-[var(--line)] px-2 py-1 text-xs text-[var(--muted)]">
                    {reliabilityLabels[item.reliability]}
                  </span>
                </div>
                {reviewable ? <SalesIntelReviewButtons intelId={item.id} /> : null}
              </div>
              <p className="text-sm leading-6 text-[var(--muted)]">{item.summary}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-[var(--muted)]">
                <span>{item.region}</span>
                <span>·</span>
                <span>{item.accountContext}</span>
                <span>·</span>
                <span>{item.sensitive ? "匿名展示" : "可展示"}</span>
              </div>
            </article>
          ))
        ) : (
          <p className="text-sm text-[var(--muted)]">{emptyMessage}</p>
        )}
      </div>
    </section>
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

function buildSalesIntelHref(status: string, competitor: string) {
  const params = new URLSearchParams();
  if (status && status !== "ALL") params.set("status", status);
  if (competitor && competitor !== "ALL") params.set("competitor", competitor);
  const query = params.toString();
  return query ? `/sales-intel?${query}` : "/sales-intel";
}

function matchesIntelFilter(item: SalesIntel, status: string, competitor: string) {
  const statusMatch = status === "ALL" || item.status === status;
  const competitorMatch = competitor === "ALL" || item.competitorId === competitor;
  return statusMatch && competitorMatch;
}
