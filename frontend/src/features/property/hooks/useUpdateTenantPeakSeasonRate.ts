import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateTenantPeakSeasonRate,
  type UpdateTenantPeakSeasonPayload,
} from "../api/tenant-peak-season.api";

interface UpdateTenantPeakSeasonRateVariables {
  rateId: string;
  roomId: string;
  payload: UpdateTenantPeakSeasonPayload;
}

export const useUpdateTenantPeakSeasonRate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      rateId,
      payload,
    }: UpdateTenantPeakSeasonRateVariables) =>
      updateTenantPeakSeasonRate(rateId, payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["tenant-peak-season-rates", variables.roomId],
      });
    },
  });
};