export type BrandConfig = {
  brandName: string;
  domain: string;
  primaryLocation: string;
  serviceAreaLabel: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2?: string;
  postcode: string;
  companyNumber?: string;
  primaryColour: string;
  secondaryColour: string;
  accentColour: string;
  logoUrl?: string;
  tagline: string;
  emergencyAvailable: boolean;
};

export const BRAND: BrandConfig = {
  brandName: "Example Drain Heroes",
  domain: "exampledrainheroes.co.uk",
  primaryLocation: "Swindon",
  serviceAreaLabel: "Swindon and surrounding areas",
  phone: "01793 000000",
  email: "info@exampledrainheroes.co.uk",
  addressLine1: "Sample Road 1",
  addressLine2: "",
  postcode: "SN1 1AA",
  companyNumber: "",
  primaryColour: "#005BBB",
  secondaryColour: "#FFD500",
  accentColour: "#111827",
  logoUrl: "",
  tagline: "Fast, Reliable Drainage Solutions",
  emergencyAvailable: true,
};
