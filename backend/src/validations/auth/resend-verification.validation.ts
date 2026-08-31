import { z } from "zod";

export const resendVerificationSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .toLowerCase(),
});

export type ResendVerificationInput =
  z.infer<typeof resendVerificationSchema>;