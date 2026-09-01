import { Mail } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import { useResendVerification } from "../hooks/useResendVerification";

export function CheckEmail() {
  const location = useLocation();

  const email = location.state?.email as string | undefined;

  const resendMutation = useResendVerification();

  const handleResend = () => {
    if (!email) {
      return;
    }

    resendMutation.mutate({
      email,
    });
  };

  return (
    <div className="w-full">
      <div className="mb-5 flex justify-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">
          <Mail className="h-7 w-7 text-midnight-indigo" strokeWidth={1.8} />
        </div>
      </div>

      <div className="text-center">
        <h1 className="font-headline-lg text-headline-lg font-bold text-black">
          Check your email
        </h1>

        <p className="mt-2 font-body-sm text-body-sm text-slate-muted">
          We've sent a verification link to:
        </p>

        {email && (
          <p className="mt-1 break-all font-label-bold text-label-bold text-midnight-indigo">
            {email}
          </p>
        )}

        <p className="mt-4 font-body-sm text-body-sm text-slate-muted">
          Click the link in the email to verify your account and create your
          password.
        </p>

        <p className="mt-3 font-body-sm text-body-sm text-slate-muted">
          Once you've verified your email, you can close this tab.
        </p>
      </div>

      {resendMutation.isSuccess && (
        <div className="mt-4 rounded-md bg-green-50 px-3 py-2 text-center font-body-sm text-body-sm text-green-700">
          Verification email sent successfully.
        </div>
      )}

      {resendMutation.isError && (
        <div className="mt-4 rounded-md bg-red-50 px-3 py-2 text-center font-body-sm text-body-sm text-red-600">
          Unable to resend verification email. Please try again.
        </div>
      )}

      <div className="mt-6 text-center">
        <p className="font-body-sm text-body-sm text-slate-muted">
          Didn't receive the email?
        </p>

        <button
          type="button"
          onClick={handleResend}
          disabled={!email || resendMutation.isPending}
          className="mt-2 font-label-bold text-label-bold text-midnight-indigo hover:underline disabled:cursor-not-allowed disabled:opacity-50"
        >
          {resendMutation.isPending
            ? "Sending..."
            : "Resend Verification Email"}
        </button>
      </div>

      <div className="mt-5 border-t border-outline-variant pt-4 text-center">
        <Link
          to="/login"
          className="font-label-bold text-label-bold text-midnight-indigo hover:underline"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
}
