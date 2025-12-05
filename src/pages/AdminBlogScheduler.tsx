import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { RefreshCw, Lightbulb, Plus, AlertTriangle } from "lucide-react";
import { BRAND } from "@/config/brand";
import { LOCATIONS } from "@/config/locations";
import { AI_PROVIDER } from "@/config/aiProvider";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AIContentPolicyPanel } from "@/components/admin/AIContentPolicyPanel";
import { QualityChecklistModal } from "@/components/admin/QualityChecklistModal";
import { BatchSizeWarningModal } from "@/components/admin/BatchSizeWarningModal";
import { Alert, AlertDescription } from "@/components/ui/alert";

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

const MAX_BATCH_SIZE = 10;

const AdminBlogScheduler = () => {
  const queryClient = useQueryClient();

  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [customTopic, setCustomTopic] = useState("");
  const [whyCreated, setWhyCreated] = useState("");
  const [category, setCategory] = useState("");
  const [targetLocation, setTargetLocation] = useState("");
  const [wordCount, setWordCount] = useState("medium");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showChecklist, setShowChecklist] = useState(false);
  const [showBatchWarning, setShowBatchWarning] = useState(false);
  const [pendingGeneration, setPendingGeneration] = useState(false);

  const allTopics = customTopic
    ? [customTopic]
    : selectedTopics;

  const handleTopicToggle = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic)
        ? prev.filter((t) => t !== topic)
        : [...prev, topic]
    );
    setCustomTopic("");
  };

  const handleGenerateClick = () => {
    if (allTopics.length === 0) {
      toast.error("Please select or enter at least one topic");
      return;
    }

    // Check batch size
    if (allTopics.length > MAX_BATCH_SIZE) {
      setShowBatchWarning(true);
      return;
    }

    setShowChecklist(true);
  };

  const handleBatchWarningConfirm = () => {
    setShowBatchWarning(false);
    setShowChecklist(true);
  };

  const handleReduceBatch = () => {
    setSelectedTopics((prev) => prev.slice(0, MAX_BATCH_SIZE));
    setShowBatchWarning(false);
    setShowChecklist(true);
  };

  const generateBlogPosts = async () => {
    setIsGenerating(true);
    let successCount = 0;
    let failCount = 0;

    for (const topic of allTopics) {
      try {
        const wordRange =
          wordCount === "short"
            ? "400-600"
            : wordCount === "long"
            ? "1000-1500"
            : "700-900";
        const locationContext = targetLocation
          ? `Focus on ${
              LOCATIONS.find((l) => l.slug === targetLocation)?.name ||
              targetLocation
            } area.`
          : "";

        const { data, error } = await supabase.functions.invoke(
          "generate-content",
          {
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
          }
        );

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
          how_created: "AI-assisted",
          why_created: whyCreated || `Blog post about: ${topic}`,
          human_reviewed: false,
          indexable: false,
        });

        if (insertError) throw insertError;
        successCount++;
      } catch (err: any) {
        console.error(`Failed to generate "${topic}":`, err);
        failCount++;
      }
    }

    queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
    setCustomTopic("");
    setSelectedTopics([]);
    setWhyCreated("");
    setIsGenerating(false);

    if (successCount > 0) {
      toast.success(
        `Generated ${successCount} post(s)! Remember to review before enabling indexing.`
      );
    }
    if (failCount > 0) {
      toast.error(`Failed to generate ${failCount} post(s).`);
    }
  };

  return (
    <AdminLayout
      title="Blog Scheduler"
      description="Generate AI-powered blog posts for your drainage website"
    >
      <AIContentPolicyPanel />

      <Alert className="mb-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Batch limit:</strong> Maximum {MAX_BATCH_SIZE} posts per batch.
          Generated posts default to <strong>non-indexable</strong> until reviewed.
        </AlertDescription>
      </Alert>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Generator Form */}
        <div className="bg-card p-6 rounded-xl">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Generate New Post(s)
          </h2>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Why is this content being created?
              </label>
              <Textarea
                placeholder="e.g., 'Educational content for homeowners about seasonal maintenance'"
                value={whyCreated}
                onChange={(e) => setWhyCreated(e.target.value)}
                rows={2}
              />
            </div>

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
                Custom Topic (overrides selection)
              </label>
              <Input
                placeholder="Enter your own topic..."
                value={customTopic}
                onChange={(e) => {
                  setCustomTopic(e.target.value);
                  if (e.target.value) setSelectedTopics([]);
                }}
              />
            </div>

            {selectedTopics.length > 0 && (
              <p className="text-sm text-muted-foreground">
                Selected: {selectedTopics.length} topic(s)
              </p>
            )}

            <Button
              onClick={handleGenerateClick}
              disabled={isGenerating || allTopics.length === 0}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                `Generate ${allTopics.length} Blog Post(s)`
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
            Click topics to select multiple, then generate as a batch (max {MAX_BATCH_SIZE}).
          </p>
          <div className="space-y-2">
            {SUGGESTED_TOPICS.map((topic, index) => (
              <button
                key={index}
                onClick={() => handleTopicToggle(topic)}
                disabled={!!customTopic}
                className={`w-full text-left p-3 rounded-lg text-sm transition-colors ${
                  selectedTopics.includes(topic)
                    ? "bg-primary text-primary-foreground"
                    : customTopic
                    ? "bg-muted/50 text-muted-foreground cursor-not-allowed"
                    : "bg-muted hover:bg-muted/70"
                }`}
              >
                {topic}
              </button>
            ))}
          </div>
        </div>
      </div>

      <QualityChecklistModal
        open={showChecklist}
        onOpenChange={setShowChecklist}
        onConfirm={generateBlogPosts}
        itemCount={allTopics.length}
        actionType="blog"
      />

      <BatchSizeWarningModal
        open={showBatchWarning}
        onOpenChange={setShowBatchWarning}
        onConfirm={handleBatchWarningConfirm}
        onReduceBatch={handleReduceBatch}
        requestedCount={allTopics.length}
        maxRecommended={MAX_BATCH_SIZE}
      />
    </AdminLayout>
  );
};

export default AdminBlogScheduler;
