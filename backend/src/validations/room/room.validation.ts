import { z } from "zod";

export const createRoomSchema = z.object({
  roomName: z
    .string()
    .trim()
    .min(1, "Room name is required")
    .max(100, "Room name must not exceed 100 characters"),

  description: z
    .string()
    .trim()
    .optional(),

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

export const updateRoomSchema =
  createRoomSchema.partial();

export type CreateRoomInput = z.infer<
  typeof createRoomSchema
>;

export type UpdateRoomInput = z.infer<
  typeof updateRoomSchema
>;