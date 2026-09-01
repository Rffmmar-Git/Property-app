import { MapPin, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

import type { Property } from "../api/property.api";

interface PropertyCardProps {
  property: Property;
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("id-ID").format(price);
};

export default function PropertyCard({
  property,
}: PropertyCardProps) {
  const navigate = useNavigate();

  const location = [
    property.destination.city,
    property.destination.province,
  ]
    .filter(Boolean)
    .join(", ");

  const handlePropertyClick = () => {
    navigate(`/properties/${property.id}`);
  };

  return (
    <article
      className="group cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md"
      onClick={handlePropertyClick}
    >
      {/* Property Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {property.thumbnail ? (
          <img
            src={property.thumbnail}
            alt={property.name}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-100 text-sm text-slate-muted">
            No image available
          </div>
        )}
      </div>

      {/* Property Information */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <h2 className="line-clamp-2 text-sm font-semibold text-slate-text">
            {property.name}
          </h2>

          <div className="flex shrink-0 items-center gap-1">
            <Star
              size={12}
              className="fill-sunrise-amber text-sunrise-amber"
            />

            <span className="text-xs font-medium text-slate-text">
              {property.rating > 0
                ? property.rating.toFixed(1)
                : "New"}
            </span>
          </div>
        </div>

        {/* Location */}
        <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-muted">
          <MapPin size={12} />

          <span className="truncate">
            {location}
          </span>
        </div>

        {/* Price */}
        <div className="mt-5 flex items-end justify-between border-t border-slate-100 pt-3">
          <span className="text-[11px] text-slate-muted">
            Starting from
          </span>

          <div className="text-right">
            <span className="text-sm font-bold text-midnight-indigo">
              Rp {formatPrice(property.startingPrice)}
            </span>

            <span className="text-[10px] text-slate-muted">
              /night
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}