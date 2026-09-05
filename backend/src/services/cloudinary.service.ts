import cloudinary from "../config/cloudinary";
import { UploadApiResponse } from "cloudinary";

export class CloudinaryService {
  async uploadFile(
    file: Express.Multer.File,
    folder: string
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
        },
        (error: unknown, result: UploadApiResponse | undefined) => {
          if (error) {
            return reject(error);
          }
          if (!result) {
            return reject(new Error("Cloudinary upload failed with no result."));
          }
          resolve(result.secure_url);
        }
      );

      // Mengirim buffer dari memoryStorage multer ke Cloudinary stream
      uploadStream.end(file.buffer);
    });
  }

  async deleteFile(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId);
  }
}