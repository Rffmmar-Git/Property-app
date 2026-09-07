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

export interface CreateTenantPropertyPayload {
  name: string;
  categoryId: string;
  destinationId: string;
  description?: string;
  address: string;
  latitude?: number;
  longitude?: number;
  checkInTime?: string;
  checkOutTime?: string;
}

export interface TenantPropertyDetail {
  id: string;
  tenant_id: string;
  category_id: string;
  destination_id: string;
  name: string;
  description: string | null;
  address: string;
  latitude: number | null;
  longitude: number | null;
  check_in_time: string | null;
  check_out_time: string | null;
}

export interface UpdateTenantPropertyPayload {
  name?: string;
  categoryId?: string;
  destinationId?: string;
  description?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  checkInTime?: string;
  checkOutTime?: string;
}

export const getMyProperties = async (): Promise<TenantProperty[]> => {
  const response = await api.get<ApiResponse<TenantProperty[]>>(
    "/tenant/properties/mine",
  );

  return response.data.data;
};

export const createTenantProperty = async (
  data: CreateTenantPropertyPayload,
): Promise<TenantProperty> => {
  const response = await api.post<ApiResponse<TenantProperty>>(
    "/tenant/properties",
    data,
  );

  return response.data.data;
};

export const getMyProperty = async (
  id: string,
): Promise<TenantPropertyDetail> => {
  const response = await api.get<ApiResponse<TenantPropertyDetail>>(
    `/tenant/properties/mine/${id}`,
  );

  return response.data.data;
};

export const updateTenantProperty = async (
  id: string,
  data: UpdateTenantPropertyPayload,
): Promise<TenantPropertyDetail> => {
  const response = await api.patch<ApiResponse<TenantPropertyDetail>>(
    `/tenant/properties/mine/${id}`,
    data,
  );

  return response.data.data;
};

export const deleteTenantProperty = async (
  id: string,
): Promise<null> => {
  const response = await api.delete<ApiResponse<null>>(
    `/tenant/properties/mine/${id}`,
  );

  return response.data.data;
};