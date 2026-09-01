import { reviews } from "../../generated/prisma/client";

import { CreateReviewResponseDto } from "../../types/dto/review/create-review-response.dto";
import { ReplyReviewResponseDto } from "../../types/dto/review/reply-review-response.dto";

export class ReviewMapperService {
  buildCreateReviewResponse(
    review: reviews
  ): CreateReviewResponseDto {
    return {
      message:
        "Review created successfully.",

      data: {
        id: Number(review.id),

        reservationId:
          Number(review.reservation_id),

        propertyId:
          Number(review.property_id),

        userId:
          Number(review.user_id),

        rating:
          review.rating,

        comment:
          review.comment,

        tenantReply:
          review.tenant_reply,

        repliedAt:
          review.replied_at,
      },
    };
  }

  buildReplyReviewResponse(
    review: reviews
  ): ReplyReviewResponseDto {
    return {
      message:
        "Review reply submitted successfully.",

      data: {
        id: Number(review.id),

        reservationId:
          Number(review.reservation_id),

        propertyId:
          Number(review.property_id),

        userId:
          Number(review.user_id),

        rating:
          review.rating,

        comment:
          review.comment,

        tenantReply:
          review.tenant_reply,

        repliedAt:
          review.replied_at,
      },
    };
  }
}