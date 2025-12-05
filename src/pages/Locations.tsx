import { Layout } from "@/components/layout/Layout";
import { LocationsGrid } from "@/components/sections/LocationsGrid";
import { CTASection } from "@/components/sections/CTASection";
import { SEOHead } from "@/components/seo/SEOHead";
import { SchemaScript } from "@/components/seo/SchemaScript";
import { BRAND } from "@/config/brand";
import { getLocationsSEO } from "@/config/seo";
import { generateLocalBusinessSchema } from "@/lib/schema";
import { Link } from "react-router-dom";

const Locations = () => {
  return (
    <Layout>
      <SEOHead metadata={getLocationsSEO()} />
      <SchemaScript schema={generateLocalBusinessSchema()} />

      <section className="hero-section">
        <div className="hero-overlay py-16 md:py-20">
          <div className="container-wide px-4 text-center text-primary-foreground">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Areas We Cover</h1>
            <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
              {BRAND.brandName} provides expert drainage services throughout {BRAND.serviceAreaLabel}. Find your local area below.
            </p>
          </div>
        </div>
      </section>

      <LocationsGrid showAll />

      {/* Internal links */}
      <section className="section-padding bg-muted/30">
        <div className="container-wide px-4 text-center">
          <p className="text-sm text-muted-foreground">
            <Link to="/" className="text-primary hover:underline">
              Home
            </Link>
            {" · "}
            <Link to="/services" className="text-primary hover:underline">
              All Services
            </Link>
            {" · "}
            <Link to="/contact" className="text-primary hover:underline">
              Contact Us
            </Link>
          </p>
        </div>
      </section>

      <CTASection />
    </Layout>
  );
};

export default Locations;
