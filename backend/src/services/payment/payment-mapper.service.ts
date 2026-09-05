import { payments } from "../../generated/prisma/client";

import { UploadPaymentResponseDto } from "../../types/dto/payment/upload-payment-response.dto";
import { ConfirmPaymentResponseDto } from "../../types/dto/payment/confirm-payment-response.dto";
import { RejectPaymentResponseDto } from "../../types/dto/payment/reject-payment-response.dto";
import { ReservationComplete } from "../../types/prisma";
import { TenantTransactionResponseDto } from "../../types/dto/payment/tenant-transaction-response.dto";
export class PaymentMapperService {
  buildUploadPaymentResponse(
    payment: payments
  ): UploadPaymentResponseDto {
    return {
      message:
        "Payment proof uploaded successfully.",
      data: {
        id: Number(payment.id),

        reservationId:
          Number(payment.reservation_id),

        status:
          payment.status!,

        proofImage:
          payment.proof_image,

        paidAt:
          payment.paid_at,
      },
    };
  }

  buildConfirmPaymentResponse(
    payment: payments
  ): ConfirmPaymentResponseDto {
    return {
      message:
        "Payment confirmed successfully.",

      data: {
        id: Number(payment.id),

        reservationId:
          Number(payment.reservation_id),

        status:
          payment.status!,

        paidAt:
          payment.paid_at,
      },
    };
  }

  buildRejectPaymentResponse(
    payment: payments
  ): RejectPaymentResponseDto {
    return {
      message:
        "Payment rejected successfully.",

      data: {
        id: Number(payment.id),

        reservationId:
          Number(payment.reservation_id),

        status:
          payment.status!,
      },
    };
  }

buildTenantTransactionResponse(
  reservations: ReservationComplete[],
  total: number,
  page: number,
  limit: number
): TenantTransactionResponseDto {
  return {
    message:
      "Tenant transactions retrieved successfully.",

    data: reservations.map((reservation) => ({
      id: Number(reservation.id),

      bookingCode:
        reservation.booking_code,

      customerName:
        reservation.users.full_name,

      propertyName:
        reservation.rooms.properties.name,

      roomName:
        reservation.rooms.room_name,

      checkInDate:
        reservation.check_in
          .toISOString()
          .split("T")[0],

      checkOutDate:
        reservation.check_out
          .toISOString()
          .split("T")[0],

      guestCount:
        reservation.guest_count,

      totalPrice:
        reservation.total_price.toString(),

      reservationStatus:
        reservation.status!,

      paymentStatus:
        reservation.payments?.status!,

      paymentProof:
        reservation.payments?.proof_image ?? null,

      createdAt:
        reservation.created_at!
          .toISOString(),
    })),

    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(
        total / limit
      ),
    },
  };
}
}