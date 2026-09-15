import { ApiError } from "../utils/core";
import { tenantRoomRepository } from "../repositories/tenant-room.repository";
import { tenantRoomAvailabilityRepository } from "../repositories/tenant-room-availability.repository";
import { CreateRoomAvailabilityInput } from "../validations/room/room-availability.validation";

export class TenantRoomAvailabilityService {
  async closeDate(
    tenantId: bigint,
    roomId: string,
    data: CreateRoomAvailabilityInput,
  ) {
    const id = this.parseId(roomId);

    const room = await this.ensureRoomOwnership(id, tenantId);

    const startDate = this.parseDate(data.startDate);
    const endDate = this.parseDate(data.endDate);

    if (startDate > endDate) {
      throw new ApiError(
        400,
        "End date must be on or after start date",
      );
    }

    const totalRooms = room.total_rooms;

    const dates = this.getDatesInRange(startDate, endDate);

    const dateAvailability = [];

    for (const date of dates) {
      const bookedRooms =
        await tenantRoomRepository.countActiveReservationsByDate(
          id,
          date,
        );

      const existing =
        await tenantRoomAvailabilityRepository.findByRoomAndDate(
          id,
          date,
        );

      const existingAvailableRooms =
        existing?.available_rooms ?? totalRooms;

      const existingClosedRooms =
        totalRooms - bookedRooms - existingAvailableRooms;

      const availableRoomsBeforeClosing =
        totalRooms - bookedRooms - existingClosedRooms;

      if (
        data.roomsToClose > availableRoomsBeforeClosing
      ) {
        throw new ApiError(
          400,
          `Only ${availableRoomsBeforeClosing} rooms can be closed on ${data.startDate}`,
        );
      }

      const availableRooms =
        availableRoomsBeforeClosing - data.roomsToClose;

      dateAvailability.push({
        date,
        availableRooms,
        isClosed: availableRooms === 0,
      });
    }

    const results = [];

    for (const item of dateAvailability) {
      const result =
        await tenantRoomAvailabilityRepository.upsert(
          id,
          item.date,
          item.availableRooms,
          item.isClosed,
          data.closureReason,
        );

      results.push(result);
    }

    return results;
  }

  async getClosedDates(
    tenantId: bigint,
    roomId: string,
  ) {
    const id = this.parseId(roomId);

    await this.ensureRoomOwnership(id, tenantId);

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
      await tenantRoomAvailabilityRepository.findById(id);

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

    await tenantRoomAvailabilityRepository.delete(id);
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

  private getDatesInRange(
    startDate: Date,
    endDate: Date,
  ): Date[] {
    const dates: Date[] = [];

    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));

      currentDate.setUTCDate(
        currentDate.getUTCDate() + 1,
      );
    }

    return dates;
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
    const date = new Date(
      `${value}T00:00:00.000Z`,
    );

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