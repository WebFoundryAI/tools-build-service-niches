import { Layout } from "@/components/layout/Layout";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { CTASection } from "@/components/sections/CTASection";
import { AIContentBlock } from "@/components/ai/AIContentBlock";
import { SchemaScript } from "@/components/seo/SchemaScript";
import { SEOHead } from "@/components/seo/SEOHead";
import { BRAND } from "@/config/brand";
import { PRIMARY_LOCATION } from "@/config/locations";
import { getServicesSEO } from "@/config/seo";
import { generateLocalBusinessSchema } from "@/lib/schema";

const Services = () => {
  return (
    <Layout>
      <SEOHead metadata={getServicesSEO()} />
      <SchemaScript schema={generateLocalBusinessSchema()} />

      <section className="hero-section">
        <div className="hero-overlay py-16 md:py-20">
          <div className="container-wide px-4 text-center text-primary-foreground">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Our Drainage Services
            </h1>
            <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
              From blocked drains to CCTV surveys, we provide comprehensive
              drainage solutions across {BRAND.serviceAreaLabel}.
            </p>
          </div>
        </div>
      </section>

      {/* AI-generated services overview */}
      <section className="section-padding bg-muted/30">
        <div className="container-wide px-4">
          <div className="max-w-3xl mx-auto">
            <AIContentBlock
              type="services"
              keyParts={["overview"]}
              templateName="servicesOverview"
              variables={{
                brandName: BRAND.brandName,
                primaryLocationName: PRIMARY_LOCATION.name,
              }}
              fallback={`${BRAND.brandName} offers a comprehensive range of professional drainage services. Whether you're dealing with a blocked sink or need a full CCTV drain survey, our experienced team has the expertise and equipment to help.`}
            />
          </div>
        </div>
      </section>

      <ServicesGrid showAll />
      <CTASection />
    </Layout>
  );
};

export default Services;
