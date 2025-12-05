import { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { MobileCallBar } from "@/components/ui/MobileCallBar";
import { CookieBanner } from "@/components/ui/CookieBanner";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pb-16 lg:pb-0">{children}</main>
      <Footer />
      <MobileCallBar />
      <CookieBanner />
    </div>
  );
}
