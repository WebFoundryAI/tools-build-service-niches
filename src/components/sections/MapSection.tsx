import { LocationConfig } from "@/config/locations";
import { buildStaticMapUrl } from "@/lib/mapHelpers";
import { MapPin } from "lucide-react";

interface MapSectionProps {
  location: LocationConfig;
}

export function MapSection({ location }: MapSectionProps) {
  const mapUrl = buildStaticMapUrl(location);

  return (
    <section className="section-padding bg-muted/30">
      <div className="container-wide px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            Our Coverage in {location.name}
          </h2>
          <p className="text-muted-foreground">
            {location.countyOrRegion && `${location.name}, ${location.countyOrRegion}`}
          </p>
        </div>

        <div className="relative rounded-xl overflow-hidden shadow-lg">
          <img
            src={mapUrl}
            alt={`Map showing ${location.name} service area`}
            className="w-full h-auto"
            loading="lazy"
          />
          <div className="absolute bottom-4 left-4 bg-card/95 backdrop-blur rounded-lg px-4 py-2 flex items-center gap-2 shadow-md">
            <MapPin className="h-5 w-5 text-primary" />
            <span className="font-medium">{location.name}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
