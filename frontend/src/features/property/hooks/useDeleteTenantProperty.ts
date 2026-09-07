import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTenantProperty } from "../api/tenant-property.api";

export const useDeleteTenantProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteTenantProperty(id),

    onSuccess: (_, propertyId) => {
      queryClient.invalidateQueries({
        queryKey: ["tenant-properties"],
      });

      queryClient.invalidateQueries({
        queryKey: ["tenant-property", propertyId],
      });
    },
  });
};