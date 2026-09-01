import { rooms } from "../../generated/prisma/client";
import { CreateReservationDto } from "../../types/dto";
import { ApiError } from "../../utils";
import {AvailabilityRepository,RoomRepository}from "../../repositories";
import { ReservationComplete } from "../../types/prisma";

export class ReservationValidationService {
  constructor(
    private readonly roomRepository: RoomRepository,
    private readonly availabilityRepository: AvailabilityRepository
  ) {}

  async validateRoom(
    roomId: number
  ): Promise<rooms> {
    const room =
      await this.roomRepository.findById(roomId);

    if (!room) {
      throw new ApiError(
        404,
        "Room not found."
      );
    }

    return room;
  }

  validateGuestCount(
    guestCount: number,
    roomCapacity: number
  ): void {
    if (guestCount <= 0) {
      throw new ApiError(
        400,
        "Guest count must be greater than zero."
      );
    }

    if (guestCount > roomCapacity) {
      throw new ApiError(
        400,
        "Guest count exceeds room capacity."
      );
    }
  }

  async validateAvailability(
    dto: CreateReservationDto
  ): Promise<void> {
    const availabilities =
      await this.availabilityRepository.findManyByRoomIdAndDateRange(
        dto.roomId,
        dto.checkInDate,
        dto.checkOutDate
      );

    if (availabilities.length === 0) {
      throw new ApiError(
        400,
        "Room is not available."
      );
    }

    for (const availability of availabilities) {
      if (availability.is_closed) {
        throw new ApiError(
          400,
          "Room is closed."
        );
      }

      if (availability.available_rooms <= 0) {
        throw new ApiError(
          400,
          "Room is fully booked."
        );
      }
    }
  }

  validateReservationExists(
    reservation: ReservationComplete | null
  ): asserts reservation is ReservationComplete {
    if (!reservation) {
      throw new ApiError(
        404,
        "Reservation not found."
      );
    }
  }

  validateReservationOwner(
    userId: number,
    reservationUserId: number
  ): void {
    if (userId !== reservationUserId) {
      throw new ApiError(
        403,
        "You are not allowed to access this reservation."
      );
    }
  }

  validateReservationCanBeCancelled(
    status: string | null
  ): void {
    if (status !== "WAITING_PAYMENT") {
      throw new ApiError(
        400,
        "Reservation cannot be cancelled."
      );
    }
  }

  validateBookingExpired(
    expiredAt: Date | null
  ): void {
    if (!expiredAt) {
      return;
    }

    if (expiredAt.getTime() < Date.now()) {
      throw new ApiError(
        400,
        "Reservation has expired."
      );
    }
  }
}