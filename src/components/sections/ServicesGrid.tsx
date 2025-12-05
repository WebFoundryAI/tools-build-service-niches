import { Link } from "react-router-dom";
import { SERVICES } from "@/config/services";
import { ArrowRight } from "lucide-react";

interface ServicesGridProps {
  showAll?: boolean;
  location?: string;
}

export function ServicesGrid({ showAll = false, location }: ServicesGridProps) {
  const displayServices = showAll ? SERVICES : SERVICES.slice(0, 4);

  return (
    <section className="section-padding bg-muted/50">
      <div className="container-wide px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Drainage Services</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Professional drainage solutions for all your needs. Fast response, fair pricing, quality guaranteed.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayServices.map((service, index) => (
            <Link
              key={service.slug}
              to={location ? `/location/${location}/${service.slug}` : `/services/${service.slug}`}
              className="group bg-card rounded-xl p-6 card-elevated hover:border-primary/20 border border-transparent transition-all animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-4xl mb-4">{service.icon}</div>
              <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                {service.name}
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                {service.shortLabel}
              </p>
              <span className="inline-flex items-center text-primary text-sm font-medium group-hover:gap-2 transition-all">
                Learn more
                <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          ))}
        </div>

        {!showAll && (
          <div className="text-center mt-10">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
            >
              View all services
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
