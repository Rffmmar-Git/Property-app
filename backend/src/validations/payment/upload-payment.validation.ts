import { z } from "zod";

export const uploadPaymentSchema = z.object({
  reservationId: z
    .number({
      error: "Reservation ID is required.",
    })
    .int("Reservation ID must be an integer.")
    .positive("Reservation ID must be greater than 0."),
});

export type UploadPaymentInput = z.infer<
  typeof uploadPaymentSchema
>;