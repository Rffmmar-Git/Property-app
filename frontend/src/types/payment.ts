export const PAYMENT_STATUS = {
  PENDING: "PENDING",
  ACCEPTED: "ACCEPTED",
  REJECTED: "REJECTED",
} as const;

export type PaymentStatus = (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];

export interface UploadPaymentProofResponse {
  id: number;
  reservationId: number;
  status: PaymentStatus;
  proofImage: string;
  paidAt: string | null;
}

export interface ConfirmPaymentResponse {
  id: number;
  reservationId: number;
  status: PaymentStatus;
  paidAt: string | null;
}

export interface RejectPaymentResponse {
  id: number;
  reservationId: number;
  status: PaymentStatus;
}