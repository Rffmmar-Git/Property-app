import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  confirmPayment,
  getTenantTransactions,
  rejectPayment,
} from "../api/payment.api";

import type { TenantTransactionQuery } from "../types/payment.types";

export const useTenantTransactions = (
  query: TenantTransactionQuery,
) => {
  return useQuery({
    queryKey: ["tenant-transactions", query],
    queryFn: () => getTenantTransactions(query),
  });
};

export const useConfirmPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: confirmPayment,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tenant-transactions"],
      });
    },
  });
};

export const useRejectPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: rejectPayment,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tenant-transactions"],
      });
    },
  });
};