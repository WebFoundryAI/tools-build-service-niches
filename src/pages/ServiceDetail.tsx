import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { LeadForm } from "@/components/forms/LeadForm";
import { CTASection } from "@/components/sections/CTASection";
import { AIContentBlock } from "@/components/ai/AIContentBlock";
import { getServiceBySlug, SERVICES } from "@/config/services";
import { BRAND } from "@/config/brand";
import { CheckCircle2, ArrowLeft } from "lucide-react";

const ServiceDetail = () => {
  const { serviceSlug } = useParams<{ serviceSlug: string }>();
  const service = getServiceBySlug(serviceSlug || "");

  if (!service) {
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

  const otherServices = SERVICES.filter((s) => s.slug !== service.slug).slice(0, 3);

  // Variables for AI content generation
  const aiVariables = {
    serviceName: service.name,
    brandName: BRAND.brandName,
    primaryLocationName: BRAND.primaryLocation,
  };

  return (
    <Layout>
      <section className="hero-section">
        <div className="hero-overlay py-16 md:py-20">
          <div className="container-wide px-4">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground mb-6 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              All Services
            </Link>
            <div className="text-primary-foreground">
              <span className="text-5xl mb-4 block">{service.icon}</span>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{service.name}</h1>
              <p className="text-lg text-primary-foreground/80 max-w-2xl">
                Professional {service.name.toLowerCase()} services across {BRAND.serviceAreaLabel}. Fast response, no call-out fee.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-wide px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold mb-6">About {service.name}</h2>
              
              {/* AI-Generated Content */}
              <AIContentBlock
                type="service"
                templateName="genericService"
                variables={aiVariables}
                keyParts={[service.slug]}
                fallback={
                  <p className="text-muted-foreground mb-6">{service.description}</p>
                }
              />

              <h3 className="text-xl font-bold mt-10 mb-4">Why Choose Us?</h3>
              <ul className="space-y-3">
                {[
                  "No call-out charges",
                  "Fixed pricing with no hidden fees",
                  "24/7 emergency availability",
                  "Fully trained and insured engineers",
                  "Latest equipment and techniques",
                  "100% satisfaction guaranteed",
                ].map((benefit, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-trust shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>

              <h3 className="text-xl font-bold mt-8 mb-4">Other Services</h3>
              <div className="grid sm:grid-cols-3 gap-4">
                {otherServices.map((s) => (
                  <Link
                    key={s.slug}
                    to={`/services/${s.slug}`}
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
                <h3 className="text-xl font-bold mb-4">Get a Quote</h3>
                <LeadForm sourcePage={`service-${service.slug}`} defaultService={service.slug} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </Layout>
  );
};

export default ServiceDetail;
