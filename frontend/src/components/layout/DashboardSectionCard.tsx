import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import SurfaceCard from "@/components/layout/SurfaceCard";

interface DashboardSectionCardProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionTo?: string;
  showMobileFooterLink?: boolean;
  children: React.ReactNode;
  className?: string;
}

export default function DashboardSectionCard({
  title,
  description,
  actionLabel,
  actionTo,
  showMobileFooterLink = true,
  children,
  className,
}: DashboardSectionCardProps) {
  return (
    <SurfaceCard className={`overflow-hidden ${className ?? ""}`}>
      <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-slate-text sm:text-lg">{title}</h2>
          <p className="mt-1 text-sm text-slate-muted">{description}</p>
        </div>

        {actionLabel && actionTo && (
          <Link
            to={actionTo}
            className="hidden shrink-0 items-center gap-1 text-sm font-medium text-midnight-indigo transition hover:text-blue-800 sm:inline-flex"
          >
            {actionLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>

      {children}

      {actionLabel && actionTo && showMobileFooterLink && (
        <div className="border-t border-slate-200 px-5 py-3 sm:hidden">
          <Link
            to={actionTo}
            className="flex items-center justify-center gap-1 text-sm font-medium text-midnight-indigo"
          >
            {actionLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </SurfaceCard>
  );
}