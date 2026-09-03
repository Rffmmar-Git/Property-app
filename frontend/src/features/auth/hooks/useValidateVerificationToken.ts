import { useQuery } from "@tanstack/react-query";

import { validateVerificationToken } from "../api/auth.api";

export const useValidateVerificationToken = (
  token: string | null,
) => {
  return useQuery({
    queryKey: ["verification-token", token],

    queryFn: () => {
      if (!token) {
        throw new Error(
          "Verification token is required",
        );
      }

      return validateVerificationToken(token);
    },

    enabled: Boolean(token),

    retry: false,
  });
};