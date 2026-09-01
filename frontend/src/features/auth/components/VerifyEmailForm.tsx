import axios from "axios";
import { useState } from "react";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Link2Off,
} from "lucide-react";
import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import { useVerifyEmail } from "../hooks/useVerifyEmail";

export function VerifyEmailForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const verifyMutation = useVerifyEmail();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [validationError, setValidationError] =
    useState("");

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setValidationError("");

    if (!token) {
      return;
    }

    if (password.length < 8) {
      setValidationError(
        "Password must be at least 8 characters.",
      );
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
      setValidationError(
        "Password must contain at least one number.",
      );
      return;
    }

    if (password !== confirmPassword) {
      setValidationError(
        "Passwords do not match.",
      );
      return;
    }

    verifyMutation.mutate(
      {
        token,
        password,
      },
      {
        onSuccess: () => {
          navigate("/login", {
            state: {
              message:
                "Email verified successfully. Please login.",
            },
          });
        },
      },
    );
  };

  const getBackendErrorMessage = () => {
    if (!verifyMutation.error) {
      return "";
    }

    if (!axios.isAxiosError(verifyMutation.error)) {
      return "Unable to verify your email. Please try again.";
    }

    const responseData =
      verifyMutation.error.response?.data;

    if (typeof responseData?.message === "string") {
      return responseData.message;
    }

    if (Array.isArray(responseData?.detail)) {
      return responseData.detail
        .map((item: { message?: string }) => item.message)
        .filter(Boolean)
        .join(" ");
    }

    if (typeof responseData?.detail === "string") {
      return responseData.detail;
    }

    return "Unable to verify your email. Please try again.";
  };

  const isInvalidVerificationToken = () => {
    if (!verifyMutation.error) {
      return false;
    }

    if (!axios.isAxiosError(verifyMutation.error)) {
      return false;
    }

    const responseData =
      verifyMutation.error.response?.data;

    const message =
      typeof responseData?.message === "string"
        ? responseData.message.toLowerCase()
        : "";

    const detail =
      typeof responseData?.detail === "string"
        ? responseData.detail.toLowerCase()
        : "";

    const combinedMessage = `${message} ${detail}`;

    return (
      combinedMessage.includes("invalid token") ||
      combinedMessage.includes("invalid verification") ||
      combinedMessage.includes("verification token") ||
      combinedMessage.includes("token expired") ||
      combinedMessage.includes("expired token") ||
      combinedMessage.includes("token is invalid")
    );
  };

  /*
   * No token
   * → show invalid verification state immediately
   */
  if (!token) {
    return (
      <div className="w-full">
        {/* Error Icon */}
        <div className="mb-5 flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
            <Link2Off
              className="h-7 w-7 text-red-500"
              strokeWidth={1.8}
            />
          </div>
        </div>

        {/* Message */}
        <div className="text-center">
          <h1 className="font-headline-lg text-headline-lg font-bold text-midnight-indigo">
            Invalid verification link
          </h1>

          <p className="mt-2 font-body-sm text-body-sm text-slate-muted">
            Please use the verification link sent to
            your email to complete your account.
          </p>
        </div>

        {/* Back to Login */}
        <Link
          to="/login"
          className="mt-6 flex h-[38px] w-full items-center justify-center rounded-md bg-midnight-indigo font-label-bold text-label-bold text-white transition hover:opacity-90"
        >
          Back to Login
        </Link>

        {/* Resend */}
        <Link
          to="/check-email"
          className="mt-3 flex h-[38px] w-full items-center justify-center rounded-md border border-midnight-indigo font-label-bold text-label-bold text-midnight-indigo transition hover:bg-blue-50"
        >
          Resend Verification Email
        </Link>
      </div>
    );
  }

  /*
   * Token exists but backend rejected it as
   * invalid/expired.
   */
  if (isInvalidVerificationToken()) {
    return (
      <div className="w-full">
        {/* Error Icon */}
        <div className="mb-5 flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
            <Link2Off
              className="h-7 w-7 text-red-500"
              strokeWidth={1.8}
            />
          </div>
        </div>

        {/* Message */}
        <div className="text-center">
          <h1 className="font-headline-lg text-headline-lg font-bold text-midnight-indigo">
            Invalid verification link
          </h1>

          <p className="mt-2 font-body-sm text-body-sm text-slate-muted">
            This verification link is invalid or has
            expired. Please request a new verification
            email.
          </p>
        </div>

        {/* Back to Login */}
        <Link
          to="/login"
          className="mt-6 flex h-[38px] w-full items-center justify-center rounded-md bg-midnight-indigo font-label-bold text-label-bold text-white transition hover:opacity-90"
        >
          Back to Login
        </Link>

        {/* Resend */}
        <Link
          to="/check-email"
          className="mt-3 flex h-[38px] w-full items-center justify-center rounded-md border border-midnight-indigo font-label-bold text-label-bold text-midnight-indigo transition hover:bg-blue-50"
        >
          Resend Verification Email
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full"
    >
      {/* Password */}
      <div className="relative mb-3">
        <LockKeyhole
          className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-muted"
          strokeWidth={1.8}
        />

        <input
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
            setValidationError("");
          }}
          placeholder="Password"
          autoComplete="new-password"
          required
          className="h-[42px] w-full rounded-md border border-outline-variant bg-surface-white pl-10 pr-10 font-body-sm text-body-sm text-slate-text outline-none transition placeholder:text-slate-muted focus:border-midnight-indigo focus:ring-2 focus:ring-midnight-indigo/10"
        />

        <button
          type="button"
          onClick={() =>
            setShowPassword(
              (current) => !current,
            )
          }
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-muted hover:text-slate-text"
          aria-label={
            showPassword
              ? "Hide password"
              : "Show password"
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
      <div className="relative">
        <LockKeyhole
          className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-muted"
          strokeWidth={1.8}
        />

        <input
          type={
            showConfirmPassword
              ? "text"
              : "password"
          }
          value={confirmPassword}
          onChange={(event) => {
            setConfirmPassword(
              event.target.value,
            );
            setValidationError("");
          }}
          placeholder="Confirm Password"
          autoComplete="new-password"
          required
          className="h-[42px] w-full rounded-md border border-outline-variant bg-surface-white pl-10 pr-10 font-body-sm text-body-sm text-slate-text outline-none transition placeholder:text-slate-muted focus:border-midnight-indigo focus:ring-2 focus:ring-midnight-indigo/10"
        />

        <button
          type="button"
          onClick={() =>
            setShowConfirmPassword(
              (current) => !current,
            )
          }
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-muted hover:text-slate-text"
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

      {/* Error */}
      {(validationError ||
        verifyMutation.isError) && (
        <div className="mt-3 rounded-md bg-red-50 px-3 py-2 font-body-sm text-body-sm text-red-600">
          {validationError ||
            getBackendErrorMessage()}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={verifyMutation.isPending}
        className="mt-4 h-[38px] w-full rounded-md bg-sunrise-amber font-label-bold text-label-bold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {verifyMutation.isPending
          ? "Verifying..."
          : "Verify & Continue"}
      </button>
    </form>
  );
}