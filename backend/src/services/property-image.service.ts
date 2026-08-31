import { ApiError } from "../utils/core";
import cloudinary from "../config/cloudinary";

import { propertyImageRepository } from "../repositories/property-image.repository";
import { tenantPropertyRepository } from "../repositories/tenant-property.repository";

export class PropertyImageService {
  async uploadImages(
    tenantId: bigint,
    propertyId: string,
    files: Express.Multer.File[],
  ) {
    const id = this.parsePropertyId(propertyId);

    const property =
      await tenantPropertyRepository.findPropertyByIdAndTenant(
        id,
        tenantId,
      );

    if (!property) {
      throw new ApiError(404, "Property not found");
    }

    if (!files.length) {
      throw new ApiError(400, "No images uploaded");
    }

    const existingImages =
      await propertyImageRepository.findByPropertyId(id);

    const startOrder = existingImages.length + 1;

    const uploadedImages = await Promise.all(
      files.map(async (file, index) => {
        const imageUrl = await this.uploadToCloudinary(file);

        return {
          imageUrl,
          displayOrder: startOrder + index,
        };
      }),
    );

    await propertyImageRepository.createMany(
      id,
      uploadedImages,
    );

    return propertyImageRepository.findByPropertyId(id);
  }

  async getPropertyImages(
    tenantId: bigint,
    propertyId: string,
  ) {
    const id = this.parsePropertyId(propertyId);

    await this.ensureOwnership(id, tenantId);

    return propertyImageRepository.findByPropertyId(id);
  }

  async deleteImage(
    tenantId: bigint,
    propertyId: string,
    imageId: string,
  ) {
    const id = this.parsePropertyId(propertyId);
    const image = this.parsePropertyId(imageId);

    await this.ensureOwnership(id, tenantId);

    const existingImage =
      await propertyImageRepository.findById(
        image,
        id,
      );

    if (!existingImage) {
      throw new ApiError(
        404,
        "Property image not found",
      );
    }

    await this.deleteFromCloudinary(
      existingImage.image_url,
    );

    await propertyImageRepository.delete(
      image,
      id,
    );
  }

  private async ensureOwnership(
    propertyId: bigint,
    tenantId: bigint,
  ) {
    const property =
      await tenantPropertyRepository.findPropertyByIdAndTenant(
        propertyId,
        tenantId,
      );

    if (!property) {
      throw new ApiError(
        404,
        "Property not found",
      );
    }

    return property;
  }

  private async uploadToCloudinary(
    file: Express.Multer.File,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream =
        cloudinary.uploader.upload_stream(
          {
            folder: "property-app/properties",
            resource_type: "image",
          },
          (error, result) => {
            if (error || !result) {
              return reject(
                new ApiError(
                  500,
                  "Failed to upload image",
                ),
              );
            }

            resolve(result.secure_url);
          },
        );

      uploadStream.end(file.buffer);
    });
  }

  private async deleteFromCloudinary(
    imageUrl: string,
  ) {
    const publicId =
      this.extractPublicId(imageUrl);

    if (!publicId) {
      return;
    }

    await cloudinary.uploader.destroy(
      publicId,
      {
        resource_type: "image",
      },
    );
  }

  private extractPublicId(
    imageUrl: string,
  ): string | null {
    try {
      const url = new URL(imageUrl);
      const uploadIndex =
        url.pathname.indexOf("/upload/");

      if (uploadIndex === -1) {
        return null;
      }

      const pathAfterUpload =
        url.pathname.substring(
          uploadIndex + "/upload/".length,
        );

      const parts =
        pathAfterUpload.split("/");

      if (parts[0]?.startsWith("v")) {
        parts.shift();
      }

      const publicId = parts.join("/");

      return publicId.replace(
        /\.[^/.]+$/,
        "",
      );
    } catch {
      return null;
    }
  }

  private parsePropertyId(value: string) {
    try {
      return BigInt(value);
    } catch {
      throw new ApiError(
        400,
        "Invalid ID",
      );
    }
  }
}

export const propertyImageService =
  new PropertyImageService();