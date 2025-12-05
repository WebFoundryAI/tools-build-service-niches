import { LocationConfig, PRIMARY_LOCATION, LOCATIONS } from "@/config/locations";
import { MAP_CONFIG } from "@/config/maps";

export function buildStaticMapUrl(location: LocationConfig): string {
  const { width, height, defaultZoom, provider, apiKeyEnvVar } = MAP_CONFIG;

  if (provider === "google-static" && apiKeyEnvVar) {
    const apiKey = import.meta.env[`VITE_${apiKeyEnvVar}`];

    if (apiKey) {
      const centerLat = PRIMARY_LOCATION.latitude;
      const centerLng = PRIMARY_LOCATION.longitude;
      
      // Build markers for all locations
      // Current location gets a red marker, others get blue
      const markers = LOCATIONS.map((loc) => {
        const color = loc.slug === location.slug ? "red" : "blue";
        return `markers=color:${color}%7Clabel:${loc.name.charAt(0)}%7C${loc.latitude},${loc.longitude}`;
      }).join("&");

      return `https://maps.googleapis.com/maps/api/staticmap?center=${centerLat},${centerLng}&zoom=${defaultZoom}&size=${width}x${height}&${markers}&key=${apiKey}`;
    }
  }

  // Fallback to placeholder image
  return `https://via.placeholder.com/${width}x${height}/e5e7eb/6b7280?text=${encodeURIComponent(location.name + " Service Area")}`;
}
