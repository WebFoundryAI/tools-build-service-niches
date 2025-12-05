import { Link, useLocation, useSearchParams } from "react-router-dom";
import { 
  FileText, 
  Calendar, 
  Settings, 
  Download, 
  AlertTriangle,
  Home
} from "lucide-react";

const ADMIN_TOKEN = "drain-admin-2024";

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
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  // Check authorization
  if (token !== ADMIN_TOKEN) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Unauthorised</h1>
          <p className="text-muted-foreground mb-4">
            Access denied. Please provide a valid admin token.
          </p>
          <Link to="/" className="text-primary hover:underline">
            Return home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Warning Banner */}
      <div className="bg-destructive/10 border-b border-destructive/20 px-4 py-2">
        <div className="container-wide flex items-center gap-2 text-sm text-destructive">
          <AlertTriangle className="h-4 w-4" />
          <span>Admin Area – Not for public access</span>
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
            
            <h2 className="font-bold text-lg mb-4">Admin Panel</h2>
            
            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.href;
                const Icon = item.icon;
                
                return (
                  <Link
                    key={item.href}
                    to={`${item.href}?token=${token}`}
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

export { ADMIN_TOKEN };
