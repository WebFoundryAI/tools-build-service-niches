import { useEffect } from "react";
import { BRAND } from "@/config/brand";
import { SERVICES } from "@/config/services";
import { LOCATIONS } from "@/config/locations";

// This component generates a sitemap.xml and serves it
// For React SPA, we'll generate a simple HTML sitemap page
// The actual XML sitemap would need to be generated at build time or via server

const Sitemap = () => {
  const baseUrl = `https://${BRAND.domain}`;

  const staticPages = [
    { url: "/", name: "Home", priority: "1.0" },
    { url: "/services", name: "Services", priority: "0.9" },
    { url: "/locations", name: "Areas", priority: "0.9" },
    { url: "/about", name: "About", priority: "0.7" },
    { url: "/contact", name: "Contact", priority: "0.8" },
    { url: "/faq", name: "FAQ", priority: "0.6" },
    { url: "/blog", name: "Blog", priority: "0.7" },
  ];

  const servicePages = SERVICES.map((service) => ({
    url: `/services/${service.slug}`,
    name: service.name,
    priority: "0.8",
  }));

  const locationPages = LOCATIONS.map((location) => ({
    url: `/location/${location.slug}`,
    name: location.name,
    priority: "0.8",
  }));

  const serviceLocationPages = LOCATIONS.flatMap((location) =>
    SERVICES.map((service) => ({
      url: `/location/${location.slug}/${service.slug}`,
      name: `${service.name} in ${location.name}`,
      priority: "0.7",
    }))
  );

  useEffect(() => {
    document.title = `Sitemap | ${BRAND.brandName}`;
  }, []);

  return (
    <div className="min-h-screen bg-background py-16">
      <div className="container-wide px-4">
        <h1 className="text-3xl font-bold mb-8">Sitemap</h1>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Main Pages</h2>
          <ul className="space-y-2">
            {staticPages.map((page) => (
              <li key={page.url}>
                <a
                  href={page.url}
                  className="text-primary hover:underline"
                >
                  {page.name}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Services</h2>
          <ul className="space-y-2">
            {servicePages.map((page) => (
              <li key={page.url}>
                <a
                  href={page.url}
                  className="text-primary hover:underline"
                >
                  {page.name}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Areas We Cover</h2>
          <ul className="space-y-2">
            {locationPages.map((page) => (
              <li key={page.url}>
                <a
                  href={page.url}
                  className="text-primary hover:underline"
                >
                  {page.name}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Local Services</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {LOCATIONS.map((location) => (
              <div key={location.slug}>
                <h3 className="font-medium mb-2">{location.name}</h3>
                <ul className="space-y-1 text-sm">
                  {SERVICES.map((service) => (
                    <li key={`${location.slug}-${service.slug}`}>
                      <a
                        href={`/location/${location.slug}/${service.slug}`}
                        className="text-primary hover:underline"
                      >
                        {service.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <div className="text-sm text-muted-foreground mt-8 pt-8 border-t">
          <p>
            Total pages: {staticPages.length + servicePages.length + locationPages.length + serviceLocationPages.length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sitemap;
