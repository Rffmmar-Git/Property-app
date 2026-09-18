import { useMutation, useQueryClient } from "@tanstack/react-query";
import { publishTenantProperty } from "../api/tenant-property.api";

export const usePublishTenantProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: publishTenantProperty,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tenant-properties"],
      });
    },
  });
};