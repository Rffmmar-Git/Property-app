import { Router } from "express";

import { tenantPropertyController } from "../controllers/tenant-property.controller";

import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";
import validate from "../middlewares/validation.middleware";

import {
  createPropertySchema,
  updatePropertySchema,
} from "../validations/property";

import { user_role } from "../generated/prisma/enums";

const router = Router();

router.use(
  authenticate,
  authorize(user_role.TENANT),
);

router.post(
  "/",
  validate(createPropertySchema),
  tenantPropertyController.createProperty,
);

router.get(
  "/mine",
  tenantPropertyController.getMyProperties,
);

router.get(
  "/mine/:id",
  tenantPropertyController.getMyProperty,
);

router.patch(
  "/mine/:id",
  validate(updatePropertySchema),
  tenantPropertyController.updateProperty,
);

router.delete(
  "/mine/:id",
  tenantPropertyController.deleteProperty,
);

export default router;