import { z } from "zod";

export const replyReviewSchema = z.object({
  reviewId: z
    .number({
      error: "Review ID is required.",
    })
    .int("Review ID must be an integer.")
    .positive("Review ID must be greater than 0."),

  reply: z
    .string({
      error: "Reply is required.",
    })
    .trim()
    .min(3, "Reply must be at least 3 characters.")
    .max(1000, "Reply must not exceed 1000 characters."),
});

export type ReplyReviewInput = z.infer<
  typeof replyReviewSchema
>;