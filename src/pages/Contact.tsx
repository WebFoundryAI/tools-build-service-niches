import { Layout } from "@/components/layout/Layout";
import { LeadForm } from "@/components/forms/LeadForm";
import { BRAND } from "@/config/brand";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

const Contact = () => {
  return (
    <Layout>
      <section className="hero-section">
        <div className="hero-overlay py-16 md:py-20">
          <div className="container-wide px-4 text-center text-primary-foreground">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
            <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
              Get in touch for a free quote or emergency callout
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-wide px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact info */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
              <p className="text-muted-foreground mb-8">
                Whether you need an emergency callout or want to book a routine service, we're here to help. Contact us today for a free, no-obligation quote.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Phone</h3>
                    <a
                      href={`tel:${BRAND.phone}`}
                      className="text-lg text-primary hover:underline"
                    >
                      {BRAND.phone}
                    </a>
                    <p className="text-sm text-muted-foreground">
                      Available 24/7 for emergencies
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <a
                      href={`mailto:${BRAND.email}`}
                      className="text-lg text-primary hover:underline"
                    >
                      {BRAND.email}
                    </a>
                    <p className="text-sm text-muted-foreground">
                      We'll respond within 24 hours
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Address</h3>
                    <p>
                      {BRAND.addressLine1}
                      {BRAND.addressLine2 && <>, {BRAND.addressLine2}</>}
                      <br />
                      {BRAND.postcode}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Hours</h3>
                    <p>
                      <strong>Office:</strong> Mon-Fri 8am-6pm
                      <br />
                      <strong>Emergency:</strong> 24/7
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact form */}
            <div className="bg-card p-6 md:p-8 rounded-xl card-elevated">
              <h2 className="text-2xl font-bold mb-2">Request a Quote</h2>
              <p className="text-muted-foreground mb-6">
                Fill in your details and we'll get back to you as soon as possible.
              </p>
              <LeadForm sourcePage="contact" />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
