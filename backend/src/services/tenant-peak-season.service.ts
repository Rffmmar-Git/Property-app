import { ApiError } from "../utils/core";

import { tenantRoomRepository } from "../repositories/tenant-room.repository";
import { tenantPeakSeasonRepository } from "../repositories/tenant-peak-season.repository";

import {
  CreatePeakSeasonInput,
  UpdatePeakSeasonInput,
} from "../validations/room";

import { adjustment_type } from "../generated/prisma/enums";

export class TenantPeakSeasonService {
  async createRate(
    tenantId: bigint,
    roomId: string,
    data: CreatePeakSeasonInput,
  ) {
    const id = this.parseId(roomId);

    await this.ensureRoomOwnership(
      id,
      tenantId,
    );

    const dates = this.parseDateRange(
      data.startDate,
      data.endDate,
    );

    return tenantPeakSeasonRepository.create({
      roomId: id,
      startDate: dates.startDate,
      endDate: dates.endDate,
      adjustmentType:
        data.adjustmentType as adjustment_type,
      adjustmentValue: data.adjustmentValue,
    });
  }

  async getRates(
    tenantId: bigint,
    roomId: string,
  ) {
    const id = this.parseId(roomId);

    await this.ensureRoomOwnership(
      id,
      tenantId,
    );

    return tenantPeakSeasonRepository.findManyByRoom(
      id,
    );
  }

  async getRate(
    tenantId: bigint,
    rateId: string,
  ) {
    const id = this.parseId(rateId);

    const rate =
      await tenantPeakSeasonRepository.findById(id);

    if (!rate) {
      throw new ApiError(
        404,
        "Peak season rate not found",
      );
    }

    await this.ensureRoomOwnership(
      rate.room_id,
      tenantId,
    );

    return rate;
  }

  async updateRate(
    tenantId: bigint,
    rateId: string,
    data: UpdatePeakSeasonInput,
  ) {
    const id = this.parseId(rateId);

    const rate =
      await tenantPeakSeasonRepository.findById(id);

    if (!rate) {
      throw new ApiError(
        404,
        "Peak season rate not found",
      );
    }

    await this.ensureRoomOwnership(
      rate.room_id,
      tenantId,
    );

    const updateData = {
      startDate: data.startDate
        ? this.parseDate(data.startDate)
        : undefined,

      endDate: data.endDate
        ? this.parseDate(data.endDate)
        : undefined,

      adjustmentType:
        data.adjustmentType as
          | adjustment_type
          | undefined,

      adjustmentValue:
        data.adjustmentValue,
    };

    return tenantPeakSeasonRepository.update(
      id,
      updateData,
    );
  }

  async deleteRate(
    tenantId: bigint,
    rateId: string,
  ) {
    const id = this.parseId(rateId);

    const rate =
      await tenantPeakSeasonRepository.findById(id);

    if (!rate) {
      throw new ApiError(
        404,
        "Peak season rate not found",
      );
    }

    await this.ensureRoomOwnership(
      rate.room_id,
      tenantId,
    );

    await tenantPeakSeasonRepository.delete(id);
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

  private parseDateRange(
    startDate: string,
    endDate: string,
  ) {
    const start = this.parseDate(startDate);
    const end = this.parseDate(endDate);

    if (end < start) {
      throw new ApiError(
        400,
        "End date must be on or after start date",
      );
    }

    return {
      startDate: start,
      endDate: end,
    };
  }
}

export const tenantPeakSeasonService =
  new TenantPeakSeasonService();