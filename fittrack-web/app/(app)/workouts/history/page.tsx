"use client";

import { useEffect, useState } from "react";

type SessionItem = {
  id: string;
  date: string;
  split: string;
  sets: number;
  volume: number;
};

export default function HistoryPage() {
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [query, setQuery] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState<string | null>(null);

  const fetchSessions = async () => {
    setError(null);
    const params = new URLSearchParams();
    if (query.trim()) {
      params.set("query", query.trim());
    }
    if (date) {
      params.set("date", date);
    }

    const response = await fetch(`/api/workouts?${params.toString()}`, {
      credentials: "include",
      cache: "no-store",
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data?.error ?? "Unable to load workout history");
      return;
    }

    setSessions(data.sessions ?? []);
  };

  useEffect(() => {
    fetchSessions();

    const onFocus = () => {
      void fetchSessions();
    };
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void fetchSessions();
      }
    };

    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  return (
    <section className="space-y-4">
      <article className="card p-4">
        <h2 className="text-2xl font-bold">Workout History</h2>
        <p className="mt-1 text-sm text-[color:var(--muted)]">
          Review previous sessions and inspect total volume.
        </p>

        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          <input
            className="field"
            placeholder="Search split or exercise"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <input className="field" type="date" value={date} onChange={(event) => setDate(event.target.value)} />
          <button
            className="rounded-md border border-[color:var(--border)] px-3 py-2 text-sm font-semibold"
            onClick={fetchSessions}
          >
            Apply Filters
          </button>
        </div>
        {error ? <p className="mt-3 text-sm text-[color:var(--danger)]">{error}</p> : null}
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
                <tr key={session.id} className="border-b border-[color:var(--border)]">
                  <td className="py-2">{session.date}</td>
                  <td className="py-2">{session.split}</td>
                  <td className="py-2">{session.sets}</td>
                  <td className="py-2">{session.volume.toLocaleString()}</td>
                  <td className="py-2">
                    <span className="text-xs text-[color:var(--muted)]">session id: {session.id.slice(0, 8)}</span>
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
