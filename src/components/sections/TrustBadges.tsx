import { Shield, Clock, Award, CheckCircle2 } from "lucide-react";
import { TRUST_BADGES } from "@/config/trust";

const iconMap: Record<string, React.ReactNode> = {
  clock: <Clock className="h-8 w-8" />,
  shield: <Shield className="h-8 w-8" />,
  award: <Award className="h-8 w-8" />,
  check: <CheckCircle2 className="h-8 w-8" />,
};

export function TrustBadges() {
  return (
    <section className="py-8 bg-muted/50">
      <div className="container-wide px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {TRUST_BADGES.map((badge, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-4"
            >
              <div className="text-primary mb-2">
                {iconMap[badge.icon] || <CheckCircle2 className="h-8 w-8" />}
              </div>
              <h3 className="font-bold text-sm">{badge.label}</h3>
              <p className="text-xs text-muted-foreground mt-1">
                {badge.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
