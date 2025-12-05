import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { BRAND } from "@/config/brand";

const Terms = () => {
  return (
    <Layout>
      <SEOHead
        metadata={{
          title: `Terms of Service | ${BRAND.brandName}`,
          description: `Terms and conditions for using ${BRAND.brandName} drainage services.`,
          canonicalUrl: "/terms",
        }}
      />

      <section className="section-padding">
        <div className="container-narrow px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">Terms of Service</h1>
          <p className="text-muted-foreground mb-8">
            Last updated: {new Date().toLocaleDateString("en-GB")}
          </p>

          <div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-foreground prose-p:text-muted-foreground">
            <h2>1. Services</h2>
            <p>
              {BRAND.brandName} provides professional drainage services including
              drain unblocking, CCTV surveys, drain jetting, and emergency
              callouts across {BRAND.serviceAreaLabel}.
            </p>

            <h2>2. Quotations and Pricing</h2>
            <p>
              All quotations are provided free of charge. Prices quoted are fixed
              for the work specified. Additional work beyond the original scope
              will be quoted separately before commencement.
            </p>

            <h2>3. Payment Terms</h2>
            <p>
              Payment is due upon completion of work unless otherwise agreed.
              We accept cash, card, and bank transfer payments.
            </p>

            <h2>4. Cancellations</h2>
            <p>
              You may cancel a booking at any time before the engineer arrives.
              For scheduled appointments, we request at least 24 hours notice
              where possible.
            </p>

            <h2>5. Warranty</h2>
            <p>
              All work carried out by {BRAND.brandName} comes with a satisfaction
              guarantee. If you are not satisfied with our work, please contact
              us within 7 days and we will return to resolve any issues.
            </p>

            <h2>6. Liability</h2>
            <p>
              We are fully insured for public liability. Our liability is limited
              to the value of the work undertaken. We are not liable for
              pre-existing conditions or damage caused by third parties.
            </p>

            <h2>7. Access Requirements</h2>
            <p>
              You must ensure we have adequate access to the drainage system.
              If access is restricted or conditions differ from those described,
              additional charges may apply.
            </p>

            <h2>8. Health and Safety</h2>
            <p>
              Our engineers follow strict health and safety protocols. Please
              inform us of any hazards at your property before we arrive.
            </p>

            <h2>9. Complaints</h2>
            <p>
              We take complaints seriously. Please contact us at{" "}
              <a
                href={`mailto:${BRAND.email}`}
                className="text-primary hover:underline"
              >
                {BRAND.email}
              </a>{" "}
              or call{" "}
              <a
                href={`tel:${BRAND.phone}`}
                className="text-primary hover:underline"
              >
                {BRAND.phone}
              </a>{" "}
              with any concerns.
            </p>

            <h2>10. Changes to Terms</h2>
            <p>
              We may update these terms from time to time. The latest version
              will always be available on our website.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Terms;
