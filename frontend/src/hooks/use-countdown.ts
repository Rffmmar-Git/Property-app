import { useEffect, useMemo, useState } from "react";

interface CountdownParts {
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
  isExpired: boolean;
}

export function useCountdown(targetDate: string | Date | null): CountdownParts {
  const target = useMemo(
    () => (targetDate ? new Date(targetDate).getTime() : null),
    [targetDate]
  );
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!target) return;
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [target]);

  const totalSeconds = target ? Math.max(0, Math.floor((target - now) / 1000)) : 0;

  return {
    hours: Math.floor(totalSeconds / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    totalSeconds,
    isExpired: target ? totalSeconds <= 0 : false,
  };
}