import { useQuery } from "@tanstack/react-query";

import { getPropertyCategories } from "../api/property-category.api";

export const usePropertyCategories = () => {
  return useQuery({
    queryKey: ["property-categories"],
    queryFn: getPropertyCategories,
  });
};