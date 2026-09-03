import HomeNavbar from "../../features/home/components/HomeNavbar";
import CustomerProfile from "../../features/profile/components/CustomerProfile";
import { useCustomerProfile } from "../../features/profile/hooks/useCustomerProfile";

export default function CustomerProfilePage() {
  const { data: profile, isLoading, isError } = useCustomerProfile();

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-surface">
        <HomeNavbar />

        <main className="mx-auto w-full max-w-[1000px] flex-1 px-5 py-8 sm:px-6 lg:px-8">
          <div>
            <div className="h-4 w-20 animate-pulse rounded bg-slate-200" />
            <div className="mt-2 h-9 w-44 animate-pulse rounded bg-slate-200" />
            <div className="mt-3 h-4 w-80 max-w-full animate-pulse rounded bg-slate-200" />
          </div>

          <div className="mt-6 h-48 animate-pulse rounded-xl bg-slate-200" />
        </main>
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="flex min-h-screen flex-col bg-surface">
        <HomeNavbar />

        <main className="mx-auto flex w-full max-w-[1000px] flex-1 items-center justify-center px-5 py-10 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-xl font-semibold text-slate-text">
              Unable to load profile
            </h1>

            <p className="mt-2 text-sm text-slate-muted">
              We could not load your profile information.
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <HomeNavbar />

      <main className="mx-auto w-full max-w-[1000px] flex-1 px-5 py-8 sm:px-6 lg:px-8">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-midnight-indigo">
            Account
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-text">
            My Profile
          </h1>

          <p className="mt-2 text-sm text-slate-muted">
            Manage your personal information and account settings.
          </p>
        </div>

        <div className="mt-6">
          <CustomerProfile profile={profile} />
        </div>
      </main>
    </div>
  );
}
