import Link from "next/link";

export default function RegisterPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Create Account</h1>
      <p className="mt-1 text-sm text-[color:var(--muted)]">
        Start tracking workouts with analytics-first insights.
      </p>

      <form className="mt-5 space-y-3">
        <label className="block text-sm font-semibold text-[color:var(--muted)]">
          Email
          <input className="field mt-1" type="email" placeholder="you@school.edu" />
        </label>
        <label className="block text-sm font-semibold text-[color:var(--muted)]">
          Password
          <input className="field mt-1" type="password" placeholder="Create password" />
        </label>
        <label className="block text-sm font-semibold text-[color:var(--muted)]">
          Confirm Password
          <input className="field mt-1" type="password" placeholder="Confirm password" />
        </label>

        <Link
          href="/dashboard"
          className="block rounded-md bg-[color:var(--primary)] px-4 py-2 text-center text-sm font-semibold text-white hover:bg-[color:var(--primary-strong)]"
        >
          Create Account
        </Link>
      </form>

      <p className="mt-4 text-sm text-[color:var(--muted)]">
        Already registered?{" "}
        <Link href="/login" className="font-semibold text-[color:var(--primary)]">
          Log in
        </Link>
      </p>
    </div>
  );
}
