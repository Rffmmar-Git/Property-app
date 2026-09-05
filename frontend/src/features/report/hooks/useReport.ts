import { useQuery } from "@tanstack/react-query";

import {
  getPropertyReport,
  getSalesReport,
  getTransactionReport,
} from "../api/report.api";

import type {
  PropertyReportQuery,
  SalesReportQuery,
  TransactionReportQuery,
} from "../types/report.types";

export const useSalesReport = (
  query: SalesReportQuery,
  enabled = true,
) => {
  return useQuery({
    queryKey: ["sales-report", query],
    queryFn: () => getSalesReport(query),
    enabled,
  });
};

export const useTransactionReport = (
  query: TransactionReportQuery,
  enabled = true,
) => {
  return useQuery({
    queryKey: ["transaction-report", query],
    queryFn: () => getTransactionReport(query),
    enabled,
  });
};

export const usePropertyReport = (
  query: PropertyReportQuery,
  enabled = true,
) => {
  return useQuery({
    queryKey: ["property-report", query],
    queryFn: () => getPropertyReport(query),
    enabled,
  });
};