import { useEffect, useState } from "react";
import { Clock3 } from "lucide-react";

interface PaymentCountdownProps {
  expiresAt: string;
}

const formatDuration = (ms: number) => {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds]
    .map((unit) => String(unit).padStart(2, "0"))
    .join(":");
};

export function PaymentCountdown({ expiresAt }: PaymentCountdownProps) {
  const [remainingMs, setRemainingMs] = useState(
    () => new Date(expiresAt).getTime() - Date.now(),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingMs(new Date(expiresAt).getTime() - Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  const isExpired = remainingMs <= 0;

  return (
    <div
      className={`flex items-center gap-2 rounded-lg border px-4 py-3 text-sm font-semibold ${
        isExpired
          ? "border-red-200 bg-red-50 text-red-600"
          : "border-amber-200 bg-amber-50 text-amber-700"
      }`}
    >
      <Clock3 size={16} />
      {isExpired
        ? "Payment window has expired."
        : `Complete your payment within ${formatDuration(remainingMs)}`}
    </div>
  );
}