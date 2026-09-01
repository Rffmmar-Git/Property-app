import { useAuthStore } from "../stores/auth.store";

export function useAuth() {
  const accessToken = useAuthStore(
    (state) => state.accessToken,
  );

  const user = useAuthStore(
    (state) => state.user,
  );

  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated,
  );

  const setAuth = useAuthStore(
    (state) => state.setAuth,
  );

  const clearAuth = useAuthStore(
    (state) => state.clearAuth,
  );

  return {
    accessToken,
    user,
    isAuthenticated,
    setAuth,
    clearAuth,
  };
}