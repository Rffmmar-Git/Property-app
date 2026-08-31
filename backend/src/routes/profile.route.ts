import { Router } from "express";
import { profileController } from "../controllers/profile.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { uploadProfilePicture } from "../middlewares/upload.middleware";

const router = Router();

router.get(
  "/",
  authenticate,
  profileController.getProfile,
);

router.patch(
  "/",
  authenticate,
  profileController.updateProfile,
);

router.patch(
  "/email",
  authenticate,
  profileController.updateEmail,
);

router.patch(
  "/change-password",
  authenticate,
  profileController.changePassword,
);

router.patch(
  "/avatar",
  authenticate,
  uploadProfilePicture,
  profileController.updateProfilePicture,
);

export default router;