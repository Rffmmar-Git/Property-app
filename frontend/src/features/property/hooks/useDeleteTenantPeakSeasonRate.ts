import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTenantPeakSeasonRate } from "../api/tenant-peak-season.api";

interface DeleteTenantPeakSeasonRateVariables {
  rateId: string;
  roomId: string;
}

export const useDeleteTenantPeakSeasonRate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ rateId }: DeleteTenantPeakSeasonRateVariables) =>
      deleteTenantPeakSeasonRate(rateId),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["tenant-peak-season-rates", variables.roomId],
      });
    },
  });
};