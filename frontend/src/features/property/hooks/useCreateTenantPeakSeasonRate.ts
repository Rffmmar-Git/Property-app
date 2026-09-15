import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createTenantPeakSeasonRate,
  type CreateTenantPeakSeasonPayload,
} from "../api/tenant-peak-season.api";

interface CreateTenantPeakSeasonRateVariables {
  roomId: string;
  payload: CreateTenantPeakSeasonPayload;
}

export const useCreateTenantPeakSeasonRate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      roomId,
      payload,
    }: CreateTenantPeakSeasonRateVariables) =>
      createTenantPeakSeasonRate(roomId, payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["tenant-peak-season-rates", variables.roomId],
      });
    },
  });
};