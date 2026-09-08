import { useMutation, useQueryClient } from "@tanstack/react-query";
import { openTenantRoomDate } from "../api/tenant-room-availability.api";

interface OpenTenantRoomDateVariables {
  roomId: string;
  availabilityId: string;
}

export const useOpenTenantRoomDate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      availabilityId,
    }: OpenTenantRoomDateVariables) =>
      openTenantRoomDate(availabilityId),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          "tenant-room-availability",
          variables.roomId,
        ],
      });
    },
  });
};