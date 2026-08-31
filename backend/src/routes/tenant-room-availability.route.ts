import { Router } from "express";

import {
  tenantRoomAvailabilityController,
} from "../controllers/tenant-room-availability.controller";

import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";
import validate from "../middlewares/validation.middleware";

import {
  createRoomAvailabilitySchema,
} from "../validations/room";

import { user_role } from "../generated/prisma/enums";

const router = Router();

router.use(
  authenticate,
  authorize(user_role.TENANT),
);

router.post(
  "/rooms/:roomId/availability",
  validate(createRoomAvailabilitySchema),
  tenantRoomAvailabilityController.closeDate,
);

router.get(
  "/rooms/:roomId/availability",
  tenantRoomAvailabilityController.getClosedDates,
);

router.delete(
  "/rooms/availability/:id",
  tenantRoomAvailabilityController.openDate,
);

export default router;