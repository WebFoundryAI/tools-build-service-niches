import { Phone } from "lucide-react";
import { BRAND } from "@/config/brand";

export function MobileCallBar() {
  if (!BRAND.showMobileCallBar) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-primary text-primary-foreground shadow-lg">
      <a
        href={`tel:${BRAND.phone}`}
        className="flex items-center justify-center gap-3 py-4 px-4 hover:bg-primary/90 transition-colors"
        aria-label={`Call ${BRAND.brandName} at ${BRAND.phone}`}
      >
        <Phone className="h-5 w-5 animate-pulse" />
        <span className="font-bold">Tap to Call – Fast Response</span>
      </a>
    </div>
  );
}
