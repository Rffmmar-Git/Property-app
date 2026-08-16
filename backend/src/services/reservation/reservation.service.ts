import {
  AvailabilityRepository,
  PeakSeasonRepository,
  ReservationRepository,
  RoomRepository,
  PaymentRepository,
} from "../../repositories";
import { ReservationPersistenceService } from "./reservation-persistence.service";
import { CreateReservationDto } from "../../types/dto";
import { ReservationPricingService,ReservationPricing, } from "./reservation-pricing.service";
import { ReservationValidationService } from "./reservation-validation.service";
import { ReservationBookingService } from "./reservation-booking.service";
import { ReservationMapperService } from "./reservation-mapper.service";
import { CancelReservationResponseDto } from "../../types/dto/reservation/cancel-reservation-response.dto";


export class ReservationService {
  constructor(
    private readonly reservationRepository:
      ReservationRepository,
    private readonly validationService:
      ReservationValidationService,
    private readonly pricingService:
      ReservationPricingService,
    private readonly mapperService:
      ReservationMapperService,
    private readonly bookingService:
      ReservationBookingService,
    private readonly persistenceService:
      ReservationPersistenceService
  ) {}

  //#region Public Methods

  async createReservation(
    userId: number,
    dto: CreateReservationDto
  ) {
    const room =
      await this.validationService.validateRoom(
        dto.roomId
      );

    this.validationService.validateGuestCount(
      dto.guestCount,
      room.capacity
    );

    await this.validationService.validateAvailability(
      dto
    );

    const pricing =
      await this.pricingService.calculateReservation(
        room,
        dto
      );

   const reservation =
    await this.persistenceService
      .createReservation(
        userId,
        dto,
        pricing
      );

    return this.mapperService
      .buildCreateReservationResponse(
        reservation
      );
  }

  async getReservationById(
    userId: number,
    reservationId: number
  ) {
    const reservation =
      await this.reservationRepository.findCompleteById(
        reservationId
      );

    this.validationService.validateReservationExists(
      reservation
    );

    this.validationService.validateReservationOwner(
      userId,
      Number(reservation.user_id)
    );

    return this.mapperService
      .buildReservationDetailResponse(
        reservation
      );
  }

  async getMyReservations(
    userId: number
  ) {
    const reservations =
      await this.reservationRepository
        .findCompleteManyByUserId(
          userId
        );

    return this.mapperService
      .buildReservationListResponse(
        reservations
      );
  }

async cancelReservation(
  userId: number,
  reservationId: number
): Promise<CancelReservationResponseDto> {
  const reservation =
    await this.reservationRepository.findCompleteById(
      reservationId
    );

  this.validationService.validateReservationExists(
    reservation
  );

  this.validationService.validateReservationOwner(
    userId,
    Number(reservation.user_id)
  );

  this.bookingService.validateReservationCanBeCancelled(
    reservation.status
  );

  this.bookingService.validateBookingExpired(
    reservation.booking_expired_at
  );

  const cancelledReservation =
    await this.persistenceService.cancelReservation(
      reservation
    );

  return this.mapperService.buildCancelReservationResponse(
    cancelledReservation
  );
}}

//#region Dependencies

const roomRepository =
  new RoomRepository();

const availabilityRepository =
  new AvailabilityRepository();

const peakSeasonRepository =
  new PeakSeasonRepository();

const reservationRepository =
  new ReservationRepository();

const paymentRepository =
  new PaymentRepository();

const validationService =
  new ReservationValidationService(
    roomRepository,
    availabilityRepository
  );

const mapperService =
  new ReservationMapperService();

const bookingService =
  new ReservationBookingService();

const persistenceService =
  new ReservationPersistenceService(
    bookingService,
    reservationRepository,
    paymentRepository,
    availabilityRepository
  );

const pricingService =
  new ReservationPricingService(
    peakSeasonRepository
  );

export const reservationService =
  new ReservationService(
    reservationRepository,
    validationService,
    pricingService,
    mapperService,
    bookingService,
    persistenceService
  );
