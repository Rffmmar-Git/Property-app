import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address"),

  password: z
    .string()
    .min(1, "Password is required"),
});

export const registerSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name is too long"),

  email: z
    .string()
    .email("Please enter a valid email address"),
});

export const tenantRegisterSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name is too long"),

  email: z
    .string()
    .email("Please enter a valid email address"),

  companyName: z
    .string()
    .min(2, "Company name is required"),

  identityNumber: z
    .string()
    .min(1, "Identity number is required"),

  taxNumber: z
    .string()
    .min(1, "Tax number is required"),

  bankName: z
    .string()
    .min(1, "Bank name is required"),

  bankAccountName: z
    .string()
    .min(1, "Bank account name is required"),

  bankAccountNumber: z
    .string()
    .min(1, "Bank account number is required"),
});

export type LoginInput = z.infer<
  typeof loginSchema
>;

export type RegisterInput = z.infer<
  typeof registerSchema
>;

export type TenantRegisterInput = z.infer<
  typeof tenantRegisterSchema
>;