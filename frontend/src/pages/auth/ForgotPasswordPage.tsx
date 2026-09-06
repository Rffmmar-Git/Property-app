import { useState } from "react";
import { Link } from "react-router-dom";

import { useForgotPassword } from "../../features/auth/hooks/useForgotPassword";

export default function ForgotPasswordPage() {
  const forgotPasswordMutation = useForgotPassword();

  const [email, setEmail] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    forgotPasswordMutation.mutate({
      email,
    });
  };

  return (
    <main className="min-h-screen bg-white px-4 py-8 md:px-6">
      <section className="mx-auto flex min-h-[calc(100vh-64px)] max-w-[1440px] items-center justify-center">
        <div className="w-full max-w-[400px] rounded-xl bg-white px-6 py-8 shadow-[0_12px_30px_rgba(0,0,0,0.12)]">
          {/* Logo */}
          <div className="mb-5 text-center">
            <Link
              to="/"
              className="font-headline-md text-headline-md font-bold text-midnight-indigo"
            >
              Property App
            </Link>
          </div>

          {/* Heading */}
          <div className="mb-6 text-center">
            <h1 className="font-headline-lg text-headline-lg font-bold text-black">
              Forgot Password?
            </h1>

            <p className="mt-1 font-body-sm text-body-sm text-slate-muted">
              Enter your email address and we&apos;ll send you a link to reset
              your password.
            </p>
          </div>

          {/* Success message */}
          {forgotPasswordMutation.isSuccess && (
            <div className="mb-4 rounded-md bg-green-50 px-3 py-2 font-body-sm text-body-sm text-green-600">
              {forgotPasswordMutation.data.message}
            </div>
          )}

          {/* Error message */}
          {forgotPasswordMutation.isError && (
            <div className="mb-4 rounded-md bg-red-50 px-3 py-2 font-body-sm text-body-sm text-red-600">
              Unable to process your request. Please try again.
            </div>
          )}

          <form onSubmit={handleSubmit} className="w-full">
            {/* Email */}
            <div>
              <input
                id="forgot-password-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Email Address"
                autoComplete="email"
                required
                disabled={forgotPasswordMutation.isPending}
                className="h-[42px] w-full rounded-md border border-outline-variant bg-surface-white px-3 font-body-sm text-body-sm text-slate-text outline-none transition placeholder:text-slate-muted focus:border-midnight-indigo focus:ring-2 focus:ring-midnight-indigo/10 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={forgotPasswordMutation.isPending}
              className="mt-4 h-[38px] w-full cursor-pointer rounded-md bg-sunrise-amber font-label-bold text-label-bold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {forgotPasswordMutation.isPending
                ? "Sending..."
                : "Send Reset Link"}
            </button>
          </form>

          {/* Back to login */}
          <div className="mt-5 border-t border-outline-variant pt-4 text-center">
            <p className="font-body-sm text-body-sm text-slate-muted">
              Remember your password?{" "}
              <Link
                to="/login"
                className="cursor-pointer font-label-bold text-label-bold text-midnight-indigo hover:underline"
              >
                Back to Login
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}