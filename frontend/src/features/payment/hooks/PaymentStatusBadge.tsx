interface PaymentStatusBadgeProps {
  status: string;
}

const statusLabel: Record<string, string> = {
  PENDING: "Waiting Confirmation",
  ACCEPTED: "Accepted",
  REJECTED: "Rejected",
};

export default function PaymentStatusBadge({
  status,
}: PaymentStatusBadgeProps) {
  return (
    <span className="inline-flex rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">
      {statusLabel[status] ?? status}
    </span>
  );
}