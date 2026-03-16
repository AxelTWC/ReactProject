"use client";

import { useAppSelector } from "@/store/hooks";

export default function ProfilePage() {
  const userEmail = useAppSelector((state) => state.auth.email);

  return (
    <section className="space-y-4">
      <article className="card p-4">
        <h2 className="text-2xl font-bold">Profile</h2>
        <p className="mt-1 text-sm text-[color:var(--muted)]">
          Manage account details and analytics preferences.
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="text-sm font-semibold text-[color:var(--muted)]">
            Email
            <input className="field mt-1" defaultValue={userEmail ?? ""} />
          </label>
          <label className="text-sm font-semibold text-[color:var(--muted)]">
            Default Unit
            <select className="field mt-1" defaultValue="lb">
              <option value="lb">Pounds (lb)</option>
              <option value="kg">Kilograms (kg)</option>
            </select>
          </label>
          <label className="text-sm font-semibold text-[color:var(--muted)]">
            Weekly Goal (sessions)
            <input className="field mt-1" type="number" defaultValue={4} min={1} />
          </label>
          <label className="text-sm font-semibold text-[color:var(--muted)]">
            Favorite Split
            <select className="field mt-1" defaultValue="push-pull-legs">
              <option value="push-pull-legs">Push / Pull / Legs</option>
              <option value="upper-lower">Upper / Lower</option>
              <option value="full-body">Full Body</option>
            </select>
          </label>
        </div>

        <button className="mt-4 rounded-md bg-[color:var(--primary)] px-3 py-2 text-sm font-semibold text-white">
          Save Changes
        </button>
      </article>
    </section>
  );
}
