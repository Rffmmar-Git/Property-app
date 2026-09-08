import { useRef, useState } from "react";
import { AlertTriangle, CircleAlert } from "lucide-react";
import { usePropertyImages } from "../hooks/usePropertyImages";
import { useUploadPropertyImages } from "../hooks/useUploadPropertyImages";
import { useDeletePropertyImage } from "../hooks/useDeletePropertyImage";

interface PropertyImageManagerProps {
  propertyId: string;
}

const MAX_IMAGES = 5;
const MAX_FILE_SIZE = 1024 * 1024;
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
];

const getUploadErrorMessage = (error: unknown): string => {
  if (!(error instanceof Error)) {
    return "Failed to upload property images. Please try again.";
  }

  const message = error.message.toLowerCase();

  if (
    message.includes("only .jpg") ||
    message.includes("file type") ||
    message.includes("file format")
  ) {
    return "Invalid file format. Please upload only JPG, JPEG, PNG, or GIF images.";
  }

  if (
    message.includes("maximum 5") ||
    message.includes("max 5") ||
    message.includes("5 files")
  ) {
    return "Maximum 5 property images are allowed.";
  }

  if (
    message.includes("1mb") ||
    message.includes("1 mb") ||
    message.includes("file size") ||
    message.includes("large")
  ) {
    return "Image size is too large. Each image must be maximum 1MB.";
  }

  return error.message;
};

export default function PropertyImageManager({
  propertyId,
}: PropertyImageManagerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadError, setUploadError] = useState("");
  const [deletingImage, setDeletingImage] = useState<{
    id: string;
    url: string;
  } | null>(null);
  const [deleteError, setDeleteError] = useState("");

  const {
    data: images = [],
    isLoading,
    isError,
  } = usePropertyImages(propertyId);

  const uploadMutation = useUploadPropertyImages();
  const deleteMutation = useDeletePropertyImage();

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(event.target.files ?? []);

    setUploadError("");

    if (files.length === 0) {
      return;
    }

    if (images.length + files.length > MAX_IMAGES) {
      setSelectedFiles([]);
      setUploadError(
        `You can upload a maximum of ${MAX_IMAGES} property images. You currently have ${images.length} image${images.length === 1 ? "" : "s"}.`,
      );

      event.target.value = "";
      return;
    }

    const invalidTypeFile = files.find(
      (file) => !ALLOWED_TYPES.includes(file.type),
    );

    if (invalidTypeFile) {
      setSelectedFiles([]);
      setUploadError(
        `"${invalidTypeFile.name}" has an unsupported format. Please upload only JPG, JPEG, PNG, or GIF images.`,
      );

      event.target.value = "";
      return;
    }

    const oversizedFile = files.find(
      (file) => file.size > MAX_FILE_SIZE,
    );

    if (oversizedFile) {
      setSelectedFiles([]);
      setUploadError(
        `"${oversizedFile.name}" is too large. Each image must be maximum 1MB.`,
      );

      event.target.value = "";
      return;
    }

    setSelectedFiles(files);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setUploadError("Please select at least one image.");
      return;
    }

    try {
      setUploadError("");

      await uploadMutation.mutateAsync({
        propertyId,
        files: selectedFiles,
      });

      setSelectedFiles([]);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      setUploadError(getUploadErrorMessage(error));
    }
  };

  const handleOpenDeleteConfirmation = (
    imageId: string,
    imageUrl: string,
  ) => {
    setDeleteError("");
    setDeletingImage({
      id: imageId,
      url: imageUrl,
    });
  };

  const handleCloseDeleteConfirmation = () => {
    if (deleteMutation.isPending) {
      return;
    }

    setDeletingImage(null);
    setDeleteError("");
  };

  const handleDelete = async () => {
    if (!deletingImage) {
      return;
    }

    try {
      setDeleteError("");

      await deleteMutation.mutateAsync({
        propertyId,
        imageId: deletingImage.id,
      });

      setDeletingImage(null);
    } catch (error) {
      setDeleteError(
        error instanceof Error
          ? error.message
          : "Failed to delete property image.",
      );
    }
  };

  return (
    <>
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Property Photos
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Upload up to 5 photos. Each photo must be JPG, JPEG, PNG, or GIF
            with a maximum size of 1MB.
          </p>
        </div>

        {isLoading && (
          <p className="text-sm text-slate-500">
            Loading property photos...
          </p>
        )}

        {isError && (
          <p className="text-sm text-red-600">
            Failed to load property photos.
          </p>
        )}

        {!isLoading && !isError && (
          <>
            {images.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
                {images.map((image) => (
                  <div
                    key={image.id}
                    className="relative overflow-hidden rounded-lg border border-slate-200 bg-slate-100"
                  >
                    <img
                      src={image.image_url}
                      alt="Property"
                      className="aspect-square w-full object-cover"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        handleOpenDeleteConfirmation(
                          image.id,
                          image.image_url,
                        )
                      }
                      disabled={deleteMutation.isPending}
                      className="absolute right-2 top-2 cursor-pointer rounded-md bg-red-600 px-2 py-1 text-xs font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-slate-300 px-4 py-8 text-center">
                <p className="text-sm text-slate-500">
                  No property photos uploaded yet.
                </p>
              </div>
            )}

            <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.gif,image/jpeg,image/png,image/gif"
                  multiple
                  onChange={handleFileChange}
                  disabled={
                    images.length >= MAX_IMAGES ||
                    uploadMutation.isPending
                  }
                  className="block w-full cursor-pointer text-sm text-slate-600 disabled:cursor-not-allowed disabled:opacity-50 file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-slate-900 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-slate-800 disabled:file:cursor-not-allowed"
                />

                <button
                  type="button"
                  onClick={handleUpload}
                  disabled={
                    selectedFiles.length === 0 ||
                    uploadMutation.isPending
                  }
                  className="cursor-pointer rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {uploadMutation.isPending ? "Uploading..." : "Upload"}
                </button>
              </div>

              {selectedFiles.length > 0 && (
                <p className="mt-2 text-sm text-slate-600">
                  {selectedFiles.length} image
                  {selectedFiles.length > 1 ? "s" : ""} selected.
                </p>
              )}

              {uploadError && (
                <div className="mt-3 flex items-start gap-2 rounded-md border border-red-200 bg-red-50 px-4 py-3">
                  <CircleAlert
                    size={17}
                    className="mt-0.5 shrink-0 text-red-600"
                  />

                  <div>
                    <p className="text-sm font-semibold text-red-700">
                      Upload failed
                    </p>

                    <p className="mt-0.5 text-sm text-red-600">
                      {uploadError}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </section>

      {deletingImage && (
        <div className="fixed inset-0 z-[9999] bg-slate-900/10">
          <div
            className="fixed left-1/2 top-1/2 z-[10000] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl"
            style={{
              width: "min(28rem, calc(100vw - 2rem))",
              maxWidth: "calc(100vw - 2rem)",
            }}
          >
            <div className="p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
                  <AlertTriangle size={19} />
                </div>

                <div className="min-w-0 flex-1">
                  <h2 className="text-sm font-semibold text-midnight-indigo">
                    Delete Property Photo
                  </h2>

                  <p className="mt-1 text-xs leading-5 text-slate-muted">
                    Are you sure you want to delete this photo? This action
                    cannot be undone.
                  </p>
                </div>
              </div>

              {deleteError && (
                <div className="mt-4 flex items-start gap-2 rounded-md border border-red-100 bg-red-50 px-4 py-3">
                  <CircleAlert
                    size={16}
                    className="mt-0.5 shrink-0 text-red-600"
                  />

                  <div>
                    <p className="text-xs font-semibold text-red-700">
                      Delete failed
                    </p>

                    <p className="mt-0.5 text-xs leading-5 text-red-600">
                      {deleteError}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-slate-200 px-5 py-4">
              <button
                type="button"
                onClick={handleCloseDeleteConfirmation}
                disabled={deleteMutation.isPending}
                className="cursor-pointer rounded-md border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span>
                  {deleteMutation.isPending
                    ? "Deleting..."
                    : "Delete Photo"}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}