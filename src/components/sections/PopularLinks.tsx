import { Link } from "react-router-dom";
import { SERVICES } from "@/config/services";
import { LOCATIONS } from "@/config/locations";

interface BlogPost {
  slug: string;
  title: string;
}

interface PopularLinksProps {
  recentPosts?: BlogPost[];
}

export function PopularLinks({ recentPosts = [] }: PopularLinksProps) {
  const topServices = SERVICES.slice(0, 3);
  const topLocations = LOCATIONS.slice(0, 3);

  return (
    <div className="border-t border-background/20 pt-8 mt-8">
      <h4 className="font-semibold mb-4 text-center">Popular Links</h4>
      <div className="flex flex-wrap justify-center gap-3 text-sm">
        {topServices.map((service) => (
          <Link
            key={service.slug}
            to={`/services/${service.slug}`}
            className="text-background/70 hover:text-accent transition-colors"
          >
            {service.name}
          </Link>
        ))}
        <span className="text-background/30">•</span>
        {topLocations.map((location) => (
          <Link
            key={location.slug}
            to={`/location/${location.slug}`}
            className="text-background/70 hover:text-accent transition-colors"
          >
            {location.name}
          </Link>
        ))}
        {recentPosts.length > 0 && (
          <>
            <span className="text-background/30">•</span>
            {recentPosts.slice(0, 3).map((post) => (
              <Link
                key={post.slug}
                to={`/blog/${post.slug}`}
                className="text-background/70 hover:text-accent transition-colors"
              >
                {post.title}
              </Link>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
