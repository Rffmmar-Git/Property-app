import { useQuery } from "@tanstack/react-query";

import { getProfile } from "../api/profile.api";

export const useCustomerProfile = () => {
  return useQuery({
    queryKey: ["customer-profile"],
    queryFn: getProfile,
  });
};