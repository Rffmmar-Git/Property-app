import prisma from "../config/prisma";
import {
  Prisma,
  payments,
  payment_status,
} from "../generated/prisma/client";

export class PaymentRepository {
  /**
   * Create payment.
   */
  async create(
    data: Prisma.paymentsCreateInput
  ): Promise<payments> {
    return prisma.payments.create({
      data,
    });
  }

  /**
   * Find payment by reservation id.
   */
  async findByReservationId(
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
  async updateStatus(
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
  async updateProofImage(
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
  async updatePaidAt(
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
}