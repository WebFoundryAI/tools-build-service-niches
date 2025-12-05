import { BRAND } from "@/config/brand";
import { LocationConfig, PRIMARY_LOCATION } from "@/config/locations";
import { ServiceConfig } from "@/config/services";
import { buildStaticMapUrl } from "./mapHelpers";

export interface SchemaOrgObject {
  "@context": string;
  "@type": string | string[];
  [key: string]: unknown;
}

export function generateWebsiteSchema(): SchemaOrgObject {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: BRAND.brandName,
    url: `https://${BRAND.domain}`,
    potentialAction: {
      "@type": "SearchAction",
      target: `https://${BRAND.domain}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

// Parse time string like "8:00 AM" to "08:00"
function parseTimeToISO(timeStr: string): string {
  const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
  if (!match) return "00:00";
  
  let hours = parseInt(match[1], 10);
  const minutes = match[2];
  const period = match[3]?.toUpperCase();
  
  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  
  return `${hours.toString().padStart(2, "0")}:${minutes}`;
}

// Parse opening hours range like "8:00 AM - 6:00 PM" to { opens, closes }
function parseHoursRange(hoursStr: string): { opens: string; closes: string } | null {
  if (hoursStr.toLowerCase().includes("emergency") || hoursStr.toLowerCase().includes("closed")) {
    return null;
  }
  
  const parts = hoursStr.split("-").map((s) => s.trim());
  if (parts.length !== 2) return null;
  
  return {
    opens: parseTimeToISO(parts[0]),
    closes: parseTimeToISO(parts[1]),
  };
}

export function generateLocalBusinessSchema(
  location?: LocationConfig
): SchemaOrgObject {
  const loc = location || PRIMARY_LOCATION;
  
  // Build opening hours specification from BRAND config
  const openingHoursSpecification: Array<{
    "@type": string;
    dayOfWeek: string | string[];
    opens: string;
    closes: string;
  }> = [];
  
  const weekdayHours = parseHoursRange(BRAND.openingHours.weekdays);
  if (weekdayHours) {
    openingHoursSpecification.push({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: weekdayHours.opens,
      closes: weekdayHours.closes,
    });
  }
  
  const saturdayHours = parseHoursRange(BRAND.openingHours.saturday);
  if (saturdayHours) {
    openingHoursSpecification.push({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: saturdayHours.opens,
      closes: saturdayHours.closes,
    });
  }
  
  const sundayHours = parseHoursRange(BRAND.openingHours.sunday);
  if (sundayHours) {
    openingHoursSpecification.push({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Sunday",
      opens: sundayHours.opens,
      closes: sundayHours.closes,
    });
  }
  
  // If 24/7 emergency, add that
  if (BRAND.emergencyAvailable) {
    openingHoursSpecification.push({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "00:00",
      closes: "23:59",
    });
  }
  
  // Build sameAs links from social profiles
  const sameAs: string[] = [];
  if (BRAND.socialLinks.facebook) sameAs.push(BRAND.socialLinks.facebook);
  if (BRAND.socialLinks.twitter) sameAs.push(BRAND.socialLinks.twitter);
  if (BRAND.socialLinks.instagram) sameAs.push(BRAND.socialLinks.instagram);
  if (BRAND.socialLinks.linkedin) sameAs.push(BRAND.socialLinks.linkedin);
  if (BRAND.socialLinks.youtube) sameAs.push(BRAND.socialLinks.youtube);

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `https://${BRAND.domain}/#localbusiness`,
    name: BRAND.brandName,
    description: `Professional drainage services in ${loc.name} and ${BRAND.serviceAreaLabel}. 24/7 emergency drain unblocking, CCTV surveys, and repairs.`,
    url: `https://${BRAND.domain}`,
    telephone: BRAND.phone,
    email: BRAND.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: BRAND.addressLine1,
      addressLocality: BRAND.primaryLocation,
      addressRegion: loc.countyOrRegion || "Wiltshire",
      postalCode: BRAND.postcode,
      addressCountry: "GB",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: loc.latitude,
      longitude: loc.longitude,
    },
    areaServed: {
      "@type": "Place",
      name: BRAND.serviceAreaLabel,
    },
    openingHoursSpecification: openingHoursSpecification.length > 0 
      ? openingHoursSpecification 
      : {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          opens: "00:00",
          closes: "23:59",
        },
    priceRange: "££",
    ...(sameAs.length > 0 && { sameAs }),
  };
}

export function generatePlaceSchema(location: LocationConfig): SchemaOrgObject {
  return {
    "@context": "https://schema.org",
    "@type": "Place",
    name: location.name,
    address: {
      "@type": "PostalAddress",
      addressLocality: location.name,
      addressRegion: location.countyOrRegion || "Wiltshire",
      addressCountry: "GB",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: location.latitude,
      longitude: location.longitude,
    },
    hasMap: buildStaticMapUrl(location),
  };
}

export function generateServiceSchema(
  service: ServiceConfig,
  location?: LocationConfig
): SchemaOrgObject {
  const loc = location || PRIMARY_LOCATION;

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    provider: {
      "@type": "LocalBusiness",
      name: BRAND.brandName,
      telephone: BRAND.phone,
    },
    areaServed: {
      "@type": "Place",
      name: loc.name,
      geo: {
        "@type": "GeoCoordinates",
        latitude: loc.latitude,
        longitude: loc.longitude,
      },
    },
    serviceType: service.name,
  };
}

export function generateServiceInLocationSchema(
  service: ServiceConfig,
  location: LocationConfig
): SchemaOrgObject[] {
  return [
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "@id": `https://${BRAND.domain}/location/${location.slug}/${service.slug}#localbusiness`,
      name: `${BRAND.brandName} - ${service.name} in ${location.name}`,
      description: `Professional ${service.name.toLowerCase()} services in ${location.name}, ${location.countyOrRegion}. Available 24/7.`,
      url: `https://${BRAND.domain}/location/${location.slug}/${service.slug}`,
      telephone: BRAND.phone,
      email: BRAND.email,
      address: {
        "@type": "PostalAddress",
        addressLocality: location.name,
        addressRegion: location.countyOrRegion || "Wiltshire",
        addressCountry: "GB",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: location.latitude,
        longitude: location.longitude,
      },
      areaServed: {
        "@type": "Place",
        name: location.name,
      },
      hasMap: buildStaticMapUrl(location),
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: service.name,
      description: service.description,
      provider: {
        "@type": "LocalBusiness",
        name: BRAND.brandName,
      },
      areaServed: {
        "@type": "Place",
        name: location.name,
        geo: {
          "@type": "GeoCoordinates",
          latitude: location.latitude,
          longitude: location.longitude,
        },
      },
    },
  ];
}

export function generateFAQSchema(
  faqs: Array<{ question: string; answer: string }>
): SchemaOrgObject {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function generateBlogPostSchema(
  title: string,
  description: string,
  slug: string,
  datePublished: string
): SchemaOrgObject {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description: description,
    url: `https://${BRAND.domain}/blog/${slug}`,
    datePublished: datePublished,
    dateModified: datePublished,
    author: {
      "@type": "Organization",
      name: BRAND.brandName,
    },
    publisher: {
      "@type": "Organization",
      name: BRAND.brandName,
      url: `https://${BRAND.domain}`,
    },
  };
}

export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
): SchemaOrgObject {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `https://${BRAND.domain}${item.url}`,
    })),
  };
}
