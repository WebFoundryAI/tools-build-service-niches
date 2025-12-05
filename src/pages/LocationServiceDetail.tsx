import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { LeadForm } from "@/components/forms/LeadForm";
import { CTASection } from "@/components/sections/CTASection";
import { getLocationBySlug } from "@/config/locations";
import { getServiceBySlug, SERVICES } from "@/config/services";
import { BRAND } from "@/config/brand";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

const LocationServiceDetail = () => {
  const { locationSlug, serviceSlug } = useParams<{ locationSlug: string; serviceSlug: string }>();
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

  return (
    <Layout>
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
                Professional {service.name.toLowerCase()} services in {location.name}, {location.countyOrRegion}. Available 24/7.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-wide px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold mb-4">
                {service.name} in {location.name}
              </h2>
              <p className="text-muted-foreground mb-6">
                Looking for {service.name.toLowerCase()} in {location.name}? {BRAND.brandName} provides fast, reliable {service.name.toLowerCase()} services to homes and businesses throughout {location.name} and the surrounding areas of {location.countyOrRegion}.
              </p>
              <p className="text-muted-foreground mb-6">{service.description}</p>

              <h3 className="text-xl font-bold mb-4">Why Choose {BRAND.brandName}?</h3>
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

              <h3 className="text-xl font-bold mb-4">Other Services in {location.name}</h3>
              <div className="grid sm:grid-cols-3 gap-4">
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

      <CTASection />
    </Layout>
  );
};

export default LocationServiceDetail;
