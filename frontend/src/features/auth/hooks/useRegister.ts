import { useMutation } from "@tanstack/react-query";

import { registerCustomer } from "../api/auth.api";

export const useRegister = () => {
  return useMutation({
    mutationFn: registerCustomer,
  });
};