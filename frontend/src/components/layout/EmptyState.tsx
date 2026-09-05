import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description?: string;
  /** Optional icon shown above the title (e.g. a lucide-react icon). */
  icon?: ReactNode;
  /** Optional call-to-action shown below the description (e.g. a button). */
  action?: ReactNode;
  /** Use a dashed border for "nothing here yet" states vs a solid border for "no results" states. */
  dashed?: boolean;
}

export default function EmptyState({
  title,
  description,
  icon,
  action,
  dashed = false,
}: EmptyStateProps) {
  return (
    <div
      className={`rounded-lg border bg-white px-5 py-12 text-center ${
        dashed ? "border-dashed border-slate-300" : "border-slate-200"
      }`}
    >
      {icon && (
        <div className="mb-3 flex justify-center text-slate-muted">
          {icon}
        </div>
      )}

      <p className="text-sm font-medium text-slate-text">{title}</p>

      {description && (
        <p className="mt-1 text-xs text-slate-muted">
          {description}
        </p>
      )}

      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  );
}