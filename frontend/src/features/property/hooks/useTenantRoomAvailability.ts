import { useQuery } from "@tanstack/react-query";
import { getTenantRoomClosedDates } from "../api/tenant-room-availability.api";

export const useTenantRoomAvailability = (
  roomId: string | null,
) => {
  return useQuery({
    queryKey: ["tenant-room-availability", roomId],
    queryFn: () => getTenantRoomClosedDates(roomId!),
    enabled: Boolean(roomId),
  });
};