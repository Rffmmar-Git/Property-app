import prisma from "../config/prisma";
import {
  Prisma,
  payment_status,
} from "../generated/prisma/client";

import {
  SalesReportQueryDto,
  TransactionReportQueryDto,
  PropertyReportQueryDto,
} from "../types/dto";

export class ReportRepository {
  //#region Sales Report

  async findSalesReport(
    query: Partial<SalesReportQueryDto>
  ) {
    const where: Prisma.reservationsWhereInput = {
      payments: {
        status: payment_status.ACCEPTED,
      },

      rooms: {
        deleted_at: null,

        ...(query.propertyId !== undefined && {
          property_id: BigInt(query.propertyId),
        }),
      },

      ...(query.startDate !== undefined ||
      query.endDate !== undefined
        ? {
            check_in: {
              ...(query.startDate !== undefined && {
                gte: query.startDate,
              }),

              ...(query.endDate !== undefined && {
                lte: query.endDate,
              }),
            },
          }
        : {}),
    };

    const orderBy =
      query.sortBy === "total_price"
        ? {
            total_price: query.order ?? "desc",
          }
        : query.sortBy === "created_at"
        ? {
            created_at: query.order ?? "desc",
          }
        : {
            check_in: query.order ?? "desc",
          };

    return prisma.reservations.findMany({
      where,

      include: {
        users: {
          select: {
            id: true,
            full_name: true,
            email: true,
          },
        },

        rooms: {
          select: {
            id: true,
            room_name: true,
            property_id: true,

            properties: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },

        payments: {
          select: {
            id: true,
            payment_method: true,
            payment_amount: true,
            status: true,
            paid_at: true,
          },
        },
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
    });


  }

  //#endregion

  //#region Transaction Report

  async findTransactionReport(
    query: Partial<TransactionReportQueryDto>
  ) {
    const where: Prisma.reservationsWhereInput = {
      rooms: {
        deleted_at: null,

        ...(query.propertyId !== undefined && {
          property_id: BigInt(query.propertyId),
        }),
      },

      ...(query.startDate !== undefined ||
      query.endDate !== undefined
        ? {
            created_at: {
              ...(query.startDate !== undefined && {
                gte: query.startDate,
              }),

              ...(query.endDate !== undefined && {
                lte: query.endDate,
              }),
            },
          }
        : {}),
    };

    const orderBy =
      query.sortBy === "booking_code"
        ? {
            booking_code: query.order ?? "desc",
          }
        : query.sortBy === "status"
        ? {
            status: query.order ?? "desc",
          }
        : query.sortBy === "total_price"
        ? {
            total_price: query.order ?? "desc",
          }
        : {
            created_at: query.order ?? "desc",
          };

    return prisma.reservations.findMany({
      where,

      include: {
        users: {
          select: {
            id: true,
            full_name: true,
            email: true,
          },
        },

        rooms: {
          select: {
            id: true,
            room_name: true,
            property_id: true,

            properties: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },

        payments: {
          select: {
            id: true,
            payment_method: true,
            payment_amount: true,
            status: true,
            paid_at: true,
          },
        },
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
    });
  }

  //#endregion

  //#region Property Report

  async findPropertyReport(
    query: Partial<PropertyReportQueryDto>
  ) {
    const where: Prisma.room_availabilitiesWhereInput = {
      ...(query.propertyId !== undefined && {
        rooms: {
          property_id: BigInt(query.propertyId),
          deleted_at: null,
        },
      }),

      ...(query.month !== undefined &&
      query.year !== undefined
        ? {
            available_date: {
              gte: new Date(
                query.year,
                query.month - 1,
                1
              ),

              lt: new Date(
                query.month === 12
                  ? query.year + 1
                  : query.year,
                query.month === 12
                  ? 0
                  : query.month,
                1
              ),
            },
          }
        : {}),
    };

    return prisma.room_availabilities.findMany({
      where,

      include: {
        rooms: {
          select: {
            id: true,
            room_name: true,
            total_rooms: true,
            base_price: true,

            properties: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },

      orderBy: {
        available_date: "asc",
      },
    });
  }

    async isPropertyOwnedByTenant(
    propertyId: number,
    tenantId: number
  ): Promise<boolean> {
    const property =
      await prisma.properties.findFirst({
        where: {
          id: BigInt(propertyId),
          tenant_id: BigInt(tenantId),
          deleted_at: null,
        },

        select: {
          id: true,
        },
      });

    return property !== null;
  }

  //#endregion
}