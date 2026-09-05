import { useRef, useState } from "react";
import { ImageIcon, Loader2, UploadCloud } from "lucide-react";
import { useUploadPaymentProof } from "../hooks/useUploadPaymentProof";

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB
const ACCEPTED_TYPES = ["image/jpeg", "image/png"];

interface PaymentProofUploaderProps {
  reservationId: number;
  disabled?: boolean;
  onUploaded?: () => void;
}

export function PaymentProofUploader({
  reservationId,
  disabled = false,
  onUploaded,
}: PaymentProofUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const { mutate, isPending, isError, error } =
    useUploadPaymentProof(reservationId);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setValidationError("Only JPG and PNG files are allowed.");
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setValidationError("File size must not exceed 1MB.");
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    setValidationError(null);
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleUpload = () => {
    if (!selectedFile) {
      return;
    }

    mutate(selectedFile, {
      onSuccess: () => {
        onUploaded?.();
      },
    });
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
      <h2 className="text-base sm:text-lg font-semibold text-slate-900">
        Upload payment proof
      </h2>
      <p className="mt-1 text-xs text-slate-500">
        JPG or PNG, max 1MB. Make sure the transfer amount and date are
        clearly visible.
      </p>

      <div className="mt-4 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-200 p-6 text-center">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Payment proof preview"
            className="mb-3 h-40 w-full max-w-xs rounded-lg object-cover"
          />
        ) : (
          <ImageIcon size={32} className="mb-2 text-slate-300" />
        )}

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || isPending}
          className="flex items-center gap-2 rounded-lg border border-midnight-indigo px-4 py-2 text-xs font-semibold text-midnight-indigo transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <UploadCloud size={14} />
          {selectedFile ? "Choose a different file" : "Choose file"}
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png"
          className="hidden"
          onChange={handleFileChange}
          disabled={disabled || isPending}
        />

        {selectedFile && (
          <p className="mt-2 text-[11px] text-slate-500">{selectedFile.name}</p>
        )}
      </div>

      {validationError && (
        <p className="mt-2 text-xs font-medium text-red-500">{validationError}</p>
      )}

      {isError && (
        <p className="mt-2 text-xs font-medium text-red-500">
          {(error as Error)?.message || "Failed to upload payment proof."}
        </p>
      )}

      <button
        type="button"
        onClick={handleUpload}
        disabled={disabled || !selectedFile || isPending}
        className="mt-4 flex w-full items-center justify-center rounded-lg bg-midnight-indigo py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Upload proof"}
      </button>
    </div>
  );
}