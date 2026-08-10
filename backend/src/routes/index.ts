import { Router } from "express";
import authRouter from "./auth.route";
import propertyRouter from "./property.route";
import destinationRouter from "./destination.route";
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

router.get(
  "/me",
  authenticate,
  authorize(user_role.CUSTOMER),
  (req, res) => {
    res.status(200).json({
      success: true,
      data: req.user,
    });
  }
);

/**
 * Authentication Routes
 * Base URL: /api/auth
 */
router.use("/auth", authRouter);

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