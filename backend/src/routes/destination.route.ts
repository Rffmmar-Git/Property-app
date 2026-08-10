import { Router } from "express";
import { destinationController } from "../controllers/destination.controller";

const destinationRouter = Router();

destinationRouter.get(
  "/",
  destinationController.getAllDestinations
);

export default destinationRouter;