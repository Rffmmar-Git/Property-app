interface PageHeaderProps {
  title: string;
  description?: string;
}

export default function PageHeader({
  title,
  description,
}: PageHeaderProps) {
  return (
    <div className="mb-6">
      <h1 className="text-xl font-bold text-midnight-indigo sm:text-2xl">
        {title}
      </h1>

      {description && (
        <p className="mt-1 text-xs text-slate-muted sm:text-sm">
          {description}
        </p>
      )}
    </div>
  );
}