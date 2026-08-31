import { z } from "zod";

export const updateEmailSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
});

export type UpdateEmailInput = z.infer<typeof updateEmailSchema>;