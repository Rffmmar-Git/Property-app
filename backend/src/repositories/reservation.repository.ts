import prisma from "../config/prisma";
import { Prisma, reservations, reservation_status } from "../generated/prisma/client";
import { ReservationComplete } from "../types/prisma";
/**
 * Create reservation.
 */
export async function create(
  data: Prisma.reservationsCreateInput
): Promise<reservations> {
  return prisma.reservations.create({
    data,
  });
}

/**
 * Find reservation by id.
 */
export async function findById(
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
export async function findCompleteById(
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
export async function findByBookingCode(
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
export async function findManyByUserId(
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
export async function findManyByUserIdAndStatus(
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
export async function updateStatus(
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
export async function updateBookingExpiredAt(
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
export async function updateConfirmedAt(
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
export async function updateCancelledAt(
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
export async function updateCompletedAt(
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