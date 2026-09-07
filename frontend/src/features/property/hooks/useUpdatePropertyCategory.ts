import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  updatePropertyCategory,
  type PropertyCategoryPayload,
} from "../api/property-category.api";

export const useUpdatePropertyCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: PropertyCategoryPayload;
    }) => updatePropertyCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["property-categories"],
      });
    },
  });
};