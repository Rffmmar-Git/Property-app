import {
  payment_status,
  reservation_status,
  reservations,
  payments,
} from "../../generated/prisma/client";

import {
  PaymentRepository,
  ReservationRepository,
} from "../../repositories";

import { ReservationComplete } from "../../types/prisma";
import { ApiError } from "../../utils";
export class PaymentValidationService {
  constructor(
    private readonly reservationRepository:
      ReservationRepository,

    private readonly paymentRepository:
      PaymentRepository
  ) {}

  //#region Reservation Validation

  async validateReservation(
    reservationId: number
  ): Promise<reservations> {
    const reservation =
      await this.reservationRepository.findById(
        reservationId
      );

    if (!reservation) {
      throw new ApiError(
        404,
        "Reservation not found."
      );
    }

    return reservation;
  }

  async validateReservationForTenant(
    reservationId: number
  ): Promise<ReservationComplete> {
    const reservation =
      await this.reservationRepository
        .findCompleteById(
          reservationId
        );

    if (!reservation) {
      throw new ApiError(
        404,
        "Reservation not found."
      );
    }

    return reservation;
  }

  validateReservationOwner(
    userId: number,
    reservationUserId: bigint
  ): void {
    if (
      userId !== Number(reservationUserId)
    ) {
      throw new ApiError(
        403,
        "You are not allowed to access this reservation."
      );
    }
  }

  //#endregion

  //#region Payment Validation

  async validatePayment(
    reservationId: number
  ): Promise<payments> {
    const payment =
      await this.paymentRepository
        .findByReservationId(
          reservationId
        );

    if (!payment) {
      throw new ApiError(
        404,
        "Payment not found."
      );
    }

    return payment;
  }

  validatePaymentCanBeUploaded(
    payment: payments
  ): void {
    if (payment.proof_image) {
      throw new ApiError(
        409,
        "Payment proof has already been uploaded."
      );
    }

    if (
      payment.status !==
      payment_status.PENDING
    ) {
      throw new ApiError(
        409,
        "Payment is no longer pending."
      );
    }
  }

  validatePaymentCanBeConfirmed(
    paymentStatus: payment_status | null,
    reservationStatus:
      reservation_status | null
  ): void {
    if (
      paymentStatus !==
      payment_status.PENDING
    ) {
      throw new ApiError(
        409,
        "Payment is not waiting for confirmation."
      );
    }

    if (
      reservationStatus !==
      reservation_status.WAITING_CONFIRMATION
    ) {
      throw new ApiError(
        409,
        "Reservation is not waiting for payment confirmation."
      );
    }
  }

  validatePaymentCanBeRejected(
    paymentStatus: payment_status | null,
    reservationStatus:
      reservation_status | null
  ): void {
    if (
      paymentStatus !==
      payment_status.PENDING
    ) {
      throw new ApiError(
        409,
        "Payment is not waiting for confirmation."
      );
    }

    if (
      reservationStatus !==
      reservation_status.WAITING_CONFIRMATION
    ) {
      throw new ApiError(
        409,
        "Reservation is not waiting for payment confirmation."
      );
    }
  }

  //#endregion

  //#region Tenant Validation

  validateTenantOwnership(
    tenantId: number,
    propertyTenantId: bigint
  ): void {
    if (
      BigInt(tenantId) !==
      propertyTenantId
    ) {
      throw new ApiError(
        403,
        "You are not authorized to manage this payment."
      );
    }
  }

  //#endregion

  //#region Booking Validation

  validateReservationStatus(
    status: reservation_status | null
  ): void {
    if (
      status !==
      reservation_status.WAITING_PAYMENT
    ) {
      throw new ApiError(
        409,
        "Reservation is not waiting for payment."
      );
    }
  }

  validateBookingExpired(
    expiredAt: Date
  ): void {
    if (
      expiredAt <= new Date()
    ) {
      throw new ApiError(
        410,
        "Reservation has expired."
      );
    }
  }

  //#endregion
}