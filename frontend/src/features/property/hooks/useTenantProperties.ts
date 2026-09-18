import { useQuery } from "@tanstack/react-query";
import {
  getMyProperties,
  type TenantPropertyQuery,
} from "../api/tenant-property.api";

export const useTenantProperties = (
  query: TenantPropertyQuery = {},
) => {
  return useQuery({
    queryKey: ["tenant-properties", query],
    queryFn: () => getMyProperties(query),
  });
};