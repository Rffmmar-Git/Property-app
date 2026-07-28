import prisma from "../config/prisma";
import { Prisma, room_availabilities } from "../generated/prisma/client";

/**
 * Find room availabilities within date range.
 */
export async function findManyByRoomIdAndDateRange(
  roomId: number,
  checkIn: Date,
  checkOut: Date
): Promise<room_availabilities[]> {
  return prisma.room_availabilities.findMany({
    where: {
      room_id: BigInt(roomId),
      available_date: {
        gte: checkIn,
        lt: checkOut,
      },
    },
    orderBy: {
      available_date: "asc",
    },
  });
}

/**
 * Update available rooms.
 */
export async function updateAvailableRooms(
  availabilityId: number,
  availableRooms: number
): Promise<room_availabilities> {
  return prisma.room_availabilities.update({
    where: {
      id: BigInt(availabilityId),
    },
    data: {
      available_rooms: availableRooms,
    },
  });
}