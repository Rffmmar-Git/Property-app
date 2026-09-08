import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateTenantRoom,
  type UpdateTenantRoomPayload,
} from "../api/tenant-room.api";

export const useUpdateTenantRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      roomId,
      payload,
    }: {
      roomId: string;
      payload: UpdateTenantRoomPayload;
    }) => updateTenantRoom(roomId, payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["tenant-rooms"],
      });

      queryClient.invalidateQueries({
        queryKey: ["tenant-room", variables.roomId],
      });
    },
  });
};