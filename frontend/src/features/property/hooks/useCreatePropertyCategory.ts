import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createPropertyCategory,
  type PropertyCategoryPayload,
} from "../api/property-category.api";

export const useCreatePropertyCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PropertyCategoryPayload) =>
      createPropertyCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["property-categories"],
      });
    },
  });
};