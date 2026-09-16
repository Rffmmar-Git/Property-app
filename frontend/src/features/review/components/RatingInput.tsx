import { Star } from "lucide-react";

interface RatingInputProps {
  value: number;
  onChange: (value: number) => void;
  error?: string;
}

export function RatingInput({
  value,
  onChange,
  error,
}: RatingInputProps) {
  return (
    <div>
      <div className="flex gap-2">
        {Array.from({ length: 5 }, (_, index) => {
          const rating = index + 1;
          const active = rating <= value;

          return (
            <button
              key={rating}
              type="button"
              onClick={() => onChange(rating)}
              aria-label={`${rating} star${rating > 1 ? "s" : ""}`}
              className="rounded-md p-1 transition hover:scale-105"
            >
              <Star
                size={32}
                className={
                  active
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-slate-300"
                }
              />
            </button>
          );
        })}
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}