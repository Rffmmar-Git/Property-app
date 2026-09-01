import { useMutation } from "@tanstack/react-query";

import { resendVerification } from "../api/auth.api";

export const useResendVerification = () => {
  return useMutation({
    mutationFn: resendVerification,
  });
};