import { useQuery } from "@tanstack/react-query";

import {
  getProperties,
  type GetPropertiesParams,
} from "../api/property.api";

export const useProperties = (
  params: GetPropertiesParams = {},
) => {
  return useQuery({
    queryKey: ["properties", params],
    queryFn: () => getProperties(params),
  });
};