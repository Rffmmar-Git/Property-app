import { Router } from "express";
import { propertyController } from "../controllers/property.controller";

const propertyRouter = Router();

propertyRouter.get("/", propertyController.getAllProperties);
propertyRouter.get("/:id", propertyController.getPropertyById);

export default propertyRouter;