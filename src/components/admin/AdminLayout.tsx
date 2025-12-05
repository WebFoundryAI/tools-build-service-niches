import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  FileText, 
  Calendar, 
  Settings, 
  Download, 
  AlertTriangle,
  Home,
  LogOut,
  Loader2
} from "lucide-react";
import { useAuth, signOut } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { MAP_CONFIG } from "@/config/maps";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

const navItems = [
  { 
    href: "/admin/content", 
    label: "Content Manager", 
    icon: FileText,
    description: "Manage AI content cache"
  },
  { 
    href: "/admin/blog-scheduler", 
    label: "Blog Scheduler", 
    icon: Calendar,
    description: "Generate blog posts"
  },
  { 
    href: "/admin/rebrand", 
    label: "Rebrand Wizard", 
    icon: Settings,
    description: "Configure brand settings"
  },
  { 
    href: "/admin/export", 
    label: "Export Snapshot", 
    icon: Download,
    description: "Export configuration"
  },
];

export function AdminLayout({ children, title, description }: AdminLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading, isAdmin } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Sign out failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      navigate("/login");
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Unauthorised</h1>
          <p className="text-muted-foreground mb-4">
            Please sign in to access the admin area.
          </p>
          <Link to="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  // Logged in but not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Admins Only</h1>
          <p className="text-muted-foreground mb-4">
            Your account ({user.email}) does not have admin access.
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            Contact the site administrator to request access.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/" className="text-primary hover:underline">
              Return home
            </Link>
            <button 
              onClick={handleSignOut}
              className="text-primary hover:underline"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show placeholder maps warning
  const showMapWarning = MAP_CONFIG.provider === "placeholder";

  return (
    <div className="min-h-screen bg-background">
      {/* Warning Banner */}
      <div className="bg-destructive/10 border-b border-destructive/20 px-4 py-2">
        <div className="container-wide flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-destructive">
            <AlertTriangle className="h-4 w-4" />
            <span>Admin Area – Not for public access</span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-muted-foreground">{user.email}</span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleSignOut}
              className="h-auto p-1 text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-[calc(100vh-40px)] bg-card border-r">
          <div className="p-4">
            <Link 
              to="/" 
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
            >
              <Home className="h-4 w-4" />
              <span className="text-sm">Back to Site</span>
            </Link>
            
            <Link to="/admin">
              <h2 className="font-bold text-lg mb-4 hover:text-primary transition-colors">
                Admin Panel
              </h2>
            </Link>
            
            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.href;
                const Icon = item.icon;
                
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                      isActive 
                        ? "bg-primary text-primary-foreground" 
                        : "hover:bg-muted"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {showMapWarning && (
            <Alert className="mb-6 border-amber-500/50 bg-amber-500/10">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-700">
                <strong>Placeholder maps enabled.</strong> To use real Google maps, 
                update <code className="bg-muted px-1 rounded">src/config/maps.ts</code> to 
                set provider to "google-static" and add your Google Static Maps API key.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="mb-8">
            <h1 className="text-3xl font-bold">{title}</h1>
            {description && (
              <p className="text-muted-foreground mt-1">{description}</p>
            )}
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
