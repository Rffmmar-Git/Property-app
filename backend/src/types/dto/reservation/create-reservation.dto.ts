export interface CreateReservationDto {
  roomId: number;
  checkInDate: Date;
  checkOutDate: Date;
  guestCount: number;
}