import { Request, Response } from "express";
import { asyncHandler } from "../utils";
import { ApiResponse } from "../utils";
import { ApiError } from "../utils";
import {
  createReviewSchema,
} from "../validations/review/create-review.validation";
import {  replyReviewSchema } from "../validations/review/reply-review.validation";
import { reviewService } from "../services/review/review.service";

export class ReviewController {
  //#region Customer

  createReview = asyncHandler(
    async (req: Request, res: Response) => {
      const dto =
        createReviewSchema.parse({
          reservationId:
            Number(req.body.reservationId),

          rating:
            Number(req.body.rating),

          comment:
            req.body.comment,
        });

      /**
       * Temporary.
       * Will be replaced with req.user.id
       * after Authentication Middleware is completed.
       */
      const userId =
        Number(req.user!.id);

      if (
        Number.isNaN(userId) ||
        userId <= 0
      ) {
        throw new ApiError(
          400,
          "User ID is required."
        );
      }

      const result =
        await reviewService.createReview(
          userId,
          dto
        );

      return res.status(201).json(
        new ApiResponse(
          true,
          result.message,
          result.data
        )
      );
    }
  );

  //#endregion

  //#region Tenant

  replyReview = asyncHandler(
    async (req: Request, res: Response) => {
      /**
       * Temporary.
       * Will be replaced with req.user.id
       * after Authentication Middleware is completed.
       */
      const tenantId =
        Number(req.user!.id);

      if (
        Number.isNaN(tenantId) ||
        tenantId <= 0
      ) {
        throw new ApiError(
          400,
          "Tenant ID is required."
        );
      }

      const dto =
        replyReviewSchema.parse({
          reviewId:
            Number(req.params.id),

          reply:
            req.body.reply,
        });

      const result =
        await reviewService.replyReview(
          tenantId,
          dto
        );

      return res.status(200).json(
        new ApiResponse(
          true,
          result.message,
          result.data
        )
      );
    }
  );

  //#endregion
}

export const reviewController =
  new ReviewController();