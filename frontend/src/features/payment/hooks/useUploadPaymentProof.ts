import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadPaymentProof } from "../api/payment.api";

export const useUploadPaymentProof = (reservationId: number | undefined) => {
  const queryClient = useQueryClient();
 
  return useMutation({
    mutationFn: (file: File) => {
      if (!reservationId) {
        throw new Error("Reservation id is required.");
      }

      return uploadPaymentProof(reservationId, file);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["reservation", reservationId],
      });
    },
  });
};