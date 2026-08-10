import { DestinationDto } from "../../types/dto/destination";

type DestinationSource = {
  id: bigint;
  city: string;
  province: string;
};

export function mapDestination(
  destination: DestinationSource
): DestinationDto {
  return {
    id: destination.id.toString(),
    city: destination.city,
    province: destination.province,
  };
}

export function mapDestinations(
  destinations: DestinationSource[]
): DestinationDto[] {
  return destinations.map(mapDestination);
}