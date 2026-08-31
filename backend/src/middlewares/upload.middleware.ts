import multer from "multer";
import path from "path";
import { ApiError } from "../utils/core";

const storage = multer.memoryStorage();

const profilePictureExtensions = [
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
];

const profilePictureMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/gif",
];

const profilePictureFileFilter: multer.Options["fileFilter"] = (
  _req,
  file,
  callback,
) => {
  const extension = path
    .extname(file.originalname)
    .toLowerCase();

  if (
    !profilePictureExtensions.includes(extension) ||
    !profilePictureMimeTypes.includes(file.mimetype)
  ) {
    return callback(
      new ApiError(
        400,
        "Only .jpg, .jpeg, .png, and .gif files are allowed",
      ),
    );
  }

  callback(null, true);
};

export const uploadProfilePicture = multer({
  storage,
  limits: {
    fileSize: 1 * 1024 * 1024,
  },
  fileFilter: profilePictureFileFilter,
}).single("profilePicture");

// Tenant identity document

const identityDocumentExtensions = [
  ".jpg",
  ".jpeg",
  ".png",
  ".pdf",
];

const identityDocumentMimeTypes = [
  "image/jpeg",
  "image/png",
  "application/pdf",
];

const identityDocumentFileFilter: multer.Options["fileFilter"] = (
  _req,
  file,
  callback,
) => {
  const extension = path
    .extname(file.originalname)
    .toLowerCase();

  if (
    !identityDocumentExtensions.includes(extension) ||
    !identityDocumentMimeTypes.includes(file.mimetype)
  ) {
    return callback(
      new ApiError(
        400,
        "Only .jpg, .jpeg, .png, and .pdf files are allowed",
      ),
    );
  }

  callback(null, true);
};

export const uploadIdentityDocument = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: identityDocumentFileFilter,
}).single("identityDocument");

// Property images
const propertyImageExtensions = [
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
];

const propertyImageMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/gif",
];

const propertyImageFileFilter: multer.Options["fileFilter"] = (
  _req,
  file,
  callback,
) => {
  const extension = path
    .extname(file.originalname)
    .toLowerCase();

  if (
    !propertyImageExtensions.includes(extension) ||
    !propertyImageMimeTypes.includes(file.mimetype)
  ) {
    return callback(
      new ApiError(
        400,
        "Only .jpg, .jpeg, .png, and .gif files are allowed",
      ),
    );
  }

  callback(null, true);
};

export const uploadPropertyImages = multer({
  storage,
  limits: {
    fileSize: 1 * 1024 * 1024,
    files: 5,
  },
  fileFilter: propertyImageFileFilter,
}).array("images", 5);