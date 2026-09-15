import { api } from "../../../services/api/axios";

export type PeakSeasonAdjustmentType = "PERCENTAGE" | "FIXED";

export interface TenantPeakSeasonRate {
  id: string;
  room_id: string;
  start_date: string;
  end_date: string;
  adjustment_type: PeakSeasonAdjustmentType;
  adjustment_value: number;
  created_at: string | null;
  updated_at: string | null;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface CreateTenantPeakSeasonPayload {
  startDate: string;
  endDate: string;
  adjustmentType: PeakSeasonAdjustmentType;
  adjustmentValue: number;
}

export type UpdateTenantPeakSeasonPayload =
  Partial<CreateTenantPeakSeasonPayload>;

export const getTenantPeakSeasonRates = async (
  roomId: string,
): Promise<TenantPeakSeasonRate[]> => {
  const response = await api.get<ApiResponse<TenantPeakSeasonRate[]>>(
    `/tenant/properties/rooms/${roomId}/peak-season`,
  );

  return response.data.data;
};

export const getTenantPeakSeasonRate = async (
  rateId: string,
): Promise<TenantPeakSeasonRate> => {
  const response = await api.get<ApiResponse<TenantPeakSeasonRate>>(
    `/tenant/properties/rooms/peak-season/${rateId}`,
  );

  return response.data.data;
};

export const createTenantPeakSeasonRate = async (
  roomId: string,
  payload: CreateTenantPeakSeasonPayload,
): Promise<TenantPeakSeasonRate> => {
  const response = await api.post<ApiResponse<TenantPeakSeasonRate>>(
    `/tenant/properties/rooms/${roomId}/peak-season`,
    payload,
  );

  return response.data.data;
};

export const updateTenantPeakSeasonRate = async (
  rateId: string,
  payload: UpdateTenantPeakSeasonPayload,
): Promise<TenantPeakSeasonRate> => {
  const response = await api.patch<ApiResponse<TenantPeakSeasonRate>>(
    `/tenant/properties/rooms/peak-season/${rateId}`,
    payload,
  );

  return response.data.data;
};

export const deleteTenantPeakSeasonRate = async (
  rateId: string,
): Promise<null> => {
  const response = await api.delete<ApiResponse<null>>(
    `/tenant/properties/rooms/peak-season/${rateId}`,
  );

  return response.data.data;
};