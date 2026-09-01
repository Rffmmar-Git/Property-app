export interface ReplyReviewResponseDto {
  message: string;

  data: {
    id: number;
    reservationId: number;
    propertyId: number;
    userId: number;
    rating: number;
    comment: string | null;
    tenantReply: string | null;
    repliedAt: Date | null;
  };
}