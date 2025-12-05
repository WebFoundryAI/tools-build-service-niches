import { useState } from "react";
import { Link } from "react-router-dom";
import { BRAND } from "@/config/brand";
import { Phone, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/locations", label: "Areas We Cover" },
    { href: "/about", label: "About" },
    { href: "/faq", label: "FAQ" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 border-b border-border">
      {/* Top bar with phone */}
      <div className="bg-primary text-primary-foreground">
        <div className="container-wide flex items-center justify-between py-2 px-4">
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4" />
            <a href={`tel:${BRAND.phone}`} className="font-medium hover:underline">
              {BRAND.phone}
            </a>
            {BRAND.emergencyAvailable && (
              <span className="ml-2 bg-accent text-accent-foreground px-2 py-0.5 rounded text-xs font-semibold">
                24/7 Emergency
              </span>
            )}
          </div>
          <span className="hidden sm:block text-sm">{BRAND.serviceAreaLabel}</span>
        </div>
      </div>

      {/* Main navigation */}
      <div className="container-wide px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            {BRAND.logoUrl ? (
              <img src={BRAND.logoUrl} alt={BRAND.brandName} className="h-10 w-auto" />
            ) : (
              <span className="text-xl font-bold text-primary">{BRAND.brandName}</span>
            )}
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-primary transition-colors rounded-md hover:bg-muted"
              >
                {link.label}
              </Link>
            ))}
            <Button asChild className="ml-4" variant="cta">
              <Link to="/contact">Get a Quote</Link>
            </Button>
          </nav>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <nav className="lg:hidden py-4 border-t border-border animate-fade-in">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="block px-4 py-3 text-foreground/80 hover:text-primary hover:bg-muted rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="px-4 pt-4">
              <Button asChild className="w-full" variant="cta">
                <Link to="/contact" onClick={() => setIsMenuOpen(false)}>Get a Quote</Link>
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
