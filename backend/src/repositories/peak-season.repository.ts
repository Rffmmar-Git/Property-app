import prisma from "../config/prisma";
import { peak_season_rates } from "../generated/prisma/client";
/**
 * Find peak season rates that overlap
 * with the reservation date range.
 */
export async function findManyByRoomIdAndDateRange(
  roomId: number,
  checkIn: Date,
  checkOut: Date
): Promise<peak_season_rates[]> {
  return prisma.peak_season_rates.findMany({
    where: {
      room_id: BigInt(roomId),

      start_date: {
        lt: checkOut,
      },

      end_date: {
        gte: checkIn,
      },
    },

    orderBy: {
      start_date: "asc",
    },
  });
}