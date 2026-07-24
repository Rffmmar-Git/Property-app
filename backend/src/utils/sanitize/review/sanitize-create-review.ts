import { CreateReviewDto } from "../../../types/dto";
import {
  sanitizePositiveInteger,
  sanitizeString,
} from "../helpers";

export function sanitizeCreateReview(
  body: Partial<CreateReviewDto>
): Partial<CreateReviewDto> {
  return {
    reservationId: sanitizePositiveInteger(body.reservationId),
    comment: sanitizeString(body.comment),
  };
}