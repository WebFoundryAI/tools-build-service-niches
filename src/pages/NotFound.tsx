import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Home, Phone } from "lucide-react";
import { BRAND } from "@/config/brand";

const NotFound = () => {
  return (
    <Layout>
      <section className="section-padding">
        <div className="container-narrow px-4 text-center">
          <h1 className="text-6xl md:text-8xl font-bold text-primary mb-4">404</h1>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Page Not Found</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Sorry, the page you're looking for doesn't exist or has been moved.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
        </div>
      </section>
    </Layout>
  );
};

export default NotFound;
