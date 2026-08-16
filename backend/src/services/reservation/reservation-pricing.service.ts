import {
  Prisma,
  adjustment_type,
  rooms,
} from "../../generated/prisma/client";

import {
  PeakSeasonRepository,
} from "../../repositories";

import { CreateReservationDto } from "../../types/dto";

export interface ReservationPricing {
  roomPrice: Prisma.Decimal;
  peakSeasonAdjustment: Prisma.Decimal;
  totalPrice: Prisma.Decimal;
}

export class ReservationPricingService {
  constructor(
    private readonly peakSeasonRepository: PeakSeasonRepository
  ) {}

  async calculateReservation(
    room: rooms,
    dto: CreateReservationDto
  ): Promise<ReservationPricing> {
    const nights = this.calculateNights(
      dto.checkInDate,
      dto.checkOutDate
    );

    const roomPrice =
      this.calculateRoomPrice(
        room,
        nights
      );

    const peakSeasonAdjustment =
      await this.calculatePeakSeasonAdjustment(
        dto,
        room
      );

    const totalPrice =
      roomPrice.plus(
        peakSeasonAdjustment
      );

    return {
      roomPrice,
      peakSeasonAdjustment,
      totalPrice,
    };
  }

  private calculateRoomPrice(
    room: rooms,
    nights: number
  ): Prisma.Decimal {
    return room.base_price.mul(nights);
  }

  private async calculatePeakSeasonAdjustment(
    dto: CreateReservationDto,
    room: rooms
  ): Promise<Prisma.Decimal> {
    const peakSeasons =
      await this.peakSeasonRepository.findManyByRoomIdAndDateRange(
        Number(room.id),
        dto.checkInDate,
        dto.checkOutDate
      );

    let adjustment =
      new Prisma.Decimal(0);

    for (const peak of peakSeasons) {
      const overlapNights =
        this.calculateOverlapNights(
          peak.start_date,
          peak.end_date,
          dto.checkInDate,
          dto.checkOutDate
        );

      if (overlapNights === 0) {
        continue;
      }

      if (
        peak.adjustment_type ===
        adjustment_type.PERCENTAGE
      ) {
        adjustment = adjustment.plus(
          room.base_price
            .mul(overlapNights)
            .mul(peak.adjustment_value)
            .div(100)
        );

        continue;
      }

      adjustment = adjustment.plus(
        peak.adjustment_value.mul(
          overlapNights
        )
      );
    }

    return adjustment;
  }

  private calculateNights(
    checkIn: Date,
    checkOut: Date
  ): number {
    const millisecondsPerDay =
      1000 * 60 * 60 * 24;

    return Math.ceil(
      (checkOut.getTime() -
        checkIn.getTime()) /
        millisecondsPerDay
    );
  }

  private calculateOverlapNights(
    peakStart: Date,
    peakEnd: Date,
    checkIn: Date,
    checkOut: Date
  ): number {
    const start =
      peakStart > checkIn
        ? peakStart
        : checkIn;

    const end =
      peakEnd < checkOut
        ? peakEnd
        : checkOut;

    if (start >= end) {
      return 0;
    }

    return this.calculateNights(
      start,
      end
    );
  }
}