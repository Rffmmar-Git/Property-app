import { Router } from "express";
import authRouter from "./auth.route";

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

export default router;