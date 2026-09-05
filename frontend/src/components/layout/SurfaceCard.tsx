import type { ReactNode } from "react";

interface SurfaceCardProps {
  children: ReactNode;
  className?: string;
  /** Adds the subtle lift-on-hover treatment used on HomePropertyCard */
  hoverLift?: boolean;
}

export default function SurfaceCard({
  children,
  className = "",
  hoverLift = false,
}: SurfaceCardProps) {
  return (
    <div
      className={`overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm ${
        hoverLift
          ? "transition hover:-translate-y-0.5 hover:shadow-md"
          : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}