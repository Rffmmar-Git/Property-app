import { z } from "zod";

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must not exceed 100 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
});

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;