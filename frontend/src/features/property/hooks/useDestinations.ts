import { useQuery } from "@tanstack/react-query";

import { getDestinations } from "../api/destination.api";

export const useDestinations = () => {
  return useQuery({
    queryKey: ["destinations"],
    queryFn: getDestinations,
  });
};