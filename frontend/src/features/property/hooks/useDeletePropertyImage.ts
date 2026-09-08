import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePropertyImage } from "../api/property-image.api";

export const useDeletePropertyImage = () => {
  const queryClient = useQueryClient();

  return useMutation<
    null,
    Error,
    { propertyId: string; imageId: string }
  >({
    mutationFn: ({ propertyId, imageId }) =>
      deletePropertyImage(propertyId, imageId),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["property-images", variables.propertyId],
      });
    },
  });
};