import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.86.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// AI Provider types
type AIProvider = "openai" | "gemini" | "claude" | "mistral" | "groq" | "lovable";

interface GenerateRequest {
  key: string;
  prompt: string;
  provider?: AIProvider;
  forceRegenerate?: boolean;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { key, prompt, provider = "lovable", forceRegenerate = false }: GenerateRequest = await req.json();

    if (!key || !prompt) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: key and prompt" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Initialize Supabase client with service role for database operations
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check cache first (unless force regenerate)
    if (!forceRegenerate) {
      const { data: cached, error: cacheError } = await supabase
        .from("ai_content")
        .select("content")
        .eq("key", key)
        .maybeSingle();

      if (!cacheError && cached?.content) {
        console.log(`Cache hit for key: ${key}`);
        return new Response(
          JSON.stringify({ content: cached.content, cached: true }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    console.log(`Generating content for key: ${key} using provider: ${provider}`);

    // Generate content based on provider
    let content: string;

    switch (provider) {
      case "lovable": {
        const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
        if (!lovableApiKey) {
          throw new Error("LOVABLE_API_KEY is not configured");
        }

        const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${lovableApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash",
            messages: [
              {
                role: "system",
                content: "You are a professional copywriter specialising in UK trade services. Generate clear, factual, SEO-friendly content. Never fabricate testimonials or claims.",
              },
              { role: "user", content: prompt },
            ],
            max_tokens: 2000,
          }),
        });

        if (!response.ok) {
          if (response.status === 429) {
            return new Response(
              JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
              { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }
          if (response.status === 402) {
            return new Response(
              JSON.stringify({ error: "AI credits exhausted. Please add funds." }),
              { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }
          const errorText = await response.text();
          console.error("Lovable AI error:", response.status, errorText);
          throw new Error(`AI gateway error: ${response.status}`);
        }

        const data = await response.json();
        content = data.choices?.[0]?.message?.content || "";
        break;
      }

      case "openai": {
        const openaiKey = Deno.env.get("OPENAI_API_KEY");
        if (!openaiKey) {
          throw new Error("OPENAI_API_KEY is not configured");
        }

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${openaiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content: "You are a professional copywriter specialising in UK trade services. Generate clear, factual, SEO-friendly content. Never fabricate testimonials or claims.",
              },
              { role: "user", content: prompt },
            ],
            max_tokens: 2000,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("OpenAI error:", response.status, errorText);
          throw new Error(`OpenAI error: ${response.status}`);
        }

        const data = await response.json();
        content = data.choices?.[0]?.message?.content || "";
        break;
      }

      case "claude": {
        const anthropicKey = Deno.env.get("ANTHROPIC_API_KEY");
        if (!anthropicKey) {
          throw new Error("ANTHROPIC_API_KEY is not configured");
        }

        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "x-api-key": anthropicKey,
            "anthropic-version": "2023-06-01",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "claude-3-haiku-20240307",
            max_tokens: 2000,
            system: "You are a professional copywriter specialising in UK trade services. Generate clear, factual, SEO-friendly content. Never fabricate testimonials or claims.",
            messages: [{ role: "user", content: prompt }],
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Claude error:", response.status, errorText);
          throw new Error(`Claude error: ${response.status}`);
        }

        const data = await response.json();
        content = data.content?.[0]?.text || "";
        break;
      }

      case "gemini": {
        const geminiKey = Deno.env.get("GEMINI_API_KEY");
        if (!geminiKey) {
          throw new Error("GEMINI_API_KEY is not configured");
        }

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
            }),
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Gemini error:", response.status, errorText);
          throw new Error(`Gemini error: ${response.status}`);
        }

        const data = await response.json();
        content = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
        break;
      }

      case "mistral": {
        const mistralKey = Deno.env.get("MISTRAL_API_KEY");
        if (!mistralKey) {
          throw new Error("MISTRAL_API_KEY is not configured");
        }

        const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${mistralKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "mistral-small-latest",
            messages: [
              {
                role: "system",
                content: "You are a professional copywriter specialising in UK trade services.",
              },
              { role: "user", content: prompt },
            ],
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Mistral error:", response.status, errorText);
          throw new Error(`Mistral error: ${response.status}`);
        }

        const data = await response.json();
        content = data.choices?.[0]?.message?.content || "";
        break;
      }

      case "groq": {
        const groqKey = Deno.env.get("GROQ_API_KEY");
        if (!groqKey) {
          throw new Error("GROQ_API_KEY is not configured");
        }

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${groqKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "llama-3.1-70b-versatile",
            messages: [
              {
                role: "system",
                content: "You are a professional copywriter specialising in UK trade services.",
              },
              { role: "user", content: prompt },
            ],
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Groq error:", response.status, errorText);
          throw new Error(`Groq error: ${response.status}`);
        }

        const data = await response.json();
        content = data.choices?.[0]?.message?.content || "";
        break;
      }

      default:
        throw new Error(`Unsupported AI provider: ${provider}`);
    }

    if (!content) {
      throw new Error("AI returned empty content");
    }

    // Store in cache
    const { error: upsertError } = await supabase
      .from("ai_content")
      .upsert(
        { key, content },
        { onConflict: "key" }
      );

    if (upsertError) {
      console.error("Failed to cache content:", upsertError);
      // Continue anyway - content was generated successfully
    }

    return new Response(
      JSON.stringify({ content, cached: false }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Generate content error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
