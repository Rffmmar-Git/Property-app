import { Request, Response } from "express";
import { destinationService } from "../services/destination.service";
import { asyncHandler } from "../utils/AsyncHandler";
import { ApiResponse } from "../utils/ApiResponse";

export class DestinationController {
  getAllDestinations = asyncHandler(
    async (_req: Request, res: Response) => {
      const destinations =
        await destinationService.getAllDestinations();

      return res.status(200).json(
        new ApiResponse(
          true,
          "Destinations retrieved successfully",
          destinations
        )
      );
    }
  );
}

export const destinationController =
  new DestinationController();