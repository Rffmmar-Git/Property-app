import prisma from "../../config/prisma";
import {
  Prisma,
  reservation_status,
  payment_status,
  reservations,
} from "../../generated/prisma/client";
import { CreateReservationDto } from "../../types/dto";
import { ReservationComplete } from "../../types/prisma";
import { ReservationPricing } from "./reservation-pricing.service";
import { ReservationBookingService } from "./reservation-booking.service";
import {
  ReservationRepository,
  PaymentRepository,
  AvailabilityRepository,
} from "../../repositories";

export class ReservationPersistenceService {
  constructor(
    private readonly bookingService: ReservationBookingService,
    private readonly reservationRepository: ReservationRepository,
    private readonly paymentRepository: PaymentRepository,
    private readonly availabilityRepository: AvailabilityRepository
  ) {}

  async createReservation(
    userId: number,
    dto: CreateReservationDto,
    pricing: ReservationPricing
  ): Promise<reservations> {
    const reservationData =
      this.buildReservationData(
        userId,
        dto,
        pricing
      );

    return prisma.$transaction(
      async (tx) => {
        const updatedAvailability =
          await this.availabilityRepository.reserveRoom(
            tx,
            dto.roomId,
            dto.checkInDate,
            dto.checkOutDate
          );

        const expectedNights =
          this.calculateNights(
            dto.checkInDate,
            dto.checkOutDate
          );

        this.validateAvailabilityUpdate(
          updatedAvailability,
          expectedNights
        );

        const reservation =
          await this.reservationRepository
            .createWithTransaction(
              tx,
              reservationData
            );

        await this.paymentRepository
          .createWithTransaction(
            tx,
            {
              reservations: {
                connect: {
                  id: reservation.id,
                },
              },

              payment_method:
                "BANK_TRANSFER",

              payment_amount:
                reservation.total_price,

              status:
                payment_status.PENDING,
            }
          );

        return reservation;
      }
    );
  }

  async expireReservation(
  reservation: ReservationComplete
): Promise<ReservationComplete | null> {
  return prisma.$transaction(
    async (tx) => {
      const updatedCount =
        await this.reservationRepository
          .markExpiredIfPending(
            tx,
            Number(reservation.id),
            new Date()
          );

      if (updatedCount === 0) {
        return null;
      }

      const releasedCount =
        await this.availabilityRepository
          .releaseRoom(
            tx,
            Number(reservation.room_id),
            reservation.check_in,
            reservation.check_out
          );

      const expectedNights =
        this.calculateNights(
          reservation.check_in,
          reservation.check_out
        );

      this.validateAvailabilityUpdate(
        releasedCount,
        expectedNights
      );

      return this.reservationRepository
        .findCompleteByIdWithTransaction(
          tx,
          Number(reservation.id)
        );
    }
  );
}

  async cancelReservation(
    reservation: ReservationComplete
  ): Promise<reservations> {
    return prisma.$transaction(
      async (tx) => {
        const expectedNights =
          this.calculateNights(
            reservation.check_in,
            reservation.check_out
          );

        const releasedAvailability =
          await this.availabilityRepository
            .releaseRoom(
              tx,
              Number(reservation.room_id),
              reservation.check_in,
              reservation.check_out
            );

        this.validateAvailabilityUpdate(
          releasedAvailability,
          expectedNights
        );

        return this.reservationRepository
          .cancelReservationWithTransaction(
            tx,
            Number(reservation.id)
          );
      }
    );
  }

  private buildReservationData(
    userId: number,
    dto: CreateReservationDto,
    pricing: ReservationPricing
  ): Prisma.reservationsCreateInput {
    return {
      booking_code:
        this.bookingService
          .generateBookingCode(),

      users: {
        connect: {
          id: BigInt(userId),
        },
      },

      rooms: {
        connect: {
          id: BigInt(dto.roomId),
        },
      },

      check_in: dto.checkInDate,

      check_out: dto.checkOutDate,

      guest_count:
        dto.guestCount,

      room_price:
        pricing.roomPrice,

      peak_season_adjustment:
        pricing.peakSeasonAdjustment,

      total_price:
        pricing.totalPrice,

      status:
        reservation_status.WAITING_PAYMENT,

      booking_expired_at:
        this.bookingService
          .calculateBookingExpiredAt(),
    };
  }

  private calculateNights(
    checkIn: Date,
    checkOut: Date
  ): number {
    const millisecondsPerDay =
      1000 * 60 * 60 * 24;

    return Math.ceil(
      (
        checkOut.getTime() -
        checkIn.getTime()
      ) / millisecondsPerDay
    );
  }

  private validateAvailabilityUpdate(
    updatedCount: number,
    expectedCount: number
  ): void {
    if (updatedCount !== expectedCount) {
      throw new Error(
        "Room availability is no longer sufficient."
      );
    }
  }
}