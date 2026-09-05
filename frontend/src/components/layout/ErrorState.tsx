interface ErrorStateProps {
  title: string;
  description?: string;
}

export default function ErrorState({
  title,
  description,
}: ErrorStateProps) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 px-5 py-8 text-center">
      <p className="text-sm font-medium text-red-700">{title}</p>

      {description && (
        <p className="mt-1 text-xs text-red-600">
          {description}
        </p>
      )}
    </div>
  );
}