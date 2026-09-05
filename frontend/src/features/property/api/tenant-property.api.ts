import { api } from "../../../services/api/axios";

export interface TenantProperty {
  id: string;
  name: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const getMyProperties = async (): Promise<TenantProperty[]> => {
  const response = await api.get<ApiResponse<TenantProperty[]>>(
    "/tenant-properties/mine",
  );

  return response.data.data;
};