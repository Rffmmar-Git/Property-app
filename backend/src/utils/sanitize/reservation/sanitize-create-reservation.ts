import { CreateReservationDto } from "../../../types/dto/reservation";
import {
  sanitizePositiveInteger,
  sanitizeDateOnly,
} from "../helpers";

export function sanitizeCreateReservation(
  body: Partial<CreateReservationDto>
): Partial<CreateReservationDto> {
  return {
    roomId: sanitizePositiveInteger(body.roomId),
    checkInDate: sanitizeDateOnly(body.checkInDate),
    checkOutDate: sanitizeDateOnly(body.checkOutDate),
    guestCount: sanitizePositiveInteger(body.guestCount),
  };
}