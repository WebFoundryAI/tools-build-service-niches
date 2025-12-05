export type LocationConfig = {
  slug: string;
  name: string;
  countyOrRegion?: string;
  latitude: number;
  longitude: number;
};

export const PRIMARY_LOCATION: LocationConfig = {
  slug: "swindon",
  name: "Swindon",
  countyOrRegion: "Wiltshire",
  latitude: 51.5558,
  longitude: -1.7797,
};

export const LOCATIONS: LocationConfig[] = [
  PRIMARY_LOCATION,
  {
    slug: "royal-wootton-bassett",
    name: "Royal Wootton Bassett",
    countyOrRegion: "Wiltshire",
    latitude: 51.541,
    longitude: -1.904,
  },
  {
    slug: "highworth",
    name: "Highworth",
    countyOrRegion: "Wiltshire",
    latitude: 51.63,
    longitude: -1.708,
  },
  {
    slug: "purton",
    name: "Purton",
    countyOrRegion: "Wiltshire",
    latitude: 51.583,
    longitude: -1.878,
  },
  {
    slug: "cricklade",
    name: "Cricklade",
    countyOrRegion: "Wiltshire",
    latitude: 51.6393,
    longitude: -1.8567,
  },
  {
    slug: "wroughton",
    name: "Wroughton",
    countyOrRegion: "Wiltshire",
    latitude: 51.5206,
    longitude: -1.7906,
  },
];

export function getLocationBySlug(slug: string): LocationConfig | undefined {
  return LOCATIONS.find((location) => location.slug === slug);
}
