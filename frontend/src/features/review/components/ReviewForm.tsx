import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { RatingInput } from "./RatingInput";
import { createReviewSchema, type CreateReviewFormValues } from "@/validations/review.schema";

interface ReviewFormProps {
  reservationId: number;
  onSubmit: (
    values: CreateReviewFormValues
  ) => void;
  isSubmitting?: boolean;
}

export function ReviewForm({
  reservationId,
  onSubmit,
  isSubmitting = false,
}: ReviewFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateReviewFormValues>({
    resolver: zodResolver(createReviewSchema),
    defaultValues: {
      reservationId,
      rating: 0,
      comment: "",
    },
  });

  const rating = watch("rating");

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
      <input
        type="hidden"
        {...register("reservationId", {
          valueAsNumber: true,
        })}
      />

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Rating
        </label>

        <RatingInput
          value={rating}
          onChange={(value) =>
            setValue("rating", value, {
              shouldValidate: true,
            })
          }
          error={errors.rating?.message}
        />
      </div>

      <div>
        <label
          htmlFor="comment"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Your Review
        </label>

        <textarea
          id="comment"
          rows={6}
          placeholder="Tell us about your stay..."
          {...register("comment")}
          className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
        />

        {errors.comment && (
          <p className="mt-1 text-sm text-red-500">
            {errors.comment.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl bg-slate-900 px-4 py-3 font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}