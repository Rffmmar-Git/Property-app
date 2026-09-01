export interface UploadPaymentResponseDto {
  message: string;

  data: {
    id: number;
    reservationId: number;
    status: string;
    proofImage: string | null;
    paidAt: Date | null;
  };
}