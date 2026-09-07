import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createTenantProperty,
  type CreateTenantPropertyPayload,
} from "../api/tenant-property.api";

export const useCreateTenantProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTenantPropertyPayload) =>
      createTenantProperty(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tenant-properties"],
      });
    },
  });
};