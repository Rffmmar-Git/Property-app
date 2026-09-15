import { Router } from "express";

import { tenantController } from "../controllers/tenant.controller";
import { tenantRoomController } from "../controllers/tenant-room.controller";

import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";
import { uploadIdentityDocument } from "../middlewares/upload.middleware";
import validate from "../middlewares/validation.middleware";

import { createRoomSchema, updateRoomSchema } from "../validations/room";

import { user_role } from "../generated/prisma/enums";

const router = Router();

// Tenant Authentication
router.post("/register", tenantController.register);

router.post("/login", tenantController.login);

// Tenant Management
router.use(authenticate, authorize(user_role.TENANT));

// Tenant Profile
router.get("/me", tenantController.getProfile);

router.patch("/me", tenantController.updateProfile);

router.post(
  "/me/identity-document",
  uploadIdentityDocument,
  tenantController.updateIdentityDocument,
);

// Tenant Room Management
router.post(
  "/:propertyId/rooms",
  validate(createRoomSchema),
  tenantRoomController.createRoom,
);

router.get("/rooms", tenantRoomController.getMyRooms);

router.get("/rooms/:id", tenantRoomController.getMyRoom);

router.patch(
  "/rooms/:id",
  validate(updateRoomSchema),
  tenantRoomController.updateRoom,
);

router.delete("/rooms/:id", tenantRoomController.deleteRoom);

export default router;