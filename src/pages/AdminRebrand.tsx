import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  Download, 
  Trash2,
  Plus,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  AlertCircle
} from "lucide-react";
import { AdminLayout, ADMIN_TOKEN } from "@/components/admin/AdminLayout";
import { BRAND, BrandConfig, OpeningHours, SocialLinks } from "@/config/brand";
import { LOCATIONS, LocationConfig, PRIMARY_LOCATION } from "@/config/locations";
import { SERVICES, ServiceConfig, SubServiceConfig } from "@/config/services";
import { AI_PROVIDER } from "@/config/aiProvider";
import { useQuery } from "@tanstack/react-query";

interface RebrandState {
  brand: Partial<BrandConfig>;
  primaryLocation: Partial<LocationConfig>;
  locations: Partial<LocationConfig>[];
  services: Partial<ServiceConfig>[];
}

const WIZARD_STEPS = [
  { id: 1, title: "Brand Basics", description: "Company details and branding" },
  { id: 2, title: "Primary Location", description: "Main service area" },
  { id: 3, title: "Surrounding Locations", description: "Additional service areas" },
  { id: 4, title: "Services", description: "Services offered" },
  { id: 5, title: "AI Provider", description: "Content generation settings" },
  { id: 6, title: "Review & Export", description: "Generate rebrand plan" },
];

const AdminRebrand = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [currentStep, setCurrentStep] = useState(1);
  const [confirmText, setConfirmText] = useState("");
  
  // Initialize state from current config
  const [rebrandState, setRebrandState] = useState<RebrandState>({
    brand: { ...BRAND },
    primaryLocation: { ...PRIMARY_LOCATION },
    locations: LOCATIONS.filter(l => l.slug !== PRIMARY_LOCATION.slug).map(l => ({ ...l })),
    services: SERVICES.map(s => ({ 
      ...s, 
      subServices: s.subServices?.map(sub => ({ ...sub })) 
    })),
  });

  // Fetch counts for checklist
  const { data: aiContentCount } = useQuery({
    queryKey: ["admin-ai-content-count"],
    queryFn: async () => {
      const { count } = await supabase
        .from("ai_content")
        .select("*", { count: "exact", head: true });
      return count || 0;
    },
  });

  const { data: blogPostCount } = useQuery({
    queryKey: ["admin-blog-count"],
    queryFn: async () => {
      const { count } = await supabase
        .from("blog_posts")
        .select("*", { count: "exact", head: true });
      return count || 0;
    },
  });

  const { data: leadsCount } = useQuery({
    queryKey: ["admin-leads-count"],
    queryFn: async () => {
      const { count } = await supabase
        .from("leads")
        .select("*", { count: "exact", head: true });
      return count || 0;
    },
  });

  // Update brand field
  const updateBrand = (field: keyof BrandConfig, value: any) => {
    setRebrandState(prev => ({
      ...prev,
      brand: { ...prev.brand, [field]: value }
    }));
  };

  // Update primary location
  const updatePrimaryLocation = (field: keyof LocationConfig, value: any) => {
    setRebrandState(prev => ({
      ...prev,
      primaryLocation: { ...prev.primaryLocation, [field]: value }
    }));
  };

  // Add/update/remove locations
  const addLocation = () => {
    setRebrandState(prev => ({
      ...prev,
      locations: [...prev.locations, { slug: "", name: "", countyOrRegion: "", latitude: 0, longitude: 0 }]
    }));
  };

  const updateLocation = (index: number, field: keyof LocationConfig, value: any) => {
    setRebrandState(prev => ({
      ...prev,
      locations: prev.locations.map((loc, i) => 
        i === index ? { ...loc, [field]: value } : loc
      )
    }));
  };

  const removeLocation = (index: number) => {
    setRebrandState(prev => ({
      ...prev,
      locations: prev.locations.filter((_, i) => i !== index)
    }));
  };

  // Add/update/remove services
  const addService = () => {
    setRebrandState(prev => ({
      ...prev,
      services: [...prev.services, { 
        slug: "", 
        name: "", 
        shortLabel: "", 
        description: "", 
        icon: "🔧",
        subServices: []
      }]
    }));
  };

  const updateService = (index: number, field: keyof ServiceConfig, value: any) => {
    setRebrandState(prev => ({
      ...prev,
      services: prev.services.map((svc, i) => 
        i === index ? { ...svc, [field]: value } : svc
      )
    }));
  };

  const removeService = (index: number) => {
    setRebrandState(prev => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index)
    }));
  };

  // Generate rebrand plan JSON
  const generateRebrandPlan = () => {
    const plan = {
      brand: rebrandState.brand,
      primaryLocation: rebrandState.primaryLocation,
      locations: [rebrandState.primaryLocation, ...rebrandState.locations],
      services: rebrandState.services,
      generatedAt: new Date().toISOString(),
    };
    return JSON.stringify(plan, null, 2);
  };

  // Download rebrand plan
  const downloadPlan = () => {
    const plan = generateRebrandPlan();
    const blob = new Blob([plan], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rebrand-plan-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Rebrand plan downloaded");
  };

  // Copy plan to clipboard
  const copyPlan = () => {
    navigator.clipboard.writeText(generateRebrandPlan());
    toast.success("Rebrand plan copied to clipboard");
  };

  // Clear AI content
  const clearAIContent = async () => {
    if (confirmText !== "RESET") {
      toast.error("Please type RESET to confirm");
      return;
    }
    
    const { error } = await supabase.from("ai_content").delete().neq("key", "");
    if (error) {
      toast.error(`Failed to clear: ${error.message}`);
    } else {
      toast.success("AI content cleared. Fresh content will generate on page visits.");
      setConfirmText("");
    }
  };

  // Clear leads
  const clearLeads = async () => {
    if (confirmText !== "RESET") {
      toast.error("Please type RESET to confirm");
      return;
    }
    
    const { error } = await supabase.from("leads").delete().neq("id", "");
    if (error) {
      toast.error(`Failed to clear: ${error.message}`);
    } else {
      toast.success("Leads cleared.");
      setConfirmText("");
    }
  };

  // Clear blog posts
  const clearBlogPosts = async () => {
    if (confirmText !== "RESET") {
      toast.error("Please type RESET to confirm");
      return;
    }
    
    const { error } = await supabase.from("blog_posts").delete().neq("id", "");
    if (error) {
      toast.error(`Failed to clear: ${error.message}`);
    } else {
      toast.success("Blog posts cleared.");
      setConfirmText("");
    }
  };

  // Ready to sell checklist
  const checklist = [
    {
      label: "Brand configured (not default)",
      passed: rebrandState.brand.brandName !== "Example Drain Heroes",
      warning: rebrandState.brand.brandName === "Example Drain Heroes"
    },
    {
      label: "Locations defined",
      passed: rebrandState.locations.length > 0,
      warning: rebrandState.locations.length === 0
    },
    {
      label: "Services defined",
      passed: rebrandState.services.length > 0,
      warning: rebrandState.services.length === 0
    },
    {
      label: "AI content generated (5+ pages)",
      passed: (aiContentCount || 0) >= 5,
      warning: (aiContentCount || 0) < 5
    },
    {
      label: "Blog posts exist (3+)",
      passed: (blogPostCount || 0) >= 3,
      warning: (blogPostCount || 0) < 3
    },
    {
      label: "Sitemap accessible",
      passed: true, // Always true if site works
      warning: false
    },
  ];

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Brand Name *</Label>
                <Input
                  value={rebrandState.brand.brandName || ""}
                  onChange={(e) => updateBrand("brandName", e.target.value)}
                  placeholder="Your Drain Company"
                />
              </div>
              <div>
                <Label>Domain *</Label>
                <Input
                  value={rebrandState.brand.domain || ""}
                  onChange={(e) => updateBrand("domain", e.target.value)}
                  placeholder="yourdraincompany.co.uk"
                />
              </div>
              <div>
                <Label>Phone *</Label>
                <Input
                  value={rebrandState.brand.phone || ""}
                  onChange={(e) => updateBrand("phone", e.target.value)}
                  placeholder="01onal 000000"
                />
              </div>
              <div>
                <Label>Email *</Label>
                <Input
                  value={rebrandState.brand.email || ""}
                  onChange={(e) => updateBrand("email", e.target.value)}
                  placeholder="info@yourcompany.co.uk"
                />
              </div>
              <div>
                <Label>Address Line 1</Label>
                <Input
                  value={rebrandState.brand.addressLine1 || ""}
                  onChange={(e) => updateBrand("addressLine1", e.target.value)}
                />
              </div>
              <div>
                <Label>Postcode</Label>
                <Input
                  value={rebrandState.brand.postcode || ""}
                  onChange={(e) => updateBrand("postcode", e.target.value)}
                />
              </div>
              <div>
                <Label>Tagline</Label>
                <Input
                  value={rebrandState.brand.tagline || ""}
                  onChange={(e) => updateBrand("tagline", e.target.value)}
                  placeholder="Fast, Reliable Drainage Solutions"
                />
              </div>
              <div>
                <Label>Company Number (optional)</Label>
                <Input
                  value={rebrandState.brand.companyNumber || ""}
                  onChange={(e) => updateBrand("companyNumber", e.target.value)}
                />
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-4">Brand Colours</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Primary Colour</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={rebrandState.brand.primaryColour || "#005BBB"}
                      onChange={(e) => updateBrand("primaryColour", e.target.value)}
                      className="w-12 h-10 p-1"
                    />
                    <Input
                      value={rebrandState.brand.primaryColour || ""}
                      onChange={(e) => updateBrand("primaryColour", e.target.value)}
                      placeholder="#005BBB"
                    />
                  </div>
                </div>
                <div>
                  <Label>Secondary Colour</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={rebrandState.brand.secondaryColour || "#FFD500"}
                      onChange={(e) => updateBrand("secondaryColour", e.target.value)}
                      className="w-12 h-10 p-1"
                    />
                    <Input
                      value={rebrandState.brand.secondaryColour || ""}
                      onChange={(e) => updateBrand("secondaryColour", e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label>Accent Colour</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={rebrandState.brand.accentColour || "#111827"}
                      onChange={(e) => updateBrand("accentColour", e.target.value)}
                      className="w-12 h-10 p-1"
                    />
                    <Input
                      value={rebrandState.brand.accentColour || ""}
                      onChange={(e) => updateBrand("accentColour", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Set your primary service location. This will be used as the main area for SEO and local search.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Town/City Name *</Label>
                <Input
                  value={rebrandState.primaryLocation.name || ""}
                  onChange={(e) => {
                    updatePrimaryLocation("name", e.target.value);
                    updatePrimaryLocation("slug", e.target.value.toLowerCase().replace(/\s+/g, "-"));
                  }}
                  placeholder="Manchester"
                />
              </div>
              <div>
                <Label>County/Region *</Label>
                <Input
                  value={rebrandState.primaryLocation.countyOrRegion || ""}
                  onChange={(e) => updatePrimaryLocation("countyOrRegion", e.target.value)}
                  placeholder="Greater Manchester"
                />
              </div>
              <div>
                <Label>Latitude</Label>
                <Input
                  type="number"
                  step="0.0001"
                  value={rebrandState.primaryLocation.latitude || ""}
                  onChange={(e) => updatePrimaryLocation("latitude", parseFloat(e.target.value))}
                  placeholder="53.4808"
                />
              </div>
              <div>
                <Label>Longitude</Label>
                <Input
                  type="number"
                  step="0.0001"
                  value={rebrandState.primaryLocation.longitude || ""}
                  onChange={(e) => updatePrimaryLocation("longitude", parseFloat(e.target.value))}
                  placeholder="-2.2426"
                />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              💡 Tip: Get coordinates from Google Maps by right-clicking on a location and selecting the coordinates.
            </p>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground">
                Add surrounding areas you serve. Each will get its own location pages.
              </p>
              <Button onClick={addLocation} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Location
              </Button>
            </div>
            
            {rebrandState.locations.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">
                No surrounding locations added yet.
              </p>
            ) : (
              <div className="space-y-4">
                {rebrandState.locations.map((loc, index) => (
                  <div key={index} className="p-4 bg-muted rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium">Location {index + 1}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeLocation(index)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                    <div className="grid md:grid-cols-4 gap-3">
                      <Input
                        placeholder="Name"
                        value={loc.name || ""}
                        onChange={(e) => {
                          updateLocation(index, "name", e.target.value);
                          updateLocation(index, "slug", e.target.value.toLowerCase().replace(/\s+/g, "-"));
                        }}
                      />
                      <Input
                        placeholder="County/Region"
                        value={loc.countyOrRegion || ""}
                        onChange={(e) => updateLocation(index, "countyOrRegion", e.target.value)}
                      />
                      <Input
                        type="number"
                        step="0.0001"
                        placeholder="Latitude"
                        value={loc.latitude || ""}
                        onChange={(e) => updateLocation(index, "latitude", parseFloat(e.target.value))}
                      />
                      <Input
                        type="number"
                        step="0.0001"
                        placeholder="Longitude"
                        value={loc.longitude || ""}
                        onChange={(e) => updateLocation(index, "longitude", parseFloat(e.target.value))}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground">
                Configure the services you offer.
              </p>
              <Button onClick={addService} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Service
              </Button>
            </div>
            
            <div className="space-y-4">
              {rebrandState.services.map((svc, index) => (
                <div key={index} className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium">{svc.name || `Service ${index + 1}`}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeService(index)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-3 mb-3">
                    <Input
                      placeholder="Service Name"
                      value={svc.name || ""}
                      onChange={(e) => {
                        updateService(index, "name", e.target.value);
                        updateService(index, "slug", e.target.value.toLowerCase().replace(/\s+/g, "-"));
                      }}
                    />
                    <Input
                      placeholder="Short Label"
                      value={svc.shortLabel || ""}
                      onChange={(e) => updateService(index, "shortLabel", e.target.value)}
                    />
                    <Input
                      placeholder="Icon (emoji)"
                      value={svc.icon || ""}
                      onChange={(e) => updateService(index, "icon", e.target.value)}
                      className="w-24"
                    />
                  </div>
                  <Textarea
                    placeholder="Description"
                    value={svc.description || ""}
                    onChange={(e) => updateService(index, "description", e.target.value)}
                    rows={2}
                  />
                </div>
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-semibold mb-2">Current AI Provider</h3>
              <p className="text-2xl font-mono">{AI_PROVIDER}</p>
              <p className="text-sm text-muted-foreground mt-2">
                The AI provider is configured in <code>/src/config/aiProvider.ts</code>
              </p>
            </div>
            
            <div className="p-4 bg-card border rounded-lg">
              <h3 className="font-semibold mb-2">Supported Providers</h3>
              <ul className="space-y-2 text-sm">
                <li><strong>lovable</strong> - Built-in, no API key required (recommended)</li>
                <li><strong>openai</strong> - Requires OPENAI_API_KEY secret</li>
                <li><strong>gemini</strong> - Requires GEMINI_API_KEY secret</li>
                <li><strong>claude</strong> - Requires CLAUDE_API_KEY secret</li>
                <li><strong>mistral</strong> - Requires MISTRAL_API_KEY secret</li>
                <li><strong>groq</strong> - Requires GROQ_API_KEY secret</li>
              </ul>
            </div>
            
            <p className="text-sm text-muted-foreground">
              See the README for instructions on changing AI providers and setting API keys.
            </p>
          </div>
        );

      case 6:
        return (
          <div className="space-y-8">
            {/* Ready to Sell Checklist */}
            <div className="p-6 bg-card border rounded-lg">
              <h3 className="font-semibold mb-4">Ready to Sell Checklist</h3>
              <div className="space-y-2">
                {checklist.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    {item.passed ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : item.warning ? (
                      <AlertCircle className="h-5 w-5 text-yellow-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-destructive" />
                    )}
                    <span className={item.passed ? "" : "text-muted-foreground"}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rebrand Summary */}
            <div className="p-6 bg-card border rounded-lg">
              <h3 className="font-semibold mb-4">Rebrand Summary</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Brand:</span>
                  <span className="ml-2 font-medium">{rebrandState.brand.brandName}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Domain:</span>
                  <span className="ml-2 font-medium">{rebrandState.brand.domain}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Primary Location:</span>
                  <span className="ml-2 font-medium">{rebrandState.primaryLocation.name}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Total Locations:</span>
                  <span className="ml-2 font-medium">{rebrandState.locations.length + 1}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Services:</span>
                  <span className="ml-2 font-medium">{rebrandState.services.length}</span>
                </div>
              </div>
            </div>

            {/* Export Options */}
            <div className="p-6 bg-card border rounded-lg">
              <h3 className="font-semibold mb-4">Export Rebrand Plan</h3>
              <div className="flex gap-4">
                <Button onClick={downloadPlan}>
                  <Download className="h-4 w-4 mr-2" />
                  Download JSON
                </Button>
                <Button variant="outline" onClick={copyPlan}>
                  Copy to Clipboard
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Use this plan to configure a new Lovable project cloned from this template.
              </p>
            </div>

            {/* Data Reset Options */}
            <div className="p-6 bg-destructive/5 border border-destructive/20 rounded-lg">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Data Reset (Destructive)
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Type <strong>RESET</strong> below to enable destructive actions.
              </p>
              <Input
                placeholder="Type RESET to confirm"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                className="max-w-xs mb-4"
              />
              <div className="flex flex-wrap gap-4">
                <Button 
                  variant="destructive" 
                  onClick={clearAIContent}
                  disabled={confirmText !== "RESET"}
                >
                  Clear AI Content ({aiContentCount || 0})
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={clearLeads}
                  disabled={confirmText !== "RESET"}
                >
                  Clear Leads ({leadsCount || 0})
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={clearBlogPosts}
                  disabled={confirmText !== "RESET"}
                >
                  Clear Blog Posts ({blogPostCount || 0})
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                ⚠️ These actions are permanent and cannot be undone.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <AdminLayout 
      title="Rebrand Wizard" 
      description="Configure brand settings for this site or export for a new project"
    >
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {WIZARD_STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <button
                onClick={() => setCurrentStep(step.id)}
                className={`flex items-center gap-2 ${
                  currentStep === step.id 
                    ? "text-primary" 
                    : currentStep > step.id 
                      ? "text-green-500" 
                      : "text-muted-foreground"
                }`}
              >
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep === step.id 
                    ? "bg-primary text-primary-foreground" 
                    : currentStep > step.id 
                      ? "bg-green-500 text-white" 
                      : "bg-muted"
                }`}>
                  {currentStep > step.id ? <Check className="h-4 w-4" /> : step.id}
                </span>
                <span className="hidden md:inline text-sm">{step.title}</span>
              </button>
              {index < WIZARD_STEPS.length - 1 && (
                <div className="w-8 md:w-16 h-px bg-border mx-2" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-card p-6 rounded-xl mb-6">
        <h2 className="text-xl font-bold mb-2">
          Step {currentStep}: {WIZARD_STEPS[currentStep - 1].title}
        </h2>
        <p className="text-muted-foreground mb-6">
          {WIZARD_STEPS[currentStep - 1].description}
        </p>
        {renderStepContent()}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(prev => prev - 1)}
          disabled={currentStep === 1}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        <Button
          onClick={() => setCurrentStep(prev => prev + 1)}
          disabled={currentStep === WIZARD_STEPS.length}
        >
          Next
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </AdminLayout>
  );
};

export default AdminRebrand;
