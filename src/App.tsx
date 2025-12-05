import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import SubServiceDetail from "./pages/SubServiceDetail";
import Locations from "./pages/Locations";
import LocationDetail from "./pages/LocationDetail";
import LocationServiceDetail from "./pages/LocationServiceDetail";
import LocationSubServiceDetail from "./pages/LocationSubServiceDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Sitemap from "./pages/Sitemap";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Cookies from "./pages/Cookies";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import AdminContent from "./pages/AdminContent";
import AdminBlogScheduler from "./pages/AdminBlogScheduler";
import AdminRebrand from "./pages/AdminRebrand";
import AdminExport from "./pages/AdminExport";
import NotFound from "./pages/NotFound";
import { ScrollToTop } from "./components/ScrollToTop";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:serviceSlug" element={<ServiceDetail />} />
          <Route path="/services/:serviceSlug/:subServiceSlug" element={<SubServiceDetail />} />
          <Route path="/locations" element={<Locations />} />
          <Route path="/location/:locationSlug" element={<LocationDetail />} />
          <Route path="/location/:locationSlug/:serviceSlug" element={<LocationServiceDetail />} />
          <Route path="/location/:locationSlug/:serviceSlug/:subServiceSlug" element={<LocationSubServiceDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/sitemap" element={<Sitemap />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/cookies" element={<Cookies />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/content" element={<AdminContent />} />
          <Route path="/admin/blog-scheduler" element={<AdminBlogScheduler />} />
          <Route path="/admin/rebrand" element={<AdminRebrand />} />
          <Route path="/admin/export" element={<AdminExport />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
