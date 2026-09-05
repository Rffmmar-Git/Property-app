import { api } from "@/services/api/axios";
import {
  ConfirmPaymentResponse,
  RejectPaymentResponse,
  UploadPaymentProofResponse,
} from "../../../types/payment";

import type {
  TenantTransactionListResponse,
  TenantTransactionQuery,
} from "../types/payment.types";

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

export const uploadPaymentProof = async (
  reservationId: number,
  file: File,
): Promise<UploadPaymentProofResponse> => {
  const formData = new FormData();
  formData.append("reservationId", String(reservationId));
  formData.append("paymentProof", file);

  const response = await api.post<ApiEnvelope<UploadPaymentProofResponse>>(
    "/payments/upload-proof",
    formData,
  );

  return response.data.data;
};

export const getTenantTransactions = async (
  query: TenantTransactionQuery,
): Promise<TenantTransactionListResponse> => {
  const response = await api.get<
    ApiEnvelope<TenantTransactionListResponse>
  >("/payments/tenant/transactions", {
    params: query,
  });

  return response.data.data;
};
export const confirmPayment = async (
  reservationId: number,
): Promise<ConfirmPaymentResponse> => {
  const response = await api.patch<ApiEnvelope<ConfirmPaymentResponse>>(
    `/payments/${reservationId}/confirm`,
  );

  return response.data.data;
};

export const rejectPayment = async (
  reservationId: number,
): Promise<RejectPaymentResponse> => {
  const response = await api.patch<ApiEnvelope<RejectPaymentResponse>>(
    `/payments/${reservationId}/reject`,
  );

  return response.data.data;
};