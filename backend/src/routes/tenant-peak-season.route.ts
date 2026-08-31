import { Router } from "express";

import {
  tenantPeakSeasonController,
} from "../controllers/tenant-peak-season.controller";

import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";
import validate from "../middlewares/validation.middleware";

import {
  createPeakSeasonSchema,
  updatePeakSeasonSchema,
} from "../validations/room";

import { user_role } from "../generated/prisma/enums";

const router = Router();

router.use(
  authenticate,
  authorize(user_role.TENANT),
);

router.post(
  "/rooms/:roomId/peak-season",
  validate(createPeakSeasonSchema),
  tenantPeakSeasonController.createRate,
);

router.get(
  "/rooms/:roomId/peak-season",
  tenantPeakSeasonController.getRates,
);

router.get(
  "/rooms/peak-season/:id",
  tenantPeakSeasonController.getRate,
);

router.patch(
  "/rooms/peak-season/:id",
  validate(updatePeakSeasonSchema),
  tenantPeakSeasonController.updateRate,
);

router.delete(
  "/rooms/peak-season/:id",
  tenantPeakSeasonController.deleteRate,
);

export default router;