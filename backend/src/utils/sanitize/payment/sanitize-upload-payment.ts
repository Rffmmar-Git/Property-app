import { UploadPaymentDto } from "../../../types/dto/payment/upload-payment.dto";
import { sanitizePositiveInteger } from "../helpers";

export function sanitizeUploadPayment(
  body: Partial<UploadPaymentDto>
): Partial<UploadPaymentDto> {
  return {
    reservationId: sanitizePositiveInteger(body.reservationId),
  };
}