import { z } from "zod";

export const tenantRegisterSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must not exceed 100 characters"),

  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .max(255, "Email must not exceed 255 characters"),

  companyName: z
    .string()
    .trim()
    .min(2, "Company name must be at least 2 characters")
    .max(150, "Company name must not exceed 150 characters"),

  identityNumber: z
    .string()
    .trim()
    .min(1, "Identity number is required")
    .max(50, "Identity number must not exceed 50 characters"),

  taxNumber: z
    .string()
    .trim()
    .max(50, "Tax number must not exceed 50 characters")
    .optional(),

  bankName: z
    .string()
    .trim()
    .max(100, "Bank name must not exceed 100 characters")
    .optional(),

  bankAccountName: z
    .string()
    .trim()
    .max(100, "Bank account name must not exceed 100 characters")
    .optional(),

  bankAccountNumber: z
    .string()
    .trim()
    .max(50, "Bank account number must not exceed 50 characters")
    .optional(),
});

export type TenantRegisterInput = z.infer<
  typeof tenantRegisterSchema
>;