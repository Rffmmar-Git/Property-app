import { ApiError } from "../utils/core";
import { tenantRoomRepository } from "../repositories/tenant-room.repository";
import { tenantRoomAvailabilityRepository } from "../repositories/tenant-room-availability.repository";
import { CreateRoomAvailabilityInput } from "../validations/room";

export class TenantRoomAvailabilityService {
  async closeDate(
    tenantId: bigint,
    roomId: string,
    data: CreateRoomAvailabilityInput,
  ) {
    const id = this.parseId(roomId);

    await this.ensureRoomOwnership(
      id,
      tenantId,
    );

    const availableDate = this.parseDate(
      data.availableDate,
    );

    const existing =
      await tenantRoomAvailabilityRepository.findByRoomAndDate(
        id,
        availableDate,
      );

    if (existing) {
      throw new ApiError(
        400,
        "Room availability already exists for this date",
      );
    }

    return tenantRoomAvailabilityRepository.create(
      id,
      availableDate,
      data.closureReason,
    );
  }

  async getClosedDates(
    tenantId: bigint,
    roomId: string,
  ) {
    const id = this.parseId(roomId);

    await this.ensureRoomOwnership(
      id,
      tenantId,
    );

    return tenantRoomAvailabilityRepository.findManyByRoom(
      id,
    );
  }

  async openDate(
    tenantId: bigint,
    availabilityId: string,
  ) {
    const id = this.parseId(availabilityId);

    const availability =
      await tenantRoomAvailabilityRepository.findById(
        id,
      );

    if (!availability) {
      throw new ApiError(
        404,
        "Room availability not found",
      );
    }

    await this.ensureRoomOwnership(
      availability.room_id,
      tenantId,
    );

    await tenantRoomAvailabilityRepository.delete(
      id,
    );
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
      throw new ApiError(
        404,
        "Room not found",
      );
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

  private parseDate(value: string) {
    const date = new Date(`${value}T00:00:00.000Z`);

    if (Number.isNaN(date.getTime())) {
      throw new ApiError(
        400,
        "Invalid date",
      );
    }

    return date;
  }
}

export const tenantRoomAvailabilityService =
  new TenantRoomAvailabilityService();