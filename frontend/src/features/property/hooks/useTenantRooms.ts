import { useQuery } from "@tanstack/react-query";
import { getMyRooms } from "../api/tenant-room.api";

export const useTenantRooms = () => {
  return useQuery({
    queryKey: ["tenant-rooms"],
    queryFn: getMyRooms,
  });
};