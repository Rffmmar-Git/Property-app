import { ConfirmPaymentDto } from "../../../types/dto";
import { sanitizePositiveInteger } from "../helpers";

export function sanitizeConfirmPayment(
  body: Partial<ConfirmPaymentDto>
): Partial<ConfirmPaymentDto> {
  return {
    reservationId: sanitizePositiveInteger(body.reservationId),
  };
}