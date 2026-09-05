interface ImagePreviewModalProps {
  imageUrl: string;
  title?: string;
  onClose: () => void;
}

export default function ImagePreviewModal({
  imageUrl,
  title,
  onClose,
}: ImagePreviewModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-lg bg-white p-4 shadow-xl sm:p-5"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-text">
            {title ?? "Preview"}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded px-3 py-1 text-slate-muted transition hover:bg-slate-100 hover:text-slate-text"
          >
            ✕
          </button>
        </div>

        <img
          src={imageUrl}
          alt={title ?? "Preview"}
          className="max-h-[75vh] w-full object-contain"
        />
      </div>
    </div>
  );
}