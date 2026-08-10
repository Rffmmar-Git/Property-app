import prisma from "../config/prisma";
import {
  Prisma,
  reservations,
  reservation_status,
} from "../generated/prisma/client";
import { ReservationComplete } from "../types/prisma";

export class ReservationRepository {
  /**
   * Create reservation.
   */
  async create(
    data: Prisma.reservationsCreateInput
  ): Promise<reservations> {
    return prisma.reservations.create({
      data,
    });
  }

  /**
   * Find reservation by id.
   */
  async findById(
    reservationId: number
  ): Promise<reservations | null> {
    return prisma.reservations.findFirst({
      where: {
        id: BigInt(reservationId),
      },
    });
  }

  /**
   * Find reservation with all required relations.
   */
  async findCompleteById(
    reservationId: number
  ): Promise<ReservationComplete | null> {
    return prisma.reservations.findFirst({
      where: {
        id: BigInt(reservationId),
      },

      include: {
        users: true,

        rooms: {
          include: {
            properties: true,
          },
        },

        payments: true,

        reviews: true,
      },
    });
  }

  /**
   * Find reservation by booking code.
   */
  async findByBookingCode(
    bookingCode: string
  ): Promise<reservations | null> {
    return prisma.reservations.findFirst({
      where: {
        booking_code: bookingCode,
      },
    });
  }

  /**
   * Find all reservations by user.
   */
  async findManyByUserId(
    userId: number
  ): Promise<reservations[]> {
    return prisma.reservations.findMany({
      where: {
        user_id: BigInt(userId),
      },

      orderBy: {
        created_at: "desc",
      },
    });
  }

  /**
   * Find reservations by user and status.
   */
  async findManyByUserIdAndStatus(
    userId: number,
    status: reservation_status
  ): Promise<reservations[]> {
    return prisma.reservations.findMany({
      where: {
        user_id: BigInt(userId),
        status,
      },

      orderBy: {
        created_at: "desc",
      },
    });
  }

  /**
   * Update reservation status.
   */
  async updateStatus(
    reservationId: number,
    status: reservation_status
  ): Promise<reservations> {
    return prisma.reservations.update({
      where: {
        id: BigInt(reservationId),
      },

      data: {
        status,
      },
    });
  }

  /**
   * Update booking expired time.
   */
  async updateBookingExpiredAt(
    reservationId: number,
    bookingExpiredAt: Date
  ): Promise<reservations> {
    return prisma.reservations.update({
      where: {
        id: BigInt(reservationId),
      },

      data: {
        booking_expired_at: bookingExpiredAt,
      },
    });
  }

  /**
   * Update confirmed time.
   */
  async updateConfirmedAt(
    reservationId: number,
    confirmedAt: Date
  ): Promise<reservations> {
    return prisma.reservations.update({
      where: {
        id: BigInt(reservationId),
      },

      data: {
        confirmed_at: confirmedAt,
      },
    });
  }

  /**
   * Update cancelled time.
   */
  async updateCancelledAt(
    reservationId: number,
    cancelledAt: Date
  ): Promise<reservations> {
    return prisma.reservations.update({
      where: {
        id: BigInt(reservationId),
      },

      data: {
        cancelled_at: cancelledAt,
      },
    });
  }

  /**
   * Update completed time.
   */
  async updateCompletedAt(
    reservationId: number,
    completedAt: Date
  ): Promise<reservations> {
    return prisma.reservations.update({
      where: {
        id: BigInt(reservationId),
      },

      data: {
        completed_at: completedAt,
      },
    });
  }
}