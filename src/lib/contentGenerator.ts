import { supabase } from "@/integrations/supabase/client";
import { AI_TEMPLATES, AITemplateName } from "@/config/aiPrompts";
import { AI_PROVIDER } from "@/config/aiProvider";

interface ContentResult {
  content: string;
  cached: boolean;
  error?: string;
}

/**
 * Get or generate AI content with caching.
 * First checks the cache, then generates via edge function if needed.
 */
export async function getOrGenerateContent(
  key: string,
  templateName: AITemplateName,
  variables: Record<string, string>
): Promise<ContentResult> {
  // First, try to get from cache directly
  const { data: cached, error: cacheError } = await supabase
    .from("ai_content")
    .select("content")
    .eq("key", key)
    .maybeSingle();

  if (!cacheError && cached?.content) {
    return { content: cached.content, cached: true };
  }

  // Build the prompt from template
  let prompt: string = AI_TEMPLATES[templateName];
  for (const [varName, value] of Object.entries(variables)) {
    prompt = prompt.split(`{{${varName}}}`).join(value);
  }

  // Call edge function to generate content
  const { data, error } = await supabase.functions.invoke("generate-content", {
    body: {
      key,
      prompt,
      provider: AI_PROVIDER,
    },
  });

  if (error) {
    console.error("Content generation error:", error);
    return {
      content: "",
      cached: false,
      error: error.message || "Failed to generate content",
    };
  }

  if (data?.error) {
    return {
      content: "",
      cached: false,
      error: data.error,
    };
  }

  return {
    content: data?.content || "",
    cached: data?.cached || false,
  };
}

/**
 * Force regenerate content, bypassing cache.
 */
export async function regenerateContent(
  key: string,
  templateName: AITemplateName,
  variables: Record<string, string>
): Promise<ContentResult> {
  let prompt: string = AI_TEMPLATES[templateName];
  for (const [varName, value] of Object.entries(variables)) {
    prompt = prompt.split(`{{${varName}}}`).join(value);
  }

  const { data, error } = await supabase.functions.invoke("generate-content", {
    body: {
      key,
      prompt,
      provider: AI_PROVIDER,
      forceRegenerate: true,
    },
  });

  if (error) {
    console.error("Content regeneration error:", error);
    return {
      content: "",
      cached: false,
      error: error.message || "Failed to regenerate content",
    };
  }

  return {
    content: data?.content || "",
    cached: false,
  };
}

/**
 * Build a cache key for content.
 */
export function buildContentKey(type: string, ...parts: string[]): string {
  return [type, ...parts].join(":");
}
