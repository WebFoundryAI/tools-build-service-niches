import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BRAND } from "@/config/brand";
import { SERVICES } from "@/config/services";
import { LOCATIONS } from "@/config/locations";

interface BlogPost {
  slug: string;
  title: string;
}

const Sitemap = () => {
  const baseUrl = `https://${BRAND.domain}`;

  // Fetch blog posts dynamically
  const { data: blogPosts } = useQuery({
    queryKey: ["sitemap-blog-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("slug, title")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as BlogPost[];
    },
  });

  const staticPages = [
    { url: "/", name: "Home", priority: "1.0" },
    { url: "/services", name: "Services", priority: "0.9" },
    { url: "/locations", name: "Areas", priority: "0.9" },
    { url: "/about", name: "About", priority: "0.7" },
    { url: "/contact", name: "Contact", priority: "0.8" },
    { url: "/faq", name: "FAQ", priority: "0.6" },
    { url: "/blog", name: "Blog", priority: "0.7" },
    { url: "/privacy", name: "Privacy Policy", priority: "0.3" },
    { url: "/terms", name: "Terms & Conditions", priority: "0.3" },
    { url: "/cookies", name: "Cookie Policy", priority: "0.3" },
  ];

  const servicePages = SERVICES.map((service) => ({
    url: `/services/${service.slug}`,
    name: service.name,
    priority: "0.8",
  }));

  // Sub-service pages
  const subServicePages = SERVICES.flatMap((service) =>
    (service.subServices || []).map((sub) => ({
      url: `/services/${service.slug}/${sub.slug}`,
      name: `${sub.name} (${service.name})`,
      priority: "0.7",
    }))
  );

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

  // Sub-service in location pages
  const subServiceLocationPages = LOCATIONS.flatMap((location) =>
    SERVICES.flatMap((service) =>
      (service.subServices || []).map((sub) => ({
        url: `/location/${location.slug}/${service.slug}/${sub.slug}`,
        name: `${sub.name} in ${location.name}`,
        priority: "0.6",
      }))
    )
  );

  const blogPages = (blogPosts || []).map((post) => ({
    url: `/blog/${post.slug}`,
    name: post.title,
    priority: "0.6",
  }));

  useEffect(() => {
    document.title = `Sitemap | ${BRAND.brandName}`;
  }, []);

  const totalPages = 
    staticPages.length + 
    servicePages.length + 
    subServicePages.length +
    locationPages.length + 
    serviceLocationPages.length + 
    subServiceLocationPages.length +
    blogPages.length;

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
          <h2 className="text-xl font-semibold mb-4">Services ({servicePages.length})</h2>
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
          {subServicePages.length > 0 && (
            <div className="mt-4 ml-4">
              <h3 className="text-lg font-medium mb-2">Sub-Services ({subServicePages.length})</h3>
              <ul className="space-y-1 text-sm">
                {subServicePages.map((page) => (
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
            </div>
          )}
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Areas We Cover ({locationPages.length})</h2>
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
          <h2 className="text-xl font-semibold mb-4">Local Services ({serviceLocationPages.length})</h2>
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

        {blogPages.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Blog Posts ({blogPages.length})</h2>
            <ul className="space-y-2">
              {blogPages.map((page) => (
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
        )}

        <div className="text-sm text-muted-foreground mt-8 pt-8 border-t">
          <p>Total pages: {totalPages}</p>
        </div>
      </div>
    </div>
  );
};

export default Sitemap;
