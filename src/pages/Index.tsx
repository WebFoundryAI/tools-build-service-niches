import { Layout } from "@/components/layout/Layout";
import { HeroWithForm } from "@/components/hero/HeroWithForm";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { LocationsGrid } from "@/components/sections/LocationsGrid";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { CTASection } from "@/components/sections/CTASection";
import { BRAND } from "@/config/brand";

const Index = () => {
  return (
    <Layout>
      {/* SEO */}
      <title>{`${BRAND.brandName} | Expert Blocked Drain Services in ${BRAND.primaryLocation}`}</title>
      <meta
        name="description"
        content={`Professional drain unblocking and CCTV surveys in ${BRAND.serviceAreaLabel}. 24/7 emergency service, no call-out fee, fixed pricing. Call ${BRAND.phone}`}
      />

      <HeroWithForm />
      <ServicesGrid />
      <TestimonialsSection />
      <LocationsGrid />
      <FAQSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
