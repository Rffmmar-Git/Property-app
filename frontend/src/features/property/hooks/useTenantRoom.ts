import { useQuery } from "@tanstack/react-query";
import { getMyRoom } from "../api/tenant-room.api";

export const useTenantRoom = (roomId: string | null) => {
  return useQuery({
    queryKey: ["tenant-room", roomId],
    queryFn: () => getMyRoom(roomId!),
    enabled: Boolean(roomId),
  });
};