interface PaginationProps {
  page: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
  /** Optional total record count, e.g. shown as "· 42 transactions". */
  totalItems?: number;
  /** Label shown after totalItems, e.g. "transactions". */
  itemLabel?: string;
  /** Set true when nesting this inside another card's own footer, to skip the outer border/shadow/background. */
  bare?: boolean;
}

export default function Pagination({
  page,
  totalPages,
  onPrevious,
  onNext,
  totalItems,
  itemLabel,
  bare = false,
}: PaginationProps) {
  return (
    <div
      className={
        bare
          ? "flex items-center justify-between"
          : "mt-6 flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
      }
    >
      <button
        type="button"
        disabled={page <= 1}
        onClick={onPrevious}
        className="rounded border border-outline-variant px-4 py-2 text-[10px] font-medium text-slate-text transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Previous
      </button>

      <p className="text-[10px] text-slate-muted">
        Page{" "}
        <span className="font-semibold text-slate-text">
          {page}
        </span>{" "}
        of{" "}
        <span className="font-semibold text-slate-text">
          {totalPages}
        </span>
        {typeof totalItems === "number" && (
          <>
            {" · "}
            {totalItems} {itemLabel}
          </>
        )}
      </p>

      <button
        type="button"
        disabled={page >= totalPages}
        onClick={onNext}
        className="rounded border border-outline-variant px-4 py-2 text-[10px] font-medium text-slate-text transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}
