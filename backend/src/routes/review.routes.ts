import { Router } from "express";
import { reviewController } from "../controllers/review.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";
import { user_role } from "../generated/prisma/enums";

const router = Router();

router.use(
  authenticate,
  authorize(user_role.CUSTOMER)
);
/**
 * Customer Review
 */
router.post(
  "/",
  reviewController.createReview
);

/**
 * Tenant Review
 */
router.patch(
  "/:id/reply",
  reviewController.replyReview
);

export default router;