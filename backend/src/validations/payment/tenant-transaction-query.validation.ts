import { z } from "zod";
import {
  payment_status,
  reservation_status,
} from "../../generated/prisma/client";

export const tenantTransactionQuerySchema =
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

    search: z
      .string()
      .trim()
      .min(1)
      .optional(),

    paymentStatus: z
      .enum(
        Object.values(payment_status) as [
          payment_status,
          ...payment_status[],
        ]
      )
      .optional(),

    reservationStatus: z
      .enum(
        Object.values(reservation_status) as [
          reservation_status,
          ...reservation_status[],
        ]
      )
      .optional(),

    sortBy: z
      .enum([
        "created_at",
        "booking_code",
        "total_price",
        "check_in",
        "check_out",
      ])
      .optional(),

    order: z
      .enum(["asc", "desc"])
      .optional(),
  });

export type TenantTransactionQueryInput =
  z.infer<
    typeof tenantTransactionQuerySchema
  >;