import { Layout } from "@/components/layout/Layout";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { CTASection } from "@/components/sections/CTASection";
import { BRAND } from "@/config/brand";

const Services = () => {
  return (
    <Layout>
      <section className="hero-section">
        <div className="hero-overlay py-16 md:py-20">
          <div className="container-wide px-4 text-center text-primary-foreground">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Drainage Services</h1>
            <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
              From blocked drains to CCTV surveys, we provide comprehensive drainage solutions across {BRAND.serviceAreaLabel}.
            </p>
          </div>
        </div>
      </section>

      <ServicesGrid showAll />
      <CTASection />
    </Layout>
  );
};

export default Services;
