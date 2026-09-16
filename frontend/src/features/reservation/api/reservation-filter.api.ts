import { api } from "@/services/api/axios";
import { ReservationDetail } from "../../../types/reservation";

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}


export interface MyReservationFilter {
  search?: string;
  startDate?: string;
  endDate?: string;
}

export const getFilteredMyReservations = async (
  filter: MyReservationFilter,
): Promise<ReservationDetail[]> => {
  const response = await api.get<ApiEnvelope<ReservationDetail[]>>(
    "/reservations/my-reservations",
    {
      params: filter,
    },
  );

  return response.data.data;
};