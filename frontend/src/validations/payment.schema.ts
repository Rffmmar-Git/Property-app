import { z } from "zod";

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB
const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/png"];

export const uploadPaymentProofSchema = z.object({
  reservationId: z.number().int().positive(),
  file: z
    .instanceof(File, { message: "Payment proof image is required." })
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: "File size must not exceed 1MB.",
    })
    .refine((file) => ACCEPTED_FILE_TYPES.includes(file.type), {
      message: "Only JPG and PNG files are allowed.",
    }),
});

export type UploadPaymentProofFormValues = z.infer<
  typeof uploadPaymentProofSchema
>;