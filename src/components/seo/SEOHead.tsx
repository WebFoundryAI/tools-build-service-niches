import { useEffect } from "react";
import { BRAND } from "@/config/brand";
import { SEOMetadata } from "@/config/seo";

interface SEOHeadProps {
  metadata: SEOMetadata;
}

export function SEOHead({ metadata }: SEOHeadProps) {
  useEffect(() => {
    document.title = metadata.title;

    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement("meta");
      metaDescription.setAttribute("name", "description");
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute("content", metadata.description);

    // Update canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (metadata.canonicalUrl) {
      if (!canonicalLink) {
        canonicalLink = document.createElement("link");
        canonicalLink.setAttribute("rel", "canonical");
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.setAttribute(
        "href",
        `https://${BRAND.domain}${metadata.canonicalUrl}`
      );
    }

    // Handle noindex meta tag for content not ready for indexing
    let robotsMeta = document.querySelector('meta[name="robots"]');
    if (metadata.noIndex) {
      if (!robotsMeta) {
        robotsMeta = document.createElement("meta");
        robotsMeta.setAttribute("name", "robots");
        document.head.appendChild(robotsMeta);
      }
      robotsMeta.setAttribute("content", "noindex, nofollow");
    } else {
      // Remove noindex if it exists and page should be indexed
      if (robotsMeta) {
        robotsMeta.remove();
      }
    }

    // Cleanup function to reset robots meta when component unmounts
    return () => {
      const existingRobotsMeta = document.querySelector('meta[name="robots"]');
      if (existingRobotsMeta) {
        existingRobotsMeta.remove();
      }
    };
  }, [metadata]);

  return null;
}
