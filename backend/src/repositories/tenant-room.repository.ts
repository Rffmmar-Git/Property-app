import prisma from "../config/prisma";

export class TenantRoomRepository {
  async createRoom(
    propertyId: bigint,
    data: {
      roomName: string;
      description?: string;
      capacity: number;
      basePrice: number;
      totalRooms: number;
    },
  ) {
    return prisma.rooms.create({
      data: {
        property_id: propertyId,
        room_name: data.roomName,
        description: data.description,
        capacity: data.capacity,
        base_price: data.basePrice,
        total_rooms: data.totalRooms,
      },
    });
  }

  async findPropertyByIdAndTenant(
    propertyId: bigint,
    tenantId: bigint,
  ) {
    return prisma.properties.findFirst({
      where: {
        id: propertyId,
        tenant_id: tenantId,
        deleted_at: null,
      },
      select: {
        id: true,
        tenant_id: true,
      },
    });
  }

  async findManyByTenant(tenantId: bigint) {
    return prisma.rooms.findMany({
      where: {
        deleted_at: null,
        properties: {
          tenant_id: tenantId,
          deleted_at: null,
        },
      },
      orderBy: {
        id: "asc",
      },
      include: {
        properties: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async findByIdAndTenant(
    roomId: bigint,
    tenantId: bigint,
  ) {
    return prisma.rooms.findFirst({
      where: {
        id: roomId,
        deleted_at: null,
        properties: {
          tenant_id: tenantId,
          deleted_at: null,
        },
      },
      include: {
        properties: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async updateRoom(
    roomId: bigint,
    data: {
      roomName?: string;
      description?: string;
      capacity?: number;
      basePrice?: number;
      totalRooms?: number;
    },
  ) {
    return prisma.rooms.update({
      where: {
        id: roomId,
      },
      data: {
        ...(data.roomName !== undefined && {
          room_name: data.roomName,
        }),
        ...(data.description !== undefined && {
          description: data.description,
        }),
        ...(data.capacity !== undefined && {
          capacity: data.capacity,
        }),
        ...(data.basePrice !== undefined && {
          base_price: data.basePrice,
        }),
        ...(data.totalRooms !== undefined && {
          total_rooms: data.totalRooms,
        }),
      },
    });
  }

  async softDeleteRoom(roomId: bigint) {
    return prisma.rooms.update({
      where: {
        id: roomId,
      },
      data: {
        deleted_at: new Date(),
      },
    });
  }
}

export const tenantRoomRepository =
  new TenantRoomRepository();