export interface GeocodingResult {
  latitude: number;
  longitude: number;
  displayName: string;
}

interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
}

export const geocodeAddress = async (
  address: string,
): Promise<GeocodingResult | null> => {
  const trimmedAddress = address.trim();

  if (!trimmedAddress) {
    return null;
  }

  const params = new URLSearchParams({
    q: trimmedAddress,
    format: "jsonv2",
    limit: "1",
  });

  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?${params.toString()}`,
    {
      headers: {
        Accept: "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to find the address.");
  }

  const results = (await response.json()) as NominatimResult[];

  if (results.length === 0) {
    return null;
  }

  const result = results[0];

  return {
    latitude: Number(result.lat),
    longitude: Number(result.lon),
    displayName: result.display_name,
  };
};