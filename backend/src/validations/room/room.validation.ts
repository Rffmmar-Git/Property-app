import { z } from "zod";

export const createRoomSchema = z.object({
  roomName: z
    .string()
    .trim()
    .min(1, "Room name is required")
    .max(100, "Room name must not exceed 100 characters"),

  description: z.string().trim().optional(),

  capacity: z
    .number({
      error: "Capacity must be a number",
    })
    .int("Capacity must be a whole number")
    .positive("Capacity must be greater than 0"),

  basePrice: z
    .number({
      error: "Base price must be a number",
    })
    .positive("Base price must be greater than 0"),

  totalRooms: z
    .number({
      error: "Total rooms must be a number",
    })
    .int("Total rooms must be a whole number")
    .positive("Total rooms must be greater than 0"),
});

export const updateRoomSchema = createRoomSchema.partial();

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

  adjustmentType: z.enum(["PERCENTAGE", "FIXED"]),

  adjustmentValue: z
    .number({
      error: "Adjustment value must be a number",
    })
    .positive("Adjustment value must be greater than 0"),
};

export const createPeakSeasonSchema = z
  .object(peakSeasonFields)
  .superRefine((data, ctx) => {
    if (data.endDate < data.startDate) {
      ctx.addIssue({
        code: "custom",
        path: ["endDate"],
        message: "End date must be on or after start date",
      });
    }

    if (
      data.adjustmentType === "PERCENTAGE" &&
      data.adjustmentValue > 100
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["adjustmentValue"],
        message: "Percentage adjustment must not exceed 100",
      });
    }
  });

export const updatePeakSeasonSchema = z
  .object(peakSeasonFields)
  .partial()
  .superRefine((data, ctx) => {
    if (
      data.startDate !== undefined &&
      data.endDate !== undefined &&
      data.endDate < data.startDate
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["endDate"],
        message: "End date must be on or after start date",
      });
    }

    if (
      data.adjustmentType === "PERCENTAGE" &&
      data.adjustmentValue !== undefined &&
      data.adjustmentValue > 100
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["adjustmentValue"],
        message: "Percentage adjustment must not exceed 100",
      });
    }
  });

export type CreateRoomInput = z.infer<typeof createRoomSchema>;

export type UpdateRoomInput = z.infer<typeof updateRoomSchema>;

export type CreatePeakSeasonInput = z.infer<
  typeof createPeakSeasonSchema
>;

export type UpdatePeakSeasonInput = z.infer<
  typeof updatePeakSeasonSchema
>;