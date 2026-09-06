import { useMutation } from "@tanstack/react-query";

import {
  forgotPassword,
  type ForgotPasswordPayload,
} from "../api/auth.api";

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (payload: ForgotPasswordPayload) =>
      forgotPassword(payload),
  });
};