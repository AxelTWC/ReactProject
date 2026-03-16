import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-8 md:px-10">
        <header className="flex items-center justify-between">
          <p className="text-lg font-bold text-[color:var(--primary)]">FitTrack</p>
          <div className="flex items-center gap-3">
            <Link href="/login" className="rounded-md px-3 py-2 text-sm font-semibold text-[color:var(--text)]">
              Log In
            </Link>
            <Link
              href="/register"
              className="rounded-md bg-[color:var(--primary)] px-3 py-2 text-sm font-semibold text-white hover:bg-[color:var(--primary-strong)]"
            >
              Register
            </Link>
          </div>
        </header>

        <section className="card overflow-hidden p-8 md:p-12">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div className="space-y-5">
              <p className="inline-block rounded-full bg-[color:var(--surface-muted)] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[color:var(--primary)]">
                Fitness Analytics Platform
              </p>
              <h1 className="text-4xl leading-tight font-bold text-[color:var(--text)] md:text-5xl">
                Train with numbers that actually mean something.
              </h1>
              <p className="text-base text-[color:var(--muted)] md:text-lg">
                Log sessions, upload CSVs, and monitor long-term progress across weekly volume, estimated one-rep max, and muscle distribution.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/dashboard"
                  className="rounded-md bg-[color:var(--primary)] px-4 py-2 text-sm font-semibold text-white hover:bg-[color:var(--primary-strong)]"
                >
                  Open Dashboard
                </Link>
                <Link
                  href="/workouts/new"
                  className="rounded-md border border-[color:var(--border)] bg-white px-4 py-2 text-sm font-semibold text-[color:var(--text)]"
                >
                  Log Workout
                </Link>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { title: "Weekly Volume", value: "+12%", tone: "text-[color:var(--success)]" },
                { title: "Avg 1RM", value: "185 lb", tone: "text-[color:var(--primary)]" },
                { title: "Consistency", value: "4.2 days/wk", tone: "text-[color:var(--primary)]" },
                { title: "CSV Errors", value: "3 rows", tone: "text-[color:var(--warning)]" },
              ].map((item) => (
                <article key={item.title} className="rounded-xl border border-[color:var(--border)] bg-white p-4">
                  <p className="text-sm text-[color:var(--muted)]">{item.title}</p>
                  <p className={`mt-2 text-2xl font-bold ${item.tone}`}>{item.value}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Progress Clarity",
              body: "See trends over weeks, not isolated sessions.",
            },
            {
              title: "Structured Uploads",
              body: "Import old workout spreadsheets with row-level validation.",
            },
            {
              title: "User-Scoped Data",
              body: "All analytics and logs are scoped to authenticated users.",
            },
          ].map((feature) => (
            <article key={feature.title} className="card p-5">
              <h2 className="text-lg font-bold">{feature.title}</h2>
              <p className="mt-2 text-sm text-[color:var(--muted)]">{feature.body}</p>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
