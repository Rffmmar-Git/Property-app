import { PaginationDto } from "./pagination.dto";
import { PropertyCardDto } from "./property-card.dto";

export interface PropertyListResponseDto {
  items: PropertyCardDto[];
  pagination: PaginationDto;
}