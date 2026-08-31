import { z } from "zod";

export const createRoomAvailabilitySchema =
  z.object({
    availableDate: z
      .string()
      .regex(
        /^\d{4}-\d{2}-\d{2}$/,
        "Date must use YYYY-MM-DD format",
      ),

    closureReason: z
      .string()
      .trim()
      .max(
        255,
        "Closure reason must not exceed 255 characters",
      )
      .optional(),
  });

export type CreateRoomAvailabilityInput =
  z.infer<
    typeof createRoomAvailabilitySchema
  >;