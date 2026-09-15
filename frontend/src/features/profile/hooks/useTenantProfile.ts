import { useQuery } from "@tanstack/react-query";

import { getTenantProfile } from "../api/tenant-profile.api";

export const useTenantProfile = () => {
  return useQuery({
    queryKey: ["tenant-profile"],
    queryFn: getTenantProfile,
  });
};