import {
  reservation_status,
  reservations,
  reviews,
} from "../../generated/prisma/client";
import {
  ReservationRepository,
  ReviewRepository,
} from "../../repositories";
import { ReservationComplete } from "../../types/prisma";
import { ApiError } from "../../utils";

export class ReviewValidationService {
  constructor(
    private readonly reservationRepository:
      ReservationRepository,

    private readonly reviewRepository:
      ReviewRepository
  ) {}

  /**
   * Validate reservation exists.
   */
  async validateReservation(
    reservationId: number
  ): Promise<ReservationComplete> {
    const reservation =
      await this.reservationRepository
        .findCompleteById(reservationId);

    if (!reservation) {
      throw new ApiError(
        404,
        "Reservation not found."
      );
    }

    return reservation;
  }

  /**
   * Validate reservation belongs to user.
   */
  validateReservationOwner(
    userId: number,
    reservationUserId: bigint
  ): void {
    if (
      userId !== Number(reservationUserId)
    ) {
      throw new ApiError(
        403,
        "You are not allowed to review this reservation."
      );
    }
  }

  /**
   * Validate reservation has been completed.
   */
  validateReservationCompleted(
    status: reservation_status | null
  ): void {
    if (
      status !==
      reservation_status.COMPLETED
    ) {
      throw new ApiError(
        409,
        "Reservation has not been completed."
      );
    }
  }

  /**
   * Validate reservation has not been reviewed.
   */
  validateReviewDoesNotExist(
    review: reviews | null
  ): void {
    if (review) {
      throw new ApiError(
        409,
        "This reservation has already been reviewed."
      );
    }
  }

  /**
   * Validate tenant owns the property.
   */
  validateTenantOwnership(
    tenantId: number,
    propertyTenantId: bigint
  ): void {
    if (
      BigInt(tenantId) !==
      propertyTenantId
    ) {
      throw new ApiError(
        403,
        "You are not authorized to manage this review."
      );
    }
  }

  /**
   * Validate review exists.
   */
  validateReviewExists(
    review: reviews | null
  ): reviews {
    if (!review) {
      throw new ApiError(
        404,
        "Review not found."
      );
    }

    return review;
  }

  /**
   * Find review by reservation.
   */
  async findReviewByReservation(
    reservationId: number
  ): Promise<reviews | null> {
    return this.reviewRepository
      .findByReservationId(
        reservationId
      );
  }
}