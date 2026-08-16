import { reservation_status } from "../../generated/prisma/client";

export class ReservationBookingService {

  generateBookingCode(): string {
    const now = new Date();

    const date =
      now.getFullYear().toString() +
      String(now.getMonth() + 1).padStart(2, "0") +
      String(now.getDate()).padStart(2, "0");

    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    let random = "";

    for (let i = 0; i < 4; i++) {
      random += characters.charAt(
        Math.floor(
          Math.random() * characters.length
        )
      );
    }

    return `RSV-${date}-${random}`;
  }

  calculateBookingExpiredAt(): Date {
    const expiredAt = new Date();

    expiredAt.setMinutes(
      expiredAt.getMinutes() + 60
    );

    return expiredAt;
  }

  validateReservationCanBeCancelled(
    status: reservation_status | null
  ): void {
    if (
      status !== reservation_status.WAITING_PAYMENT
    ) {
      throw new Error(
        "Reservation cannot be cancelled."
      );
    }
  }

  validateBookingExpired(
    bookingExpiredAt: Date | null
  ): void {
    if (!bookingExpiredAt) {
      return;
    }

    if (new Date() >= bookingExpiredAt) {
      throw new Error(
        "Reservation payment period has expired."
      );
    }
  }
}