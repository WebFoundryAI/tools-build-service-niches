import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { LeadForm } from "@/components/forms/LeadForm";
import { MapSection } from "@/components/sections/MapSection";
import { CTASection } from "@/components/sections/CTASection";
import { AIContentBlock } from "@/components/ai/AIContentBlock";
import { SchemaScript } from "@/components/seo/SchemaScript";
import { SEOHead } from "@/components/seo/SEOHead";
import { Breadcrumbs } from "@/components/nav/Breadcrumbs";
import { getLocationBySlug, LOCATIONS, PRIMARY_LOCATION } from "@/config/locations";
import { SERVICES } from "@/config/services";
import { BRAND } from "@/config/brand";
import { getLocationSEO } from "@/config/seo";
import {
  generateLocalBusinessSchema,
  generatePlaceSchema,
  generateBreadcrumbSchema,
} from "@/lib/schema";
import { ArrowLeft, MapPin, Wrench } from "lucide-react";

const LocationDetail = () => {
  const { locationSlug } = useParams<{ locationSlug: string }>();
  const location = getLocationBySlug(locationSlug || "");

  if (!location) {
    return (
      <Layout>
        <div className="section-padding text-center">
          <h1 className="text-2xl font-bold mb-4">Location Not Found</h1>
          <Link to="/locations" className="text-primary hover:underline">
            View all areas
          </Link>
        </div>
      </Layout>
    );
  }

  const otherLocations = LOCATIONS.filter((l) => l.slug !== location.slug).slice(0, 4);
  const breadcrumbItems = [
    { label: "Areas", href: "/locations" },
    { label: location.name },
  ];

  return (
    <Layout>
      <SEOHead metadata={getLocationSEO(location)} />
      <SchemaScript
        schema={[
          generateLocalBusinessSchema(location),
          generatePlaceSchema(location),
          generateBreadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Areas", url: "/locations" },
            { name: location.name, url: `/location/${location.slug}` },
          ]),
        ]}
      />

      <section className="hero-section">
        <div className="hero-overlay py-16 md:py-20">
          <div className="container-wide px-4">
            <Link
              to="/locations"
              className="inline-flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground mb-6 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              All Areas
            </Link>
            <div className="text-primary-foreground">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-6 w-6 text-accent" />
                <span className="text-lg text-primary-foreground/80">
                  {location.countyOrRegion}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Drain Services in {location.name}
              </h1>
              <p className="text-lg text-primary-foreground/80 max-w-2xl">
                Professional drain unblocking and repairs in {location.name}. 24/7
                emergency service, no call-out fee.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-wide px-4">
          <Breadcrumbs items={breadcrumbItems} />

          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold mb-4">
                {BRAND.brandName} in {location.name}
              </h2>

              <AIContentBlock
                type="location"
                keyParts={[location.slug]}
                templateName="locationPage"
                variables={{
                  brandName: BRAND.brandName,
                  primaryLocationName: PRIMARY_LOCATION.name,
                  serviceAreaLabel: BRAND.serviceAreaLabel,
                  locationName: location.name,
                }}
                fallback={`Need a reliable drainage specialist in ${location.name}? ${BRAND.brandName} provides fast, professional drainage services to homes and businesses throughout ${location.name} and the surrounding area.`}
              />

              {/* Services in this location */}
              <h3 className="text-xl font-bold mt-10 mb-4 flex items-center gap-2">
                <Wrench className="h-5 w-5 text-primary" />
                Our Services in {location.name}
              </h3>
              <div className="grid sm:grid-cols-2 gap-3 mb-8">
                {SERVICES.map((service) => (
                  <Link
                    key={service.slug}
                    to={`/location/${location.slug}/${service.slug}`}
                    className="flex items-center gap-3 p-4 bg-muted rounded-lg hover:bg-muted/70 transition-colors"
                  >
                    <span className="text-2xl">{service.icon}</span>
                    <div>
                      <span className="font-medium block">{service.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {service.shortLabel}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Other locations */}
              <h3 className="text-xl font-bold mt-8 mb-4">Other Areas We Cover</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {otherLocations.map((l) => (
                  <Link
                    key={l.slug}
                    to={`/location/${l.slug}`}
                    className="flex items-center gap-2 p-3 bg-muted rounded-lg hover:bg-muted/70 transition-colors"
                  >
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="font-medium">{l.name}</span>
                  </Link>
                ))}
              </div>

              {/* Internal links */}
              <div className="mt-8 pt-6 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  <Link to="/" className="text-primary hover:underline">
                    Home
                  </Link>
                  {" · "}
                  <Link to="/services" className="text-primary hover:underline">
                    All Services
                  </Link>
                  {" · "}
                  <Link to="/locations" className="text-primary hover:underline">
                    All Areas
                  </Link>
                  {" · "}
                  <Link to="/contact" className="text-primary hover:underline">
                    Contact Us
                  </Link>
                </p>
              </div>
            </div>

            <div>
              <div className="bg-card p-6 rounded-xl card-elevated sticky top-24">
                <h3 className="text-xl font-bold mb-4">
                  Get a Quote in {location.name}
                </h3>
                <LeadForm
                  sourcePage={`location-${location.slug}`}
                  defaultLocation={location.slug}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <MapSection location={location} />
      <CTASection />
    </Layout>
  );
};

export default LocationDetail;
