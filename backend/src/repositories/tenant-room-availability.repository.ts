import prisma from "../config/prisma";

export class TenantRoomAvailabilityRepository {
  async create(
    roomId: bigint,
    availableDate: Date,
    closureReason?: string,
  ) {
    return prisma.room_availabilities.create({
      data: {
        room_id: roomId,
        available_date: availableDate,
        available_rooms: 0,
        is_closed: true,
        closure_reason: closureReason,
      },
    });
  }

  async findByRoomAndDate(
    roomId: bigint,
    availableDate: Date,
  ) {
    return prisma.room_availabilities.findUnique({
      where: {
        room_id_available_date: {
          room_id: roomId,
          available_date: availableDate,
        },
      },
    });
  }

  async findManyByRoom(roomId: bigint) {
    return prisma.room_availabilities.findMany({
      where: {
        room_id: roomId,
        is_closed: true,
      },
      orderBy: {
        available_date: "asc",
      },
    });
  }

  async findById(id: bigint) {
    return prisma.room_availabilities.findUnique({
      where: {
        id,
      },
    });
  }

  async delete(id: bigint) {
    return prisma.room_availabilities.delete({
      where: {
        id,
      },
    });
  }
}

export const tenantRoomAvailabilityRepository =
  new TenantRoomAvailabilityRepository();