import { z } from "zod";

export const createReviewSchema = z.object({
  reservationId: z
    .number({
      error: "Reservation ID is required.",
    })
    .int("Reservation ID must be an integer.")
    .positive("Reservation ID must be greater than 0."),

  comment: z
    .string({
      error: "Comment is required.",
    })
    .trim()
    .min(5, "Comment must be at least 5 characters.")
    .max(1000, "Comment must not exceed 1000 characters."),
});

export type CreateReviewInput = z.infer<
  typeof createReviewSchema
>;