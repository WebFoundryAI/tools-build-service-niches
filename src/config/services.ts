export type SubServiceConfig = {
  slug: string;
  name: string;
  shortLabel?: string;
  description: string;
};

export type ServiceConfig = {
  slug: string;
  name: string;
  shortLabel: string;
  description: string;
  icon: string;
  subServices?: SubServiceConfig[];
  semanticTags?: {
    problemType?: string[];
    serviceType?: string[];
    propertyType?: string[];
    riskFactors?: string[];
  };
};

export const SERVICES: ServiceConfig[] = [
  {
    slug: "blocked-drains",
    name: "Blocked Drains",
    shortLabel: "Blocked drains cleared fast",
    description: "Professional drain unblocking service using the latest equipment. We clear all types of blockages quickly and efficiently.",
    icon: "🚿",
    subServices: [
      {
        slug: "blocked-toilet",
        name: "Blocked Toilet",
        shortLabel: "Toilet unblocking",
        description: "Fast and effective toilet unblocking service for domestic and commercial properties.",
      },
      {
        slug: "blocked-sink",
        name: "Blocked Sink",
        shortLabel: "Sink unblocking",
        description: "Professional sink unblocking for kitchen and bathroom sinks.",
      },
      {
        slug: "blocked-bath",
        name: "Blocked Bath & Shower",
        shortLabel: "Bath and shower unblocking",
        description: "Clear blockages in baths, showers, and wet rooms.",
      },
    ],
    semanticTags: {
      problemType: ["blockage", "slow drainage", "standing water"],
      serviceType: ["emergency", "repair", "maintenance"],
      propertyType: ["residential", "commercial", "industrial"],
      riskFactors: ["flooding", "water damage", "hygiene"],
    },
  },
  {
    slug: "drain-unblocking",
    name: "Drain Unblocking",
    shortLabel: "Sink and toilet unblocking",
    description: "Expert unblocking of sinks, toilets, baths, and shower drains. No call-out charges, fixed pricing.",
    icon: "🔧",
    subServices: [
      {
        slug: "external-drain-unblocking",
        name: "External Drain Unblocking",
        shortLabel: "Outside drain clearing",
        description: "Clear blockages in external drains, gullies, and manholes.",
      },
      {
        slug: "internal-drain-unblocking",
        name: "Internal Drain Unblocking",
        shortLabel: "Inside drain clearing",
        description: "Unblock internal drains throughout your property.",
      },
    ],
    semanticTags: {
      problemType: ["blockage", "overflow", "backup"],
      serviceType: ["repair", "emergency"],
      propertyType: ["residential", "commercial"],
      riskFactors: ["water damage", "smell", "hygiene"],
    },
  },
  {
    slug: "cctv-drain-surveys",
    name: "CCTV Drain Surveys",
    shortLabel: "CCTV drain inspections",
    description: "High-definition CCTV surveys to diagnose drainage issues accurately. Detailed reports provided.",
    icon: "📹",
    subServices: [
      {
        slug: "pre-purchase-survey",
        name: "Pre-Purchase Drain Survey",
        shortLabel: "Homebuyer drain survey",
        description: "Comprehensive drain survey before buying a property.",
      },
      {
        slug: "drainage-investigation",
        name: "Drainage Investigation",
        shortLabel: "Problem diagnosis",
        description: "Detailed investigation to identify the cause of drainage problems.",
      },
    ],
    semanticTags: {
      problemType: ["investigation", "diagnosis", "inspection"],
      serviceType: ["survey", "assessment"],
      propertyType: ["residential", "commercial"],
      riskFactors: ["structural damage", "root ingress", "collapse"],
    },
  },
  {
    slug: "drain-jetting",
    name: "Drain Jetting",
    shortLabel: "High-pressure jetting",
    description: "Powerful high-pressure water jetting to clear stubborn blockages and clean drains thoroughly.",
    icon: "💧",
    subServices: [
      {
        slug: "domestic-jetting",
        name: "Domestic Drain Jetting",
        shortLabel: "Home drain jetting",
        description: "High-pressure jetting for residential properties.",
      },
      {
        slug: "commercial-jetting",
        name: "Commercial Drain Jetting",
        shortLabel: "Business drain jetting",
        description: "Industrial-strength jetting for commercial properties.",
      },
    ],
    semanticTags: {
      problemType: ["blockage", "buildup", "fat grease"],
      serviceType: ["cleaning", "maintenance", "repair"],
      propertyType: ["residential", "commercial", "industrial"],
      riskFactors: ["recurrent blockages", "hygiene"],
    },
  },
  {
    slug: "emergency-drain-services",
    name: "Emergency Drain Services",
    shortLabel: "24/7 emergency callouts",
    description: "Round-the-clock emergency drainage services. Fast response times when you need us most.",
    icon: "🚨",
    subServices: [
      {
        slug: "flooding-emergency",
        name: "Flooding Emergency",
        shortLabel: "Flood response",
        description: "Immediate response to flooding and water damage emergencies.",
      },
      {
        slug: "sewage-emergency",
        name: "Sewage Emergency",
        shortLabel: "Sewage backup",
        description: "Urgent response to sewage backups and overflows.",
      },
    ],
    semanticTags: {
      problemType: ["emergency", "urgent", "flooding"],
      serviceType: ["emergency", "urgent response"],
      propertyType: ["residential", "commercial"],
      riskFactors: ["health hazard", "property damage", "contamination"],
    },
  },
];

export function getServiceBySlug(slug: string): ServiceConfig | undefined {
  return SERVICES.find((service) => service.slug === slug);
}

export function getSubServiceBySlug(
  serviceSlug: string,
  subServiceSlug: string
): SubServiceConfig | undefined {
  const service = getServiceBySlug(serviceSlug);
  return service?.subServices?.find((sub) => sub.slug === subServiceSlug);
}

export function getAllSubServices(): Array<{
  service: ServiceConfig;
  subService: SubServiceConfig;
}> {
  const result: Array<{ service: ServiceConfig; subService: SubServiceConfig }> = [];
  
  for (const service of SERVICES) {
    if (service.subServices) {
      for (const subService of service.subServices) {
        result.push({ service, subService });
      }
    }
  }
  
  return result;
}
