import { Request, Response } from "express";
import { propertyService } from "../services/property.service";
import { ApiResponse } from "../utils/core/ApiResponse";
import { asyncHandler } from "../utils/core/AsyncHandler";
import { parsePropertyQuery } from "../helpers/property/property-query.helper";

export class PropertyController {
  getAllProperties = asyncHandler(async (req: Request, res: Response) => {
    const query = parsePropertyQuery(req);
    const result = await propertyService.getAllProperties(query);

    return res
      .status(200)
      .json(new ApiResponse(true, "Properties retrieved successfully", result));
  });

  getPropertyById = asyncHandler(async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    const property = await propertyService.getPropertyById(id);

    return res
      .status(200)
      .json(new ApiResponse(true, "Property retrieved successfully", property));
  });
}

export const propertyController = new PropertyController();
