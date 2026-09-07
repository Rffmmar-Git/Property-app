import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  updateTenantProperty,
  type UpdateTenantPropertyPayload,
} from "../api/tenant-property.api";

export const useUpdateTenantProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateTenantPropertyPayload;
    }) => updateTenantProperty(id, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["tenant-properties"],
      });

      queryClient.invalidateQueries({
        queryKey: ["tenant-property", variables.id],
      });
    },
  });
};