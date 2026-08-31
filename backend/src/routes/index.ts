import { Router } from "express";
import authRouter from "./auth.route";
import googleRouter from "./google.route";
import tenantRouter from "./tenant.route";
import propertyRouter from "./property.route";
import propertyCategoryRouter from "./property-category.route";
import tenantPropertyRouter from "./tenant-property.route";
import propertyImageRouter from "./property-image.route";
import tenantRoomRouter from "./tenant-room.route";
import tenantRoomAvailabilityRouter from "./tenant-room-availability.route";
import tenantPeakSeasonRouter from "./tenant-peak-season.route";
import destinationRouter from "./destination.route";
import profileRouter from "./profile.route";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";
import { user_role } from "../generated/prisma/enums";

const router = Router();

/**
 * Health Check
 * GET /api/health
 */
router.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Property App API is running 🚀",
  });
});

/**
 * Current authenticated user
 * GET /api/me
 */
router.get(
  "/me",
  authenticate,
  authorize(user_role.CUSTOMER),
  (req, res) => {
    res.status(200).json({
      success: true,
      data: req.user,
    });
  },
);

/**
 * Authentication Routes
 * Base URL: /api/auth
 */
router.use("/auth", authRouter);

/**
 * Google Authentication Routes
 * Base URL: /api/auth/google
 */
router.use("/auth/google", googleRouter);

/**
 * Tenant Authentication Routes
 * Base URL: /api/auth/tenant
 */
router.use("/auth/tenant", tenantRouter);

/**
 * Profile Routes
 * Base URL: /api/profile
 */
router.use("/profile", profileRouter);

/**
 * Property Category Routes
 * Base URL: /api/properties/categories
 */
router.use(
  "/properties/categories",
  propertyCategoryRouter,
);

/**
 * Tenant Property Management Routes
 * Base URL: /api/properties/manage
 */
router.use(
  "/properties/manage",
  tenantPropertyRouter,
);

/**
 * Tenant Property Image Routes
 * Base URL: /api/properties/manage
 */
router.use(
  "/properties/manage",
  propertyImageRouter,
);

/**
 * Tenant Room Management Routes
 * Base URL: /api/properties/manage
 */
router.use(
  "/properties/manage",
  tenantRoomRouter,
);

/**
 * Tenant Room Availability Routes
 * Base URL: /api/properties/manage
 */
router.use(
  "/properties/manage",
  tenantRoomAvailabilityRouter,
);

/**
 * Tenant Peak Season Routes
 * Base URL: /api/properties/manage
 */
router.use(
  "/properties/manage",
  tenantPeakSeasonRouter,
);

/**
 * Property Routes
 * Base URL: /api/properties
 */
router.use("/properties", propertyRouter);

/**
 * Destination Routes
 * Base URL: /api/destinations
 */
router.use("/destinations", destinationRouter);

export default router;