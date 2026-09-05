import { useQuery } from "@tanstack/react-query";
import { getReservationById } from "../api/reservation.api";

export const useReservation = (reservationId: number | undefined) => {
  return useQuery({
    queryKey: ["reservation", reservationId],
    queryFn: () => getReservationById(reservationId as number),
    enabled: Boolean(reservationId),
  });
};