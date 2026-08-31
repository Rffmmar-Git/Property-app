import { z } from "zod";

const peakSeasonFields = {
  startDate: z
    .string()
    .regex(
      /^\d{4}-\d{2}-\d{2}$/,
      "Start date must use YYYY-MM-DD format",
    ),

  endDate: z
    .string()
    .regex(
      /^\d{4}-\d{2}-\d{2}$/,
      "End date must use YYYY-MM-DD format",
    ),

  adjustmentType: z.enum([
    "PERCENTAGE",
    "FIXED",
  ]),

  adjustmentValue: z
    .number()
    .positive(
      "Adjustment value must be greater than 0",
    ),
};

export const createPeakSeasonSchema = z
  .object(peakSeasonFields)
  .superRefine((data, ctx) => {
    if (data.endDate < data.startDate) {
      ctx.addIssue({
        code: "custom",
        message:
          "End date must be on or after start date",
        path: ["endDate"],
      });
    }

    if (
      data.adjustmentType === "PERCENTAGE" &&
      data.adjustmentValue > 100
    ) {
      ctx.addIssue({
        code: "custom",
        message:
          "Percentage adjustment must not exceed 100",
        path: ["adjustmentValue"],
      });
    }
  });

export const updatePeakSeasonSchema =
  z.object(peakSeasonFields).partial();

export type CreatePeakSeasonInput =
  z.infer<typeof createPeakSeasonSchema>;

export type UpdatePeakSeasonInput =
  z.infer<typeof updatePeakSeasonSchema>;