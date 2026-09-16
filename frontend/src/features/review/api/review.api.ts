import { api } from "@/services/api/axios";
import type {
  CreateReviewPayload,
  CreateReviewResponse,
} from "../types/review.types";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const createReview = async (
  payload: CreateReviewPayload
): Promise<CreateReviewResponse> => {
  const response = await api.post<
    ApiResponse<CreateReviewResponse>
  >("/reviews", payload);

  return response.data.data;
};