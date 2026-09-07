import { useQuery } from "@tanstack/react-query";

import { getMyProperty } from "../api/tenant-property.api";

export const useTenantProperty = (id: string | null) => {
  return useQuery({
    queryKey: ["tenant-property", id],
    queryFn: () => getMyProperty(id!),
    enabled: Boolean(id),
  });
};