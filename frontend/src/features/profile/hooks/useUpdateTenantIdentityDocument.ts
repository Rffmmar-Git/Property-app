import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateTenantIdentityDocument } from "../api/tenant-profile.api";

export const useUpdateTenantIdentityDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => updateTenantIdentityDocument(file),

    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(["tenant-profile"], updatedProfile);
    },
  });
};