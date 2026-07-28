import { SalesReportQueryDto } from "../../../types/dto";
import {
  sanitizeDateOnly,
  sanitizeLimit,
  sanitizeOrder,
  sanitizePage,
  sanitizePositiveInteger,
  sanitizeSort,
} from "../helpers";

export function sanitizeSalesReportQuery(
  query: Partial<SalesReportQueryDto>
): Partial<SalesReportQueryDto> {
  return {
    page: sanitizePage(query.page),
    limit: sanitizeLimit(query.limit),

    propertyId: sanitizePositiveInteger(query.propertyId),

    startDate: sanitizeDateOnly(query.startDate),
    endDate: sanitizeDateOnly(query.endDate),

    
    order: sanitizeOrder(query.order),
  };
}