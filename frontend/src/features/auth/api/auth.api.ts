import { api } from "../../../services/api/axios";

import type { LoginResponse, RegisterResponse } from "../../../types/auth";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
}

export interface TenantRegisterPayload {
  fullName: string;
  email: string;
  companyName: string;
  identityNumber: string;
  taxNumber: string;
  bankName: string;
  bankAccountName: string;
  bankAccountNumber: string;
}

export interface VerifyEmailPayload {
  token: string;
  password?: string;
}

export interface ResendVerificationPayload {
  email: string;
}

export interface VerificationTokenValidation {
  valid: boolean;
  requiresPassword: boolean;
}

export const login = async (
  payload: LoginPayload,
): Promise<LoginResponse> => {
  const response = await api.post<{
    success: boolean;
    message: string;
    data: LoginResponse;
  }>("/auth/login", payload);

  return response.data.data;
};

export const tenantLogin = async (
  payload: LoginPayload,
): Promise<LoginResponse> => {
  const response = await api.post<{
    success: boolean;
    message: string;
    data: LoginResponse;
  }>("/tenant/login", payload);

  return response.data.data;
};

export const registerCustomer = async (
  payload: RegisterPayload,
): Promise<RegisterResponse> => {
  const response = await api.post<{
    success: boolean;
    message: string;
    data: RegisterResponse;
  }>("/auth/register", payload);

  return response.data.data;
};

export const registerTenant = async (
  payload: TenantRegisterPayload,
): Promise<RegisterResponse> => {
  const response = await api.post<{
    success: boolean;
    message: string;
    data: RegisterResponse;
  }>("/tenant/register", payload);

  return response.data.data;
};

export const validateVerificationToken = async (
  token: string,
): Promise<VerificationTokenValidation> => {
  const response = await api.get<{
    success: boolean;
    message: string;
    data: VerificationTokenValidation;
  }>(`/auth/verify-email/${token}`);

  return response.data.data;
};

export const verifyEmail = async (payload: VerifyEmailPayload) => {
  const response = await api.post<{
    success: boolean;
    message: string;
    data: null;
  }>("/auth/verify-email", payload);

  return response.data;
};

export const resendVerification = async (
  payload: ResendVerificationPayload,
) => {
  const response = await api.post<{
    success: boolean;
    message: string;
    data: null;
  }>("/auth/resend-verification", payload);

  return response.data;
};