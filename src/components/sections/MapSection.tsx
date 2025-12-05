import { LocationConfig } from "@/config/locations";
import { buildStaticMapUrl } from "@/lib/mapHelpers";
import { BRAND } from "@/config/brand";
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
            {BRAND.serviceAreaLabel}
          </p>
        </div>

        <div className="relative rounded-xl overflow-hidden shadow-lg max-w-4xl mx-auto">
          <img
            src={mapUrl}
            alt={`Drain service area map for ${location.name} showing coverage by ${BRAND.brandName}`}
            className="w-full h-auto"
            loading="lazy"
          />
          <div className="absolute bottom-4 left-4 bg-card/95 backdrop-blur rounded-lg px-4 py-2 flex items-center gap-2 shadow-md">
            <MapPin className="h-5 w-5 text-primary" />
            <span className="font-medium">{location.name}</span>
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-4">
          Serving {location.name} and {BRAND.serviceAreaLabel}
        </p>
      </div>
    </section>
  );
}
