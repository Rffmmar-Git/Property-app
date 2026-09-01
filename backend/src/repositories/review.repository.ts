import prisma from "../config/prisma";
import { Prisma, reviews } from "../generated/prisma/client";

export class ReviewRepository {
  /**
   * Create review.
   */
  async create(
    data: Prisma.reviewsCreateInput
  ): Promise<reviews> {
    return prisma.reviews.create({
      data,
    });
  }

  /**
   * Find review by reservation id.
   */
  async findByReservationId(
    reservationId: number
  ): Promise<reviews | null> {
    return prisma.reviews.findUnique({
      where: {
        reservation_id: BigInt(reservationId),
      },
    });
  }

  /**
   * Update review comment.
   */
  async updateComment(
    reviewId: number,
    comment: string
  ): Promise<reviews> {
    return prisma.reviews.update({
      where: {
        id: BigInt(reviewId),
      },
      data: {
        comment,
      },
    });
  }

  /**
   * Update tenant reply.
   */
  async updateTenantReply(
    reviewId: number,
    tenantReply: string
  ): Promise<reviews> {
    return prisma.reviews.update({
      where: {
        id: BigInt(reviewId),
      },
      data: {
        tenant_reply: tenantReply,
      },
    });
  }

  /**
   * Update replied at.
   */
  async updateRepliedAt(
    reviewId: number,
    repliedAt: Date
  ): Promise<reviews> {
    return prisma.reviews.update({
      where: {
        id: BigInt(reviewId),
      },
      data: {
        replied_at: repliedAt,
      },
    });
  }
  async findCompleteById(
  reviewId: number
) {
  return prisma.reviews.findUnique({
    where: {
      id: BigInt(reviewId),
    },
    include: {
      properties: true,
      users: true,
      reservations: true,
    },
  });
}
}