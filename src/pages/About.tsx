import { Layout } from "@/components/layout/Layout";
import { CTASection } from "@/components/sections/CTASection";
import { SEOHead } from "@/components/seo/SEOHead";
import { BRAND } from "@/config/brand";
import { getAboutSEO } from "@/config/seo";
import { CheckCircle2, Users, Clock, Shield } from "lucide-react";

const About = () => {
  return (
    <Layout>
      <SEOHead metadata={getAboutSEO()} />
      <section className="hero-section">
        <div className="hero-overlay py-16 md:py-20">
          <div className="container-wide px-4 text-center text-primary-foreground">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About {BRAND.brandName}</h1>
            <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
              Your trusted drainage specialists serving {BRAND.serviceAreaLabel}
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-narrow px-4">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold mb-4">Who We Are</h2>
            <p className="text-muted-foreground mb-6">
              {BRAND.brandName} is a professional drainage company serving {BRAND.serviceAreaLabel}. With years of experience in the industry, we've built a reputation for fast, reliable service at fair prices.
            </p>
            <p className="text-muted-foreground mb-6">
              Our team of fully trained and insured engineers use the latest equipment and techniques to tackle any drainage problem, from simple blockages to complex repairs. We pride ourselves on our honest, transparent approach – no hidden fees, no call-out charges, just quality workmanship you can trust.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 mt-12">
            <div className="text-center p-6 bg-muted/50 rounded-xl">
              <Users className="h-10 w-10 mx-auto text-primary mb-4" />
              <h3 className="font-bold mb-2">Experienced Team</h3>
              <p className="text-sm text-muted-foreground">
                Fully trained and insured engineers
              </p>
            </div>
            <div className="text-center p-6 bg-muted/50 rounded-xl">
              <Clock className="h-10 w-10 mx-auto text-primary mb-4" />
              <h3 className="font-bold mb-2">24/7 Available</h3>
              <p className="text-sm text-muted-foreground">
                Emergency service when you need it
              </p>
            </div>
            <div className="text-center p-6 bg-muted/50 rounded-xl">
              <Shield className="h-10 w-10 mx-auto text-primary mb-4" />
              <h3 className="font-bold mb-2">Fully Insured</h3>
              <p className="text-sm text-muted-foreground">
                Complete peace of mind guaranteed
              </p>
            </div>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Our Promise</h2>
            <ul className="space-y-4">
              {[
                "No call-out fee – you only pay for work completed",
                "Fixed pricing – the quote we give is the price you pay",
                "Fast response – typically within 1-2 hours for emergencies",
                "Quality workmanship – all work guaranteed",
                "Honest advice – we'll always give you our professional opinion",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-trust shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <CTASection />
    </Layout>
  );
};

export default About;
