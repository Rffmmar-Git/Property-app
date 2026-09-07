import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

import PageHeader from "@/components/layout/PageHeader";
import SurfaceCard from "@/components/layout/SurfaceCard";
import TenantLayout from "@/layouts/TenantLayout";
import PropertyLocationPicker from "@/components/property/PropertyLocationPicker";
import { geocodeAddress } from "@/features/property/api/geocoding.api";
import { useTenantProperties } from "@/features/property/hooks/useTenantProperties";
import { useCreateTenantProperty } from "@/features/property/hooks/useCreateTenantProperty";
import { useUpdateTenantProperty } from "@/features/property/hooks/useUpdateTenantProperty";
import { useDeleteTenantProperty } from "@/features/property/hooks/useDeleteTenantProperty";
import { useTenantProperty } from "@/features/property/hooks/useTenantProperty";
import { usePropertyCategories } from "@/features/property/hooks/usePropertyCategories";
import { useDestinations } from "@/features/property/hooks/useDestinations";

export default function TenantPropertyPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingPropertyId, setEditingPropertyId] = useState<string | null>(
    null,
  );
  const [deletingProperty, setDeletingProperty] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [destinationId, setDestinationId] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [checkInTime, setCheckInTime] = useState("");
  const [checkOutTime, setCheckOutTime] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isGeocoding, setIsGeocoding] = useState(false);

  const propertiesQuery = useTenantProperties();
  const categoriesQuery = usePropertyCategories();
  const destinationsQuery = useDestinations();

  const createMutation = useCreateTenantProperty();
  const updateMutation = useUpdateTenantProperty();
  const deleteMutation = useDeleteTenantProperty();

  const propertyDetailQuery = useTenantProperty(editingPropertyId);

  const properties = propertiesQuery.data ?? [];
  const categories = categoriesQuery.data ?? [];
  const destinations = destinationsQuery.data ?? [];

  const isEditMode = Boolean(editingPropertyId);
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const resetForm = () => {
    setName("");
    setCategoryId("");
    setDestinationId("");
    setDescription("");
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
    resetForm();
    setEditingPropertyId(propertyId);
    setShowForm(true);
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

  useEffect(() => {
    if (!isEditMode || !propertyDetailQuery.data) {
      return;
    }

    const property = propertyDetailQuery.data;

    setName(property.name);
    setCategoryId(property.category_id);
    setDestinationId(property.destination_id);
    setDescription(property.description ?? "");
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
    if (address.trim().length < 5) {
      setErrorMessage("Please enter a valid address first.");
      return;
    }

    setErrorMessage(null);
    setIsGeocoding(true);

    try {
      const result = await geocodeAddress(address);

      if (!result) {
        setLatitude("");
        setLongitude("");
        setErrorMessage(
          "Address not found. Please try a more specific address.",
        );
        return;
      }

      setLatitude(result.latitude.toString());
      setLongitude(result.longitude.toString());
    } catch {
      setLatitude("");
      setLongitude("");
      setErrorMessage("Failed to find the address. Please try again.");
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
      setErrorMessage("Address must be at least 5 characters.");
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
              {properties.length} properties available
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenForm}
            className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-midnight-indigo px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-800"
          >
            <Plus size={15} />
            Add Property
          </button>
        </div>

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
                      htmlFor="property-address"
                      className="mb-2 block text-xs font-semibold text-midnight-indigo"
                    >
                      Address
                    </label>

                    <input
                      id="property-address"
                      type="text"
                      value={address}
                      onChange={(event) => {
                        setAddress(event.target.value);
                        setLatitude("");
                        setLongitude("");
                        setErrorMessage(null);
                      }}
                      placeholder="Property address"
                      className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-midnight-indigo focus:ring-2 focus:ring-midnight-indigo/10"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold text-midnight-indigo">
                          Location
                        </p>

                        <p className="mt-1 text-xs text-slate-muted">
                          Find the property location from the address.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleFindLocation}
                        disabled={isGeocoding || address.trim().length < 5}
                        className="cursor-pointer rounded-md border border-slate-200 px-4 py-2 text-xs font-semibold text-midnight-indigo transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isGeocoding ? "Finding..." : "Find Location"}
                      </button>
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
                      className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-midnight-indigo focus:ring-2 focus:ring-midnight-indigo/10"
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
                      className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-midnight-indigo focus:ring-2 focus:ring-midnight-indigo/10"
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
                  No properties yet
                </p>

                <p className="mt-1 text-xs text-slate-muted">
                  Add your first property to get started.
                </p>
              </div>
            )}

          {!propertiesQuery.isLoading &&
            !propertiesQuery.isError &&
            properties.length > 0 && (
              <div className="divide-y divide-slate-100">
                {properties.map((property) => (
                  <div
                    key={property.id}
                    className="flex items-center justify-between gap-4 px-5 py-4"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-midnight-indigo/10 text-midnight-indigo">
                        <Building2 size={18} />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-midnight-indigo">
                          {property.name}
                        </p>

                        <p className="mt-0.5 text-xs text-slate-muted">
                          Property ID: {property.id}
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleEditProperty(property.id)}
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
                  </div>
                ))}
              </div>
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
