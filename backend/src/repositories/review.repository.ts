import prisma from "../config/prisma";
import { Prisma, reviews } from "../generated/prisma/client";

/**
 * Create review.
 */
export async function create(
  data: Prisma.reviewsCreateInput
): Promise<reviews> {
  return prisma.reviews.create({
    data,
  });
}

/**
 * Find review by reservation id.
 */
export async function findByReservationId(
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
export async function updateComment(
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
export async function updateTenantReply(
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
export async function updateRepliedAt(
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