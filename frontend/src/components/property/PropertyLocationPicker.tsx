import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import L from "leaflet";

import "leaflet/dist/leaflet.css";

interface PropertyLocationPickerProps {
  latitude: number | null;
  longitude: number | null;
  onLocationChange: (latitude: number, longitude: number) => void;
}

const defaultPosition: [number, number] = [-6.2088, 106.8456];

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function LocationMarker({
  latitude,
  longitude,
  onLocationChange,
}: PropertyLocationPickerProps) {
  useMapEvents({
    click(event) {
      onLocationChange(event.latlng.lat, event.latlng.lng);
    },
  });

  if (latitude === null || longitude === null) {
    return null;
  }

  return (
    <Marker
      position={[latitude, longitude]}
      icon={markerIcon}
      draggable
      eventHandlers={{
        dragend(event) {
          const marker = event.target as L.Marker;
          const position = marker.getLatLng();

          onLocationChange(position.lat, position.lng);
        },
      }}
    />
  );
}

export default function PropertyLocationPicker({
  latitude,
  longitude,
  onLocationChange,
}: PropertyLocationPickerProps) {
  const position: [number, number] =
    latitude !== null && longitude !== null
      ? [latitude, longitude]
      : defaultPosition;

  return (
    <div className="overflow-hidden rounded-md border border-slate-200">
      <MapContainer
        center={position}
        zoom={13}
        scrollWheelZoom
        className="h-[320px] w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <LocationMarker
          latitude={latitude}
          longitude={longitude}
          onLocationChange={onLocationChange}
        />
      </MapContainer>
    </div>
  );
}