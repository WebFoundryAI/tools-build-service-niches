import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { BRAND } from "@/config/brand";

const Cookies = () => {
  return (
    <Layout>
      <SEOHead
        metadata={{
          title: `Cookie Policy | ${BRAND.brandName}`,
          description: `Cookie policy for ${BRAND.brandName}. Learn about the cookies we use on our website.`,
          canonicalUrl: "/cookies",
        }}
      />

      <section className="section-padding">
        <div className="container-narrow px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">Cookie Policy</h1>
          <p className="text-muted-foreground mb-8">
            Last updated: {new Date().toLocaleDateString("en-GB")}
          </p>

          <div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-foreground prose-p:text-muted-foreground">
            <h2>What Are Cookies?</h2>
            <p>
              Cookies are small text files stored on your device when you visit
              our website. They help us understand how you use our site and
              improve your experience.
            </p>

            <h2>Cookies We Use</h2>

            <h3>Essential Cookies</h3>
            <p>
              These cookies are necessary for the website to function properly.
              They enable basic features like page navigation and access to
              secure areas.
            </p>

            <h3>Analytics Cookies</h3>
            <p>
              We use analytics cookies to understand how visitors interact with
              our website. This helps us improve our services and user
              experience.
            </p>

            <h3>Functional Cookies</h3>
            <p>
              These cookies remember your preferences and choices to provide a
              more personalised experience.
            </p>

            <h2>Managing Cookies</h2>
            <p>
              Most web browsers allow you to control cookies through their
              settings. You can:
            </p>
            <ul>
              <li>View cookies stored on your device</li>
              <li>Delete all or specific cookies</li>
              <li>Block cookies from all or specific websites</li>
              <li>Set preferences for first-party vs third-party cookies</li>
            </ul>

            <h2>Impact of Disabling Cookies</h2>
            <p>
              If you disable cookies, some features of our website may not
              function correctly. However, you will still be able to browse our
              site and contact us.
            </p>

            <h2>Third-Party Cookies</h2>
            <p>
              Some cookies are placed by third-party services that appear on our
              pages. We do not control these cookies and recommend you check the
              relevant third-party policies for more information.
            </p>

            <h2>Contact Us</h2>
            <p>
              For questions about our cookie policy, contact us at:{" "}
              <a
                href={`mailto:${BRAND.email}`}
                className="text-primary hover:underline"
              >
                {BRAND.email}
              </a>
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Cookies;
