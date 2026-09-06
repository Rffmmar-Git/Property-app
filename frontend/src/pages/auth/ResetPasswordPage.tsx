import { useState } from "react";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

import { useResetPassword } from "../../features/auth/hooks/useResetPassword";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const resetPasswordMutation = useResetPassword();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationError, setValidationError] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setValidationError("");

    if (!token) {
      setValidationError("Invalid or missing reset token.");
      return;
    }

    if (password.length < 8) {
      setValidationError("Password must be at least 8 characters.");
      return;
    }

    if (!/[A-Z]/.test(password)) {
      setValidationError(
        "Password must contain at least one uppercase letter.",
      );
      return;
    }

    if (!/[a-z]/.test(password)) {
      setValidationError(
        "Password must contain at least one lowercase letter.",
      );
      return;
    }

    if (!/[0-9]/.test(password)) {
      setValidationError("Password must contain at least one number.");
      return;
    }

    if (password !== confirmPassword) {
      setValidationError("Passwords do not match.");
      return;
    }

    resetPasswordMutation.mutate({
      token,
      password,
    });
  };

  const errorMessage =
    resetPasswordMutation.error instanceof Error
      ? resetPasswordMutation.error.message
      : "Unable to reset password.";

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
              Reset Password
            </h1>

            <p className="mt-1 font-body-sm text-body-sm text-slate-muted">
              Enter your new password below.
            </p>
          </div>

          {/* Success */}
          {resetPasswordMutation.isSuccess ? (
            <div className="text-center">
              <div className="rounded-md bg-green-50 px-3 py-2 font-body-sm text-body-sm text-green-600">
                {resetPasswordMutation.data.message}
              </div>

              <Link
                to="/login"
                className="mt-4 inline-block font-label-bold text-label-bold text-midnight-indigo hover:underline"
              >
                Back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="w-full">
              {/* New Password */}
              <div className="relative">
                <LockKeyhole
                  className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-muted"
                  strokeWidth={1.8}
                />

                <input
                  id="reset-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="New Password"
                  autoComplete="new-password"
                  required
                  disabled={resetPasswordMutation.isPending}
                  className="h-[42px] w-full rounded-md border border-outline-variant bg-surface-white pl-10 pr-10 font-body-sm text-body-sm text-slate-text outline-none transition placeholder:text-slate-muted focus:border-midnight-indigo focus:ring-2 focus:ring-midnight-indigo/10 disabled:cursor-not-allowed disabled:opacity-60"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((current) => !current)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-muted hover:text-slate-text"
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff
                      className="h-[18px] w-[18px]"
                      strokeWidth={1.8}
                    />
                  ) : (
                    <Eye
                      className="h-[18px] w-[18px]"
                      strokeWidth={1.8}
                    />
                  )}
                </button>
              </div>

              {/* Confirm Password */}
              <div className="relative mt-3">
                <LockKeyhole
                  className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-muted"
                  strokeWidth={1.8}
                />

                <input
                  id="reset-confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                  placeholder="Confirm New Password"
                  autoComplete="new-password"
                  required
                  disabled={resetPasswordMutation.isPending}
                  className="h-[42px] w-full rounded-md border border-outline-variant bg-surface-white pl-10 pr-10 font-body-sm text-body-sm text-slate-text outline-none transition placeholder:text-slate-muted focus:border-midnight-indigo focus:ring-2 focus:ring-midnight-indigo/10 disabled:cursor-not-allowed disabled:opacity-60"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword((current) => !current)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-muted hover:text-slate-text"
                  aria-label={
                    showConfirmPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff
                      className="h-[18px] w-[18px]"
                      strokeWidth={1.8}
                    />
                  ) : (
                    <Eye
                      className="h-[18px] w-[18px]"
                      strokeWidth={1.8}
                    />
                  )}
                </button>
              </div>

              {/* Validation Error */}
              {validationError && (
                <div className="mt-3 rounded-md bg-red-50 px-3 py-2 font-body-sm text-body-sm text-red-600">
                  {validationError}
                </div>
              )}

              {/* Backend Error */}
              {resetPasswordMutation.isError && (
                <div className="mt-3 rounded-md bg-red-50 px-3 py-2 font-body-sm text-body-sm text-red-600">
                  {errorMessage}
                </div>
              )}

              {/* Reset Button */}
              <button
                type="submit"
                disabled={resetPasswordMutation.isPending}
                className="mt-4 h-[38px] w-full cursor-pointer rounded-md bg-sunrise-amber font-label-bold text-label-bold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {resetPasswordMutation.isPending
                  ? "Resetting..."
                  : "Reset Password"}
              </button>

              {/* Back to Login */}
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
            </form>
          )}
        </div>
      </section>
    </main>
  );
}