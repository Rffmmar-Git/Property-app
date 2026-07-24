import { z } from "zod";

export const createReservationSchema = z.object({
  roomId: z
    .number({
      error: "Room is required.",
    })
    .int("Room ID must be an integer.")
    .positive("Room ID must be greater than 0."),

  checkInDate: z.date({
    error: "Check-in date is required.",
  }),

  checkOutDate: z.date({
    error: "Check-out date is required.",
  }),

  guestCount: z
    .number({
      error: "Guest count is required.",
    })
    .int("Guest count must be an integer.")
    .min(1, "Guest count must be at least 1."),
});

export type CreateReservationInput = z.infer<
  typeof createReservationSchema
>;