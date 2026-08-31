import { Router } from "express";

import { propertyImageController } from "../controllers/property-image.controller";

import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";
import { uploadPropertyImages } from "../middlewares/upload.middleware";

import { user_role } from "../generated/prisma/enums";

const router = Router();

router.use(
  authenticate,
  authorize(user_role.TENANT),
);

router.post(
  "/:id/images",
  uploadPropertyImages,
  propertyImageController.uploadImages,
);

router.get(
  "/:id/images",
  propertyImageController.getPropertyImages,
);

router.delete(
  "/:id/images/:imageId",
  propertyImageController.deleteImage,
);

export default router;