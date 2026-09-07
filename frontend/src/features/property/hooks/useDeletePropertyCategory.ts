import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deletePropertyCategory } from "../api/property-category.api";

export const useDeletePropertyCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deletePropertyCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["property-categories"],
      });
    },
  });
};