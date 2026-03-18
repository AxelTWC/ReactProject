"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { loginSuccess } from "@/store/slices/authSlice";
import { authClient } from "@/src/lib/auth-client";

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
      const { data, error: signUpError } = await authClient.signUp.email({
        name: email.split("@")[0] || "FitTrack User",
        email,
        password,
        callbackURL: "/dashboard",
      });

      if (signUpError) {
        setError(signUpError.message ?? "Registration failed");
        return;
      }

      dispatch(loginSuccess(data?.user?.email ?? email));
      router.push("/dashboard");
    } catch {
      setError("Unable to create account right now");
    } finally {
      setIsSubmitting(false);
    }
  }

  const onGoogleSignIn = async () => {
    setError(null);
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
    });
  };

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

      <button
        type="button"
        onClick={onGoogleSignIn}
        className="mt-3 block rounded-md border border-[color:var(--border)] bg-white px-4 py-2 text-center text-sm font-semibold"
      >
        Continue with Google
      </button>

      <p className="mt-4 text-sm text-[color:var(--muted)]">
        Already registered?{" "}
        <Link href="/login" className="font-semibold text-[color:var(--primary)]">
          Log in
        </Link>
      </p>
    </div>
  );
}
