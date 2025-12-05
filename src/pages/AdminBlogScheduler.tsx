import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { RefreshCw, Lightbulb, Plus } from "lucide-react";
import { BRAND } from "@/config/brand";
import { LOCATIONS } from "@/config/locations";
import { AI_PROVIDER } from "@/config/aiProvider";
import { AdminLayout } from "@/components/admin/AdminLayout";

const TOPIC_CATEGORIES = [
  { value: "blocked-drains", label: "Blocked Drains" },
  { value: "maintenance", label: "Drain Maintenance" },
  { value: "emergency", label: "Emergency Situations" },
  { value: "seasonal", label: "Seasonal Tips" },
  { value: "homeowner-guide", label: "Homeowner Guides" },
  { value: "commercial", label: "Commercial Drainage" },
];

const SUGGESTED_TOPICS = [
  "How to prevent fat and grease blockages in your kitchen",
  "Signs your drains need professional attention",
  "Winter drain maintenance checklist for UK homeowners",
  "What to do if your drains flood during heavy rain",
  "The benefits of regular CCTV drain surveys",
  "Common causes of blocked toilets and how to avoid them",
  "How tree roots can damage your drainage system",
  "Emergency drain problems: when to call a professional",
  "Understanding your home drainage system",
  "Drain maintenance tips for landlords and property managers",
];

const AdminBlogScheduler = () => {
  const queryClient = useQueryClient();
  
  const [selectedTopic, setSelectedTopic] = useState("");
  const [customTopic, setCustomTopic] = useState("");
  const [category, setCategory] = useState("");
  const [targetLocation, setTargetLocation] = useState("");
  const [wordCount, setWordCount] = useState("medium");
  const [isGenerating, setIsGenerating] = useState(false);

  const generateBlogPost = async () => {
    const topic = customTopic || selectedTopic;
    if (!topic) {
      toast.error("Please select or enter a topic");
      return;
    }

    setIsGenerating(true);
    try {
      const wordRange = wordCount === "short" ? "400-600" : wordCount === "long" ? "1000-1500" : "700-900";
      const locationContext = targetLocation
        ? `Focus on ${LOCATIONS.find((l) => l.slug === targetLocation)?.name || targetLocation} area.`
        : "";

      const { data, error } = await supabase.functions.invoke("generate-content", {
        body: {
          key: `blog:scheduled:${Date.now()}`,
          prompt: `Write an informative blog post for a UK drain services company.

Topic: "${topic}"
Category: "${category || "General"}"
Brand: "${BRAND.brandName}"
Primary Location: "${BRAND.primaryLocation}"
${locationContext}

Rules:
- Explain the topic in detail with practical UK-relevant advice.
- Avoid sensational claims or fabricated statistics.
- Include actionable tips homeowners can follow.
- Word count: ${wordRange} words.

Tone: helpful, knowledgeable, approachable.
Language: UK English.

Format the response as follows:
TITLE: [A compelling, SEO-friendly title]
EXCERPT: [A one-sentence summary for preview]
CONTENT: [The full blog post content with proper paragraphs]`,
          provider: AI_PROVIDER,
        },
      });

      if (error) throw error;

      const content = data?.content || "";
      const titleMatch = content.match(/TITLE:\s*(.+?)(?:\n|EXCERPT:)/s);
      const excerptMatch = content.match(/EXCERPT:\s*(.+?)(?:\n|CONTENT:)/s);
      const contentMatch = content.match(/CONTENT:\s*([\s\S]+)/);

      const title = titleMatch?.[1]?.trim() || topic;
      const excerpt = excerptMatch?.[1]?.trim() || content.substring(0, 150);
      const blogContent = contentMatch?.[1]?.trim() || content;

      const slug = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .substring(0, 50);

      const { error: insertError } = await supabase.from("blog_posts").insert({
        slug: `${slug}-${Date.now()}`,
        title,
        excerpt,
        content: blogContent,
      });

      if (insertError) throw insertError;

      queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
      setCustomTopic("");
      setSelectedTopic("");
      toast.success("Blog post generated and saved!");
    } catch (err: any) {
      toast.error(`Failed to generate: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <AdminLayout 
      title="Blog Scheduler" 
      description="Generate AI-powered blog posts for your drainage website"
    >
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Generator Form */}
        <div className="bg-card p-6 rounded-xl">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Generate New Post
          </h2>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Category (optional)
              </label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {TOPIC_CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Target Location (optional)
              </label>
              <Select value={targetLocation} onValueChange={setTargetLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="General (all areas)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">General (all areas)</SelectItem>
                  {LOCATIONS.map((loc) => (
                    <SelectItem key={loc.slug} value={loc.slug}>
                      {loc.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Word Count
              </label>
              <Select value={wordCount} onValueChange={setWordCount}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short">Short (400-600 words)</SelectItem>
                  <SelectItem value="medium">Medium (700-900 words)</SelectItem>
                  <SelectItem value="long">Long (1000-1500 words)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Custom Topic
              </label>
              <Input
                placeholder="Enter your own topic..."
                value={customTopic}
                onChange={(e) => {
                  setCustomTopic(e.target.value);
                  setSelectedTopic("");
                }}
              />
            </div>

            <Button
              onClick={generateBlogPost}
              disabled={isGenerating || (!customTopic && !selectedTopic)}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Blog Post"
              )}
            </Button>
          </div>
        </div>

        {/* Suggested Topics */}
        <div className="bg-card p-6 rounded-xl">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Suggested Topics
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Click a topic to select it, then generate.
          </p>
          <div className="space-y-2">
            {SUGGESTED_TOPICS.map((topic, index) => (
              <button
                key={index}
                onClick={() => {
                  setSelectedTopic(topic);
                  setCustomTopic("");
                }}
                className={`w-full text-left p-3 rounded-lg text-sm transition-colors ${
                  selectedTopic === topic
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/70"
                }`}
              >
                {topic}
              </button>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminBlogScheduler;
