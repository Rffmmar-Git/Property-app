import { Router } from "express";

import authRouter from "./auth.route";
import tenantRouter from "./tenant.route";
import propertyRouter from "./property.route";
import propertyCategoryRouter from "./property-category.route";
import destinationRouter from "./destination.route";
import reservationRouter from "./reservation.route";
import reviewRouter from "./review.routes";
import reportRouter from "./report.route";
import paymentRouter from "./payment.route";

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
router.get("/me", authenticate, authorize(user_role.CUSTOMER), (req, res) => {
  res.status(200).json({
    success: true,
    data: req.user,
  });
});

router.use("/auth", authRouter);

router.use("/tenant", tenantRouter);

router.use("/properties/categories", propertyCategoryRouter);

router.use("/properties", propertyRouter);

router.use("/reservations", reservationRouter);

router.use("/destinations", destinationRouter);

router.use("/payments", paymentRouter);

router.use("/reviews", reviewRouter);

router.use("reports", reportRouter);

export default router;
