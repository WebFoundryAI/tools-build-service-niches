import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import { BRAND } from "@/config/brand";
import { LOCATIONS, LocationConfig } from "@/config/locations";

interface CoverageStatementProps {
  currentLocation?: LocationConfig;
}

export function CoverageStatement({ currentLocation }: CoverageStatementProps) {
  const otherLocations = currentLocation
    ? LOCATIONS.filter((l) => l.slug !== currentLocation.slug)
    : LOCATIONS;

  return (
    <div className="bg-muted/50 rounded-lg p-6">
      <h3 className="font-bold mb-3 flex items-center gap-2">
        <MapPin className="h-5 w-5 text-primary" />
        Our Coverage Area
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        We cover the entire {currentLocation?.name || BRAND.primaryLocation} area
        including:
      </p>
      <div className="flex flex-wrap gap-2">
        {otherLocations.slice(0, 8).map((location) => (
          <Link
            key={location.slug}
            to={`/location/${location.slug}`}
            className="text-xs bg-background px-3 py-1.5 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            {location.name}
          </Link>
        ))}
        {otherLocations.length > 8 && (
          <Link
            to="/locations"
            className="text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-full hover:bg-primary/90 transition-colors"
          >
            +{otherLocations.length - 8} more
          </Link>
        )}
      </div>
    </div>
  );
}
