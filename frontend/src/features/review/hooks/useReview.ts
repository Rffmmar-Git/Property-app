import { useMutation } from "@tanstack/react-query";

import { createReview } from "../api/review.api";

import type { CreateReviewPayload } from "../types/review.types";

export const useCreateReview = () => {
  return useMutation({
    mutationFn: (payload: CreateReviewPayload) =>
      createReview(payload),
  });
};