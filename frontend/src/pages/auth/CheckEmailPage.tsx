import { Link } from "react-router-dom";

import { CheckEmail } from "../../features/auth/components/CheckEmail";

export default function CheckEmailPage() {
  return (
    <main className="min-h-screen bg-white px-4 py-8 md:px-6">
      <section className="mx-auto flex min-h-[calc(100vh-64px)] max-w-[1440px] items-center justify-center">
        <div className="w-full max-w-[400px] rounded-xl bg-white px-6 py-8 shadow-[0_12px_30px_rgba(0,0,0,0.12)]">
          <div className="mb-5 text-center">
            <Link
              to="/"
              className="font-headline-md text-headline-md font-bold text-midnight-indigo"
            >
              Property App
            </Link>
          </div>

          <CheckEmail />
        </div>
      </section>
    </main>
  );
}