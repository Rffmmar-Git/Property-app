import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Save,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import PageHeader from "@/components/layout/PageHeader";
import SurfaceCard from "@/components/layout/SurfaceCard";
import TenantLayout from "@/layouts/TenantLayout";
import PropertyLocationPicker from "@/components/property/PropertyLocationPicker";

import PropertyImageManager from "@/features/property/components/PropertyImageManager";
import TenantRoomManager from "@/features/property/components/TenantRoomManager";

import { geocodeAddress } from "@/features/property/api/geocoding.api";
import { useTenantProperty } from "@/features/property/hooks/useTenantProperty";
import { useUpdateTenantProperty } from "@/features/property/hooks/useUpdateTenantProperty";
import { usePropertyCategories } from "@/features/property/hooks/usePropertyCategories";
import { useDestinations } from "@/features/property/hooks/useDestinations";

export default function TenantPropertyEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const propertyId = id as string;

  const propertyQuery = useTenantProperty(propertyId);
  const categoriesQuery = usePropertyCategories();
  const destinationsQuery = useDestinations();
  const updateMutation = useUpdateTenantProperty();

  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [destinationId, setDestinationId] = useState("");
  const [description, setDescription] = useState("");

  const [locationSearch, setLocationSearch] = useState("");
  const [address, setAddress] = useState("");

  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const [checkInTime, setCheckInTime] = useState("");
  const [checkOutTime, setCheckOutTime] = useState("");

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [isGeocoding, setIsGeocoding] = useState(false);

  const property = propertyQuery.data;

  useEffect(() => {
    if (!property) {
      return;
    }

    setName(property.name);
    setCategoryId(property.category_id);
    setDestinationId(property.destination_id);
    setDescription(property.description ?? "");

    setAddress(property.address);
    setLocationSearch("");

    setLatitude(property.latitude?.toString() ?? "");
    setLongitude(property.longitude?.toString() ?? "");

    setCheckInTime(
      property.check_in_time ? property.check_in_time.slice(11, 16) : "",
    );

    setCheckOutTime(
      property.check_out_time ? property.check_out_time.slice(11, 16) : "",
    );
  }, [property]);

  const handleFindLocation = async () => {
    if (locationSearch.trim().length < 5) {
      setErrorMessage("Please enter a valid location search.");
      return;
    }

    setErrorMessage(null);
    setSuccessMessage(null);
    setIsGeocoding(true);

    try {
      const result = await geocodeAddress(locationSearch);

      if (!result) {
        setLatitude("");
        setLongitude("");
        setErrorMessage(
          "Location not found. Please try a different location search.",
        );
        return;
      }

      setLatitude(result.latitude.toString());
      setLongitude(result.longitude.toString());
      setSuccessMessage("Location found successfully.");
    } catch {
      setLatitude("");
      setLongitude("");
      setErrorMessage("Failed to find the location. Please try again.");
    } finally {
      setIsGeocoding(false);
    }
  };

  const handleSaveProperty = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!propertyId) {
      setErrorMessage("Invalid property ID.");
      return;
    }

    if (name.trim().length < 3) {
      setErrorMessage("Property name must be at least 3 characters.");
      return;
    }

    if (!categoryId) {
      setErrorMessage("Category is required.");
      return;
    }

    if (!destinationId) {
      setErrorMessage("Destination is required.");
      return;
    }

    if (address.trim().length < 5) {
      setErrorMessage("Property address must be at least 5 characters.");
      return;
    }

    const latitudeValue = latitude ? Number(latitude) : undefined;
    const longitudeValue = longitude ? Number(longitude) : undefined;

    if (
      latitude &&
      (Number.isNaN(latitudeValue) ||
        latitudeValue! < -90 ||
        latitudeValue! > 90)
    ) {
      setErrorMessage("Latitude must be a number between -90 and 90.");
      return;
    }

    if (
      longitude &&
      (Number.isNaN(longitudeValue) ||
        longitudeValue! < -180 ||
        longitudeValue! > 180)
    ) {
      setErrorMessage("Longitude must be a number between -180 and 180.");
      return;
    }

    const payload = {
      name: name.trim(),
      categoryId,
      destinationId,
      description: description.trim() || undefined,
      address: address.trim(),
      latitude: latitudeValue,
      longitude: longitudeValue,
      checkInTime: checkInTime || undefined,
      checkOutTime: checkOutTime || undefined,
    };

    try {
      await updateMutation.mutateAsync({
        id: propertyId,
        data: payload,
      });

      setSuccessMessage("Property information updated successfully.");

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(
          error.response?.data?.message ||
            "Failed to update property information.",
        );
        return;
      }

      if (error instanceof Error) {
        setErrorMessage(error.message);
        return;
      }

      setErrorMessage("Failed to update property information.");
    }
  };

  if (propertyQuery.isLoading) {
    return (
      <TenantLayout>
        <PageHeader
          title="Edit Property"
          description="Manage the information and setup for this property."
        />

        <SurfaceCard>
          <div className="px-5 py-12 text-center text-sm text-slate-muted">
            Loading property details...
          </div>
        </SurfaceCard>
      </TenantLayout>
    );
  }

  if (propertyQuery.isError || !property) {
    return (
      <TenantLayout>
        <PageHeader
          title="Edit Property"
          description="Manage the information and setup for this property."
        />

        <SurfaceCard>
          <div className="p-5">
            <div className="rounded-md border border-red-100 bg-red-50 px-4 py-3">
              <div className="flex items-start gap-2">
                <AlertTriangle
                  size={16}
                  className="mt-0.5 shrink-0 text-red-600"
                />

                <p className="text-xs font-medium text-red-600">
                  Failed to load this property. The property may not exist or
                  you may not have access to it.
                </p>
              </div>
            </div>

            <Link
              to="/tenant/properties"
              className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-midnight-indigo hover:underline"
            >
              <ArrowLeft size={14} />
              Back to Properties
            </Link>
          </div>
        </SurfaceCard>
      </TenantLayout>
    );
  }

  return (
    <TenantLayout>
      <PageHeader
        title="Edit Property"
        description={`Manage the information and setup for ${property.name}.`}
      />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Link
            to="/tenant/properties"
            className="inline-flex items-center gap-2 text-xs font-semibold text-midnight-indigo hover:underline"
          >
            <ArrowLeft size={14} />
            Back to Properties
          </Link>

          <span
            className={
              property.status === "PUBLISHED"
                ? "inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700"
                : "inline-flex items-center rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-semibold text-amber-700"
            }
          >
            {property.status === "PUBLISHED" ? "Published" : "Draft"}
          </span>
        </div>

        {(errorMessage || successMessage) && (
          <div
            className={
              errorMessage
                ? "rounded-md border border-red-100 bg-red-50 px-4 py-3"
                : "rounded-md border border-emerald-100 bg-emerald-50 px-4 py-3"
            }
          >
            <div className="flex items-start gap-2">
              {errorMessage ? (
                <AlertTriangle
                  size={15}
                  className="mt-0.5 shrink-0 text-red-600"
                />
              ) : (
                <CheckCircle2
                  size={15}
                  className="mt-0.5 shrink-0 text-emerald-600"
                />
              )}

              <p
                className={
                  errorMessage
                    ? "text-xs font-medium text-red-600"
                    : "text-xs font-medium text-emerald-700"
                }
              >
                {errorMessage || successMessage}
              </p>

              <button
                type="button"
                onClick={() => {
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                className={
                  errorMessage
                    ? "ml-auto cursor-pointer text-red-400 hover:text-red-600"
                    : "ml-auto cursor-pointer text-emerald-400 hover:text-emerald-600"
                }
                title="Dismiss"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        )}

        <SurfaceCard>
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="text-sm font-semibold text-midnight-indigo">
              Property Information
            </h2>

            <p className="mt-1 text-xs text-slate-muted">
              Update the basic information, location, and check-in details for
              this property.
            </p>
          </div>

          <div className="grid gap-5 p-5 md:grid-cols-2">
            <div>
              <label
                htmlFor="property-name"
                className="mb-2 block text-xs font-semibold text-midnight-indigo"
              >
                Property Name
              </label>

              <input
                id="property-name"
                type="text"
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                placeholder="e.g. Sunset Villa"
                maxLength={150}
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-midnight-indigo focus:ring-2 focus:ring-midnight-indigo/10"
              />
            </div>

            <div>
              <label
                htmlFor="property-category"
                className="mb-2 block text-xs font-semibold text-midnight-indigo"
              >
                Category
              </label>

              <select
                id="property-category"
                value={categoryId}
                onChange={(event) => {
                  setCategoryId(event.target.value);
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                disabled={categoriesQuery.isLoading}
                className="w-full cursor-pointer rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-midnight-indigo focus:ring-2 focus:ring-midnight-indigo/10 disabled:cursor-not-allowed disabled:bg-slate-50"
              >
                <option value="">
                  {categoriesQuery.isLoading
                    ? "Loading categories..."
                    : "Select category"}
                </option>

                {(categoriesQuery.data ?? []).map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="property-destination"
                className="mb-2 block text-xs font-semibold text-midnight-indigo"
              >
                Destination
              </label>

              <select
                id="property-destination"
                value={destinationId}
                onChange={(event) => {
                  setDestinationId(event.target.value);
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                disabled={destinationsQuery.isLoading}
                className="w-full cursor-pointer rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-midnight-indigo focus:ring-2 focus:ring-midnight-indigo/10 disabled:cursor-not-allowed disabled:bg-slate-50"
              >
                <option value="">
                  {destinationsQuery.isLoading
                    ? "Loading destinations..."
                    : "Select destination"}
                </option>

                {(destinationsQuery.data ?? []).map((destination) => (
                  <option key={destination.id} value={destination.id}>
                    {destination.city}, {destination.province}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="property-location-search"
                className="mb-2 block text-xs font-semibold text-midnight-indigo"
              >
                Location Search
              </label>

              <div className="flex gap-2">
                <input
                  id="property-location-search"
                  type="text"
                  value={locationSearch}
                  onChange={(event) => {
                    setLocationSearch(event.target.value);
                    setLatitude("");
                    setLongitude("");
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  placeholder="e.g. Sudirman area, Jakarta"
                  className="min-w-0 flex-1 rounded-md border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-midnight-indigo focus:ring-2 focus:ring-midnight-indigo/10"
                />

                <button
                  type="button"
                  onClick={handleFindLocation}
                  disabled={
                    isGeocoding || locationSearch.trim().length < 5
                  }
                  className="shrink-0 cursor-pointer rounded-md border border-slate-200 px-4 py-2 text-xs font-semibold text-midnight-indigo transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isGeocoding ? "Finding..." : "Find Location"}
                </button>
              </div>

              <p className="mt-1 text-xs text-slate-muted">
                Use a searchable place name or location to find the map
                position.
              </p>
            </div>

            <div>
              <label
                htmlFor="property-address"
                className="mb-2 block text-xs font-semibold text-midnight-indigo"
              >
                Property Address
              </label>

              <input
                id="property-address"
                type="text"
                value={address}
                onChange={(event) => {
                  setAddress(event.target.value);
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                placeholder="e.g. Jl. Sudirman No. 123, Jakarta"
                maxLength={255}
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-midnight-indigo focus:ring-2 focus:ring-midnight-indigo/10"
              />

              <p className="mt-1 text-xs text-slate-muted">
                Enter the property's actual address.
              </p>
            </div>

            <div className="md:col-span-2">
              <div>
                <p className="text-xs font-semibold text-midnight-indigo">
                  Location
                </p>

                <p className="mt-1 text-xs text-slate-muted">
                  Find the property location using the Location Search field
                  above.
                </p>
              </div>

              {latitude && longitude && (
                <div className="mt-4 space-y-3">
                  <div className="flex items-center gap-2 rounded-md border border-emerald-100 bg-emerald-50 px-3 py-2">
                    <CheckCircle2
                      size={15}
                      className="shrink-0 text-emerald-600"
                    />

                    <p className="text-xs font-medium text-emerald-700">
                      Location found. Drag the marker to adjust the exact
                      position if needed.
                    </p>
                  </div>

                  <PropertyLocationPicker
                    latitude={Number(latitude)}
                    longitude={Number(longitude)}
                    onLocationChange={(newLatitude, newLongitude) => {
                      setLatitude(newLatitude.toString());
                      setLongitude(newLongitude.toString());
                      setSuccessMessage(null);
                    }}
                  />

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-muted">
                        Latitude
                      </p>

                      <p className="mt-1 text-xs font-medium text-slate-700">
                        {latitude}
                      </p>
                    </div>

                    <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-muted">
                        Longitude
                      </p>

                      <p className="mt-1 text-xs font-medium text-slate-700">
                        {longitude}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="property-description"
                className="mb-2 block text-xs font-semibold text-midnight-indigo"
              >
                Description
              </label>

              <textarea
                id="property-description"
                value={description}
                onChange={(event) => {
                  setDescription(event.target.value);
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                placeholder="Describe the property..."
                rows={5}
                className="w-full resize-none rounded-md border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-midnight-indigo focus:ring-2 focus:ring-midnight-indigo/10"
              />
            </div>

            <div>
              <label
                htmlFor="property-check-in"
                className="mb-2 block text-xs font-semibold text-midnight-indigo"
              >
                Check-in Time
              </label>

              <input
                id="property-check-in"
                type="time"
                value={checkInTime}
                onChange={(event) => {
                  setCheckInTime(event.target.value);
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                className="w-full cursor-pointer rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-midnight-indigo focus:ring-2 focus:ring-midnight-indigo/10"
              />
            </div>

            <div>
              <label
                htmlFor="property-check-out"
                className="mb-2 block text-xs font-semibold text-midnight-indigo"
              >
                Check-out Time
              </label>

              <input
                id="property-check-out"
                type="time"
                value={checkOutTime}
                onChange={(event) => {
                  setCheckOutTime(event.target.value);
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                className="w-full cursor-pointer rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-midnight-indigo focus:ring-2 focus:ring-midnight-indigo/10"
              />
            </div>

            {(categoriesQuery.isError || destinationsQuery.isError) && (
              <div className="md:col-span-2 rounded-md border border-red-100 bg-red-50 px-4 py-3">
                <p className="text-xs font-medium text-red-600">
                  {categoriesQuery.isError
                    ? "Failed to load categories."
                    : "Failed to load destinations."}
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-end border-t border-slate-200 px-5 py-4">
            <button
              type="button"
              onClick={handleSaveProperty}
              disabled={updateMutation.isPending}
              className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-midnight-indigo px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save size={15} />

              {updateMutation.isPending
                ? "Saving..."
                : "Save Property Information"}
            </button>
          </div>
        </SurfaceCard>

        <SurfaceCard>
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="text-sm font-semibold text-midnight-indigo">
              Property Photos
            </h2>

            <p className="mt-1 text-xs text-slate-muted">
              Upload and manage the photos displayed for this property.
            </p>
          </div>

          <div className="p-5">
            <PropertyImageManager propertyId={propertyId} />
          </div>
        </SurfaceCard>

        <SurfaceCard>
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="text-sm font-semibold text-midnight-indigo">
              Room Types
            </h2>

            <p className="mt-1 text-xs text-slate-muted">
              Manage room types, room quantities, availability, and peak
              season rates for this property.
            </p>
          </div>

          <div className="p-5">
            <TenantRoomManager propertyId={propertyId} />
          </div>
        </SurfaceCard>

        <div className="flex justify-start pb-4">
          <button
            type="button"
            onClick={() => navigate("/tenant/properties")}
            className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            <ArrowLeft size={14} />
            Back to Properties
          </button>
        </div>
      </div>
    </TenantLayout>
  );
}