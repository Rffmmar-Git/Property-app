import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createTenantRoom,
  type CreateTenantRoomPayload,
} from "../api/tenant-room.api";

export const useCreateTenantRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      propertyId,
      payload,
    }: {
      propertyId: string;
      payload: CreateTenantRoomPayload;
    }) => createTenantRoom(propertyId, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tenant-rooms"],
      });
    },
  });
};