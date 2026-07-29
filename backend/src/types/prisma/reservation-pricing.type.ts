import { Prisma } from "../../generated/prisma/client";

export interface ReservationPricing {
  roomPrice: Prisma.Decimal;
  peakSeasonAdjustment: Prisma.Decimal;
  totalPrice: Prisma.Decimal;
}