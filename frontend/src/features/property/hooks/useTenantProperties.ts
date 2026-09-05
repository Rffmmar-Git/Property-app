import { useQuery } from "@tanstack/react-query";
import { getMyProperties } from "../api/tenant-property.api";

export const useTenantProperties = () => {
  return useQuery({
    queryKey: ["tenant-properties"],
    queryFn: getMyProperties,
  });
};