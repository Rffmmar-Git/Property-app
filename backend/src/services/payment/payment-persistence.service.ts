import prisma from "../../config/prisma";
import {
  Prisma,
  payments,
  payment_status,
  reservation_status,
} from "../../generated/prisma/client";
import { PaymentRepository } from "../../repositories";

export class PaymentPersistenceService {
  constructor(
    private readonly paymentRepository: PaymentRepository
  ) {}

  async uploadPaymentProof(
    reservationId: number,
    proofImage: string
  ): Promise<payments> {
    const paymentData: Prisma.paymentsUpdateInput = {
      proof_image: proofImage,
    };

    const reservationData: Prisma.reservationsUpdateInput = {
      status: reservation_status.WAITING_CONFIRMATION,
    };

    return this.paymentRepository.uploadProof(
      reservationId,
      paymentData,
      reservationData
    );
  }

  async confirmPayment(
    reservationId: number
  ): Promise<payments> {
    return prisma.$transaction(
      async (tx) => {
        const payment =
          await tx.payments.update({
            where: {
              reservation_id: BigInt(
                reservationId
              ),
            },
            data: {
              status: payment_status.ACCEPTED,
              paid_at: new Date(),
            },
          });

        await tx.reservations.update({
          where: {
            id: BigInt(reservationId),
          },
          data: {
            status:
              reservation_status.CONFIRMED,
            confirmed_at: new Date(),
          },
        });

        return payment;
      }
    );
  }

  async rejectPayment(
    reservationId: number
  ): Promise<payments> {
    return prisma.$transaction(
      async (tx) => {
        const payment =
          await tx.payments.update({
            where: {
              reservation_id: BigInt(
                reservationId
              ),
            },
            data: {
              status: payment_status.REJECTED,
            },
          });

        await tx.reservations.update({
          where: {
            id: BigInt(reservationId),
          },
          data: {
            status:
              reservation_status.WAITING_PAYMENT,
          },
        });

        return payment;
      }
    );
  }
}