export interface PropertyCardDto {
  id: string;
  name: string;
  destination: {
    city: string;
    province: string;
  };
  thumbnail: string | null;
  startingPrice: number | null;
  rating: number;
  reviewCount: number;
}