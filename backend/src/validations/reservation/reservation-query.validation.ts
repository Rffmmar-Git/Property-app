import { z } from "zod";

export const reservationQuerySchema = z.object({
  page: z.number().int().positive().optional(),

  limit: z.number().int().positive().max(100).optional(),

  sortBy: z.string().optional(),

  order: z.enum(["asc", "desc"]).optional(),

  status: z.string().optional(),

  search: z.string().optional(),

  startDate: z.date().optional(),

  endDate: z.date().optional(),
});

export type ReservationQueryInput =
  z.infer<typeof reservationQuerySchema>;