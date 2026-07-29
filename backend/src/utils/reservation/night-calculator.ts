const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

export function calculateNight(
  checkIn: Date,
  checkOut: Date
): number {
  const diff = checkOut.getTime() - checkIn.getTime();

  if (diff <= 0) {
    throw new Error(
      "Check-out date must be after check-in date."
    );
  }

  return Math.ceil(diff / MILLISECONDS_PER_DAY);
}