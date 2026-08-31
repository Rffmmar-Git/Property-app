import { Router } from "express";
import { googleController } from "../controllers/google.controller";

const router = Router();

router.get(
  "/",
  googleController.startLogin,
);

router.get(
  "/callback",
  googleController.callback,
);

export default router;