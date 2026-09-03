import { useState } from "react";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { useLogin } from "../hooks/useLogin";

export function LoginForm() {
  const navigate = useNavigate();
  const loginMutation = useLogin();

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
          navigate("/");
        },
      },
    );
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8000/api/auth/google";
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      {/* Email */}
      <div className="relative mb-3">
        <Mail
          className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-muted"
          strokeWidth={1.8}
        />

        <input
          id="email"
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
          id="password"
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
          className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-muted hover:text-slate-text"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <EyeOff className="h-[18px] w-[18px]" strokeWidth={1.8} />
          ) : (
            <Eye className="h-[18px] w-[18px]" strokeWidth={1.8} />
          )}
        </button>
      </div>

      {/* Forgot password */}
      <div className="mt-3 flex justify-end">
        <Link
          to="/forgot-password"
          className="cursor-pointer font-label-sm text-label-sm text-midnight-indigo hover:underline"
        >
          Forgot password?
        </Link>
      </div>

      {/* Error message */}
      {loginMutation.isError && (
        <div className="mt-3 rounded-md bg-red-50 px-3 py-2 font-body-sm text-body-sm text-red-600">
          Invalid email or password.
        </div>
      )}

      {/* Login button */}
      <button
        type="submit"
        disabled={loginMutation.isPending}
        className="mt-4 h-[38px] w-full cursor-pointer rounded-md bg-sunrise-amber font-label-bold text-label-bold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loginMutation.isPending ? "Logging in..." : "Login"}
      </button>

      {/* Tenant Login */}
      <div className="mt-3 text-center">
        <p className="font-body-sm text-body-sm text-slate-muted">
          Are you a tenant?{" "}
          <Link
            to="/tenant/login"
            className="cursor-pointer font-label-bold text-label-bold text-midnight-indigo hover:underline"
          >
            Login here
          </Link>
        </p>
      </div>

      {/* Divider */}
      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-outline-variant" />

        <span className="font-label-sm text-label-sm text-slate-muted">OR</span>

        <div className="h-px flex-1 bg-outline-variant" />
      </div>

      {/* Google Login */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        className="flex h-[40px] w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-outline-variant bg-surface-white font-label-bold text-label-bold text-slate-text transition hover:bg-surface"
      >
        <span className="font-bold text-[#4285F4]">G</span>
        Continue with Google
      </button>

      {/* Register */}
      <div className="mt-5 border-t border-outline-variant pt-4 text-center">
        <p className="font-body-sm text-body-sm text-slate-muted">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="cursor-pointer font-label-bold text-label-bold text-midnight-indigo hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </form>
  );
}
