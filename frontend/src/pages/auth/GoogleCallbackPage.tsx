import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import type { AuthUser } from "../../types/auth";
import { useAuthStore } from "../../stores/auth.store";

export default function GoogleCallbackPage() {
  const navigate = useNavigate();

  const setAuth = useAuthStore((state) => state.setAuth);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.replace("#", ""));

    const accessToken = params.get("accessToken");

    const encodedUser = params.get("user");

    const googleError = params.get("error");

    if (googleError) {
      setError(googleError);
      return;
    }

    if (!accessToken || !encodedUser) {
      setError("Unable to complete Google login.");
      return;
    }

    try {
      const user: AuthUser = JSON.parse(decodeURIComponent(encodedUser));

      if (user.role !== "CUSTOMER") {
        setError("Google login is only available for customers.");
        return;
      }

      setAuth(accessToken, user);

      window.history.replaceState(null, "", window.location.pathname);

      navigate("/", {
        replace: true,
      });
    } catch {
      setError("Unable to complete Google login.");
    }
  }, [navigate, setAuth]);

  if (error) {
    return (
      <main className="min-h-screen bg-white px-4 py-8 md:px-6">
        <section className="mx-auto flex min-h-[calc(100vh-64px)] max-w-[1440px] items-center justify-center">
          <div className="w-full max-w-[400px] rounded-xl bg-white px-6 py-8 text-center shadow-[0_12px_30px_rgba(0,0,0,0.12)]">
            <h1 className="font-headline-lg text-headline-lg font-bold text-midnight-indigo">
              Google Login Failed
            </h1>

            <p className="mt-2 font-body-sm text-body-sm text-slate-muted">
              {error}
            </p>

            <Link
              to="/login"
              className="mt-6 flex h-[38px] w-full items-center justify-center rounded-md bg-midnight-indigo font-label-bold text-label-bold text-white transition hover:opacity-90"
            >
              Back to Login
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-white">
      <p className="font-body-sm text-body-sm text-slate-muted">
        Completing Google login...
      </p>
    </main>
  );
}
