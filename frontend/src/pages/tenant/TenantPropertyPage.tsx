import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Globe,
  Pencil,
  Plus,
  Save,
  Send,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import PageHeader from "@/components/layout/PageHeader";
import SurfaceCard from "@/components/layout/SurfaceCard";
import TenantLayout from "@/layouts/TenantLayout";
import PropertyLocationPicker from "@/components/property/PropertyLocationPicker";
import PropertyImageManager from "@/features/property/components/PropertyImageManager";
import TenantRoomManager from "@/features/property/components/TenantRoomManager";
import { geocodeAddress } from "@/features/property/api/geocoding.api";
import { useTenantProperties } from "@/features/property/hooks/useTenantProperties";
import { useCreateTenantProperty } from "@/features/property/hooks/useCreateTenantProperty";
import { useUpdateTenantProperty } from "@/features/property/hooks/useUpdateTenantProperty";
import { useDeleteTenantProperty } from "@/features/property/hooks/useDeleteTenantProperty";
import { usePublishTenantProperty } from "@/features/property/hooks/usePublishTenantProperty";
import { useTenantProperty } from "@/features/property/hooks/useTenantProperty";
import { usePropertyCategories } from "@/features/property/hooks/usePropertyCategories";
import { useDestinations } from "@/features/property/hooks/useDestinations";

const PAGE_SIZE = 10;
const SEARCH_DEBOUNCE_MS = 500;

type TenantSortBy = "created_at" | "name";
type SortOrder = "asc" | "desc";

interface TenantPropertyRoom {
  id: string;
  room_name: string;
  total_rooms: number;
}

interface TenantPropertyWithRooms {
  id: string;
  name: string;
  status: "DRAFT" | "PUBLISHED";
  property_categories?: {
    id: string;
    name: string;
  } | null;
  destinations?: {
    id: string;
    city: string;
  } | null;
  rooms?: TenantPropertyRoom[];
}

export default function TenantPropertyPage() {
  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);
  const [editingPropertyId, setEditingPropertyId] = useState<string | null>(
    null,
  );

  const [deletingProperty, setDeletingProperty] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [publishError, setPublishError] = useState<string | null>(null);

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
  const [isGeocoding, setIsGeocoding] = useState(false);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [sortBy, setSortBy] = useState<TenantSortBy>("created_at");
  const [order, setOrder] = useState<SortOrder>("desc");
  const [page, setPage] = useState(1);

  const propertiesQuery = useTenantProperties({
    page,
    pageSize: PAGE_SIZE,
    search: search || undefined,
    category: filterCategory || undefined,
    sortBy,
    order,
  });

  const categoriesQuery = usePropertyCategories();
  const destinationsQuery = useDestinations();

  const createMutation = useCreateTenantProperty();
  const updateMutation = useUpdateTenantProperty();
  const deleteMutation = useDeleteTenantProperty();
  const publishMutation = usePublishTenantProperty();

  const propertyDetailQuery = useTenantProperty(editingPropertyId);

  const properties = (propertiesQuery.data?.items ??
    []) as TenantPropertyWithRooms[];

  const pagination = propertiesQuery.data?.pagination;

  const categories = categoriesQuery.data ?? [];
  const destinations = destinationsQuery.data ?? [];

  const hasDraftProperties = properties.some(
    (property) => property.status === "DRAFT",
  );

  const isEditMode = Boolean(editingPropertyId);
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [searchInput]);

  const resetForm = () => {
    setName("");
    setCategoryId("");
    setDestinationId("");
    setDescription("");
    setLocationSearch("");
    setAddress("");
    setLatitude("");
    setLongitude("");
    setCheckInTime("");
    setCheckOutTime("");
    setErrorMessage(null);
  };

  const handleOpenForm = () => {
    resetForm();
    setEditingPropertyId(null);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    resetForm();
    setEditingPropertyId(null);
    setShowForm(false);
  };

  const handleEditProperty = (propertyId: string) => {
    navigate(`/tenant/properties/${propertyId}/edit`);
  };

  const handleOpenDeleteConfirmation = (
    propertyId: string,
    propertyName: string,
  ) => {
    setDeleteError(null);
    setDeletingProperty({
      id: propertyId,
      name: propertyName,
    });
  };

  const handleCloseDeleteConfirmation = () => {
    if (deleteMutation.isPending) {
      return;
    }

    setDeleteError(null);
    setDeletingProperty(null);
  };

  const handleDeleteProperty = async () => {
    if (!deletingProperty) {
      return;
    }

    setDeleteError(null);

    try {
      await deleteMutation.mutateAsync(deletingProperty.id);
      setDeletingProperty(null);

      if (properties.length === 1 && page > 1) {
        setPage((currentPage) => currentPage - 1);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setDeleteError(
          error.response?.data?.message || "Failed to delete property.",
        );
        return;
      }

      setDeleteError("Failed to delete property.");
    }
  };

  const handlePublishProperty = async (propertyId: string) => {
    setPublishError(null);

    try {
      await publishMutation.mutateAsync(propertyId);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setPublishError(
          error.response?.data?.message ||
            error.message ||
            "Failed to publish property.",
        );
        return;
      }

      if (error instanceof Error) {
        setPublishError(error.message);
        return;
      }

      setPublishError("Failed to publish property.");
    }
  };

  const handleCategoryFilterChange = (value: string) => {
    setFilterCategory(value);
    setPage(1);
  };

  const handleSortChange = (value: string) => {
    if (value === "newest") {
      setSortBy("created_at");
      setOrder("desc");
      setPage(1);
      return;
    }

    if (value === "oldest") {
      setSortBy("created_at");
      setOrder("asc");
      setPage(1);
      return;
    }

    if (value === "name-asc") {
      setSortBy("name");
      setOrder("asc");
      setPage(1);
      return;
    }

    if (value === "name-desc") {
      setSortBy("name");
      setOrder("desc");
      setPage(1);
    }
  };

  const currentSort =
    sortBy === "created_at"
      ? order === "desc"
        ? "newest"
        : "oldest"
      : order === "asc"
        ? "name-asc"
        : "name-desc";

  const totalPages = pagination?.totalPages ?? 0;
  const totalItems = pagination?.totalItems ?? 0;

  useEffect(() => {
    if (totalPages > 0 && page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  useEffect(() => {
    if (!isEditMode || !propertyDetailQuery.data) {
      return;
    }

    const property = propertyDetailQuery.data;

    setName(property.name);
    setCategoryId(property.category_id);
    setDestinationId(property.destination_id);
    setDescription(property.description ?? "");

    setLocationSearch("");
    setAddress(property.address);

    setLatitude(property.latitude?.toString() ?? "");
    setLongitude(property.longitude?.toString() ?? "");

    setCheckInTime(
      property.check_in_time ? property.check_in_time.slice(11, 16) : "",
    );

    setCheckOutTime(
      property.check_out_time ? property.check_out_time.slice(11, 16) : "",
    );
  }, [isEditMode, propertyDetailQuery.data]);

  const handleFindLocation = async () => {
    if (locationSearch.trim().length < 5) {
      setErrorMessage("Please enter a valid location search.");
      return;
    }

    setErrorMessage(null);
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
    } catch {
      setLatitude("");
      setLongitude("");
      setErrorMessage("Failed to find the location. Please try again.");
    } finally {
      setIsGeocoding(false);
    }
  };

  const handleSubmit = async () => {
    setErrorMessage(null);

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
      if (editingPropertyId) {
        await updateMutation.mutateAsync({
          id: editingPropertyId,
          data: payload,
        });
      } else {
        await createMutation.mutateAsync(payload);
      }

      handleCloseForm();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(
          error.response?.data?.message ||
            (editingPropertyId
              ? "Failed to update property."
              : "Failed to create property."),
        );
        return;
      }

      setErrorMessage(
        editingPropertyId
          ? "Failed to update property."
          : "Failed to create property.",
      );
    }
  };

  return (
    <TenantLayout>
      <PageHeader
        title="Property Management"
        description="Manage the properties associated with your account."
      />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-midnight-indigo">
              My Properties
            </h2>

            <p className="mt-1 text-xs text-slate-muted">
              {totalItems} properties available
            </p>
          </div>

          {!showForm && (
            <button
              type="button"
              onClick={handleOpenForm}
              className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-midnight-indigo px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-800"
            >
              <Plus size={15} />
              Add Property
            </button>
          )}
        </div>

        {hasDraftProperties && (
          <div className="rounded-md border border-blue-100 bg-blue-50 px-4 py-3">
            <div className="flex items-start gap-3">
              <CheckCircle2
                size={16}
                className="mt-0.5 shrink-0 text-blue-600"
              />

              <div>
                <p className="text-xs font-semibold text-blue-800">
                  Complete your property setup before publishing
                </p>

                <p className="mt-1 text-xs leading-5 text-blue-700">
                  New properties are saved as drafts. Click Edit to add the
                  required property images and room types before publishing.
                </p>
              </div>
            </div>
          </div>
        )}

        {publishError && !showForm && (
          <div className="rounded-md border border-red-100 bg-red-50 px-4 py-3">
            <div className="flex items-start gap-2">
              <AlertTriangle
                size={15}
                className="mt-0.5 shrink-0 text-red-600"
              />

              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-red-600">
                  {publishError}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setPublishError(null)}
                className="cursor-pointer text-red-400 transition hover:text-red-600"
                title="Dismiss"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        )}

        {!showForm && (
          <SurfaceCard>
            <div className="grid gap-3 p-5 md:grid-cols-[minmax(0,1fr)_220px_220px]">
              <div>
                <label
                  htmlFor="tenant-property-search"
                  className="mb-2 block text-xs font-semibold text-midnight-indigo"
                >
                  Search
                </label>

                <input
                  id="tenant-property-search"
                  type="text"
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  placeholder="Search property name or city..."
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-midnight-indigo focus:ring-2 focus:ring-midnight-indigo/10"
                />
              </div>

              <div>
                <label
                  htmlFor="tenant-property-category"
                  className="mb-2 block text-xs font-semibold text-midnight-indigo"
                >
                  Category
                </label>

                <select
                  id="tenant-property-category"
                  value={filterCategory}
                  onChange={(event) =>
                    handleCategoryFilterChange(event.target.value)
                  }
                  disabled={categoriesQuery.isLoading}
                  className="w-full cursor-pointer rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-midnight-indigo focus:ring-2 focus:ring-midnight-indigo/10 disabled:cursor-not-allowed disabled:bg-slate-50"
                >
                  <option value="">
                    {categoriesQuery.isLoading
                      ? "Loading categories..."
                      : "All categories"}
                  </option>

                  {categories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="tenant-property-sort"
                  className="mb-2 block text-xs font-semibold text-midnight-indigo"
                >
                  Sort
                </label>

                <select
                  id="tenant-property-sort"
                  value={currentSort}
                  onChange={(event) => handleSortChange(event.target.value)}
                  className="w-full cursor-pointer rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-midnight-indigo focus:ring-2 focus:ring-midnight-indigo/10"
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="name-asc">Name A–Z</option>
                  <option value="name-desc">Name Z–A</option>
                </select>
              </div>
            </div>
          </SurfaceCard>
        )}

        {showForm && (
          <SurfaceCard>
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <h2 className="text-sm font-semibold text-midnight-indigo">
                  {isEditMode ? "Edit Property" : "Add Property"}
                </h2>

                <p className="mt-1 text-xs text-slate-muted">
                  {isEditMode
                    ? "Update the information for your property."
                    : "Create a new property for your account."}
                </p>
              </div>

              <button
                type="button"
                onClick={handleCloseForm}
                className="cursor-pointer rounded-md p-2 text-slate-500 transition hover:bg-slate-100 hover:text-midnight-indigo"
                title="Close form"
              >
                <X size={17} />
              </button>
            </div>

            {isEditMode && propertyDetailQuery.isLoading && (
              <div className="px-5 py-8 text-center text-sm text-slate-muted">
                Loading property details...
              </div>
            )}

            {isEditMode && propertyDetailQuery.isError && (
              <div className="p-5">
                <div className="rounded-md border border-red-100 bg-red-50 px-4 py-3">
                  <p className="text-xs font-medium text-red-600">
                    Failed to load property details.
                  </p>
                </div>
              </div>
            )}

            {(!isEditMode ||
              (!propertyDetailQuery.isLoading &&
                !propertyDetailQuery.isError)) && (
              <>
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
                      }}
                      disabled={categoriesQuery.isLoading}
                      className="w-full cursor-pointer rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-midnight-indigo focus:ring-2 focus:ring-midnight-indigo/10 disabled:cursor-not-allowed disabled:bg-slate-50"
                    >
                      <option value="">
                        {categoriesQuery.isLoading
                          ? "Loading categories..."
                          : "Select category"}
                      </option>

                      {categories.map((category) => (
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
                      }}
                      disabled={destinationsQuery.isLoading}
                      className="w-full cursor-pointer rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-midnight-indigo focus:ring-2 focus:ring-midnight-indigo/10 disabled:cursor-not-allowed disabled:bg-slate-50"
                    >
                      <option value="">
                        {destinationsQuery.isLoading
                          ? "Loading destinations..."
                          : "Select destination"}
                      </option>

                      {destinations.map((destination) => (
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
                      }}
                      placeholder="e.g. Jl. Sudirman No. 123, Jakarta"
                      maxLength={255}
                      className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-midnight-indigo focus:ring-2 focus:ring-midnight-indigo/10"
                    />

                    <p className="mt-1 text-xs text-slate-muted">
                      Enter the property's actual address. This address is
                      stored separately from the location search.
                    </p>
                  </div>

                  <div className="md:col-span-2">
                    <div>
                      <p className="text-xs font-semibold text-midnight-indigo">
                        Location
                      </p>

                      <p className="mt-1 text-xs text-slate-muted">
                        Find the property location using the Location Search
                        field above.
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
                      }}
                      placeholder="Describe the property..."
                      rows={4}
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
                      onChange={(event) => setCheckInTime(event.target.value)}
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
                      onChange={(event) => setCheckOutTime(event.target.value)}
                      className="w-full cursor-pointer rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-midnight-indigo focus:ring-2 focus:ring-midnight-indigo/10"
                    />
                  </div>

                  {(errorMessage ||
                    categoriesQuery.isError ||
                    destinationsQuery.isError) && (
                    <div className="md:col-span-2 rounded-md border border-red-100 bg-red-50 px-4 py-3">
                      <p className="text-xs font-medium text-red-600">
                        {errorMessage ||
                          (categoriesQuery.isError
                            ? "Failed to load categories."
                            : "Failed to load destinations.")}
                      </p>
                    </div>
                  )}
                </div>

                {isEditMode && editingPropertyId && (
                  <>
                    <div className="border-t border-slate-200 p-5">
                      <PropertyImageManager propertyId={editingPropertyId} />
                    </div>

                    <div className="border-t border-slate-200 p-5">
                      <TenantRoomManager propertyId={editingPropertyId} />
                    </div>
                  </>
                )}

                <div className="flex justify-end gap-2 border-t border-slate-200 px-5 py-4">
                  <button
                    type="button"
                    onClick={handleCloseForm}
                    className="cursor-pointer rounded-md border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-midnight-indigo px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isEditMode ? <Save size={15} /> : <Plus size={15} />}

                    {createMutation.isPending
                      ? "Creating..."
                      : updateMutation.isPending
                        ? "Updating..."
                        : isEditMode
                          ? "Update Property"
                          : "Create Property"}
                  </button>
                </div>
              </>
            )}
          </SurfaceCard>
        )}

        <SurfaceCard>
          {propertiesQuery.isLoading && (
            <div className="px-5 py-8 text-center text-sm text-slate-muted">
              Loading properties...
            </div>
          )}

          {propertiesQuery.isError && (
            <div className="px-5 py-8 text-center text-sm text-red-500">
              Failed to load properties.
            </div>
          )}

          {!propertiesQuery.isLoading &&
            !propertiesQuery.isError &&
            properties.length === 0 && (
              <div className="px-5 py-10 text-center">
                <Building2 size={28} className="mx-auto text-slate-300" />

                <p className="mt-3 text-sm font-medium text-midnight-indigo">
                  {search || filterCategory
                    ? "No matching properties"
                    : "No properties yet"}
                </p>

                <p className="mt-1 text-xs text-slate-muted">
                  {search || filterCategory
                    ? "Try changing your search or filter."
                    : "Add your first property to get started."}
                </p>
              </div>
            )}

          {!propertiesQuery.isLoading &&
            !propertiesQuery.isError &&
            properties.length > 0 && (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[920px] border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50">
                        <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-muted">
                          Property
                        </th>

                        <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-muted">
                          Location
                        </th>

                        <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-muted">
                          Category
                        </th>

                        <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-muted">
                          Room Types
                        </th>

                        <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-muted">
                          Status
                        </th>

                        <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-wide text-slate-muted">
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {properties.map((property) => {
                        const rooms = property.rooms ?? [];

                        return (
                          <tr
                            key={property.id}
                            className="transition hover:bg-slate-50/70"
                          >
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-midnight-indigo/10 text-midnight-indigo">
                                  <Building2 size={17} />
                                </div>

                                <div className="min-w-0">
                                  <p className="max-w-[190px] truncate text-sm font-semibold text-midnight-indigo">
                                    {property.name}
                                  </p>

                                  <p className="mt-0.5 text-[11px] text-slate-muted">
                                    ID: {property.id}
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="px-5 py-4">
                              <p className="text-sm text-slate-700">
                                {property.destinations?.city || "—"}
                              </p>
                            </td>

                            <td className="px-5 py-4">
                              <p className="text-sm text-slate-700">
                                {property.property_categories?.name || "—"}
                              </p>
                            </td>

                            <td className="px-5 py-4">
                              {rooms.length === 0 ? (
                                <p className="text-xs text-slate-muted">
                                  No rooms yet
                                </p>
                              ) : (
                                <div className="max-w-[250px] space-y-1.5">
                                  {rooms.map((room) => (
                                    <div
                                      key={room.id}
                                      className="flex items-center justify-between gap-3 rounded-md bg-slate-50 px-2.5 py-1.5"
                                    >
                                      <span className="min-w-0 truncate text-xs text-slate-700">
                                        {room.room_name}
                                      </span>

                                      <span className="shrink-0 text-[11px] font-semibold text-midnight-indigo">
                                        {room.total_rooms}{" "}
                                        {room.total_rooms === 1
                                          ? "room"
                                          : "rooms"}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </td>

                            <td className="px-5 py-4">
                              {property.status === "PUBLISHED" ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700">
                                  <Globe size={11} />
                                  Published
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-[10px] font-semibold text-amber-700">
                                  <Pencil size={11} />
                                  Draft
                                </span>
                              )}
                            </td>

                            <td className="px-5 py-4">
                              {!showForm && (
                                <div className="flex justify-end gap-2">
                                  {property.status === "DRAFT" && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handlePublishProperty(property.id)
                                      }
                                      disabled={publishMutation.isPending}
                                      className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-emerald-200 px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                      <Send size={14} />

                                      {publishMutation.isPending &&
                                      publishMutation.variables === property.id
                                        ? "Publishing..."
                                        : "Publish"}
                                    </button>
                                  )}

                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleEditProperty(property.id)
                                    }
                                    className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-xs font-semibold text-midnight-indigo transition hover:bg-slate-50"
                                  >
                                    <Pencil size={14} />
                                    Edit
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleOpenDeleteConfirmation(
                                        property.id,
                                        property.name,
                                      )
                                    }
                                    className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                                  >
                                    <Trash2 size={14} />
                                    Delete
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {pagination && totalPages > 0 && (
                  <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-slate-muted">
                      Showing{" "}
                      <span className="font-semibold text-slate-700">
                        {(page - 1) * PAGE_SIZE + 1}
                      </span>
                      {"–"}
                      <span className="font-semibold text-slate-700">
                        {Math.min(page * PAGE_SIZE, totalItems)}
                      </span>{" "}
                      of{" "}
                      <span className="font-semibold text-slate-700">
                        {totalItems}
                      </span>{" "}
                      properties
                    </p>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setPage((currentPage) => currentPage - 1)
                        }
                        disabled={page <= 1 || propertiesQuery.isFetching}
                        className="inline-flex cursor-pointer items-center gap-1 rounded-md border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <ChevronLeft size={14} />
                        Previous
                      </button>

                      <span className="px-2 text-xs font-semibold text-midnight-indigo">
                        Page {page} of {totalPages}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          setPage((currentPage) => currentPage + 1)
                        }
                        disabled={
                          page >= totalPages || propertiesQuery.isFetching
                        }
                        className="inline-flex cursor-pointer items-center gap-1 rounded-md border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Next
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
        </SurfaceCard>
      </div>

      {deletingProperty && (
        <div className="fixed inset-0 z-50 bg-slate-900/40">
          <div
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl"
            style={{
              width: "min(28rem, calc(100vw - 2rem))",
              maxWidth: "calc(100vw - 2rem)",
            }}
          >
            <div className="p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
                  <AlertTriangle size={19} />
                </div>

                <div className="min-w-0 flex-1">
                  <h2 className="text-sm font-semibold text-midnight-indigo">
                    Delete Property
                  </h2>

                  <p className="mt-1 text-xs leading-5 text-slate-muted">
                    Are you sure you want to delete{" "}
                    <span className="font-semibold text-slate-700">
                      {deletingProperty.name}
                    </span>
                    ? This property will no longer appear in your property list.
                  </p>
                </div>
              </div>

              {deleteError && (
                <div className="mt-4 rounded-md border border-red-100 bg-red-50 px-4 py-3">
                  <p className="text-xs font-medium text-red-600">
                    {deleteError}
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-slate-200 px-5 py-4">
              <button
                type="button"
                onClick={handleCloseDeleteConfirmation}
                disabled={deleteMutation.isPending}
                className="cursor-pointer rounded-md border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDeleteProperty}
                disabled={deleteMutation.isPending}
                className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Trash2 size={14} />

                {deleteMutation.isPending ? "Deleting..." : "Delete Property"}
              </button>
            </div>
          </div>
        </div>
      )}
    </TenantLayout>
  );
}
