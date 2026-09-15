import { useQuery } from "@tanstack/react-query";
import { getTenantPeakSeasonRates } from "../api/tenant-peak-season.api";

export const useTenantPeakSeasonRates = (roomId: string | null) => {
  return useQuery({
    queryKey: ["tenant-peak-season-rates", roomId],
    queryFn: () => getTenantPeakSeasonRates(roomId as string),
    enabled: Boolean(roomId),
  });
};