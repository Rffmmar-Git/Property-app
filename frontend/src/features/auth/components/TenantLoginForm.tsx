import { useState } from "react";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { useTenantLogin } from "../hooks/useTenantLogin";

export function TenantLoginForm() {
  const navigate = useNavigate();
  const loginMutation = useTenantLogin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    loginMutation.mutate(
      {
        email,
        password,
      },
      {
        onSuccess: () => {
          navigate("/tenant");
        },
      },
    );
  };

  const errorMessage =
    loginMutation.error instanceof Error
      ? loginMutation.error.message
      : "Unable to login.";

  return (
    <form onSubmit={handleSubmit} className="w-full">
      {/* Email */}
      <div className="relative mb-3">
        <Mail
          className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-muted"
          strokeWidth={1.8}
        />

        <input
          id="tenant-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email Address"
          autoComplete="email"
          required
          className="h-[42px] w-full rounded-md border border-outline-variant bg-surface-white pl-10 pr-3 font-body-sm text-body-sm text-slate-text outline-none transition placeholder:text-slate-muted focus:border-midnight-indigo focus:ring-2 focus:ring-midnight-indigo/10"
        />
      </div>

      {/* Password */}
      <div className="relative">
        <LockKeyhole
          className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-muted"
          strokeWidth={1.8}
        />

        <input
          id="tenant-password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password"
          autoComplete="current-password"
          required
          className="h-[42px] w-full rounded-md border border-outline-variant bg-surface-white pl-10 pr-10 font-body-sm text-body-sm text-slate-text outline-none transition placeholder:text-slate-muted focus:border-midnight-indigo focus:ring-2 focus:ring-midnight-indigo/10"
        />

        <button
          type="button"
          onClick={() => setShowPassword((current) => !current)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-muted hover:text-slate-text"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <EyeOff className="h-[18px] w-[18px]" strokeWidth={1.8} />
          ) : (
            <Eye className="h-[18px] w-[18px]" strokeWidth={1.8} />
          )}
        </button>
      </div>

      {/* Error message */}
      {loginMutation.isError && (
        <div className="mt-3 rounded-md bg-red-50 px-3 py-2 font-body-sm text-body-sm text-red-600">
          {errorMessage}
        </div>
      )}

      {/* Login button */}
      <button
        type="submit"
        disabled={loginMutation.isPending}
        className="mt-4 h-[38px] w-full rounded-md bg-sunrise-amber font-label-bold text-label-bold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loginMutation.isPending ? "Logging in..." : "Login as Tenant"}
      </button>

      {/* Customer login */}
      <div className="mt-5 border-t border-outline-variant pt-4 text-center">
        <p className="font-body-sm text-body-sm text-slate-muted">
          Are you a customer?{" "}
          <Link
            to="/login"
            className="font-label-bold text-label-bold text-midnight-indigo hover:underline"
          >
            Customer Login
          </Link>
        </p>
      </div>
    </form>
  );
}
