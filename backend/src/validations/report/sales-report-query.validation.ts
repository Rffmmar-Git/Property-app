import { z } from "zod";

export const salesReportQuerySchema = z.object({
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
    .string()
    .optional(),

  order: z
    .enum(["asc", "desc"])
    .optional(),
});

export type SalesReportQueryInput =
  z.infer<typeof salesReportQuerySchema>;