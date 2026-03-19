"use client";

import { useEffect, useState } from "react";
import { useAppSelector } from "@/store/hooks";

interface ProfileStats {
  memberSince: string;
  lastLoggedIn: string;
  totalWorkouts: number;
}

export default function ProfilePage() {
  const userEmail = useAppSelector((state) => state.auth.email);
  const [stats, setStats] = useState<ProfileStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/profile/stats");
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to fetch profile stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <section className="space-y-4">
      <article className="card p-4">
        <h2 className="text-2xl font-bold">Profile</h2>
        <p className="mt-1 text-sm text-[color:var(--muted)]">
          Account information and settings.
        </p>

        <div className="mt-4 space-y-3">
          <div>
            <p className="text-sm font-semibold text-[color:var(--muted)]">Email</p>
            <p className="mt-1 text-base">{userEmail ?? "Not signed in"}</p>
          </div>
        </div>
      </article>

      {!loading && stats && (
        <div className="grid gap-4 md:grid-cols-2">
          <article className="card p-4">
            <p className="text-sm font-semibold text-[color:var(--muted)]">
              Member Since
            </p>
            <p className="mt-2 text-lg font-medium">
              {formatDate(stats.memberSince)}
            </p>
          </article>

          <article className="card p-4">
            <p className="text-sm font-semibold text-[color:var(--muted)]">
              Last Logged In
            </p>
            <p className="mt-2 text-lg font-medium">
              {formatDate(stats.lastLoggedIn)}
            </p>
          </article>

          <article className="card p-4">
            <p className="text-sm font-semibold text-[color:var(--muted)]">
              Total Workouts
            </p>
            <p className="mt-2 text-lg font-medium">{stats.totalWorkouts}</p>
          </article>
        </div>
      )}
    </section>
  );
}
