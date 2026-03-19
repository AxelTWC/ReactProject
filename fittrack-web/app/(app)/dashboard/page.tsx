"use client";

import { useEffect, useMemo, useState } from "react";
import { useAppSelector } from "@/store/hooks";

type DashboardData = {
  kpis: {
    weeklyVolume: number;
    avgEstimatedOneRM: number;
    consistencyScore: number;
  };
  charts: {
    volumeTrend: Array<{ week: string; volume: number }>;
    oneRMTrend: Array<{ date: string; oneRM: number }>;
    muscleDistribution: Array<{ muscleGroup: string; percent: number }>;
    exerciseFrequency: Array<{ exerciseName: string; count: number }>;
  };
};

export default function DashboardPage() {
  const dashboard = useAppSelector((state) => state.dashboard);
  const [data, setData] = useState<DashboardData>({
    kpis: dashboard.kpis,
    charts: dashboard.charts,
  });
  const [error, setError] = useState<string | null>(null);

  const maxVolume = useMemo(() => {
    if (data.charts.volumeTrend.length === 0) {
      return 1;
    }
    return Math.max(...data.charts.volumeTrend.map((item) => item.volume), 1);
  }, [data.charts.volumeTrend]);

  const maxOneRM = useMemo(() => {
    if (data.charts.oneRMTrend.length === 0) {
      return 1;
    }
    return Math.max(...data.charts.oneRMTrend.map((item) => item.oneRM), 1);
  }, [data.charts.oneRMTrend]);

  useEffect(() => {
    const run = async () => {
      setError(null);
      const params = new URLSearchParams({
        from: dashboard.dateRange.from,
        to: dashboard.dateRange.to,
      });

      const response = await fetch(`/api/analytics/summary?${params.toString()}`, {
        credentials: "include",
      });
      const result = await response.json();

      if (!response.ok) {
        setError(result?.error ?? "Unable to load analytics");
        return;
      }

      setData(result);
    };

    run();
  }, [dashboard.dateRange.from, dashboard.dateRange.to, dashboard.selectedExerciseId]);

  return (
    <section className="space-y-4">
      {error ? <p className="text-sm text-[color:var(--danger)]">{error}</p> : null}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <article className="card p-4">
          <p className="text-sm text-[color:var(--muted)]">Weekly Volume</p>
          <p className="mt-1 text-3xl font-bold">{data.kpis.weeklyVolume.toLocaleString()}</p>
        </article>
        <article className="card p-4">
          <p className="text-sm text-[color:var(--muted)]">Avg Estimated 1RM</p>
          <p className="mt-1 text-3xl font-bold">{data.kpis.avgEstimatedOneRM} lb</p>
        </article>
        <article className="card p-4">
          <p className="text-sm text-[color:var(--muted)]">Consistency Score</p>
          <p className="mt-1 text-3xl font-bold">{data.kpis.consistencyScore} / 5</p>
        </article>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <article className="card p-4">
          <h2 className="text-lg font-bold">Volume Trend</h2>
          <div className="mt-4 space-y-2">
            {data.charts.volumeTrend.map((item, idx) => (
              <div key={`${item.week}-${idx}`} className="grid grid-cols-[40px_1fr_70px] items-center gap-2">
                <span className="text-sm text-[color:var(--muted)]">{item.week}</span>
                <div className="h-3 rounded-full bg-[color:var(--surface-muted)]">
                  <div
                    className="h-3 rounded-full bg-[color:var(--primary)]"
                    style={{ width: `${Math.round((item.volume / maxVolume) * 100)}%` }}
                  />
                </div>
                <span className="text-right text-sm font-semibold">{item.volume}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="card p-4">
          <h2 className="text-lg font-bold">Estimated 1RM Progress</h2>
          <div className="mt-4 space-y-2">
            {data.charts.oneRMTrend.map((item, idx) => (
              <div key={`${item.date}-${idx}`} className="grid grid-cols-[50px_1fr_60px] items-center gap-2">
                <span className="text-sm text-[color:var(--muted)]">{item.date}</span>
                <div className="h-3 rounded-full bg-[color:var(--surface-muted)]">
                  <div
                    className="h-3 rounded-full bg-[color:var(--success)]"
                    style={{ width: `${Math.round((item.oneRM / maxOneRM) * 100)}%` }}
                  />
                </div>
                <span className="text-right text-sm font-semibold">{item.oneRM}</span>
              </div>
            ))}
          </div>
        </article>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <article className="card p-4">
          <h2 className="text-lg font-bold">Muscle Group Distribution</h2>
          <ul className="mt-4 space-y-2">
            {data.charts.muscleDistribution.map((item) => (
              <li key={item.muscleGroup} className="flex items-center justify-between text-sm">
                <span>{item.muscleGroup}</span>
                <span className="font-semibold">{item.percent}%</span>
              </li>
            ))}
          </ul>
        </article>

        <article className="card p-4">
          <h2 className="text-lg font-bold">Exercise Frequency</h2>
          <ul className="mt-4 space-y-2">
            {data.charts.exerciseFrequency.map((item) => (
              <li key={item.exerciseName} className="flex items-center justify-between text-sm">
                <span>{item.exerciseName}</span>
                <span className="font-semibold">{item.count} sessions</span>
              </li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}
