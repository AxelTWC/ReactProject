"use client";

import { useEffect, useMemo, useState } from "react";
import { authClient } from "@/src/lib/auth-client";
import { setDateRange } from "@/store/slices/dashboardSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export function Topbar() {
  const dispatch = useAppDispatch();
  const authEmail = useAppSelector((state) => state.auth.email);
  const dateRange = useAppSelector((state) => state.dashboard.dateRange);
  const [fallbackEmail, setFallbackEmail] = useState<string | null>(null);

  useEffect(() => {
    if (authEmail) {
      setFallbackEmail(null);
      return;
    }

    const run = async () => {
      const result = await authClient.getSession();
      setFallbackEmail(result.data?.user?.email ?? null);
    };

    void run();
  }, [authEmail]);

  const visibleEmail = useMemo(() => authEmail ?? fallbackEmail, [authEmail, fallbackEmail]);

  return (
    <header className="card mb-4 flex flex-col gap-3 p-4 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
        <p className="text-sm text-[color:var(--muted)]">
          Monitor training trends and find weak points.
        </p>
      </div>

      <div className="w-full md:max-w-xl">
        <p className="mb-2 text-right text-sm text-[color:var(--muted)]">
          Signed in as{" "}
          <span className="font-bold text-[color:var(--primary)]">{visibleEmail ?? "loading..."}</span>
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
        <label className="text-xs font-semibold text-[color:var(--muted)]">
          From
          <input
            type="date"
            value={dateRange.from}
            className="field mt-1"
            onChange={(event) =>
              dispatch(
                setDateRange({ from: event.target.value, to: dateRange.to }),
              )
            }
          />
        </label>
        <label className="text-xs font-semibold text-[color:var(--muted)]">
          To
          <input
            type="date"
            value={dateRange.to}
            className="field mt-1"
            onChange={(event) =>
              dispatch(
                setDateRange({ from: dateRange.from, to: event.target.value }),
              )
            }
          />
        </label>
        </div>
      </div>
    </header>
  );
}
