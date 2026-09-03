import { useMutation } from "@tanstack/react-query";

import { tenantLogin } from "../api/auth.api";

import { useAuthStore } from "../../../stores/auth.store";

export const useTenantLogin = () => {
  const setAuth = useAuthStore(
    (state) => state.setAuth,
  );

  return useMutation({
    mutationFn: tenantLogin,

    onSuccess: (data) => {
      setAuth(
        data.accessToken,
        data.user,
      );
    },
  });
};