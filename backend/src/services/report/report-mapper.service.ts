import { Decimal } from "@prisma/client/runtime/client";

export class ReportMapperService {
  //#region Sales Report

  buildSalesReportResponse(
    reservations: any[]
  ) {
    return reservations.map(
      (reservation) => ({
        id: Number(
          reservation.id
        ),

        bookingCode:
          reservation.booking_code,

        user: {
          id: Number(
            reservation.users.id
          ),

          fullName:
            reservation.users.full_name,

          email:
            reservation.users.email,
        },

        property: {
          id: Number(
            reservation.rooms
              .properties.id
          ),

          name:
            reservation.rooms
              .properties.name,
        },

        room: {
          id: Number(
            reservation.rooms.id
          ),

          roomName:
            reservation.rooms
              .room_name,
        },

        checkIn:
          reservation.check_in,

        checkOut:
          reservation.check_out,

        totalPrice:
          Number(
            reservation.total_price
          ),

        payment:
          reservation.payments
            ? {
                id: Number(
                  reservation
                    .payments.id
                ),

                paymentMethod:
                  reservation
                    .payments
                    .payment_method,

                paymentAmount:
                  Number(
                    reservation
                      .payments
                      .payment_amount
                  ),

                status:
                  reservation
                    .payments.status,

                paidAt:
                  reservation
                    .payments.paid_at,
              }
            : null,
      })
    );
  }

  //#endregion

  //#region Transaction Report

  buildTransactionReportResponse(
    reservations: any[]
  ) {
    return reservations.map(
      (reservation) => ({
        id: Number(
          reservation.id
        ),

        bookingCode:
          reservation.booking_code,

        status:
          reservation.status,

        user: {
          id: Number(
            reservation.users.id
          ),

          fullName:
            reservation.users.full_name,

          email:
            reservation.users.email,
        },

        property: {
          id: Number(
            reservation.rooms
              .properties.id
          ),

          name:
            reservation.rooms
              .properties.name,
        },

        room: {
          id: Number(
            reservation.rooms.id
          ),

          roomName:
            reservation.rooms
              .room_name,
        },

        checkIn:
          reservation.check_in,

        checkOut:
          reservation.check_out,

        totalPrice:
          Number(
            reservation.total_price
          ),

        createdAt:
          reservation.created_at,

        payment:
          reservation.payments
            ? {
                id: Number(
                  reservation
                    .payments.id
                ),

                paymentMethod:
                  reservation
                    .payments
                    .payment_method,

                paymentAmount:
                  Number(
                    reservation
                      .payments
                      .payment_amount
                  ),

                status:
                  reservation
                    .payments.status,

                paidAt:
                  reservation
                    .payments.paid_at,
              }
            : null,
      })
    );
  }

  //#endregion

  //#region Property Report

  buildPropertyReportResponse(
    availability: any[]
  ) {
    return availability.map(
      (item) => ({
        id: Number(
          item.id
        ),

        availableDate:
          item.available_date,

        availableRooms:
          item.available_rooms,

        isClosed:
          item.is_closed,

        closureReason:
          item.closure_reason,

        room: {
          id: Number(
            item.rooms.id
          ),

          roomName:
            item.rooms.room_name,

          totalRooms:
            item.rooms.total_rooms,

          basePrice:
            Number(
              item.rooms.base_price
            ),
        },

        property: {
          id: Number(
            item.rooms
              .properties.id
          ),

          name:
            item.rooms
              .properties.name,
        },
      })
    );
  }

  //#endregion
}