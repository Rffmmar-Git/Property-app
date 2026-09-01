import { Prisma, reviews } from "../../generated/prisma/client";
import { ReviewRepository } from "../../repositories";

export class ReviewPersistenceService {
  constructor(
    private readonly reviewRepository:
      ReviewRepository
  ) {}

  async createReview(
    data: Prisma.reviewsCreateInput
  ): Promise<reviews> {
    return this.reviewRepository.create(data);
  }

  async replyReview(
    reviewId: number,
    reply: string
  ): Promise<reviews> {
    const review =
      await this.reviewRepository
        .updateTenantReply(
          reviewId,
          reply
        );

    await this.reviewRepository
      .updateRepliedAt(
        reviewId,
        new Date()
      );

    return review;
  }
}