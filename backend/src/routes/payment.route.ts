import { Router } from "express";
import { paymentController } from "../controllers/payment.controller";
import { uploadPaymentProof } from "../middlewares/payment/upload-payment.middleware";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";
import { user_role } from "../generated/prisma/enums";

const router = Router();

/**
 * Customer Payment
 */
router.post(
  "/upload-proof",
  authenticate,
  authorize(user_role.CUSTOMER),
  uploadPaymentProof.single("paymentProof"),
  paymentController.uploadPaymentProof
);

/**
 * Tenant Payment
 */
router.get(
  "/tenant/transactions",
  authenticate,
  authorize(user_role.TENANT),
  paymentController.getTenantTransactions
);

router.patch(
  "/:id/confirm",
  authenticate,
  authorize(user_role.TENANT),
  paymentController.confirmPayment
);

router.patch(
  "/:id/reject",
  authenticate,
  authorize(user_role.TENANT),
  paymentController.rejectPayment
);

export default router;