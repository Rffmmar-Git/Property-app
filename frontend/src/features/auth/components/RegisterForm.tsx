import axios from "axios";
import { useState } from "react";
import { Mail, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { useRegister } from "../hooks/useRegister";

export function RegisterForm() {
  const navigate = useNavigate();
  const registerMutation = useRegister();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  const getErrorMessage = () => {
    const error = registerMutation.error;

    if (axios.isAxiosError(error)) {
      if (error.response?.status === 409) {
        return "This email is already registered. Please use another email or log in.";
      }

      return (
        error.response?.data?.message ||
        "Unable to create your account. Please try again."
      );
    }

    return "Unable to create your account. Please try again.";
  };

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    registerMutation.mutate(
      {
        fullName: fullName.trim(),
        email: email.trim(),
      },
      {
        onSuccess: () => {
          navigate("/check-email", {
            state: {
              email: email.trim(),
            },
          });
        },
      },
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full"
    >
      {/* Full Name */}
      <div className="relative mb-3">
        <User
          className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-muted"
          strokeWidth={1.8}
        />

        <input
          id="fullName"
          type="text"
          value={fullName}
          onChange={(event) =>
            setFullName(event.target.value)
          }
          placeholder="Full Name"
          autoComplete="name"
          required
          className="h-[42px] w-full rounded-md border border-outline-variant bg-surface-white pl-10 pr-3 font-body-sm text-body-sm text-slate-text outline-none transition placeholder:text-slate-muted focus:border-midnight-indigo focus:ring-2 focus:ring-midnight-indigo/10"
        />
      </div>

      {/* Email */}
      <div className="relative">
        <Mail
          className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-muted"
          strokeWidth={1.8}
        />

        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) =>
            setEmail(event.target.value)
          }
          placeholder="Email Address"
          autoComplete="email"
          required
          className="h-[42px] w-full rounded-md border border-outline-variant bg-surface-white pl-10 pr-3 font-body-sm text-body-sm text-slate-text outline-none transition placeholder:text-slate-muted focus:border-midnight-indigo focus:ring-2 focus:ring-midnight-indigo/10"
        />
      </div>

      {/* Error */}
      {registerMutation.isError && (
        <div className="mt-3 rounded-md bg-red-50 px-3 py-2 font-body-sm text-body-sm text-red-600">
          {getErrorMessage()}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={registerMutation.isPending}
        className="mt-4 h-[38px] w-full rounded-md bg-sunrise-amber font-label-bold text-label-bold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {registerMutation.isPending
          ? "Creating account..."
          : "Create account"}
      </button>

      {/* Tenant Registration */}
      <div className="mt-4 text-center">
        <p className="font-body-sm text-body-sm text-slate-muted">
          Want to list your property?
        </p>

        <Link
          to="/register/tenant"
          className="mt-1 inline-block font-label-bold text-label-bold text-midnight-indigo hover:underline"
        >
          Register as a Tenant
        </Link>
      </div>

      {/* Login */}
      <div className="mt-5 border-t border-outline-variant pt-4 text-center">
        <p className="font-body-sm text-body-sm text-slate-muted">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-label-bold text-label-bold text-midnight-indigo hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </form>
  );
}