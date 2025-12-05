import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Home, Phone, Search, MapPin, Wrench } from "lucide-react";
import { BRAND } from "@/config/brand";
import { SERVICES } from "@/config/services";
import { LOCATIONS } from "@/config/locations";

const NotFound = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Redirect to services page as a simple search
      navigate(`/services?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <Layout>
      <section className="section-padding">
        <div className="container-narrow px-4 text-center">
          <h1 className="text-6xl md:text-8xl font-bold text-primary mb-4">
            404
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Page Not Found</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Sorry, the page you are looking for does not exist or has been moved.
            Let us help you find what you need.
          </p>

          {/* Search Box */}
          <form onSubmit={handleSearch} className="max-w-md mx-auto mb-8">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Search for a service..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button type="submit">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </form>

          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button asChild size="lg">
              <Link to="/">
                <Home className="h-4 w-4" />
                Return Home
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href={`tel:${BRAND.phone}`}>
                <Phone className="h-4 w-4" />
                Call Us
              </a>
            </Button>
          </div>

          {/* Quick Links */}
          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto text-left">
            {/* Services */}
            <div>
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Wrench className="h-5 w-5 text-primary" />
                Our Services
              </h3>
              <ul className="space-y-2">
                {SERVICES.slice(0, 4).map((service) => (
                  <li key={service.slug}>
                    <Link
                      to={`/services/${service.slug}`}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {service.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    to="/services"
                    className="text-primary font-medium hover:underline"
                  >
                    View all services →
                  </Link>
                </li>
              </ul>
            </div>

            {/* Locations */}
            <div>
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Areas We Cover
              </h3>
              <ul className="space-y-2">
                {LOCATIONS.slice(0, 4).map((location) => (
                  <li key={location.slug}>
                    <Link
                      to={`/location/${location.slug}`}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {location.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    to="/locations"
                    className="text-primary font-medium hover:underline"
                  >
                    View all areas →
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default NotFound;
