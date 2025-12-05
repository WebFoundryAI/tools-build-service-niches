import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { HeroWithForm } from "@/components/hero/HeroWithForm";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { LocationsGrid } from "@/components/sections/LocationsGrid";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { CTASection } from "@/components/sections/CTASection";
import { AIContentBlock } from "@/components/ai/AIContentBlock";
import { SchemaScript } from "@/components/seo/SchemaScript";
import { SEOHead } from "@/components/seo/SEOHead";
import { BRAND } from "@/config/brand";
import { PRIMARY_LOCATION, LOCATIONS } from "@/config/locations";
import { SERVICES } from "@/config/services";
import { getHomeSEO } from "@/config/seo";
import {
  generateWebsiteSchema,
  generateLocalBusinessSchema,
} from "@/lib/schema";
import { MapPin, ArrowRight } from "lucide-react";

const Index = () => {
  // Priority service-in-location combinations for internal linking
  const priorityLinks = SERVICES.slice(0, 3).flatMap((service) =>
    LOCATIONS.slice(0, 2).map((location) => ({
      href: `/location/${location.slug}/${service.slug}`,
      label: `${service.name} in ${location.name}`,
      icon: service.icon,
    }))
  );

  return (
    <Layout>
      <SEOHead metadata={getHomeSEO()} />
      <SchemaScript
        schema={[generateWebsiteSchema(), generateLocalBusinessSchema()]}
      />

      <HeroWithForm />

      {/* AI-generated intro section */}
      <section className="section-padding bg-muted/30">
        <div className="container-wide px-4">
          <div className="max-w-3xl mx-auto text-center">
            <AIContentBlock
              type="home"
              keyParts={["intro"]}
              templateName="homeIntro"
              variables={{
                brandName: BRAND.brandName,
                primaryLocationName: PRIMARY_LOCATION.name,
                serviceAreaLabel: BRAND.serviceAreaLabel,
              }}
              fallback={`${BRAND.brandName} provides professional drainage services across ${BRAND.serviceAreaLabel}. From emergency drain unblocking to CCTV surveys, our experienced team is available 24/7.`}
            />
          </div>
        </div>
      </section>

      <ServicesGrid />
      <TestimonialsSection />
      <LocationsGrid />

      {/* Priority Service-in-Location Links (SEO) */}
      <section className="section-padding">
        <div className="container-wide px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              Popular Services by Area
            </h2>
            <p className="text-muted-foreground">
              Quick links to our most requested services in your area
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {priorityLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="flex items-center gap-3 p-4 bg-card rounded-lg card-elevated hover:bg-muted/50 transition-colors group"
              >
                <span className="text-2xl">{link.icon}</span>
                <span className="flex-1 font-medium text-sm">{link.label}</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link
              to="/locations"
              className="inline-flex items-center gap-2 text-primary hover:underline"
            >
              <MapPin className="h-4 w-4" />
              View all service areas
            </Link>
          </div>
        </div>
      </section>

      <FAQSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
