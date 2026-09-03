import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateEmail } from "../api/profile.api";
import { useAuthStore } from "../../../stores/auth.store";

export const useUpdateEmail = () => {
  const queryClient = useQueryClient();

  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: updateEmail,

    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(["customer-profile"], updatedProfile);

      if (accessToken && user) {
        setAuth(accessToken, {
          ...user,
          fullName: updatedProfile.fullName,
          email: updatedProfile.email,
          role: updatedProfile.role,
          profilePicture:
            updatedProfile.profilePicture ?? user.profilePicture,
        });
      }
    },
  });
};