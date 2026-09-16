import { useQuery } from "@tanstack/react-query";
import {
  getFilteredMyReservations,
  MyReservationFilter,
} from "../api/reservation-filter.api";

export const useFilteredMyReservations = (
  filter: MyReservationFilter,
) => {
  return useQuery({
    queryKey: ["my-reservations", "filtered", filter],
    queryFn: () => getFilteredMyReservations(filter),
  });
};