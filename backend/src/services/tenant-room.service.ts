import { ApiError } from "../utils/core";
import { tenantRoomRepository } from "../repositories/tenant-room.repository";
import {
  CreateRoomInput,
  UpdateRoomInput,
} from "../validations/room";

export class TenantRoomService {
  async createRoom(
    tenantId: bigint,
    propertyId: string,
    data: CreateRoomInput,
  ) {
    const id = this.parseId(propertyId);

    await this.ensurePropertyOwnership(
      id,
      tenantId,
    );

    return tenantRoomRepository.createRoom(
      id,
      data,
    );
  }

  async getMyRooms(tenantId: bigint) {
    return tenantRoomRepository.findManyByTenant(
      tenantId,
    );
  }

  async getMyRoom(
    tenantId: bigint,
    roomId: string,
  ) {
    const id = this.parseId(roomId);

    const room =
      await tenantRoomRepository.findByIdAndTenant(
        id,
        tenantId,
      );

    if (!room) {
      throw new ApiError(404, "Room not found");
    }

    return room;
  }

  async updateRoom(
    tenantId: bigint,
    roomId: string,
    data: UpdateRoomInput,
  ) {
    const id = this.parseId(roomId);

    await this.ensureRoomOwnership(
      id,
      tenantId,
    );

    return tenantRoomRepository.updateRoom(
      id,
      data,
    );
  }

  async deleteRoom(
    tenantId: bigint,
    roomId: string,
  ) {
    const id = this.parseId(roomId);

    await this.ensureRoomOwnership(
      id,
      tenantId,
    );

    await tenantRoomRepository.softDeleteRoom(id);
  }

  private async ensurePropertyOwnership(
    propertyId: bigint,
    tenantId: bigint,
  ) {
    const property =
      await tenantRoomRepository.findPropertyByIdAndTenant(
        propertyId,
        tenantId,
      );

    if (!property) {
      throw new ApiError(
        404,
        "Property not found",
      );
    }

    return property;
  }

  private async ensureRoomOwnership(
    roomId: bigint,
    tenantId: bigint,
  ) {
    const room =
      await tenantRoomRepository.findByIdAndTenant(
        roomId,
        tenantId,
      );

    if (!room) {
      throw new ApiError(404, "Room not found");
    }

    return room;
  }

  private parseId(value: string) {
    try {
      return BigInt(value);
    } catch {
      throw new ApiError(
        400,
        "Invalid ID",
      );
    }
  }
}

export const tenantRoomService =
  new TenantRoomService();