import { Link } from "react-router-dom";
import { BRAND } from "@/config/brand";
import { SERVICES } from "@/config/services";
import { LOCATIONS } from "@/config/locations";
import { Phone, Mail, MapPin } from "lucide-react";
import { PopularLinks } from "@/components/sections/PopularLinks";

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="container-wide px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand column */}
          <div>
            <h3 className="text-xl font-bold mb-4">{BRAND.brandName}</h3>
            <p className="text-background/70 text-sm mb-4">{BRAND.tagline}</p>
            <div className="space-y-2 text-sm">
              <a
                href={`tel:${BRAND.phone}`}
                className="flex items-center gap-2 text-background/80 hover:text-accent transition-colors"
              >
                <Phone className="h-4 w-4" />
                {BRAND.phone}
              </a>
              <a
                href={`mailto:${BRAND.email}`}
                className="flex items-center gap-2 text-background/80 hover:text-accent transition-colors"
              >
                <Mail className="h-4 w-4" />
                {BRAND.email}
              </a>
              <div className="flex items-start gap-2 text-background/80">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                <span>
                  {BRAND.addressLine1}
                  {BRAND.addressLine2 && <>, {BRAND.addressLine2}</>}
                  <br />
                  {BRAND.postcode}
                </span>
              </div>
            </div>
          </div>

          {/* Services column */}
          <div>
            <h4 className="font-semibold mb-4">Our Services</h4>
            <ul className="space-y-2 text-sm">
              {SERVICES.map((service) => (
                <li key={service.slug}>
                  <Link
                    to={`/services/${service.slug}`}
                    className="text-background/70 hover:text-accent transition-colors"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Areas column */}
          <div>
            <h4 className="font-semibold mb-4">Areas We Cover</h4>
            <ul className="space-y-2 text-sm">
              {LOCATIONS.slice(0, 6).map((location) => (
                <li key={location.slug}>
                  <Link
                    to={`/location/${location.slug}`}
                    className="text-background/70 hover:text-accent transition-colors"
                  >
                    {location.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick links column */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/about"
                  className="text-background/70 hover:text-accent transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="text-background/70 hover:text-accent transition-colors"
                >
                  FAQs
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-background/70 hover:text-accent transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="text-background/70 hover:text-accent transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  to="/sitemap"
                  className="text-background/70 hover:text-accent transition-colors"
                >
                  Sitemap
                </Link>
              </li>
              <li>
                <Link
                  to="/admin"
                  className="text-background/70 hover:text-accent transition-colors"
                >
                  Admin
                </Link>
              </li>
            </ul>

            {/* Legal links */}
            <h4 className="font-semibold mb-3 mt-6">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/privacy"
                  className="text-background/70 hover:text-accent transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-background/70 hover:text-accent transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="/cookies"
                  className="text-background/70 hover:text-accent transition-colors"
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <PopularLinks />

        <div className="border-t border-background/20 mt-10 pt-6 text-center text-sm text-background/60">
          <p>
            © {new Date().getFullYear()} {BRAND.brandName}. All rights reserved.
            {BRAND.companyNumber && (
              <span className="block mt-1">
                Company No: {BRAND.companyNumber}
              </span>
            )}
          </p>
        </div>
      </div>
    </footer>
  );
}
