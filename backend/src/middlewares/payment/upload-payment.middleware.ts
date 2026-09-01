import multer from "multer";
import { ApiError } from "../../utils";
const storage = multer.memoryStorage();

const fileFilter: multer.Options["fileFilter"] = (
  req,
  file,
  callback
) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
  ];

  if (!allowedMimeTypes.includes(file.mimetype)) {
    return callback(
      new ApiError(
        400,
        "Only JPG, JPEG, and PNG files are allowed."
      )
    );
  }

  callback(null, true);
};

export const uploadPaymentProof = multer({
  storage,

  limits: {
    fileSize: 1024 * 1024, // 1 MB
  },

  fileFilter,
});