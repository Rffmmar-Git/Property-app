import { z } from "zod";

export const propertyReportQuerySchema = z.object({
  propertyId: z
    .number()
    .int()
    .positive()
    .optional(),

  month: z
    .number()
    .int()
    .min(1)
    .max(12)
    .optional(),

  year: z
    .number()
    .int()
    .min(2000)
    .optional(),
});

export type PropertyReportQueryInput =
  z.infer<typeof propertyReportQuerySchema>;