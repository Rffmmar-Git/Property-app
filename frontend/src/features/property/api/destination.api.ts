import { api } from "../../../services/api/axios";

export interface Destination {
  id: string;
  city: string;
  province: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const getDestinations = async (): Promise<Destination[]> => {
  const response = await api.get<ApiResponse<Destination[]>>(
    "/destinations",
  );

  return response.data.data;
};