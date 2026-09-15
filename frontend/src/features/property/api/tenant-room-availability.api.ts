import { api } from "../../../services/api/axios";

export interface TenantRoomAvailability {
  id: string;
  room_id: string;
  available_date: string;
  available_rooms: number;
  is_closed: boolean;
  closure_reason: string | null;
  created_at: string | null;
  updated_at: string | null;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface CreateTenantRoomAvailabilityPayload {
  startDate: string;
  endDate: string;
  roomsToClose: number;
  closureReason?: string;
}

export const getTenantRoomClosedDates = async (
  roomId: string,
): Promise<TenantRoomAvailability[]> => {
  const response = await api.get<
    ApiResponse<TenantRoomAvailability[]>
  >(`/tenant/properties/rooms/${roomId}/availability`);

  return response.data.data;
};

export const closeTenantRoomDate = async (
  roomId: string,
  payload: CreateTenantRoomAvailabilityPayload,
): Promise<TenantRoomAvailability[]> => {
  const response = await api.post<
    ApiResponse<TenantRoomAvailability[]>
  >(
    `/tenant/properties/rooms/${roomId}/availability`,
    payload,
  );

  return response.data.data;
};

export const openTenantRoomDate = async (
  availabilityId: string,
): Promise<null> => {
  const response = await api.delete<ApiResponse<null>>(
    `/tenant/properties/rooms/availability/${availabilityId}`,
  );

  return response.data.data;
};