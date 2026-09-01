import { useMutation } from "@tanstack/react-query";

import { login } from "../api/auth.api";
import { useAuthStore } from "../../../stores/auth.store";

export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setAuth(data.accessToken, data.user);
    },
  });
};