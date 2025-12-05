import { LocationConfig, PRIMARY_LOCATION } from "@/config/locations";
import { MAP_CONFIG } from "@/config/maps";

export function buildStaticMapUrl(location: LocationConfig): string {
  const { width, height, defaultZoom, provider, apiKeyEnvVar } = MAP_CONFIG;

  if (provider === "google-static" && apiKeyEnvVar) {
    const apiKey = import.meta.env[`VITE_${apiKeyEnvVar}`];

    if (apiKey) {
      const centerLat = PRIMARY_LOCATION.latitude;
      const centerLng = PRIMARY_LOCATION.longitude;
      const markerLat = location.latitude;
      const markerLng = location.longitude;

      return `https://maps.googleapis.com/maps/api/staticmap?center=${centerLat},${centerLng}&zoom=${defaultZoom}&size=${width}x${height}&markers=color:red%7C${markerLat},${markerLng}&key=${apiKey}`;
    }
  }

  // Fallback to placeholder image
  return `https://via.placeholder.com/${width}x${height}/e5e7eb/6b7280?text=${encodeURIComponent(location.name + " Service Area")}`;
}
