import Link from "next/link";
import {
  Activity,
  Bell,
  BookOpenCheck,
  BrainCircuit,
  ClipboardList,
  Database,
  LayoutDashboard,
  LogOut,
  Radar,
  Scale,
  ShieldCheck,
  Swords,
  UsersRound
} from "lucide-react";

const navItems = [
  { href: "/", label: "总览", icon: LayoutDashboard },
  { href: "/briefing", label: "战略简报", icon: ClipboardList },
  { href: "/analysis", label: "分析中心", icon: BrainCircuit },
  { href: "/knowledge", label: "知识中心", icon: BookOpenCheck },
  { href: "/battlecards", label: "战术卡", icon: Swords },
  { href: "/sales-intel", label: "一线情报", icon: UsersRound },
  { href: "/competitors", label: "竞品", icon: Radar },
  { href: "/matrix", label: "历史评分", icon: Scale },
  { href: "/sources", label: "来源审核", icon: Database },
  { href: "/score-suggestions", label: "评分建议", icon: ShieldCheck },
  { href: "/alerts", label: "提醒", icon: Bell }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="shell-grid">
      <aside className="border-r border-[var(--line)] bg-black/20 p-5 max-[900px]:border-b max-[900px]:border-r-0">
        <div className="mb-8 flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded bg-[var(--accent)] text-black">
            <Activity size={20} />
          </div>
          <div>
            <div className="text-sm text-[var(--muted)]">Bürkert</div>
            <div className="font-semibold">Pharma CI Radar</div>
          </div>
        </div>
        <nav className="grid gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded px-3 py-2 text-sm text-[var(--muted)] transition hover:bg-white/5 hover:text-[var(--foreground)]"
            >
              <item.icon size={17} />
              {item.label}
            </Link>
          ))}
        </nav>
        <form action="/api/logout" method="post" className="mt-8">
          <button className="flex w-full items-center gap-3 rounded border border-[var(--line)] px-3 py-2 text-sm text-[var(--muted)] hover:bg-white/5">
            <LogOut size={16} />
            退出
          </button>
        </form>
      </aside>
      <main className="min-w-0 p-6 max-[700px]:p-4">{children}</main>
    </div>
  );
}
