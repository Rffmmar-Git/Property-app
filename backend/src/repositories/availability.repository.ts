import prisma from "../config/prisma";
import {
  Prisma,
  room_availabilities,
} from "../generated/prisma/client";

export class AvailabilityRepository {
  /**
   * Find room availabilities within date range.
   */
  async findManyByRoomIdAndDateRange(
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
  async updateAvailableRooms(
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

  /**
   * Reserve one room for every date
   * between check-in and check-out.
   *
   * Returns the number of availability
   * records successfully updated.
   */
  async reserveRoom(
    tx: Prisma.TransactionClient,
    roomId: number,
    checkIn: Date,
    checkOut: Date
  ): Promise<number> {
    const result =
      await tx.room_availabilities.updateMany({
        where: {
          room_id: BigInt(roomId),

          available_date: {
            gte: checkIn,
            lt: checkOut,
          },

          is_closed: false,

          available_rooms: {
            gt: 0,
          },
        },

        data: {
          available_rooms: {
            decrement: 1,
          },
        },
      });

    return result.count;
  }

  /**
   * Release one room for every date
   * between check-in and check-out.
   */
  async releaseRoom(
    tx: Prisma.TransactionClient,
    roomId: number,
    checkIn: Date,
    checkOut: Date
  ): Promise<number> {
    const result =
      await tx.room_availabilities.updateMany({
        where: {
          room_id: BigInt(roomId),

          available_date: {
            gte: checkIn,
            lt: checkOut,
          },
        },

        data: {
          available_rooms: {
            increment: 1,
          },
        },
      });

    return result.count;
  }
}