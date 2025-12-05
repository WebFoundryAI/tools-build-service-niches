import { Layout } from "@/components/layout/Layout";
import { LocationsGrid } from "@/components/sections/LocationsGrid";
import { CTASection } from "@/components/sections/CTASection";
import { BRAND } from "@/config/brand";

const Locations = () => {
  return (
    <Layout>
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
      <CTASection />
    </Layout>
  );
};

export default Locations;
