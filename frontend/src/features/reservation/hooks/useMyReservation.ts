import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { getMyReservations } from "../api/reservation.api";
import { ReservationDetail } from "@/types/reservation";

type UseMyReservationsOptions = Omit <
  UseQueryOptions<ReservationDetail[], Error>,
  "queryKey" | "queryFn"
>;

export const useMyReservations = (options?: UseMyReservationsOptions) => {
  return useQuery({
    queryKey: ["my-reservations"],
    queryFn: getMyReservations,
    ...options,
  });
};