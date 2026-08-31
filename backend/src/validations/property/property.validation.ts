import { z } from "zod";

export const createPropertySchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Property name must be at least 3 characters")
    .max(150, "Property name must not exceed 150 characters"),

  categoryId: z
    .string()
    .min(1, "Category is required"),

  destinationId: z
    .string()
    .min(1, "Destination is required"),

  description: z
    .string()
    .trim()
    .optional(),

  address: z
    .string()
    .trim()
    .min(5, "Address must be at least 5 characters"),

  latitude: z
    .number()
    .min(-90)
    .max(90)
    .optional(),

  longitude: z
    .number()
    .min(-180)
    .max(180)
    .optional(),

  checkInTime: z
    .string()
    .regex(
      /^([01]\d|2[0-3]):[0-5]\d$/,
      "Check-in time must use HH:mm format",
    )
    .optional(),

  checkOutTime: z
    .string()
    .regex(
      /^([01]\d|2[0-3]):[0-5]\d$/,
      "Check-out time must use HH:mm format",
    )
    .optional(),
});

export type CreatePropertyInput = z.infer<
  typeof createPropertySchema
>;

export const updatePropertySchema = createPropertySchema.partial();

export type UpdatePropertyInput = z.infer<
  typeof updatePropertySchema
>;