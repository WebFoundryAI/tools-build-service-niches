import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { LeadForm } from "@/components/forms/LeadForm";
import { CTASection } from "@/components/sections/CTASection";
import { AIContentBlock } from "@/components/ai/AIContentBlock";
import { SchemaScript } from "@/components/seo/SchemaScript";
import { SEOHead } from "@/components/seo/SEOHead";
import { Breadcrumbs } from "@/components/nav/Breadcrumbs";
import { getServiceBySlug, getSubServiceBySlug, SERVICES } from "@/config/services";
import { BRAND } from "@/config/brand";
import { PRIMARY_LOCATION } from "@/config/locations";
import { generateServiceSchema, generateBreadcrumbSchema } from "@/lib/schema";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

const SubServiceDetail = () => {
  const { serviceSlug, subServiceSlug } = useParams<{
    serviceSlug: string;
    subServiceSlug: string;
  }>();

  const service = getServiceBySlug(serviceSlug || "");
  const subService = getSubServiceBySlug(serviceSlug || "", subServiceSlug || "");

  if (!service || !subService) {
    return (
      <Layout>
        <div className="section-padding text-center">
          <h1 className="text-2xl font-bold mb-4">Service Not Found</h1>
          <Link to="/services" className="text-primary hover:underline">
            View all services
          </Link>
        </div>
      </Layout>
    );
  }

  const otherSubServices = service.subServices?.filter(
    (s) => s.slug !== subService.slug
  );

  const breadcrumbItems = [
    { label: "Services", href: "/services" },
    { label: service.name, href: `/services/${service.slug}` },
    { label: subService.name },
  ];

  return (
    <Layout>
      <SEOHead
        metadata={{
          title: `${subService.name} | ${BRAND.brandName}`,
          description: `${subService.description} Professional service across ${BRAND.serviceAreaLabel}. Call ${BRAND.phone}`,
          canonicalUrl: `/services/${service.slug}/${subService.slug}`,
        }}
      />
      <SchemaScript
        schema={[
          {
            "@context": "https://schema.org",
            "@type": "Service",
            name: subService.name,
            description: subService.description,
            provider: {
              "@type": "LocalBusiness",
              name: BRAND.brandName,
              telephone: BRAND.phone,
            },
            areaServed: {
              "@type": "Place",
              name: BRAND.serviceAreaLabel,
            },
            serviceType: subService.name,
          },
          generateBreadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Services", url: "/services" },
            { name: service.name, url: `/services/${service.slug}` },
            { name: subService.name, url: `/services/${service.slug}/${subService.slug}` },
          ]),
        ]}
      />

      <section className="hero-section">
        <div className="hero-overlay py-16 md:py-20">
          <div className="container-wide px-4">
            <Link
              to={`/services/${service.slug}`}
              className="inline-flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground mb-6 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to {service.name}
            </Link>
            <div className="text-primary-foreground">
              <span className="text-5xl mb-4 block">{service.icon}</span>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {subService.name}
              </h1>
              <p className="text-lg text-primary-foreground/80 max-w-2xl">
                {subService.shortLabel || subService.description}
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
              <h2 className="text-2xl font-bold mb-6">About {subService.name}</h2>

              <AIContentBlock
                type="subService"
                templateName="genericService"
                variables={{
                  serviceName: subService.name,
                  brandName: BRAND.brandName,
                  primaryLocationName: PRIMARY_LOCATION.name,
                }}
                keyParts={[service.slug, subService.slug]}
                fallback={
                  <p className="text-muted-foreground mb-6">
                    {subService.description}
                  </p>
                }
              />

              <h3 className="text-xl font-bold mt-10 mb-4">Why Choose Us?</h3>
              <ul className="space-y-3 mb-8">
                {[
                  "No call-out charges",
                  "Fixed pricing with no hidden fees",
                  "24/7 emergency availability",
                  "Fully trained and insured engineers",
                  "Latest equipment and techniques",
                ].map((benefit, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-trust shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>

              {otherSubServices && otherSubServices.length > 0 && (
                <>
                  <h3 className="text-xl font-bold mb-4">
                    Other {service.name} Services
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4 mb-8">
                    {otherSubServices.map((sub) => (
                      <Link
                        key={sub.slug}
                        to={`/services/${service.slug}/${sub.slug}`}
                        className="p-4 bg-muted rounded-lg hover:bg-muted/70 transition-colors"
                      >
                        <span className="font-medium block">{sub.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {sub.shortLabel}
                        </span>
                      </Link>
                    ))}
                  </div>
                </>
              )}

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
                  <Link
                    to={`/services/${service.slug}`}
                    className="text-primary hover:underline"
                  >
                    {service.name}
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
                <h3 className="text-xl font-bold mb-4">Get a Quote</h3>
                <LeadForm
                  sourcePage={`subservice-${service.slug}-${subService.slug}`}
                  defaultService={service.slug}
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

export default SubServiceDetail;
