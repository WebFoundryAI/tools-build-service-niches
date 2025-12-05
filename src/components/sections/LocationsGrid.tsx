import { Link } from "react-router-dom";
import { LOCATIONS } from "@/config/locations";
import { BRAND } from "@/config/brand";
import { MapPin, ArrowRight } from "lucide-react";

interface LocationsGridProps {
  showAll?: boolean;
}

export function LocationsGrid({ showAll = false }: LocationsGridProps) {
  const displayLocations = showAll ? LOCATIONS : LOCATIONS.slice(0, 6);

  return (
    <section className="section-padding">
      <div className="container-wide px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Areas We Cover</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {BRAND.brandName} provides expert drainage services across {BRAND.serviceAreaLabel} and beyond.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {displayLocations.map((location, index) => (
            <Link
              key={location.slug}
              to={`/location/${location.slug}`}
              className="group flex items-center gap-3 p-4 bg-card rounded-lg card-elevated hover:border-primary/20 border border-transparent transition-all animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <MapPin className="h-5 w-5 text-primary shrink-0" />
              <div className="flex-1">
                <span className="font-semibold group-hover:text-primary transition-colors">
                  {location.name}
                </span>
                {location.countyOrRegion && (
                  <span className="text-muted-foreground text-sm block">
                    {location.countyOrRegion}
                  </span>
                )}
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </div>

        {!showAll && (
          <div className="text-center mt-10">
            <Link
              to="/locations"
              className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
            >
              View all areas
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
