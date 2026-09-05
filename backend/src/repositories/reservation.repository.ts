import prisma from "../config/prisma";
import {
  Prisma,
  reservations,
  reservation_status
} from "../generated/prisma/client";
import { ReservationComplete } from "../types/prisma";
import { TenantTransactionQueryDto } from "../types/dto";

export class ReservationRepository {
//  Create reservation.
  async create(
  data: Prisma.reservationsCreateInput
): Promise<reservations> {
  return prisma.reservations.create({
    data,
  });
}
async createWithTransaction(
  tx: Prisma.TransactionClient,
  data: Prisma.reservationsCreateInput
): Promise<reservations> {
  return tx.reservations.create({
    data,
  });
}
  // Find reservation by id.
  async findById(
    reservationId: number
  ): Promise<reservations | null> {
    return prisma.reservations.findFirst({
      where: {
        id: BigInt(reservationId),
      },
    });
  }
// Find reservation with all required relations.
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

  async findCompleteManyByUserId(
  userId: number
): Promise<ReservationComplete[]> {
  return prisma.reservations.findMany({
    where: {
      user_id: BigInt(userId),
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

    orderBy: {
      created_at: "desc",
    },
  });
}

// Find reservation by booking code.
  async findByBookingCode(
    bookingCode: string
  ): Promise<reservations | null> {
    return prisma.reservations.findFirst({
      where: {
        booking_code: bookingCode,
      },
    });
  }
// Find all reservations by user.
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

// Find reservations by user and status.
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

// Update reservation status.
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

//  Update booking expired time.
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

//   Update confirmed time.
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

// Update cancelled time.
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

// Update completed time.
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

  async findByIdWithTransaction(
  tx: Prisma.TransactionClient,
  reservationId: number
): Promise<ReservationComplete | null> {
  return tx.reservations.findFirst({
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
  }) as Promise<ReservationComplete | null>;
}

  async markExpiredIfPending(
  tx: Prisma.TransactionClient,
  reservationId: number,
  now: Date
): Promise<number> {
  const result =
    await tx.reservations.updateMany({
      where: {
        id: BigInt(reservationId),
        status:
          reservation_status.WAITING_PAYMENT,
        booking_expired_at: {
          lte: now,
        },
      },
      data: {
        status:
          reservation_status.EXPIRED,
      },
    });

  return result.count;
}

  async findCompleteByIdWithTransaction(
  tx: Prisma.TransactionClient,
  reservationId: number
): Promise<ReservationComplete | null> {
  return tx.reservations.findFirst({
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
  }) as Promise<ReservationComplete | null>;
}

  async cancelReservation(
  reservationId: number,
  reservationData: Prisma.reservationsUpdateInput
): Promise<reservations> {
  return prisma.reservations.update({
    where: {
      id: BigInt(reservationId),
    },
    data: reservationData,
  });
}

async cancelReservationWithTransaction(
  tx: Prisma.TransactionClient,
  reservationId: number
): Promise<reservations> {
  return tx.reservations.update({
    where: {
      id: BigInt(reservationId),
    },
    data: {
      status: reservation_status.CANCELLED,
      cancelled_at: new Date(),
    },
  });
}

async findTenantTransactions(
  tenantId: number,
  query: TenantTransactionQueryDto
) {
  const where: Prisma.reservationsWhereInput = {
    rooms: {
      properties: {
        tenant_id: BigInt(tenantId),
      },
    },

    ...(query.search
      ? {
          OR: [
            {
              booking_code: {
                contains: query.search,
                mode: "insensitive",
              },
            },
            {
              users: {
                full_name: {
                  contains: query.search,
                  mode: "insensitive",
                },
              },
            },
          ],
        }
      : {}),

    ...(query.reservationStatus
      ? {
          status: query.reservationStatus,
        }
      : {}),

    ...(query.paymentStatus
      ? {
          payments: {
            status: query.paymentStatus,
          },
        }
      : {}),
  };

  const orderBy =
    query.sortBy === "booking_code"
      ? { booking_code: query.order ?? "desc" }
      : query.sortBy === "total_price"
        ? { total_price: query.order ?? "desc" }
        : query.sortBy === "check_in"
          ? { check_in: query.order ?? "desc" }
          : query.sortBy === "check_out"
            ? { check_out: query.order ?? "desc" }
            : { created_at: query.order ?? "desc" };

  const [reservations, total] =
    await prisma.$transaction([
      prisma.reservations.findMany({
        where,

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

        orderBy,

        ...(query.page !== undefined &&
        query.limit !== undefined
          ? {
              skip:
                (query.page - 1) *
                query.limit,
              take: query.limit,
            }
          : {}),
      }),

      prisma.reservations.count({
        where,
      }),
    ]);

  return {
    reservations,
    total,
  };
}

async findConfirmedReservationsForReminder(
  startDate: Date,
  endDate: Date
): Promise<ReservationComplete[]> {
  return prisma.reservations.findMany({
    where: {
      status: reservation_status.CONFIRMED,
      check_in: {
        gte: startDate,
        lt: endDate,
      },
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

    orderBy: {
      check_in: "asc",
    },
  });
}
}



