import {
  keepPreviousData,
  useQuery,
} from "@tanstack/react-query";

import { getPropertyDetail } from "../api/property-detail.api";

export const usePropertyDetail = (
  propertyId: string,
  roomId?: string,
) => {
  return useQuery({
    queryKey: [
      "property-detail",
      propertyId,
      roomId ?? null,
    ],
    queryFn: () =>
      getPropertyDetail(propertyId, {
        roomId,
      }),
    enabled: Boolean(propertyId),
    placeholderData: keepPreviousData,
  });
};