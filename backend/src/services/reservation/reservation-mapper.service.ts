import {
  Prisma,
  reservations, reservation_status
} from "../../generated/prisma/client";
import { CreateReservationResponseDto } from "../../types/dto/reservation/create-reservation-response.dto";
import { ReservationDetailResponseDto } from "../../types/dto/reservation/reservation-detail-response.dto";
import { ReservationListResponseDto } from "../../types/dto/reservation/reservation-list-response.dto";
import { CancelReservationResponseDto } from "../../types/dto/reservation/cancel-reservation-response.dto";

import { ReservationComplete } from "../../types/prisma";

export class ReservationMapperService {
  buildCreateReservationResponse(
    reservation: reservations
  ): CreateReservationResponseDto {
    return {
      message:
        "Reservation created successfully.",

      data: {
        id: Number(reservation.id),

        bookingCode:
          reservation.booking_code,

        roomId:
          Number(reservation.room_id),

        checkInDate:
          reservation.check_in,

        checkOutDate:
          reservation.check_out,

        guestCount:
          reservation.guest_count,

        roomPrice:
          reservation.room_price.toString(),

        peakSeasonAdjustment:
          (
            reservation.peak_season_adjustment ??
            new Prisma.Decimal(0)
          ).toString(),

        totalPrice:
          reservation.total_price.toString(),

        status:
        this.mapReservationStatus(
            reservation.status),
        
        bookingExpiredAt:
          reservation.booking_expired_at,
      },
    };
  }

  buildReservationDetailResponse(
    reservation: ReservationComplete
  ): ReservationDetailResponseDto {
    return {
      message:
        "Reservation detail retrieved successfully.",

      data: {
        id:
          Number(reservation.id),

        bookingCode:
          reservation.booking_code,

        propertyName:
          reservation.rooms.properties.name,

        roomName:
          reservation.rooms.room_name,

        checkInDate:
          reservation.check_in,

        checkOutDate:
          reservation.check_out,

        guestCount:
          reservation.guest_count,

        totalPrice:
          reservation.total_price.toString(),

        reservationStatus:
        this.mapReservationStatus(
            reservation.status),

        paymentStatus:
          reservation.payments?.status ?? null,
        
        paymentProof:
          reservation.payments?.proof_image ?? null,
      },
    };
  }

  private mapReservationStatus(
  status: reservation_status | null
    ): reservation_status {
    if (!status) {
        throw new Error(
        "Reservation status is missing."
        );
    }

    return status;
    }

  buildReservationListResponse(
    reservations: ReservationComplete[]
  ): ReservationListResponseDto {
    return {
      message:
        "Reservations retrieved successfully.",

      data: reservations.map(
        (reservation) => ({
          id:
            Number(reservation.id),

          bookingCode:
            reservation.booking_code,

          propertyName:
            reservation.rooms.properties.name,

          roomName:
            reservation.rooms.room_name,

          checkInDate:
            reservation.check_in,

          checkOutDate:
            reservation.check_out,

          totalPrice:
            reservation.total_price.toString(),

          reservationStatus:
            this.mapReservationStatus(
                reservation.status ),
 
          paymentStatus:
            reservation.payments?.status ?? null,
        })
      ),
    };
  }

  buildCancelReservationResponse(
    reservation: reservations
  ): CancelReservationResponseDto {
    return {
      message:
        "Reservation cancelled successfully.",

      data: {
        id:
          Number(reservation.id),

        bookingCode:
          reservation.booking_code,
        status:
        this.mapReservationStatus(
            reservation.status),
        cancelledAt:
          reservation.cancelled_at,
      },
    };
  }
}