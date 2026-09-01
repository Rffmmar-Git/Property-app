import cloudinary from "../config/cloudinary";

export class CloudinaryService {
  async uploadFile(
    file: Express.Multer.File,
    folder: string
  ): Promise<string> {
    const result = await cloudinary.uploader.upload(
      file.path,
      {
        folder,
      }
    );

    return result.secure_url;
  }

  async deleteFile(
    publicId: string
  ): Promise<void> {
    await cloudinary.uploader.destroy(publicId);
  }
}