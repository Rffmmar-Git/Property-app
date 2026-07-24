import { ReplyReviewDto } from "../../../types/dto";
import {
  sanitizePositiveInteger,
  sanitizeString,
} from "../helpers";

export function sanitizeReplyReview(
  body: Partial<ReplyReviewDto>
): Partial<ReplyReviewDto> {
  return {
    reviewId: sanitizePositiveInteger(body.reviewId),
    reply: sanitizeString(body.reply),
  };
}