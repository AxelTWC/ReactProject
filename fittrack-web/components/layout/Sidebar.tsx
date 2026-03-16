"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/workouts/new", label: "Log Workout" },
  { href: "/workouts/history", label: "History" },
  { href: "/upload", label: "CSV Upload" },
  { href: "/profile", label: "Profile" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="card h-fit p-4 md:sticky md:top-6">
      <p className="mb-4 text-xl font-bold text-[color:var(--primary)]">FitTrack</p>
      <nav className="space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-md px-3 py-2 text-sm font-semibold transition ${
                isActive
                  ? "bg-[color:var(--primary)] text-white"
                  : "text-[color:var(--text)] hover:bg-[color:var(--surface-muted)]"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
