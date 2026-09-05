import { api } from "@/services/api/axios";
import { ReservationDetail } from "../../../types/reservation";

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

export const getReservationById = async (
  reservationId: number,
): Promise<ReservationDetail> => {
  const response = await api.get<ApiEnvelope<ReservationDetail>>(
    `/reservations/${reservationId}`,
  );

  return response.data.data;
};

export const getMyReservations = async (): Promise<ReservationDetail[]> => {
  const response = await api.get<ApiEnvelope<ReservationDetail[]>>(
    "/reservations/my-reservations",
  );

  return response.data.data;
};