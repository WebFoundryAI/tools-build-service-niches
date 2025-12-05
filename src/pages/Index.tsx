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
import { PRIMARY_LOCATION } from "@/config/locations";
import { getHomeSEO } from "@/config/seo";
import {
  generateWebsiteSchema,
  generateLocalBusinessSchema,
} from "@/lib/schema";

const Index = () => {
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
      <FAQSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
