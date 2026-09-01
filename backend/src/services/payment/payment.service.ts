import {
  PaymentRepository,
  ReservationRepository,
} from "../../repositories";
import { CloudinaryService } from "../cloudinary.service";
import { UploadPaymentDto } from "../../types/dto";
import { UploadPaymentResponseDto } from "../../types/dto/payment/upload-payment-response.dto";
import { PaymentValidationService } from "./payment-validation.service";
import { PaymentPersistenceService } from "./payment-persistence.service";
import { PaymentMapperService } from "./payment-mapper.service";

export class PaymentService {
  constructor(
    private readonly validationService:
      PaymentValidationService,

    private readonly persistenceService:
      PaymentPersistenceService,

    private readonly cloudinaryService:
      CloudinaryService,

    private readonly mapperService:
      PaymentMapperService
  ) {}

  //#region Public Methods

  async uploadPaymentProof(
    userId: number,
    dto: UploadPaymentDto,
    file: Express.Multer.File
  ): Promise<UploadPaymentResponseDto> {
    const reservation =
      await this.validationService.validateReservation(
        dto.reservationId
      );

    this.validationService.validateReservationOwner(
      userId,
      reservation.user_id
    );

    const payment =
      await this.validationService.validatePayment(
        dto.reservationId
      );

    this.validationService.validatePaymentCanBeUploaded(
      payment
    );

    this.validationService.validateReservationStatus(
      reservation.status
    );

    this.validationService.validateBookingExpired(
      reservation.booking_expired_at
    );

    const imageUrl =
      await this.cloudinaryService.uploadFile(
        file,
        "payment-proofs"
      );

    const updatedPayment =
      await this.persistenceService.uploadPaymentProof(
        dto.reservationId,
        imageUrl
      );

    return this.mapperService.buildUploadPaymentResponse(
      updatedPayment
    );
  }

  async confirmPayment(
    tenantId: number,
    reservationId: number
  ) {
    const reservation =
      await this.validationService
        .validateReservationForTenant(
          reservationId
        );

    const payment =
      await this.validationService.validatePayment(
        reservationId
      );

    this.validationService.validateTenantOwnership(
      tenantId,
      reservation.rooms.properties.tenant_id
    );

    this.validationService
      .validatePaymentCanBeConfirmed(
        payment.status,
        reservation.status
      );

    const updatedPayment =
      await this.persistenceService.confirmPayment(
        reservationId
      );

    return this.mapperService
      .buildConfirmPaymentResponse(
        updatedPayment
      );
  }

  async rejectPayment(
    tenantId: number,
    reservationId: number
  ) {
    const reservation =
      await this.validationService
        .validateReservationForTenant(
          reservationId
        );

    const payment =
      await this.validationService.validatePayment(
        reservationId
      );

    this.validationService.validateTenantOwnership(
      tenantId,
      reservation.rooms.properties.tenant_id
    );

    this.validationService
      .validatePaymentCanBeRejected(
        payment.status,
        reservation.status
      );

    const updatedPayment =
      await this.persistenceService.rejectPayment(
        reservationId
      );

    return this.mapperService
      .buildRejectPaymentResponse(
        updatedPayment
      );
  }
}

//#region Dependencies

const paymentRepository =
  new PaymentRepository();

const reservationRepository =
  new ReservationRepository();

const cloudinaryService =
  new CloudinaryService();

const validationService =
  new PaymentValidationService(
    reservationRepository,
    paymentRepository
  );

const persistenceService =
  new PaymentPersistenceService(
    paymentRepository
  );

const mapperService =
  new PaymentMapperService();

export const paymentService =
  new PaymentService(
    validationService,
    persistenceService,
    cloudinaryService,
    mapperService
  );

//#endregion