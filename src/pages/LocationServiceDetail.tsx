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
import { getServiceBySlug, SERVICES } from "@/config/services";
import { BRAND } from "@/config/brand";
import { getServiceInLocationSEO } from "@/config/seo";
import {
  generateServiceInLocationSchema,
  generateBreadcrumbSchema,
} from "@/lib/schema";
import { ArrowLeft, CheckCircle2, MapPin } from "lucide-react";

const LocationServiceDetail = () => {
  const { locationSlug, serviceSlug } = useParams<{
    locationSlug: string;
    serviceSlug: string;
  }>();
  const location = getLocationBySlug(locationSlug || "");
  const service = getServiceBySlug(serviceSlug || "");

  if (!location || !service) {
    return (
      <Layout>
        <div className="section-padding text-center">
          <h1 className="text-2xl font-bold mb-4">Page Not Found</h1>
          <Link to="/" className="text-primary hover:underline">
            Return home
          </Link>
        </div>
      </Layout>
    );
  }

  const otherServices = SERVICES.filter((s) => s.slug !== service.slug).slice(0, 3);
  const nearbyLocations = LOCATIONS.filter((l) => l.slug !== location.slug).slice(0, 3);
  const breadcrumbItems = [
    { label: "Areas", href: "/locations" },
    { label: location.name, href: `/location/${location.slug}` },
    { label: service.name },
  ];

  return (
    <Layout>
      <SEOHead metadata={getServiceInLocationSEO(service, location)} />
      <SchemaScript
        schema={[
          ...generateServiceInLocationSchema(service, location),
          generateBreadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Areas", url: "/locations" },
            { name: location.name, url: `/location/${location.slug}` },
            {
              name: service.name,
              url: `/location/${location.slug}/${service.slug}`,
            },
          ]),
        ]}
      />

      <section className="hero-section">
        <div className="hero-overlay py-16 md:py-20">
          <div className="container-wide px-4">
            <Link
              to={`/location/${location.slug}`}
              className="inline-flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground mb-6 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to {location.name}
            </Link>
            <div className="text-primary-foreground">
              <span className="text-5xl mb-4 block">{service.icon}</span>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {service.name} in {location.name}
              </h1>
              <p className="text-lg text-primary-foreground/80 max-w-2xl">
                Professional {service.name.toLowerCase()} services in{" "}
                {location.name}, {location.countyOrRegion}. Available 24/7.
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
                {service.name} in {location.name}
              </h2>

              <AIContentBlock
                type="serviceInLocation"
                keyParts={[location.slug, service.slug]}
                templateName="serviceInLocation"
                variables={{
                  serviceName: service.name,
                  locationName: location.name,
                  brandName: BRAND.brandName,
                  primaryLocationName: PRIMARY_LOCATION.name,
                  phone: BRAND.phone,
                  serviceAreaLabel: BRAND.serviceAreaLabel,
                }}
                fallback={`Looking for ${service.name.toLowerCase()} in ${location.name}? ${BRAND.brandName} provides fast, reliable ${service.name.toLowerCase()} services to homes and businesses throughout ${location.name} and the surrounding areas of ${location.countyOrRegion}.`}
              />

              <h3 className="text-xl font-bold mt-8 mb-4">
                Why Choose {BRAND.brandName}?
              </h3>
              <ul className="space-y-3 mb-8">
                {[
                  `Local engineers covering ${location.name}`,
                  "No call-out charges",
                  "Fixed pricing with no hidden fees",
                  "24/7 emergency availability",
                  "Fully trained and insured",
                ].map((benefit, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-trust shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>

              {/* Other services in this location */}
              <h3 className="text-xl font-bold mb-4">
                Other Services in {location.name}
              </h3>
              <div className="grid sm:grid-cols-3 gap-4 mb-8">
                {otherServices.map((s) => (
                  <Link
                    key={s.slug}
                    to={`/location/${location.slug}/${s.slug}`}
                    className="p-4 bg-muted rounded-lg hover:bg-muted/70 transition-colors"
                  >
                    <span className="text-2xl block mb-2">{s.icon}</span>
                    <span className="font-medium">{s.name}</span>
                  </Link>
                ))}
              </div>

              {/* Same service in nearby locations */}
              <h3 className="text-xl font-bold mb-4">
                {service.name} in Nearby Areas
              </h3>
              <div className="grid sm:grid-cols-3 gap-3 mb-8">
                {nearbyLocations.map((l) => (
                  <Link
                    key={l.slug}
                    to={`/location/${l.slug}/${service.slug}`}
                    className="flex items-center gap-2 p-3 bg-muted rounded-lg hover:bg-muted/70 transition-colors"
                  >
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="font-medium">{l.name}</span>
                  </Link>
                ))}
              </div>

              {/* Internal links */}
              <div className="pt-6 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  <Link to="/" className="text-primary hover:underline">
                    Home
                  </Link>
                  {" · "}
                  <Link to="/services" className="text-primary hover:underline">
                    All Services
                  </Link>
                  {" · "}
                  <Link
                    to={`/services/${service.slug}`}
                    className="text-primary hover:underline"
                  >
                    {service.name}
                  </Link>
                  {" · "}
                  <Link
                    to={`/location/${location.slug}`}
                    className="text-primary hover:underline"
                  >
                    {location.name}
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
                  sourcePage={`${location.slug}-${service.slug}`}
                  defaultService={service.slug}
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

export default LocationServiceDetail;
