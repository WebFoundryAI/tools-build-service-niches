import { LocationConfig } from "@/config/locations";
import { MAP_CONFIG } from "@/config/maps";

export function buildStaticMapUrl(location: LocationConfig): string {
  if (MAP_CONFIG.provider === "placeholder") {
    return `https://via.placeholder.com/${MAP_CONFIG.width}x${MAP_CONFIG.height}/e5e7eb/6b7280?text=${encodeURIComponent(location.name + " Area")}`;
  }

  // Future: implement Google Static Maps
  // const apiKey = import.meta.env[MAP_CONFIG.apiKeyEnvVar];
  // return `https://maps.googleapis.com/maps/api/staticmap?center=${location.latitude},${location.longitude}&zoom=${MAP_CONFIG.defaultZoom}&size=${MAP_CONFIG.width}x${MAP_CONFIG.height}&key=${apiKey}`;

  return `https://via.placeholder.com/${MAP_CONFIG.width}x${MAP_CONFIG.height}/e5e7eb/6b7280?text=${encodeURIComponent(location.name)}`;
}
