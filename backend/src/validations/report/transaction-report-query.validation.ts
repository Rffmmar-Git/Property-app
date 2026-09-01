import { z } from "zod";

export const transactionReportQuerySchema =
  z.object({
    page: z
      .number()
      .int()
      .positive()
      .optional(),

    limit: z
      .number()
      .int()
      .positive()
      .max(100)
      .optional(),

    propertyId: z
      .number()
      .int()
      .positive()
      .optional(),

    startDate: z
      .date()
      .optional(),

    endDate: z
      .date()
      .optional(),

    sortBy: z
      .enum([
        "created_at",
        "booking_code",
        "status",
        "total_price",
      ])
      .optional(),

    order: z
      .enum(["asc", "desc"])
      .optional(),
  });

export type TransactionReportQueryInput =
  z.infer<
    typeof transactionReportQuerySchema
  >;