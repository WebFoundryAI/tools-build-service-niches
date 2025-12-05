import { Link } from "react-router-dom";
import { BRAND } from "@/config/brand";
import { Button } from "@/components/ui/button";
import { Phone, ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="hero-section">
      <div className="hero-overlay py-16 md:py-20">
        <div className="container-wide px-4 text-center text-primary-foreground">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Need Emergency Drain Clearing?
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Don't let a blocked drain disrupt your day. Our expert team is available 24/7 for emergency callouts across {BRAND.serviceAreaLabel}.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild variant="hero" size="xl">
              <a href={`tel:${BRAND.phone}`}>
                <Phone className="h-5 w-5" />
                Call {BRAND.phone}
              </a>
            </Button>
            <Button asChild variant="hero-outline" size="xl">
              <Link to="/contact">
                Request a Quote
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
