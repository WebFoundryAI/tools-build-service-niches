import { BRAND } from "@/config/brand";
import { LeadForm } from "@/components/forms/LeadForm";
import { Phone, Clock, Shield } from "lucide-react";

export function HeroWithForm() {
  return (
    <section className="hero-section relative overflow-hidden">
      <div className="hero-overlay py-16 md:py-24">
        <div className="container-wide px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero content */}
            <div className="text-primary-foreground animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-accent/20 border border-accent/30 rounded-full px-4 py-1.5 mb-6">
                <Clock className="h-4 w-4 text-accent" />
                <span className="text-sm font-medium">24/7 Emergency Service</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance">
                Expert Drain Unblocking in {BRAND.primaryLocation}
              </h1>

              <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-xl">
                Fast, reliable drainage solutions for homes and businesses across {BRAND.serviceAreaLabel}. No call-out charges, fixed pricing, same-day service.
              </p>

              {/* Trust signals */}
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="h-5 w-5 text-accent" />
                  <span>Fully Insured</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="trust-badge">✓ No Call-Out Fee</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="trust-badge">✓ Fixed Pricing</span>
                </div>
              </div>

              {/* Phone CTA */}
              <a
                href={`tel:${BRAND.phone}`}
                className="inline-flex items-center gap-3 text-2xl md:text-3xl font-bold text-accent hover:underline"
              >
                <Phone className="h-8 w-8" />
                {BRAND.phone}
              </a>
              <p className="text-primary-foreground/60 text-sm mt-2">
                Call now for immediate assistance
              </p>
            </div>

            {/* Lead form */}
            <div className="bg-card rounded-xl p-6 md:p-8 shadow-2xl animate-scale-in" style={{ animationDelay: "0.2s" }}>
              <h2 className="text-2xl font-bold text-card-foreground mb-2">
                Get Your Free Quote
              </h2>
              <p className="text-muted-foreground mb-6">
                Fill in your details and we'll call you back within 30 minutes
              </p>
              <LeadForm sourcePage="home-hero" compact />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
