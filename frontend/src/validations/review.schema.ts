import { z } from "zod";

export const createReviewSchema = z.object({
  reservationId: z
    .number()
    .int()
    .positive("Reservation ID must be greater than 0."),

  rating: z
    .number()
    .int()
    .min(1, "Please select a rating.")
    .max(5, "Rating must not exceed 5."),

  comment: z
    .string()
    .trim()
    .min(5, "Review must be at least 5 characters.")
    .max(1000, "Review must not exceed 1000 characters."),
});

export type CreateReviewFormValues = z.infer<
  typeof createReviewSchema
>;