import { Router } from "express";
import { reportController } from "../controllers/report.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";
import { user_role } from "../generated/prisma/enums";

const router = Router();
router.use(
  authenticate,
  authorize(user_role.CUSTOMER)
);

/**
 * Sales Report
 * GET /api/reports/sales
 */
router.get(
  "/sales",
  reportController.getSalesReport
);

/**
 * Transaction Report
 * GET /api/reports/transactions
 */
router.get(
  "/transactions",
  reportController.getTransactionReport
);

/**
 * Property Report
 * GET /api/reports/property
 */
router.get(
  "/property",
  reportController.getPropertyReport
);

export default router;