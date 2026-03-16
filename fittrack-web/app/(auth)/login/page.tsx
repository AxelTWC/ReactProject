import Link from "next/link";

export default function LoginPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Log In</h1>
      <p className="mt-1 text-sm text-[color:var(--muted)]">
        Access your training data and analytics.
      </p>

      <form className="mt-5 space-y-3">
        <label className="block text-sm font-semibold text-[color:var(--muted)]">
          Email
          <input className="field mt-1" type="email" placeholder="you@school.edu" />
        </label>
        <label className="block text-sm font-semibold text-[color:var(--muted)]">
          Password
          <input className="field mt-1" type="password" placeholder="••••••••" />
        </label>

        <Link
          href="/dashboard"
          className="block rounded-md bg-[color:var(--primary)] px-4 py-2 text-center text-sm font-semibold text-white hover:bg-[color:var(--primary-strong)]"
        >
          Continue
        </Link>
      </form>

      <p className="mt-4 text-sm text-[color:var(--muted)]">
        Need an account?{" "}
        <Link href="/register" className="font-semibold text-[color:var(--primary)]">
          Register
        </Link>
      </p>
    </div>
  );
}
