import { Router } from "express";
import authRouter from "./auth.route";
import propertyRouter from "./property.route";
import destinationRouter from "./destination.route";

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