import { Link } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AIContentPolicyPanel } from "@/components/admin/AIContentPolicyPanel";
import { FileText, Calendar, Settings, Download } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const adminTools = [
  {
    title: "Content Cache",
    description: "Manage AI-generated content cache",
    href: "/admin/content",
    icon: FileText,
  },
  {
    title: "Blog Scheduler",
    description: "Generate and schedule blog posts",
    href: "/admin/blog-scheduler",
    icon: Calendar,
  },
  {
    title: "Rebrand Wizard",
    description: "Configure brand settings and locations",
    href: "/admin/rebrand",
    icon: Settings,
  },
  {
    title: "Export Snapshot",
    description: "Export configuration and data",
    href: "/admin/export",
    icon: Download,
  },
];

const Admin = () => {
  return (
    <AdminLayout title="Admin Dashboard" description="Manage your site settings and content">
      <AIContentPolicyPanel />
      
      <div className="grid md:grid-cols-2 gap-6">
        {adminTools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link key={tool.href} to={tool.href}>
              <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{tool.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>{tool.description}</CardDescription>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </AdminLayout>
  );
};

export default Admin;
