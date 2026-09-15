import { z } from "zod";

export const createRoomAvailabilitySchema = z
  .object({
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

    roomsToClose: z
      .number({
        error: "Rooms to close must be a number",
      })
      .int("Rooms to close must be a whole number")
      .positive("Rooms to close must be greater than 0"),

    closureReason: z
      .string()
      .trim()
      .max(
        255,
        "Closure reason must not exceed 255 characters",
      )
      .optional(),
  })
  .refine(
    (data) => data.startDate <= data.endDate,
    {
      message: "End date must be on or after start date",
      path: ["endDate"],
    },
  );

export type CreateRoomAvailabilityInput = z.infer<
  typeof createRoomAvailabilitySchema
>;