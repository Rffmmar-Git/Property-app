import type { CSSProperties, ReactNode } from "react";

interface SurfaceCardProps {
  children: ReactNode;
  className?: string;
  /** Adds the subtle lift-on-hover treatment used on HomePropertyCard */
  hoverLift?: boolean;
  /** Escape hatch for precise inline values, e.g. a dynamic status-accent border color/width. */
  style?: CSSProperties;
}

export default function SurfaceCard({
  children,
  className = "",
  hoverLift = false,
  style,
}: SurfaceCardProps) {
  return (
    <div
      style={style}
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