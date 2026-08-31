import { Router } from "express";
import { tenantController } from "../controllers/tenant.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";
import { user_role } from "../generated/prisma/enums";
import { uploadIdentityDocument } from "../middlewares/upload.middleware";

const router = Router();

router.post(
  "/register",
  tenantController.register,
);

router.get(
  "/me",
  authenticate,
  authorize(user_role.TENANT),
  tenantController.getProfile,
);

router.patch(
  "/me",
  authenticate,
  authorize(user_role.TENANT),
  tenantController.updateProfile,
);

router.post(
  "/me/identity-document",
  authenticate,
  authorize(user_role.TENANT),
  uploadIdentityDocument,
  tenantController.updateIdentityDocument,
);

export default router;