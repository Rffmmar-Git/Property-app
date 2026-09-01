import { useQuery } from "@tanstack/react-query";

import { getHomeProperties } from "../api/home.api";

export const useFeaturedProperties = (pageSize = 8) => {
  return useQuery({
    queryKey: ["home-properties", pageSize],
    queryFn: () =>
      getHomeProperties({
        page: 1,
        pageSize,
      }),
  });
};