import { Link } from "react-router-dom";

import { LoginForm } from "../../features/auth/components/LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-white px-4 py-8 md:px-6">
      <section className="mx-auto flex min-h-[calc(100vh-64px)] max-w-[1440px] items-center justify-center">
        <div className="w-full max-w-[400px] rounded-xl bg-white px-6 py-8 shadow-[0_12px_30px_rgba(0,0,0,0.12)]">
          {/* Brand */}
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
              Welcome back
            </h1>

            <p className="mt-1 font-body-sm text-body-sm text-slate-muted">
              Please enter your details to sign in.
            </p>
          </div>

          <LoginForm />
        </div>
      </section>
    </main>
  );
}