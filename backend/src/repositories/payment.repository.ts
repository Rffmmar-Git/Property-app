import prisma from "../config/prisma";
import { Prisma, payments, payment_status } from "../generated/prisma/client";

/**
 * Create payment.
 */
export async function create(
  data: Prisma.paymentsCreateInput
): Promise<payments> {
  return prisma.payments.create({
    data,
  });
}

/**
 * Find payment by reservation id.
 */
export async function findByReservationId(
  reservationId: number
): Promise<payments | null> {
  return prisma.payments.findFirst({
    where: {
      reservation_id: BigInt(reservationId),
    },
  });
}

/**
 * Update payment status.
 */
export async function updateStatus(
  paymentId: number,
  status: payment_status
): Promise<payments> {
  return prisma.payments.update({
    where: {
      id: BigInt(paymentId),
    },
    data: {
      status,
    },
  });
}

/**
 * Update payment proof image.
 */
export async function updateProofImage(
  paymentId: number,
  proofImage: string
): Promise<payments> {
  return prisma.payments.update({
    where: {
      id: BigInt(paymentId),
    },
    data: {
      proof_image: proofImage,
    },
  });
}

/**
 * Update payment paid at.
 */
export async function updatePaidAt(
  paymentId: number,
  paidAt: Date
): Promise<payments> {
  return prisma.payments.update({
    where: {
      id: BigInt(paymentId),
    },
    data: {
      paid_at: paidAt,
    },
  });
}