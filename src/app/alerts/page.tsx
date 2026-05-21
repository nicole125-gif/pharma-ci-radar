import { BellRing } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { getRepository } from "@/lib/repository";

export default function AlertsPage() {
  const alerts = getRepository().getAlerts();

  return (
    <AppShell>
      <PageHeader
        eyebrow="In-app alerts"
        title="站内提醒"
        description="V1 只做站内提醒。高影响变化、价格/产品/招聘/定位信号会进入这里。"
      />
      <section className="grid gap-4">
        {alerts.map((alert) => (
          <article key={alert.id} className="panel p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-3">
                <BellRing className="mt-1 text-[var(--accent)]" size={18} />
                <div>
                  <h2 className="font-semibold">{alert.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{alert.body}</p>
                </div>
              </div>
              <StatusBadge value={alert.impactLevel} />
            </div>
          </article>
        ))}
      </section>
    </AppShell>
  );
}
