import { api } from "../../../services/api/axios";

export interface CustomerProfile {
  id: string;
  fullName: string;
  email: string;
  role: "CUSTOMER" | "TENANT";
  provider: "EMAIL" | "GOOGLE";
  isVerified: boolean;
  profilePicture?: string | null;
}

export interface UpdateProfilePayload {
  fullName: string;
}

export interface UpdateEmailPayload {
  email: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const getProfile = async (): Promise<CustomerProfile> => {
  const response = await api.get<{
    success: boolean;
    message: string;
    data: CustomerProfile;
  }>("/profile");

  return response.data.data;
};

export const updateProfile = async (
  payload: UpdateProfilePayload,
): Promise<CustomerProfile> => {
  const response = await api.patch<{
    success: boolean;
    message: string;
    data: CustomerProfile;
  }>("/profile", payload);

  return response.data.data;
};

export const updateEmail = async (
  payload: UpdateEmailPayload,
): Promise<CustomerProfile> => {
  const response = await api.patch<{
    success: boolean;
    message: string;
    data: CustomerProfile;
  }>("/profile/email", payload);

  return response.data.data;
};

export const updateProfilePicture = async (
  file: File,
): Promise<CustomerProfile> => {
  const formData = new FormData();
  formData.append("profilePicture", file);

  const response = await api.patch<{
    success: boolean;
    message: string;
    data: CustomerProfile;
  }>("/profile/avatar", formData);

  return response.data.data;
};

export const changePassword = async (
  payload: ChangePasswordPayload,
): Promise<{ message: string }> => {
  const response = await api.patch<{
    success: boolean;
    message: string;
    data: {
      message: string;
    };
  }>("/profile/change-password", payload);

  return {
    message: response.data.message,
  };
};