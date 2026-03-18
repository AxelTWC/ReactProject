"use client";

import { setDateRange, setSelectedExerciseId } from "@/store/slices/dashboardSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

const exerciseOptions = [
  { value: "", label: "All Exercises" },
  { value: "bench", label: "Bench Press" },
  { value: "squat", label: "Back Squat" },
  { value: "deadlift", label: "Deadlift" },
  { value: "row", label: "Barbell Row" },
];

export function Topbar() {
  const dispatch = useAppDispatch();
  const authEmail = useAppSelector((state) => state.auth.email);
  const dateRange = useAppSelector((state) => state.dashboard.dateRange);
  const selectedExerciseId = useAppSelector(
    (state) => state.dashboard.selectedExerciseId,
  );

  return (
    <header className="card mb-4 flex flex-col gap-3 p-4 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
        <p className="text-sm text-[color:var(--muted)]">
          Monitor training trends and find weak points.
        </p>
        {authEmail ? (
          <p className="mt-1 text-xs text-[color:var(--muted)]">Signed in as {authEmail}</p>
        ) : null}
      </div>

      <div className="grid w-full gap-2 sm:grid-cols-3 md:max-w-xl">
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
        <label className="text-xs font-semibold text-[color:var(--muted)]">
          Exercise
          <select
            value={selectedExerciseId ?? ""}
            className="field mt-1"
            onChange={(event) =>
              dispatch(setSelectedExerciseId(event.target.value || null))
            }
          >
            {exerciseOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </header>
  );
}
