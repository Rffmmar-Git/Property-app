import prisma from "../config/prisma";
import { SalesReportQueryDto } from "../types/dto";
import { SalesReportRow } from "../types/prisma/report.type";

export class ReportRepository {
  async findSalesReport(
    query: Partial<SalesReportQueryDto>
  ): Promise<SalesReportRow[]> {
    return prisma.reservations.findMany({
      where: {
        status: {
          in: ["CONFIRMED", "COMPLETED"],
        },

        rooms: {
          deleted_at: null,

          ...(query.propertyId && {
            property_id: BigInt(query.propertyId),
          }),
        },

        ...((query.startDate || query.endDate) && {
          check_in: {
            ...(query.startDate && {
              gte: query.startDate,
            }),

            ...(query.endDate && {
              lte: query.endDate,
            }),
          },
        }),
      },

      include: {
        users: {
          select: {
            id: true,
            full_name: true,
            email: true,
          },
        },

        rooms: {
          include: {
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
            status: true,
            payment_amount: true,
            paid_at: true,
          },
        },
      },

      orderBy: {
        [query.sortBy ?? "check_in"]: query.order ?? "desc",
      },

      ...(query.page &&
        query.limit && {
          skip: (query.page - 1) * query.limit,
          take: query.limit,
        }),
    }) as Promise<SalesReportRow[]>;
  }
}