"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { loginSuccess } from "@/store/slices/authSlice";

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data?.error ?? "Registration failed");
        return;
      }

      dispatch(loginSuccess(data.user.email));
      router.push("/dashboard");
    } catch {
      setError("Unable to create account right now");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Create Account</h1>
      <p className="mt-1 text-sm text-[color:var(--muted)]">
        Start tracking workouts with analytics-first insights.
      </p>

      <form className="mt-5 space-y-3" onSubmit={onSubmit}>
        <label className="block text-sm font-semibold text-[color:var(--muted)]">
          Email
          <input
            className="field mt-1"
            type="email"
            placeholder="you@school.edu"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>
        <label className="block text-sm font-semibold text-[color:var(--muted)]">
          Password
          <input
            className="field mt-1"
            type="password"
            placeholder="Create password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>
        <label className="block text-sm font-semibold text-[color:var(--muted)]">
          Confirm Password
          <input
            className="field mt-1"
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
          />
        </label>

        {error ? <p className="text-sm text-[color:var(--danger)]">{error}</p> : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="block rounded-md bg-[color:var(--primary)] px-4 py-2 text-center text-sm font-semibold text-white hover:bg-[color:var(--primary-strong)]"
        >
          {isSubmitting ? "Creating account..." : "Create Account"}
        </button>
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
