import { payments } from "../../generated/prisma/client";

import { UploadPaymentResponseDto } from "../../types/dto/payment/upload-payment-response.dto";
import { ConfirmPaymentResponseDto } from "../../types/dto/payment/confirm-payment-response.dto";
import { RejectPaymentResponseDto } from "../../types/dto/payment/reject-payment-response.dto";

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
}