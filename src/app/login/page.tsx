import { LockKeyhole } from "lucide-react";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;

  return (
    <main className="grid min-h-screen place-items-center p-6">
      <section className="panel w-full max-w-md p-7">
        <div className="mb-6 grid size-11 place-items-center rounded bg-[var(--accent)] text-black">
          <LockKeyhole size={21} />
        </div>
        <h1 className="text-2xl font-semibold">Pharma CI Radar</h1>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">单团队内部访问。演示账号为 strategy@burkert.local，密码 demo-ci。</p>
        {error ? <div className="mt-4 rounded border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-100">账号或密码不正确。</div> : null}
        <form action="/api/login" method="post" className="mt-6 grid gap-4">
          <label className="grid gap-2 text-sm">
            邮箱
            <input
              name="email"
              defaultValue="strategy@burkert.local"
              className="rounded border border-[var(--line)] bg-black/20 px-3 py-2 outline-none focus:border-[var(--accent-2)]"
            />
          </label>
          <label className="grid gap-2 text-sm">
            密码
            <input
              name="password"
              type="password"
              defaultValue="demo-ci"
              className="rounded border border-[var(--line)] bg-black/20 px-3 py-2 outline-none focus:border-[var(--accent-2)]"
            />
          </label>
          <button className="rounded bg-[var(--accent)] px-4 py-2 font-semibold text-black hover:brightness-110">进入工作台</button>
        </form>
      </section>
    </main>
  );
}
