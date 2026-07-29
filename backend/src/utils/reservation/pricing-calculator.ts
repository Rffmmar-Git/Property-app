import { adjustment_type } from "../../generated/prisma/enums";


export function calculateSubtotal(
  roomPrice: number,
  nights: number
): number {
  return roomPrice * nights;
}


export function calculatePeakSeasonAdjustment(
  subtotal: number,
  adjustmentType: adjustment_type,
  adjustmentValue: number
): number {
  switch (adjustmentType) {
    case adjustment_type.FIXED:
      return adjustmentValue;

    case adjustment_type.PERCENTAGE:
      return (subtotal * adjustmentValue) / 100;

    default:
      return 0;
  }
}


export function calculateTotalPrice(
  subtotal: number,
  adjustment: number
): number {
  return subtotal + adjustment;
}