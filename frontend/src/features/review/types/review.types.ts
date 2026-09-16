export interface CreateReviewPayload {
  reservationId: number;
  rating: number;
  comment: string;
}

export interface CreateReviewResponse {
  id: number;
  reservationId: number;
  propertyId: number;
  userId: number;
  rating: number;
  comment: string;
  tenantReply: string | null;
  repliedAt: string | null;
}