import { TenantHeader } from "../../components/layout/TenantHeader";
import TenantProfile from "../../features/profile/components/TenantProfile";
import { useTenantProfile } from "../../features/profile/hooks/useTenantProfile";

export default function TenantProfilePage() {
  const {
    data: profile,
    isLoading,
    isError,
  } = useTenantProfile();

  if (isLoading) {
    return (
      <>
        <TenantHeader />

        <main className="min-h-screen bg-gray-50 px-6 py-10">
          <div className="mx-auto max-w-5xl">
            <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />

            <div className="mt-6 h-96 rounded-2xl bg-white shadow-sm" />
          </div>
        </main>
      </>
    );
  }

  if (isError || !profile) {
    return (
      <>
        <TenantHeader />

        <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
          <p className="text-sm text-red-600">
            Unable to load tenant profile.
          </p>
        </main>
      </>
    );
  }

  return (
    <>
      <TenantHeader />

      <main className="min-h-screen bg-gray-50 px-6 py-10">
        <div className="mx-auto max-w-5xl">
          <TenantProfile profile={profile} />
        </div>
      </main>
    </>
  );
}