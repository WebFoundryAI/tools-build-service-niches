import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { BRAND } from "@/config/brand";

const Privacy = () => {
  return (
    <Layout>
      <SEOHead
        metadata={{
          title: `Privacy Policy | ${BRAND.brandName}`,
          description: `Privacy policy for ${BRAND.brandName}. Learn how we collect, use, and protect your personal information.`,
          canonicalUrl: "/privacy",
        }}
      />

      <section className="section-padding">
        <div className="container-narrow px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">Privacy Policy</h1>
          <p className="text-muted-foreground mb-8">
            Last updated: {new Date().toLocaleDateString("en-GB")}
          </p>

          <div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-foreground prose-p:text-muted-foreground">
            <h2>1. Information We Collect</h2>
            <p>
              When you use our services or contact us, we may collect the following
              information:
            </p>
            <ul>
              <li>Name and contact details (phone, email, address)</li>
              <li>Information about your drainage issue</li>
              <li>Property location and postcode</li>
              <li>Payment information when you use our services</li>
            </ul>

            <h2>2. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul>
              <li>Provide drainage services you have requested</li>
              <li>Contact you about your enquiry or booking</li>
              <li>Send appointment confirmations and reminders</li>
              <li>Improve our services</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h2>3. Data Storage and Security</h2>
            <p>
              Your data is stored securely using industry-standard encryption. We
              retain your information only as long as necessary to provide our
              services and meet legal requirements.
            </p>

            <h2>4. Third-Party Sharing</h2>
            <p>
              We do not sell your personal information. We may share data with
              trusted service providers who assist in delivering our services,
              subject to strict confidentiality agreements.
            </p>

            <h2>5. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access your personal data</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Withdraw consent for marketing communications</li>
            </ul>

            <h2>6. Cookies</h2>
            <p>
              Our website uses cookies to improve your experience. See our{" "}
              <a href="/cookies" className="text-primary hover:underline">
                Cookie Policy
              </a>{" "}
              for more details.
            </p>

            <h2>7. Contact Us</h2>
            <p>
              For privacy-related enquiries, contact us at:{" "}
              <a
                href={`mailto:${BRAND.email}`}
                className="text-primary hover:underline"
              >
                {BRAND.email}
              </a>
            </p>
            <p>
              {BRAND.brandName}
              <br />
              {BRAND.addressLine1}
              {BRAND.addressLine2 && <>, {BRAND.addressLine2}</>}
              <br />
              {BRAND.postcode}
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Privacy;
