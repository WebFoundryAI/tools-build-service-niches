export type ServiceConfig = {
  slug: string;
  name: string;
  shortLabel: string;
  description: string;
  icon: string;
};

export const SERVICES: ServiceConfig[] = [
  {
    slug: "blocked-drains",
    name: "Blocked Drains",
    shortLabel: "Blocked drains cleared fast",
    description: "Professional drain unblocking service using the latest equipment. We clear all types of blockages quickly and efficiently.",
    icon: "🚿",
  },
  {
    slug: "drain-unblocking",
    name: "Drain Unblocking",
    shortLabel: "Sink and toilet unblocking",
    description: "Expert unblocking of sinks, toilets, baths, and shower drains. No call-out charges, fixed pricing.",
    icon: "🔧",
  },
  {
    slug: "cctv-drain-surveys",
    name: "CCTV Drain Surveys",
    shortLabel: "CCTV drain inspections",
    description: "High-definition CCTV surveys to diagnose drainage issues accurately. Detailed reports provided.",
    icon: "📹",
  },
  {
    slug: "drain-jetting",
    name: "Drain Jetting",
    shortLabel: "High-pressure jetting",
    description: "Powerful high-pressure water jetting to clear stubborn blockages and clean drains thoroughly.",
    icon: "💧",
  },
  {
    slug: "emergency-drain-services",
    name: "Emergency Drain Services",
    shortLabel: "24/7 emergency callouts",
    description: "Round-the-clock emergency drainage services. Fast response times when you need us most.",
    icon: "🚨",
  },
];

export function getServiceBySlug(slug: string): ServiceConfig | undefined {
  return SERVICES.find((service) => service.slug === slug);
}
