import { PropertyReportQueryDto } from "../../../types/dto";
import {
  sanitizePositiveInteger,
} from "../helpers";

export function sanitizePropertyReportQuery(
  query: Partial<PropertyReportQueryDto>
): Partial<PropertyReportQueryDto> {
  return {
    propertyId: sanitizePositiveInteger(query.propertyId),
    month: sanitizePositiveInteger(query.month),
    year: sanitizePositiveInteger(query.year),
  };
}