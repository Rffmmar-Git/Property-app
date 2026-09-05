import app from "./app";
import { env } from "./config/env";
import { startReservationReminderCron } from "./cron/reservation-reminder.cron";

startReservationReminderCron();

app.listen(env.PORT, () => {
  console.log(
    `🚀 Server is running at http://localhost:${env.PORT}`
  );
});