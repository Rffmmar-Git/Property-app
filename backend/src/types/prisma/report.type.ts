import { Prisma } from "../../generated/prisma/client";
/**
 * Sales Report
 */
export type SalesReportRow =
  Prisma.reservationsGetPayload<{
    include: {
      users: {
        select: {
          id: true;
          full_name: true;
          email: true;
        };
      };

      rooms: {
        include: {
          properties: {
            select: {
              id: true;
              name: true;
            };
          };
        };
      };

      payments: {
        select: {
          status: true;
          payment_amount: true;
          paid_at: true;
        };
      };
    };
  }>;

/**
 * Transaction Report
 */
export type TransactionReportRow = SalesReportRow;

/**
 * Property Calendar Report
 */
export type PropertyCalendarRow =
  Prisma.room_availabilitiesGetPayload<{
    include: {
      rooms: {
        select: {
          id: true;
          room_name: true;
          total_rooms: true;
        };
      };
    };
  }>;