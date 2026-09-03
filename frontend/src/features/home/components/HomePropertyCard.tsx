import { MapPin, Star } from "lucide-react";
import { Link } from "react-router-dom";

import type { HomeProperty } from "../api/home.api";

interface HomePropertyCardProps {
  property: HomeProperty;
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("id-ID").format(price);
};

export default function HomePropertyCard({ property }: HomePropertyCardProps) {
  const location = [property.destination.city, property.destination.province]
    .filter(Boolean)
    .join(", ");

  return (
    <Link
      to={`/properties/${property.id}`}
      className="block rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-midnight-indigo focus-visible:ring-offset-2"
      aria-label={`View ${property.name}`}
    >
      <article className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
        {/* Image */}
        <div className="relative h-[150px] overflow-hidden">
          {property.thumbnail ? (
            <img
              src={property.thumbnail}
              alt={property.name}
              className="h-full w-full object-cover transition duration-300 hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-slate-100 text-xs text-slate-muted">
              No image available
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-3">
          <div className="flex items-start justify-between gap-3">
            <h3 className="truncate text-sm font-semibold text-slate-text">
              {property.name}
            </h3>

            <div className="flex shrink-0 items-center gap-1 text-[10px]">
              <Star
                size={10}
                className="fill-sunrise-amber text-sunrise-amber"
              />

              <span className="font-medium text-slate-text">
                {property.rating > 0 ? property.rating.toFixed(1) : "New"}
              </span>
            </div>
          </div>

          <div className="mt-1.5 flex items-center gap-1 text-[10px] text-slate-muted">
            <MapPin size={10} />
            <span className="truncate">{location}</span>
          </div>

          <div className="mt-5 flex items-end justify-between border-t border-slate-100 pt-2.5">
            <span className="text-[9px] text-slate-muted">Starting from</span>

            <span className="text-[10px] font-semibold text-midnight-indigo">
              Rp {formatPrice(property.startingPrice)}
              <span className="font-normal text-slate-muted">/night</span>
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
