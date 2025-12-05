import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { RefreshCw, Trash2, Plus, CheckCircle, AlertCircle, Eye, EyeOff } from "lucide-react";
import { BRAND } from "@/config/brand";
import { AI_PROVIDER } from "@/config/aiProvider";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AIContentPolicyPanel } from "@/components/admin/AIContentPolicyPanel";
import { QualityChecklistModal } from "@/components/admin/QualityChecklistModal";
import { useAuth } from "@/hooks/useAuth";

interface AIContent {
  id: string;
  key: string;
  content: string;
  created_at: string;
  updated_at: string;
  how_created: string | null;
  why_created: string | null;
  human_reviewed: boolean | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
}

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  created_at: string;
  how_created: string | null;
  why_created: string | null;
  human_reviewed: boolean | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  indexable: boolean | null;
}

const THIN_CONTENT_THRESHOLD = 300; // characters

const AdminContent = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [blogTopic, setBlogTopic] = useState("");
  const [blogWhyCreated, setBlogWhyCreated] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showChecklist, setShowChecklist] = useState(false);
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  const [editingAIContentId, setEditingAIContentId] = useState<string | null>(null);

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
        .select("*")
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

  // Update blog post mutation
  const updateBlogMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<BlogPost> }) => {
      const { error } = await supabase.from("blog_posts").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
      toast.success("Blog post updated.");
    },
    onError: (error) => {
      toast.error(`Failed to update: ${error.message}`);
    },
  });

  // Update AI content mutation
  const updateAIContentMutation = useMutation({
    mutationFn: async ({ key, updates }: { key: string; updates: Partial<AIContent> }) => {
      const { error } = await supabase.from("ai_content").update(updates).eq("key", key);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-ai-content"] });
      toast.success("Content updated.");
    },
    onError: (error) => {
      toast.error(`Failed to update: ${error.message}`);
    },
  });

  const markAsReviewed = (type: "blog" | "ai", id: string) => {
    const updates = {
      human_reviewed: true,
      reviewed_by: user?.email || "admin",
      reviewed_at: new Date().toISOString(),
    };

    if (type === "blog") {
      updateBlogMutation.mutate({ id, updates });
    } else {
      updateAIContentMutation.mutate({ key: id, updates });
    }
  };

  const toggleIndexable = (id: string, currentValue: boolean | null) => {
    updateBlogMutation.mutate({ id, updates: { indexable: !currentValue } });
  };

  const handleGenerateClick = () => {
    if (!blogTopic.trim()) {
      toast.error("Please enter a topic");
      return;
    }
    setShowChecklist(true);
  };

  // Generate blog post from topic
  const generateBlogPost = async () => {
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
          provider: AI_PROVIDER,
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

      // Insert into database with metadata
      const { error: insertError } = await supabase.from("blog_posts").insert({
        slug: `${slug}-${Date.now()}`,
        title,
        excerpt,
        content: blogContent,
        how_created: "AI-assisted",
        why_created: blogWhyCreated || `Blog post about: ${blogTopic}`,
        human_reviewed: false,
        indexable: false, // Default to non-indexable
      });

      if (insertError) throw insertError;

      queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
      setBlogTopic("");
      setBlogWhyCreated("");
      toast.success("Blog post generated! Remember to review before enabling indexing.");
    } catch (err: any) {
      toast.error(`Failed to generate: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const isThinContent = (content: string) => content.length < THIN_CONTENT_THRESHOLD;
  const unreviewedCount = (blogPosts?.filter((p) => !p.human_reviewed).length || 0) +
    (aiContent?.filter((c) => !c.human_reviewed).length || 0);

  return (
    <AdminLayout title="Content Manager" description="Manage AI content cache and blog posts">
      <AIContentPolicyPanel />

      {unreviewedCount > 0 && (
        <div className="mb-6 p-4 bg-amber-100 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700 rounded-lg flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-amber-600" />
          <p className="text-amber-800 dark:text-amber-200">
            <strong>{unreviewedCount} items</strong> need human review before they should be indexed.
          </p>
        </div>
      )}

      {/* Blog Post Generator */}
      <section className="mb-12 bg-card p-6 rounded-xl">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Generate Blog Post
        </h2>
        <div className="space-y-4">
          <Input
            placeholder="Enter a blog topic (e.g., 'How to spot a collapsed drain')"
            value={blogTopic}
            onChange={(e) => setBlogTopic(e.target.value)}
          />
          <Textarea
            placeholder="Why is this content being created? (e.g., 'Educational piece for homeowners about drain maintenance')"
            value={blogWhyCreated}
            onChange={(e) => setBlogWhyCreated(e.target.value)}
            rows={2}
          />
          <Button onClick={handleGenerateClick} disabled={isGenerating}>
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
          <div className="space-y-3">
            {blogPosts.map((post) => {
              const thin = isThinContent(post.content);
              const needsAttention = !post.human_reviewed || thin;
              
              return (
                <div
                  key={post.id}
                  className={`p-4 bg-card rounded-lg border ${
                    needsAttention ? "border-amber-300 dark:border-amber-700" : "border-border"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <p className="font-medium">{post.title}</p>
                        {!post.human_reviewed && (
                          <Badge variant="outline" className="text-amber-600 border-amber-600">
                            Needs Review
                          </Badge>
                        )}
                        {thin && (
                          <Badge variant="outline" className="text-red-600 border-red-600">
                            Thin Content
                          </Badge>
                        )}
                        {post.indexable ? (
                          <Badge className="bg-green-600">
                            <Eye className="h-3 w-3 mr-1" />
                            Indexable
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            <EyeOff className="h-3 w-3 mr-1" />
                            No Index
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{post.excerpt}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span>{new Date(post.created_at).toLocaleDateString("en-GB")}</span>
                        <span>How: {post.how_created || "Unknown"}</span>
                        {post.why_created && <span>Why: {post.why_created}</span>}
                        {post.human_reviewed && post.reviewed_by && (
                          <span className="text-green-600">
                            Reviewed by {post.reviewed_by}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Index</span>
                        <Switch
                          checked={post.indexable || false}
                          onCheckedChange={() => toggleIndexable(post.id, post.indexable)}
                        />
                      </div>
                      {!post.human_reviewed && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => markAsReviewed("blog", post.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Mark Reviewed
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" asChild>
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
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-muted-foreground">No blog posts yet.</p>
        )}
      </section>

      {/* AI Content Cache */}
      <section>
        <h2 className="text-xl font-bold mb-4">AI Content Cache ({aiContent?.length || 0})</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Delete cached content to force regeneration on next page visit.
        </p>
        {loadingAI ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : aiContent && aiContent.length > 0 ? (
          <div className="space-y-2">
            {aiContent.map((item) => {
              const thin = isThinContent(item.content);
              const needsAttention = !item.human_reviewed || thin;

              return (
                <div
                  key={item.id}
                  className={`p-4 bg-card rounded-lg border ${
                    needsAttention ? "border-amber-300 dark:border-amber-700" : "border-border"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-mono text-sm truncate">{item.key}</p>
                        {!item.human_reviewed && (
                          <Badge variant="outline" className="text-amber-600 border-amber-600">
                            Needs Review
                          </Badge>
                        )}
                        {thin && (
                          <Badge variant="outline" className="text-red-600 border-red-600">
                            Thin
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                        <span>Updated: {new Date(item.updated_at).toLocaleString("en-GB")}</span>
                        {item.human_reviewed && item.reviewed_by && (
                          <span className="text-green-600">Reviewed by {item.reviewed_by}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!item.human_reviewed && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => markAsReviewed("ai", item.key)}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteContentMutation.mutate(item.key)}
                        title="Delete to regenerate"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-muted-foreground">No cached content yet.</p>
        )}
      </section>

      <QualityChecklistModal
        open={showChecklist}
        onOpenChange={setShowChecklist}
        onConfirm={generateBlogPost}
        itemCount={1}
        actionType="blog"
      />
    </AdminLayout>
  );
};

export default AdminContent;
