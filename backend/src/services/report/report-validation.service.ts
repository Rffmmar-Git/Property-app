import { ApiError } from "../../utils";

export class ReportValidationService {
  validateDateRange(
    startDate?: Date,
    endDate?: Date
  ): void {
    if (
      startDate &&
      endDate &&
      startDate > endDate
    ) {
      throw new ApiError(
        400,
        "Start date must not be later than end date."
      );
    }
  }

  validatePagination(
    page?: number,
    limit?: number
  ): void {
    if (
      page !== undefined &&
      page <= 0
    ) {
      throw new ApiError(
        400,
        "Page must be greater than 0."
      );
    }

    if (
      limit !== undefined &&
      limit <= 0
    ) {
      throw new ApiError(
        400,
        "Limit must be greater than 0."
      );
    }
  }

  validatePropertyReportPeriod(
    month?: number,
    year?: number
  ): void {
    if (
      month !== undefined &&
      year === undefined
    ) {
      throw new ApiError(
        400,
        "Year is required when month is provided."
      );
    }

    if (
      year !== undefined &&
      month === undefined
    ) {
      throw new ApiError(
        400,
        "Month is required when year is provided."
      );
    }
  }
}