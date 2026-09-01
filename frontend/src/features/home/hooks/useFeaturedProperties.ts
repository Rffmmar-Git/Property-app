import { useQuery } from "@tanstack/react-query";

import { getHomeProperties } from "../api/home.api";

export const useFeaturedProperties = () => {
  return useQuery({
    queryKey: ["home-properties"],
    queryFn: getHomeProperties,
  });
};