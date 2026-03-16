const sessions = [
  { date: "2026-03-14", split: "Push", sets: 18, volume: 6020 },
  { date: "2026-03-12", split: "Pull", sets: 16, volume: 5430 },
  { date: "2026-03-10", split: "Legs", sets: 20, volume: 7120 },
  { date: "2026-03-08", split: "Upper", sets: 15, volume: 4900 },
];

export default function HistoryPage() {
  return (
    <section className="space-y-4">
      <article className="card p-4">
        <h2 className="text-2xl font-bold">Workout History</h2>
        <p className="mt-1 text-sm text-[color:var(--muted)]">
          Review previous sessions and inspect total volume.
        </p>

        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          <input className="field" placeholder="Search split or exercise" />
          <input className="field" type="date" />
          <button className="rounded-md border border-[color:var(--border)] px-3 py-2 text-sm font-semibold">
            Apply Filters
          </button>
        </div>
      </article>

      <article className="card p-4">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-[color:var(--border)] text-left text-[color:var(--muted)]">
                <th className="py-2">Date</th>
                <th className="py-2">Split</th>
                <th className="py-2">Sets</th>
                <th className="py-2">Volume</th>
                <th className="py-2">Details</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session) => (
                <tr key={session.date} className="border-b border-[color:var(--border)]">
                  <td className="py-2">{session.date}</td>
                  <td className="py-2">{session.split}</td>
                  <td className="py-2">{session.sets}</td>
                  <td className="py-2">{session.volume.toLocaleString()}</td>
                  <td className="py-2">
                    <button className="rounded-md border border-[color:var(--border)] px-2 py-1 text-xs font-semibold">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}
