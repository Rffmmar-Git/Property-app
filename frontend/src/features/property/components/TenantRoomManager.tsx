import { useState } from "react";
import {
  AlertTriangle,
  CalendarDays,
  CircleAlert,
  Plus,
  ArrowLeft,
} from "lucide-react";
import { type CreateTenantRoomPayload } from "../api/tenant-room.api";
import { useTenantRooms } from "../hooks/useTenantRooms";
import { useCreateTenantRoom } from "../hooks/useCreateTenantRoom";
import { useUpdateTenantRoom } from "../hooks/useUpdateTenantRoom";
import { useDeleteTenantRoom } from "../hooks/useDeleteTenantRoom";
import TenantRoomAvailabilityManager from "./TenantRoomAvailabilityManager";
import TenantPeakSeasonManager from "./TenantPeakSeasonManager";

interface TenantRoomManagerProps {
  propertyId: string;
}

interface RoomFormState {
  roomName: string;
  description: string;
  capacity: string;
  basePrice: string;
  totalRooms: string;
}

interface AvailabilityRoomState {
  id: string;
  name: string;
}

interface PeakSeasonRoomState {
  id: string;
  name: string;
}

const initialFormState: RoomFormState = {
  roomName: "",
  description: "",
  capacity: "",
  basePrice: "",
  totalRooms: "",
};

const formatPrice = (value: string | number): string => {
  const numericValue = String(value).replace(/\D/g, "");

  if (!numericValue) {
    return "";
  }

  return Number(numericValue).toLocaleString("en-US");
};

const parsePrice = (value: string): number => {
  return Number(value.replace(/,/g, ""));
};

const getErrorMessage = (error: unknown, fallbackMessage: string): string => {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return fallbackMessage;
};

export default function TenantRoomManager({
  propertyId,
}: TenantRoomManagerProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
  const [deletingRoom, setDeletingRoom] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [availabilityRoom, setAvailabilityRoom] =
    useState<AvailabilityRoomState | null>(null);
  const [peakSeasonRoom, setPeakSeasonRoom] =
    useState<PeakSeasonRoomState | null>(null);

  const [form, setForm] = useState<RoomFormState>(initialFormState);
  const [errorMessage, setErrorMessage] = useState("");

  const { data: rooms = [], isLoading, isError } = useTenantRooms();

  const createMutation = useCreateTenantRoom();
  const updateMutation = useUpdateTenantRoom();
  const deleteMutation = useDeleteTenantRoom();

  const propertyRooms = rooms.filter((room) => room.property_id === propertyId);

  const isEditMode = Boolean(editingRoomId);
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const resetForm = () => {
    setForm(initialFormState);
    setErrorMessage("");
    setEditingRoomId(null);
    setShowForm(false);
  };

  const handleOpenCreate = () => {
    setForm(initialFormState);
    setErrorMessage("");
    setEditingRoomId(null);
    setShowForm(true);
  };

  const handleOpenEdit = (room: (typeof propertyRooms)[number]) => {
    setForm({
      roomName: room.room_name,
      description: room.description ?? "",
      capacity: String(room.capacity),
      basePrice: formatPrice(room.base_price),
      totalRooms: String(room.total_rooms),
    });

    setErrorMessage("");
    setEditingRoomId(room.id);
    setShowForm(true);
  };

  const handleOpenAvailability = (roomId: string, roomName: string) => {
    setErrorMessage("");
    setAvailabilityRoom({
      id: roomId,
      name: roomName,
    });
  };

  const handleCloseAvailability = () => {
    setAvailabilityRoom(null);
    setErrorMessage("");
  };

  const handleOpenPeakSeason = (roomId: string, roomName: string) => {
    setErrorMessage("");
    setPeakSeasonRoom({
      id: roomId,
      name: roomName,
    });
  };

  const handleClosePeakSeason = () => {
    setPeakSeasonRoom(null);
    setErrorMessage("");
  };

  const handleInputChange = (field: keyof RoomFormState, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handlePriceChange = (value: string) => {
    setForm((current) => ({
      ...current,
      basePrice: formatPrice(value),
    }));
  };

  const validateForm = (): string | null => {
    if (!form.roomName.trim()) {
      return "Room name is required.";
    }

    if (form.roomName.trim().length > 100) {
      return "Room name must not exceed 100 characters.";
    }

    const capacity = Number(form.capacity);
    const basePrice = parsePrice(form.basePrice);
    const totalRooms = Number(form.totalRooms);

    if (!form.capacity || !Number.isInteger(capacity) || capacity <= 0) {
      return "Capacity must be a whole number greater than 0.";
    }

    if (!form.basePrice || !Number.isFinite(basePrice) || basePrice <= 0) {
      return "Base price must be greater than 0.";
    }

    if (!form.totalRooms || !Number.isInteger(totalRooms) || totalRooms <= 0) {
      return "Total rooms must be a whole number greater than 0.";
    }

    return null;
  };

  const handleSubmit = async () => {
    const validationError = validateForm();

    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    const payload: CreateTenantRoomPayload = {
      roomName: form.roomName.trim(),
      description: form.description.trim() || undefined,
      capacity: Number(form.capacity),
      basePrice: parsePrice(form.basePrice),
      totalRooms: Number(form.totalRooms),
    };

    try {
      setErrorMessage("");

      if (editingRoomId) {
        await updateMutation.mutateAsync({
          roomId: editingRoomId,
          payload,
        });
      } else {
        await createMutation.mutateAsync({
          propertyId,
          payload,
        });
      }

      resetForm();
    } catch (error) {
      setErrorMessage(
        getErrorMessage(
          error,
          `Unable to ${
            editingRoomId ? "update" : "create"
          } this room. Please check the room details and try again.`,
        ),
      );
    }
  };

  const handleOpenDelete = (roomId: string, roomName: string) => {
    setErrorMessage("");
    setDeletingRoom({
      id: roomId,
      name: roomName,
    });
  };

  const handleCloseDelete = () => {
    if (deleteMutation.isPending) {
      return;
    }

    setDeletingRoom(null);
  };

  const handleDelete = async () => {
    if (!deletingRoom) {
      return;
    }

    try {
      setErrorMessage("");

      await deleteMutation.mutateAsync(deletingRoom.id);

      setDeletingRoom(null);
    } catch (error) {
      setErrorMessage(
        getErrorMessage(error, "Unable to delete this room. Please try again."),
      );
    }
  };

  if (availabilityRoom) {
    return (
      <section className="space-y-6 rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <button
              type="button"
              onClick={() => setAvailabilityRoom(null)}
              className="mb-2 cursor-pointer text-sm font-medium text-gray-500 hover:text-gray-900"
            >
              ← Back to Rooms
            </button>

            <h2 className="text-xl font-bold text-gray-900">
              Room Availability
            </h2>

            <p className="text-sm text-gray-500">{availabilityRoom.name}</p>
          </div>
        </div>

        <TenantRoomAvailabilityManager roomId={availabilityRoom.id} />
      </section>
    );
  }

  if (peakSeasonRoom) {
    return (
      <TenantPeakSeasonManager
        roomId={peakSeasonRoom.id}
        roomName={peakSeasonRoom.name}
        onBack={handleClosePeakSeason}
      />
    );
  }

  return (
    <>
      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between gap-4 border-b border-slate-200 p-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Rooms</h2>

            <p className="mt-1 text-sm text-slate-500">
              Manage the room types available in this property.
            </p>
          </div>

          {!showForm && (
            <button
              type="button"
              onClick={handleOpenCreate}
              className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              <Plus size={16} />
              Add Room
            </button>
          )}
        </div>

        {showForm && (
          <div className="border-b border-slate-200 p-5">
            <div className="mb-5">
              <h3 className="text-base font-semibold text-slate-900">
                {isEditMode ? "Edit Room" : "Add Room"}
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Enter the room details below.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Room Name
                </label>

                <input
                  type="text"
                  value={form.roomName}
                  onChange={(event) =>
                    handleInputChange("roomName", event.target.value)
                  }
                  placeholder="e.g. Deluxe Room"
                  disabled={isSubmitting}
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 disabled:cursor-not-allowed disabled:bg-slate-50"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Capacity
                </label>

                <input
                  type="number"
                  min="1"
                  step="1"
                  value={form.capacity}
                  onChange={(event) =>
                    handleInputChange("capacity", event.target.value)
                  }
                  placeholder="e.g. 2"
                  disabled={isSubmitting}
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 disabled:cursor-not-allowed disabled:bg-slate-50"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Base Price
                </label>

                <input
                  type="text"
                  inputMode="numeric"
                  value={form.basePrice}
                  onChange={(event) => handlePriceChange(event.target.value)}
                  placeholder="e.g. 750,000"
                  disabled={isSubmitting}
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 disabled:cursor-not-allowed disabled:bg-slate-50"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Total Rooms
                </label>

                <input
                  type="number"
                  min="1"
                  step="1"
                  value={form.totalRooms}
                  onChange={(event) =>
                    handleInputChange("totalRooms", event.target.value)
                  }
                  placeholder="e.g. 10"
                  disabled={isSubmitting}
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 disabled:cursor-not-allowed disabled:bg-slate-50"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Description
                </label>

                <textarea
                  value={form.description}
                  onChange={(event) =>
                    handleInputChange("description", event.target.value)
                  }
                  placeholder="Describe this room type..."
                  rows={4}
                  disabled={isSubmitting}
                  className="w-full resize-none rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 disabled:cursor-not-allowed disabled:bg-slate-50"
                />
              </div>
            </div>

            {errorMessage && (
              <div className="mt-4 flex items-start gap-2 rounded-md border border-red-200 bg-red-50 px-4 py-3">
                <CircleAlert
                  size={17}
                  className="mt-0.5 shrink-0 text-red-600"
                />

                <div>
                  <p className="text-sm font-semibold text-red-700">
                    Unable to save room
                  </p>

                  <p className="mt-0.5 text-sm text-red-600">{errorMessage}</p>
                </div>
              </div>
            )}

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={resetForm}
                disabled={isSubmitting}
                className="cursor-pointer rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="cursor-pointer rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting
                  ? "Saving..."
                  : isEditMode
                    ? "Save Changes"
                    : "Add Room"}
              </button>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="p-5">
            <p className="text-sm text-slate-500">Loading rooms...</p>
          </div>
        )}

        {isError && (
          <div className="p-5">
            <p className="text-sm text-red-600">
              Unable to load rooms. Please refresh the page and try again.
            </p>
          </div>
        )}

        {!isLoading && !isError && !showForm && (
          <>
            {propertyRooms.length > 0 ? (
              <div className="divide-y divide-slate-200">
                {propertyRooms.map((room) => (
                  <div
                    key={room.id}
                    className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between"
                  >
                    <div className="min-w-0">
                      <h3 className="font-semibold text-slate-900">
                        {room.room_name}
                      </h3>

                      {room.description && (
                        <p className="mt-1 text-sm text-slate-500">
                          {room.description}
                        </p>
                      )}

                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600">
                        <span>Capacity: {room.capacity}</span>

                        <span>
                          Price:{" "}
                          {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            maximumFractionDigits: 0,
                          }).format(room.base_price)}
                        </span>

                        <span>Total rooms: {room.total_rooms}</span>
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          handleOpenAvailability(room.id, room.room_name)
                        }
                        className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                      >
                        <CalendarDays size={14} />
                        Availability
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleOpenPeakSeason(room.id, room.room_name)
                        }
                        className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                      >
                        <CalendarDays size={14} />
                        Peak Season
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenEdit(room)}
                        className="cursor-pointer rounded-md border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleOpenDelete(room.id, room.room_name)
                        }
                        className="cursor-pointer rounded-md bg-red-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <p className="text-sm text-slate-500">
                  No rooms have been added to this property yet.
                </p>

                <button
                  type="button"
                  onClick={handleOpenCreate}
                  className="mt-3 cursor-pointer text-sm font-semibold text-slate-900 underline underline-offset-2"
                >
                  Add your first room
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {deletingRoom && (
        <div className="fixed inset-0 z-[9999] bg-slate-900/10">
          <div
            className="fixed left-1/2 top-1/2 z-[10000] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl"
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
                    Delete Room
                  </h2>

                  <p className="mt-1 text-xs leading-5 text-slate-muted">
                    Are you sure you want to delete{" "}
                    <span className="font-semibold">{deletingRoom.name}</span>?
                    This action cannot be undone.
                  </p>
                </div>
              </div>

              {errorMessage && (
                <div className="mt-4 flex items-start gap-2 rounded-md border border-red-100 bg-red-50 px-4 py-3">
                  <CircleAlert
                    size={16}
                    className="mt-0.5 shrink-0 text-red-600"
                  />

                  <div>
                    <p className="text-xs font-semibold text-red-700">
                      Delete failed
                    </p>

                    <p className="mt-0.5 text-xs leading-5 text-red-600">
                      {errorMessage}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-slate-200 px-5 py-4">
              <button
                type="button"
                onClick={handleCloseDelete}
                disabled={deleteMutation.isPending}
                className="cursor-pointer rounded-md border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span>
                  {deleteMutation.isPending ? "Deleting..." : "Delete Room"}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
