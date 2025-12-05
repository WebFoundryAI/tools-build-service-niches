import { Link } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AIContentPolicyPanel } from "@/components/admin/AIContentPolicyPanel";
import { QualityDashboard } from "@/components/admin/QualityDashboard";
import { FileText, Calendar, Settings, Download } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
  // Fetch AI content for quality dashboard
  const { data: aiContent } = useQuery({
    queryKey: ["admin-ai-content-summary"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ai_content")
        .select("key, content, human_reviewed");
      if (error) throw error;
      return data || [];
    },
  });

  // Fetch blog posts for quality dashboard
  const { data: blogPosts } = useQuery({
    queryKey: ["admin-blog-posts-summary"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("content, human_reviewed, indexable");
      if (error) throw error;
      return data || [];
    },
  });

  return (
    <AdminLayout title="Admin Dashboard" description="Manage your site settings and content">
      <AIContentPolicyPanel />
      
      {/* Quality Dashboard */}
      {(aiContent || blogPosts) && (
        <QualityDashboard
          aiContent={aiContent?.map((c) => ({ key: c.key, content: c.content, human_reviewed: c.human_reviewed })) || []}
          blogPosts={blogPosts?.map((p) => ({ content: p.content, human_reviewed: p.human_reviewed, indexable: p.indexable })) || []}
        />
      )}
      
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
