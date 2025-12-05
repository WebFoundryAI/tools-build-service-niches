import { BRAND } from "./brand";
import { LocationConfig, PRIMARY_LOCATION } from "./locations";
import { ServiceConfig } from "./services";

export interface SEOMetadata {
  title: string;
  description: string;
  canonicalUrl?: string;
  noIndex?: boolean;
}

export function getHomeSEO(): SEOMetadata {
  return {
    title: `${BRAND.brandName} | Expert Blocked Drain Services in ${BRAND.primaryLocation}`,
    description: `Professional drain unblocking and CCTV surveys in ${BRAND.serviceAreaLabel}. 24/7 emergency service, no call-out fee, fixed pricing. Call ${BRAND.phone}`,
    canonicalUrl: "/",
  };
}

export function getServicesSEO(): SEOMetadata {
  return {
    title: `Drainage Services | ${BRAND.brandName}`,
    description: `Complete drainage services in ${BRAND.serviceAreaLabel}. Blocked drains, CCTV surveys, drain jetting, and 24/7 emergency callouts. No call-out fee.`,
    canonicalUrl: "/services",
  };
}

export function getServiceSEO(service: ServiceConfig): SEOMetadata {
  return {
    title: `${service.name} | ${BRAND.brandName}`,
    description: `${service.description} Available across ${BRAND.serviceAreaLabel}. Call ${BRAND.phone} for fast response.`,
    canonicalUrl: `/services/${service.slug}`,
  };
}

export function getLocationsSEO(): SEOMetadata {
  return {
    title: `Areas We Cover | ${BRAND.brandName}`,
    description: `${BRAND.brandName} provides expert drainage services throughout ${BRAND.serviceAreaLabel}. Find your local area for fast, professional drain unblocking.`,
    canonicalUrl: "/locations",
  };
}

export function getLocationSEO(location: LocationConfig): SEOMetadata {
  return {
    title: `Drain Services in ${location.name} | ${BRAND.brandName}`,
    description: `Professional drainage services in ${location.name}, ${location.countyOrRegion}. 24/7 emergency drain unblocking, CCTV surveys, and repairs. Call ${BRAND.phone}`,
    canonicalUrl: `/location/${location.slug}`,
  };
}

export function getServiceInLocationSEO(
  service: ServiceConfig,
  location: LocationConfig
): SEOMetadata {
  return {
    title: `${service.name} in ${location.name} | ${BRAND.brandName}`,
    description: `Professional ${service.name.toLowerCase()} services in ${location.name}, ${location.countyOrRegion}. Fast response, fixed pricing. Call ${BRAND.phone}`,
    canonicalUrl: `/location/${location.slug}/${service.slug}`,
  };
}

export function getAboutSEO(): SEOMetadata {
  return {
    title: `About Us | ${BRAND.brandName}`,
    description: `Learn about ${BRAND.brandName}, your trusted drainage specialists in ${BRAND.serviceAreaLabel}. Reliable, professional, and available 24/7.`,
    canonicalUrl: "/about",
  };
}

export function getContactSEO(): SEOMetadata {
  return {
    title: `Contact Us | ${BRAND.brandName}`,
    description: `Get in touch with ${BRAND.brandName} for drainage services in ${BRAND.serviceAreaLabel}. Call ${BRAND.phone} or use our contact form.`,
    canonicalUrl: "/contact",
  };
}

export function getFAQSEO(): SEOMetadata {
  return {
    title: `FAQs | ${BRAND.brandName}`,
    description: `Common questions about drainage services in ${BRAND.serviceAreaLabel}. Find answers about blocked drains, costs, and emergency callouts.`,
    canonicalUrl: "/faq",
  };
}

export function getBlogSEO(): SEOMetadata {
  return {
    title: `Drainage Tips & Advice | ${BRAND.brandName} Blog`,
    description: `Expert drainage advice, tips, and guides from ${BRAND.brandName}. Learn how to prevent blocked drains and maintain your drainage system.`,
    canonicalUrl: "/blog",
  };
}
