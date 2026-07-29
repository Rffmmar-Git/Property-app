import prisma from "../config/prisma";
import { rooms } from "../generated/prisma/client";
import { RoomWithProperty } from "../types/prisma";

export class RoomRepository {
  /**
   * Find active room by ID.
   */
  async findById(
    roomId: number
  ): Promise<rooms | null> {
    return prisma.rooms.findFirst({
      where: {
        id: BigInt(roomId),
        deleted_at: null,
      },
    });
  }

  /**
   * Find active room with property.
   */
  async findByIdWithProperty(
    roomId: number
  ): Promise<RoomWithProperty | null> {
    return prisma.rooms.findFirst({
      where: {
        id: BigInt(roomId),
        deleted_at: null,
      },
      include: {
        properties: true,
      },
    });
  }

  /**
   * Find all active rooms by property.
   */
 async findManyByPropertyId(
    propertyId: number
  ): Promise<rooms[]> {
    return prisma.rooms.findMany({
      where: {
        property_id: BigInt(propertyId),
        deleted_at: null,
      },
      orderBy: {
        id: "asc",
      },
    });
  }
}