import { CheckCircle2 } from "lucide-react";
import { GUARANTEES } from "@/config/trust";
import { BRAND } from "@/config/brand";

export function GuaranteesSection() {
  return (
    <section className="section-padding bg-muted/30">
      <div className="container-wide px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            Our Guarantees
          </h2>
          <p className="text-muted-foreground">
            Why choose {BRAND.brandName} for your drainage needs
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {GUARANTEES.map((guarantee, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-4 bg-card rounded-lg"
            >
              <CheckCircle2 className="h-6 w-6 text-trust shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold mb-1">{guarantee.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {guarantee.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
