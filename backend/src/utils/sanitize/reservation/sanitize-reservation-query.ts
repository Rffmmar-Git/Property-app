import { ReservationQueryDto } from "../../../types/dto/reservation";
import {
  sanitizePage,
  sanitizeLimit,
  sanitizeSort,
  sanitizeOrder,
  sanitizeString,
  sanitizeDateOnly,
} from "../helpers";

export function sanitizeReservationQuery(
  query: Partial<ReservationQueryDto>
): Partial<ReservationQueryDto> {
  return {
    page: sanitizePage(query.page),
    limit: sanitizeLimit(query.limit),

    status: sanitizeString(query.status),

    sortBy: sanitizeSort(query.sortBy),
    order: sanitizeOrder(query.order),

    search: sanitizeString(query.search),

    startDate: sanitizeDateOnly(query.startDate),
    endDate: sanitizeDateOnly(query.endDate),
  };
}