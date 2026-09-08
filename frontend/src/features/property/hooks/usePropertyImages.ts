import { useQuery } from "@tanstack/react-query";
import { getPropertyImages } from "../api/property-image.api";

export const usePropertyImages = (propertyId: string | null) => {
  return useQuery({
    queryKey: ["property-images", propertyId],
    queryFn: () => getPropertyImages(propertyId!),
    enabled: Boolean(propertyId),
  });
};