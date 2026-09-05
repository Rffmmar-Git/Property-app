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
import { TenantTransactionResponseDto } from "../../types/dto/payment/tenant-transaction-response.dto";
import { sendPaymentApprovedEmail, sendPaymentRejectedEmail } from "../../utils";
import { TenantTransactionQueryDto } from "../../types/dto";
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

  async getTenantTransactions(
  tenantId: number,
  query: TenantTransactionQueryDto
) {
  const result =
    await reservationRepository.findTenantTransactions(
      tenantId,
      query
    );

  return this.mapperService.buildTenantTransactionResponse(
    result.reservations,
    result.total,
    query.page ?? 1,
    query.limit ?? 10
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

      await sendPaymentApprovedEmail(
      reservation.users.email,
      reservation.users.full_name,
      reservation.booking_code,
      reservation.rooms.properties.name,
      reservation.rooms.properties.description,
      reservation.rooms.properties.address,
      reservation.rooms.room_name,
      reservation.check_in,
      reservation.check_out,
      reservation.rooms.properties.check_in_time,
      reservation.rooms.properties.check_out_time,
      reservation.guest_count,
      reservation.total_price.toString()
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

      await sendPaymentRejectedEmail(
      reservation.users.email,
      reservation.users.full_name,
      reservation.booking_code,
      reservation.rooms.properties.name,
      reservation.rooms.room_name
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