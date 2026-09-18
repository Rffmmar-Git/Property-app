import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { useAuthStore } from "@/stores/auth.store";
import { ROUTES, user_role } from "./route-config";
import type { UserRole } from "./route-config";

interface RoleRouteProps {
  allowedRoles: UserRole[];
  children: ReactNode;
}

export function RoleRoute({
  allowedRoles,
  children,
}: RoleRouteProps) {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated,
  );
  const hasHydrated = useAuthStore((state) => state._hasHydrated);

  if (!hasHydrated) {
    return null;
  }

  if (!isAuthenticated || !user) {
    const isTenantRoute = allowedRoles.includes(
      user_role.TENANT,
    );

    return (
      <Navigate
        to={
          isTenantRoute
            ? ROUTES.TENANT_LOGIN
            : ROUTES.LOGIN
        }
        replace
      />
    );
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={ROUTES.UNAUTHORIZED} replace />;
  }

  return <>{children}</>;
}