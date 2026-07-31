import { Request, Response } from "express";
import { propertyService } from "../services/property.service";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/AsyncHandler";

export class PropertyController {
  getAllProperties = asyncHandler(async (_req: Request, res: Response) => {
    const properties = await propertyService.getAllProperties();

    return res.status(200).json(
      new ApiResponse(
        true,
        "Properties retrieved successfully",
        properties
      )
    );
  });
}

export const propertyController = new PropertyController();