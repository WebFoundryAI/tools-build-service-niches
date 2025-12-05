import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { RefreshCw, Trash2, Plus, ArrowLeft } from "lucide-react";
import { BRAND } from "@/config/brand";

interface AIContent {
  id: string;
  key: string;
  content: string;
  created_at: string;
  updated_at: string;
}

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  created_at: string;
}

const ADMIN_TOKEN = "drain-admin-2024"; // Simple token for demo

const AdminContent = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const queryClient = useQueryClient();
  const [blogTopic, setBlogTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

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

  // Fetch AI content
  const { data: aiContent, isLoading: loadingAI } = useQuery({
    queryKey: ["admin-ai-content"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ai_content")
        .select("*")
        .order("updated_at", { ascending: false });

      if (error) throw error;
      return data as AIContent[];
    },
  });

  // Fetch blog posts
  const { data: blogPosts, isLoading: loadingBlog } = useQuery({
    queryKey: ["admin-blog-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id, slug, title, excerpt, created_at")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as BlogPost[];
    },
  });

  // Delete AI content mutation
  const deleteContentMutation = useMutation({
    mutationFn: async (key: string) => {
      const { error } = await supabase.from("ai_content").delete().eq("key", key);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-ai-content"] });
      toast.success("Content deleted. It will regenerate on next page visit.");
    },
    onError: (error) => {
      toast.error(`Failed to delete: ${error.message}`);
    },
  });

  // Delete blog post mutation
  const deleteBlogMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("blog_posts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
      toast.success("Blog post deleted.");
    },
    onError: (error) => {
      toast.error(`Failed to delete: ${error.message}`);
    },
  });

  // Generate blog post from topic
  const generateBlogPost = async () => {
    if (!blogTopic.trim()) {
      toast.error("Please enter a topic");
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-content", {
        body: {
          key: `blog:${Date.now()}`,
          prompt: `Write an informative blog post for a UK drain services company.

Topic: "${blogTopic}"
Brand: "${BRAND.brandName}"
Primary Location: "${BRAND.primaryLocation}"

Rules:
- Explain the topic in detail.
- Avoid sensational claims.
- Provide actionable UK-relevant advice.
- 700–1000 words.

Tone: helpful, knowledgeable, approachable.
Language: UK English.

Format the response as follows:
TITLE: [A compelling title]
EXCERPT: [A one-sentence summary]
CONTENT: [The full blog post content]`,
          provider: "lovable",
        },
      });

      if (error) throw error;

      const content = data?.content || "";

      // Parse the response
      const titleMatch = content.match(/TITLE:\s*(.+?)(?:\n|EXCERPT:)/s);
      const excerptMatch = content.match(/EXCERPT:\s*(.+?)(?:\n|CONTENT:)/s);
      const contentMatch = content.match(/CONTENT:\s*([\s\S]+)/);

      const title = titleMatch?.[1]?.trim() || blogTopic;
      const excerpt = excerptMatch?.[1]?.trim() || content.substring(0, 150);
      const blogContent = contentMatch?.[1]?.trim() || content;

      // Create slug from title
      const slug = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .substring(0, 50);

      // Insert into database
      const { error: insertError } = await supabase.from("blog_posts").insert({
        slug: `${slug}-${Date.now()}`,
        title,
        excerpt,
        content: blogContent,
      });

      if (insertError) throw insertError;

      queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
      setBlogTopic("");
      toast.success("Blog post generated and saved!");
    } catch (err: any) {
      toast.error(`Failed to generate: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container-wide px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to site
            </Link>
            <h1 className="text-3xl font-bold">Admin: Content Manager</h1>
          </div>
        </div>

        {/* Blog Post Generator */}
        <section className="mb-12 bg-card p-6 rounded-xl">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Generate Blog Post
          </h2>
          <div className="flex gap-4">
            <Input
              placeholder="Enter a blog topic (e.g., 'How to spot a collapsed drain')"
              value={blogTopic}
              onChange={(e) => setBlogTopic(e.target.value)}
              className="flex-1"
            />
            <Button onClick={generateBlogPost} disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate"
              )}
            </Button>
          </div>
        </section>

        {/* Blog Posts */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-4">Blog Posts ({blogPosts?.length || 0})</h2>
          {loadingBlog ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : blogPosts && blogPosts.length > 0 ? (
            <div className="space-y-2">
              {blogPosts.map((post) => (
                <div
                  key={post.id}
                  className="flex items-center justify-between p-4 bg-card rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{post.title}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {post.excerpt}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(post.created_at).toLocaleDateString("en-GB")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                    >
                      <Link to={`/blog/${post.slug}`}>View</Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteBlogMutation.mutate(post.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No blog posts yet.</p>
          )}
        </section>

        {/* AI Content Cache */}
        <section>
          <h2 className="text-xl font-bold mb-4">
            AI Content Cache ({aiContent?.length || 0})
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Delete cached content to force regeneration on next page visit.
          </p>
          {loadingAI ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : aiContent && aiContent.length > 0 ? (
            <div className="space-y-2">
              {aiContent.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 bg-card rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-sm truncate">{item.key}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Updated: {new Date(item.updated_at).toLocaleString("en-GB")}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteContentMutation.mutate(item.key)}
                    title="Delete to regenerate"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No cached content yet.</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default AdminContent;
