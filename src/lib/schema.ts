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

export function generateLocalBusinessSchema(
  location?: LocationConfig
): SchemaOrgObject {
  const loc = location || PRIMARY_LOCATION;

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
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "00:00",
      closes: "23:59",
    },
    priceRange: "££",
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
