import { api } from "../../../services/api/axios";

export interface TenantProfile {
  id: string;
  fullName: string;
  email: string;
  role: "TENANT";
  provider: "EMAIL";
  isVerified: boolean;
  profilePicture?: string | null;
  companyName: string | null;
  identityNumber: string | null;
  taxNumber: string | null;
  bankName: string | null;
  bankAccountName: string | null;
  bankAccountNumber: string | null;
  identityDocumentUrl: string | null;
}

export interface UpdateTenantProfilePayload {
  companyName?: string;
  identityNumber?: string;
  taxNumber?: string;
  bankName?: string;
  bankAccountName?: string;
  bankAccountNumber?: string;
}

export const getTenantProfile = async (): Promise<TenantProfile> => {
  const response = await api.get<{
    success: boolean;
    message: string;
    data: TenantProfile;
  }>("/tenant/me");

  return response.data.data;
};

export const updateTenantProfile = async (
  payload: UpdateTenantProfilePayload,
): Promise<TenantProfile> => {
  const response = await api.patch<{
    success: boolean;
    message: string;
    data: TenantProfile;
  }>("/tenant/me", payload);

  return response.data.data;
};

export const updateTenantIdentityDocument = async (
  file: File,
): Promise<TenantProfile> => {
  const formData = new FormData();

  formData.append("identityDocument", file);

  const response = await api.post<{
    success: boolean;
    message: string;
    data: TenantProfile;
  }>("/tenant/me/identity-document", formData);

  return response.data.data;
};