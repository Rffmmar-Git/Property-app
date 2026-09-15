import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  updateTenantProfile,
  type UpdateTenantProfilePayload,
} from "../api/tenant-profile.api";

export const useUpdateTenantProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateTenantProfilePayload) =>
      updateTenantProfile(payload),

    onSuccess: async (updatedProfile) => {
      queryClient.setQueryData(["tenant-profile"], updatedProfile);

      await queryClient.invalidateQueries({
        queryKey: ["tenant-profile"],
      });
    },
  });
};