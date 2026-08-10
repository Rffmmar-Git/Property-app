import { mapDestinations } from "../helpers/destination/destination.mapper";
import { destinationRepository } from "../repositories/destination.repository";

export class DestinationService {
  async getAllDestinations() {
    const destinations =
      await destinationRepository.findAllDestinations();

    return mapDestinations(destinations);
  }
}

export const destinationService =
  new DestinationService();