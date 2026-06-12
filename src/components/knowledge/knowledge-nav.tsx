import Link from "next/link";
import { BookOpen, ClipboardCheck, LayoutDashboard, Search } from "lucide-react";

const items = [
  { view: "workbench", href: "/knowledge", label: "工作台", icon: LayoutDashboard },
  { view: "products", href: "/knowledge?view=products", label: "产品与场景", icon: Search },
  { view: "training", href: "/knowledge?view=training", label: "训练", icon: BookOpen },
  { view: "validation", href: "/knowledge?view=validation", label: "验证", icon: ClipboardCheck }
];

export function KnowledgeNav({ activeView }: { activeView: string }) {
  return (
    <nav className="mb-5 flex gap-2 overflow-x-auto border-b border-[var(--line)] pb-3">
      {items.map((item) => (
        <Link
          key={item.view}
          href={item.href}
          className={`flex shrink-0 items-center gap-2 rounded px-3 py-2 text-sm ${
            activeView === item.view
              ? "bg-[var(--accent)] font-semibold text-black"
              : "text-[var(--muted)] hover:bg-white/5 hover:text-[var(--foreground)]"
          }`}
        >
          <item.icon size={16} />
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
