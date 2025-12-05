type MapProvider = "google-static" | "custom-static" | "placeholder";

export type MapConfig = {
  provider: MapProvider;
  apiKeyEnvVar?: string;
  defaultZoom: number;
  width: number;
  height: number;
};

export const MAP_CONFIG: MapConfig = {
  provider: "placeholder",
  apiKeyEnvVar: "GOOGLE_STATIC_MAPS_API_KEY",
  defaultZoom: 11,
  width: 800,
  height: 450,
};
