import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  uploadPropertyImages,
  type PropertyImage,
} from "../api/property-image.api";

export const useUploadPropertyImages = () => {
  const queryClient = useQueryClient();

  return useMutation<
    PropertyImage[],
    Error,
    { propertyId: string; files: File[] }
  >({
    mutationFn: ({ propertyId, files }) =>
      uploadPropertyImages(propertyId, files),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["property-images", variables.propertyId],
      });
    },
  });
};