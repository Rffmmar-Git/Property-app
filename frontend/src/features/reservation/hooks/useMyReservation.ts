import { useQuery } from "@tanstack/react-query";
import { getMyReservations } from "../api/reservation.api";

export const useMyReservations = () => {
  return useQuery({
    queryKey: ["my-reservations"],
    queryFn: getMyReservations,
  });
};