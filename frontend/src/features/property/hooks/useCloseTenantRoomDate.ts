import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  closeTenantRoomDate,
  type CreateTenantRoomAvailabilityPayload,
} from "../api/tenant-room-availability.api";

interface CloseTenantRoomDateVariables {
  roomId: string;
  payload: CreateTenantRoomAvailabilityPayload;
}

export const useCloseTenantRoomDate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      roomId,
      payload,
    }: CloseTenantRoomDateVariables) =>
      closeTenantRoomDate(roomId, payload),

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