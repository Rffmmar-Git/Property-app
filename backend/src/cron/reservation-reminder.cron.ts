import cron from "node-cron";
import { ReservationRepository } from "../repositories";
import { sendCheckInReminderEmail } from "../utils";

const reservationRepository =
  new ReservationRepository();

function getJakartaDate(): Date {
  const jakartaDate =
    new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Jakarta",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());

  return new Date(`${jakartaDate}T00:00:00+07:00`);
}

export function startReservationReminderCron(): void {
  cron.schedule(
    "0 0 * * *",
    async () => {
      try {
        const today = getJakartaDate();

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const dayAfterTomorrow = new Date(tomorrow);
        dayAfterTomorrow.setDate(
          dayAfterTomorrow.getDate() + 1
        );

        const reservations =
          await reservationRepository
            .findConfirmedReservationsForReminder(
              tomorrow,
              dayAfterTomorrow
            );

        for (const reservation of reservations) {
          await sendCheckInReminderEmail(
            reservation.users.email,
            reservation.users.full_name,
            reservation.booking_code,
            reservation.rooms.properties.name,
            reservation.rooms.properties.address,
            reservation.rooms.room_name,
            reservation.check_in,
            reservation.check_out,
            reservation.rooms.properties.check_in_time,
            reservation.guest_count
          );
        }

        console.log(
          `✅ H-1 reminder processed: ${reservations.length} reservation(s)`
        );
      } catch (error) {
        console.error(
          "❌ Failed to process H-1 reservation reminders:",
          error
        );
      }
    },
    {
      timezone: "Asia/Jakarta",
    }
  );
}