import { useMutation } from "@tanstack/react-query";

import {
  resetPassword,
  type ResetPasswordPayload,
} from "../api/auth.api";

export const useResetPassword = () => {
  return useMutation({
    mutationFn: (payload: ResetPasswordPayload) =>
      resetPassword(payload),
  });
};