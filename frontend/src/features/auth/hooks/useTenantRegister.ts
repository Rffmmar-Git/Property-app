import { useMutation } from "@tanstack/react-query";

import { registerTenant } from "../api/auth.api";

export const useTenantRegister = () => {
  return useMutation({
    mutationFn: registerTenant,
  });
};