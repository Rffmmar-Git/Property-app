import { Router } from "express";

import { authController } from "../controllers/auth.controller";

const router = Router();

router.post("/register", authController.register);

router.post("/resend-verification", authController.resendVerification);

router.get("/verify-email/:token", authController.validateVerificationToken);

router.post("/verify-email", authController.verifyEmail);

router.post("/forgot-password", authController.forgotPassword);

router.post("/reset-password", authController.resetPassword);

router.post("/login", authController.login);

export default router;
