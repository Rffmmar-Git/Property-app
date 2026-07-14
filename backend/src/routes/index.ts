import { Router } from "express";

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

export default router;