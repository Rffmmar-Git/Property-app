import {
  AvailabilityRepository,
  PeakSeasonRepository,
  ReservationRepository,
  RoomRepository,
} from "../repositories";
import { Prisma, reservation_status, adjustment_type } from "../generated/prisma/client";
import { CreateReservationDto } from "../types/dto";
import { rooms } from "../generated/prisma/client";


interface ReservationPricing {
  roomPrice: Prisma.Decimal;
  peakSeasonAdjustment: Prisma.Decimal;
  totalPrice: Prisma.Decimal;
}


export class ReservationService {
  constructor(
    private readonly roomRepository: RoomRepository,
    private readonly availabilityRepository: AvailabilityRepository,
    private readonly peakSeasonRepository: PeakSeasonRepository,
    private readonly reservationRepository: ReservationRepository
  ) {}

  //#region Public Methods

  async createReservation(
  userId: number,
  dto: CreateReservationDto
) {
  // Validation
  const room = await this.validateRoom(dto.roomId);

  this.validateGuestCount(
    dto.guestCount,
    room.capacity
  );

  await this.validateAvailability(dto);

  // Pricing
  const pricing = await this.calculateReservation(
    room,
    dto
  );

  // Persistence
  const reservationData = this.buildReservationData(
  userId,
  dto,
  pricing
);

const reservation =
  await this.reservationRepository.create(
    reservationData
  );

return reservation;
}

  async getReservationById() {
    throw new Error("Not implemented.");
  }

  async getMyReservations() {
    throw new Error("Not implemented.");
  }

  async cancelReservation() {
    throw new Error("Not implemented.");
  }

  //#endregion

  //#region Validation
  private async validateRoom(
  roomId: number
): Promise<rooms> {
  const room = await this.roomRepository.findById(roomId);

  if (!room) {
    throw new Error("Room not found.");
  }

  return room;
}

private validateGuestCount(
  guestCount: number,
  roomCapacity: number
): void {
  if (guestCount <= 0) {
    throw new Error("Guest count must be greater than zero.");
  }

  if (guestCount > roomCapacity) {
    throw new Error("Guest count exceeds room capacity.");
  }
}

private async validateAvailability(
  dto: CreateReservationDto
): Promise<void> {
  const availabilities =
    await this.availabilityRepository.findManyByRoomIdAndDateRange(
      dto.roomId,
      dto.checkInDate,
      dto.checkOutDate
    );

  if (availabilities.length === 0) {
    throw new Error("Room is not available.");
  }

  for (const availability of availabilities) {
    if (availability.is_closed) {
      throw new Error("Room is closed.");
    }

    if (availability.available_rooms <= 0) {
      throw new Error("Room is fully booked.");
    }
  }
}

private async calculateReservation(
  room: rooms,
  dto: CreateReservationDto
): Promise<ReservationPricing> {
  const nights = this.calculateNights(
    dto.checkInDate,
    dto.checkOutDate
  );

  const roomPrice = this.calculateRoomPrice(
    room,
    nights
  );

  const peakSeasonAdjustment =
    await this.calculatePeakSeasonAdjustment(
      dto,
      room
    );

  const totalPrice = roomPrice.plus(
    peakSeasonAdjustment
  );

  return {
    roomPrice,
    peakSeasonAdjustment,
    totalPrice,
  };
}

private calculateRoomPrice(
  room: rooms,
  nights: number
): Prisma.Decimal {
  return room.base_price.mul(nights);
}

private async calculatePeakSeasonAdjustment(
  dto: CreateReservationDto,
  room: rooms
): Promise<Prisma.Decimal> {
  const peakSeasons =
    await this.peakSeasonRepository.findManyByRoomIdAndDateRange(
      Number(room.id),
      dto.checkInDate,
      dto.checkOutDate
    );

  let adjustment = new Prisma.Decimal(0);

  for (const peak of peakSeasons) {
    const overlapNights = this.calculateOverlapNights(
      peak.start_date,
      peak.end_date,
      dto.checkInDate,
      dto.checkOutDate
    );

    if (overlapNights === 0) {
      continue;
    }

    if (peak.adjustment_type === adjustment_type.PERCENTAGE) {
      adjustment = adjustment.plus(
        room.base_price
          .mul(overlapNights)
          .mul(peak.adjustment_value)
          .div(100)
      );

      continue;
    }

    adjustment = adjustment.plus(
      peak.adjustment_value.mul(overlapNights)
    );
  }

  return adjustment;
}


  //#endregion

  //#region Pricing
  private calculateNights(
  checkIn: Date,
  checkOut: Date
): number {
  const millisecondsPerDay = 1000 * 60 * 60 * 24;

  return Math.ceil(
    (checkOut.getTime() - checkIn.getTime()) /
      millisecondsPerDay
  );
}

private calculateOverlapNights(
  peakStart: Date,
  peakEnd: Date,
  checkIn: Date,
  checkOut: Date
): number {
  const start =
    peakStart > checkIn ? peakStart : checkIn;

  const end =
    peakEnd < checkOut ? peakEnd : checkOut;

  if (start >= end) {
    return 0;
  }

  return this.calculateNights(start, end);
}



  //#endregion

  //#region Booking
  private generateBookingCode(): string {
  const now = new Date();

  const date =
    now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, "0") +
    String(now.getDate()).padStart(2, "0");

  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  let random = "";

  for (let i = 0; i < 4; i++) {
    random += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }

  return `RSV-${date}-${random}`;
}

private calculateBookingExpiredAt(): Date {
  const expiredAt = new Date();

  expiredAt.setMinutes(expiredAt.getMinutes() + 60);

  return expiredAt;
}



  //#endregion

  //#region Persistence
  private buildReservationData(
  userId: number,
  dto: CreateReservationDto,
  pricing: ReservationPricing
): Prisma.reservationsCreateInput {
  return {
    booking_code: this.generateBookingCode(),

    users: {
      connect: {
        id: BigInt(userId),
      },
    },

    rooms: {
      connect: {
        id: BigInt(dto.roomId),
      },
    },

    check_in: dto.checkInDate,
    check_out: dto.checkOutDate,
    guest_count: dto.guestCount,

    room_price: pricing.roomPrice,
    peak_season_adjustment: pricing.peakSeasonAdjustment,
    total_price: pricing.totalPrice,

    status: reservation_status.WAITING_PAYMENT,

    booking_expired_at: this.calculateBookingExpiredAt(),
  };
}



  //#endregion
}