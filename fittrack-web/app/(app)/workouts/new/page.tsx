"use client";

import {
  addSet,
  removeSet,
  setWorkoutDate,
  setWorkoutNotes,
  updateSet,
} from "@/store/slices/workoutSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export default function NewWorkoutPage() {
  const dispatch = useAppDispatch();
  const workout = useAppSelector((state) => state.workout);

  return (
    <section className="card p-4">
      <h2 className="text-2xl font-bold">Log Workout Session</h2>
      <p className="mt-1 text-sm text-[color:var(--muted)]">
        Record sets with reps and weight to fuel analytics.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="text-sm font-semibold text-[color:var(--muted)]">
          Session Date
          <input
            className="field mt-1"
            type="date"
            value={workout.date}
            onChange={(event) => dispatch(setWorkoutDate(event.target.value))}
          />
        </label>
        <label className="text-sm font-semibold text-[color:var(--muted)]">
          Notes
          <input
            className="field mt-1"
            value={workout.notes}
            onChange={(event) => dispatch(setWorkoutNotes(event.target.value))}
            placeholder="Energy level, technique notes, etc."
          />
        </label>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[620px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-[color:var(--border)] text-left text-[color:var(--muted)]">
              <th className="py-2">Exercise</th>
              <th className="py-2">Reps</th>
              <th className="py-2">Weight</th>
              <th className="py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {workout.sets.map((set) => (
              <tr key={set.id} className="border-b border-[color:var(--border)]">
                <td className="py-2 pr-2">
                  <input
                    className="field"
                    value={set.exercise}
                    onChange={(event) =>
                      dispatch(
                        updateSet({
                          id: set.id,
                          field: "exercise",
                          value: event.target.value,
                        }),
                      )
                    }
                    placeholder="Bench Press"
                  />
                </td>
                <td className="py-2 pr-2">
                  <input
                    className="field"
                    value={set.reps}
                    onChange={(event) =>
                      dispatch(
                        updateSet({
                          id: set.id,
                          field: "reps",
                          value: Number(event.target.value),
                        }),
                      )
                    }
                    type="number"
                    min={0}
                  />
                </td>
                <td className="py-2 pr-2">
                  <input
                    className="field"
                    value={set.weight}
                    onChange={(event) =>
                      dispatch(
                        updateSet({
                          id: set.id,
                          field: "weight",
                          value: Number(event.target.value),
                        }),
                      )
                    }
                    type="number"
                    min={0}
                  />
                </td>
                <td className="py-2">
                  <button
                    type="button"
                    onClick={() => dispatch(removeSet(set.id))}
                    className="rounded-md border border-[color:var(--border)] px-2 py-1"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          className="rounded-md border border-[color:var(--border)] bg-white px-3 py-2 text-sm font-semibold"
          onClick={() => dispatch(addSet())}
        >
          Add Set
        </button>
        <button
          type="button"
          className="rounded-md bg-[color:var(--primary)] px-3 py-2 text-sm font-semibold text-white"
        >
          Save Session
        </button>
      </div>
    </section>
  );
}
