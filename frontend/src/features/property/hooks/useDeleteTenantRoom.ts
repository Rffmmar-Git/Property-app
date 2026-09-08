import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTenantRoom } from "../api/tenant-room.api";

export const useDeleteTenantRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (roomId: string) => deleteTenantRoom(roomId),

    onSuccess: (_, roomId) => {
      queryClient.invalidateQueries({
        queryKey: ["tenant-rooms"],
      });

      queryClient.removeQueries({
        queryKey: ["tenant-room", roomId],
      });
    },
  });
};