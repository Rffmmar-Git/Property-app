import { RejectPaymentDto } from "../../../types/dto";
import { sanitizePositiveInteger } from "../helpers";

export function sanitizeRejectPayment(
  body: Partial<RejectPaymentDto>
): Partial<RejectPaymentDto> {
  return {
    reservationId: sanitizePositiveInteger(body.reservationId),
  };
}