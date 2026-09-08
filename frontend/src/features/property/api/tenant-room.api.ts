import { api } from "../../../services/api/axios";

export interface TenantRoom {
  id: string;
  property_id: string;
  room_name: string;
  description: string | null;
  capacity: number;
  base_price: number;
  total_rooms: number;
  created_at: string | null;
  updated_at: string | null;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface CreateTenantRoomPayload {
  roomName: string;
  description?: string;
  capacity: number;
  basePrice: number;
  totalRooms: number;
}

export type UpdateTenantRoomPayload =
  Partial<CreateTenantRoomPayload>;

export const getMyRooms = async (): Promise<TenantRoom[]> => {
  const response = await api.get<ApiResponse<TenantRoom[]>>(
    "/tenant/properties/rooms",
  );

  return response.data.data;
};

export const getMyRoom = async (
  roomId: string,
): Promise<TenantRoom> => {
  const response = await api.get<ApiResponse<TenantRoom>>(
    `/tenant/properties/rooms/${roomId}`,
  );

  return response.data.data;
};

export const createTenantRoom = async (
  propertyId: string,
  payload: CreateTenantRoomPayload,
): Promise<TenantRoom> => {
  const response = await api.post<ApiResponse<TenantRoom>>(
    `/tenant/properties/${propertyId}/rooms`,
    payload,
  );

  return response.data.data;
};

export const updateTenantRoom = async (
  roomId: string,
  payload: UpdateTenantRoomPayload,
): Promise<TenantRoom> => {
  const response = await api.patch<ApiResponse<TenantRoom>>(
    `/tenant/properties/rooms/${roomId}`,
    payload,
  );

  return response.data.data;
};

export const deleteTenantRoom = async (
  roomId: string,
): Promise<null> => {
  const response = await api.delete<ApiResponse<null>>(
    `/tenant/properties/rooms/${roomId}`,
  );

  return response.data.data;
};