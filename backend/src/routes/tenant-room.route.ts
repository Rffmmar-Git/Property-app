import { Router } from "express";

import { tenantRoomController } from "../controllers/tenant-room.controller";

import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";
import validate from "../middlewares/validation.middleware";

import {
  createRoomSchema,
  updateRoomSchema,
} from "../validations/room";

import { user_role } from "../generated/prisma/enums";

const router = Router();

router.use(
  authenticate,
  authorize(user_role.TENANT),
);

router.post(
  "/:propertyId/rooms",
  validate(createRoomSchema),
  tenantRoomController.createRoom,
);

router.get(
  "/rooms",
  tenantRoomController.getMyRooms,
);

router.get(
  "/rooms/:id",
  tenantRoomController.getMyRoom,
);

router.patch(
  "/rooms/:id",
  validate(updateRoomSchema),
  tenantRoomController.updateRoom,
);

router.delete(
  "/rooms/:id",
  tenantRoomController.deleteRoom,
);

export default router;