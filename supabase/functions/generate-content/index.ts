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

// Helper function to generate content with OpenAI
async function generateWithOpenAI(prompt: string): Promise<string> {
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
  return data.choices?.[0]?.message?.content || "";
}

// Helper function to generate content with Lovable AI (fallback)
async function generateWithLovable(prompt: string): Promise<string> {
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
      throw new Error("RATE_LIMIT: Rate limit exceeded");
    }
    if (response.status === 402) {
      throw new Error("PAYMENT_REQUIRED: AI credits exhausted");
    }
    const errorText = await response.text();
    console.error("Lovable AI error:", response.status, errorText);
    throw new Error(`Lovable AI error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { key, prompt, provider = "openai", forceRegenerate = false }: GenerateRequest = await req.json();

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

    let content: string = "";
    let usedProvider = provider;

    // Try primary provider first (OpenAI by default), fallback to Lovable AI
    if (provider === "openai") {
      try {
        content = await generateWithOpenAI(prompt);
        console.log(`Successfully generated with OpenAI for key: ${key}`);
      } catch (openaiError) {
        console.error("OpenAI failed, falling back to Lovable AI:", openaiError);
        try {
          content = await generateWithLovable(prompt);
          usedProvider = "lovable";
          console.log(`Fallback to Lovable AI successful for key: ${key}`);
        } catch (lovableError) {
          // Check for specific Lovable errors
          if (lovableError instanceof Error) {
            if (lovableError.message.includes("RATE_LIMIT")) {
              return new Response(
                JSON.stringify({ error: "Rate limit exceeded on all providers. Please try again later." }),
                { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
              );
            }
            if (lovableError.message.includes("PAYMENT_REQUIRED")) {
              return new Response(
                JSON.stringify({ error: "AI credits exhausted on fallback. Please add funds or check OpenAI key." }),
                { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
              );
            }
          }
          throw new Error(`Both OpenAI and Lovable AI failed. OpenAI: ${openaiError}. Lovable: ${lovableError}`);
        }
      }
    } else if (provider === "lovable") {
      // If explicitly requesting Lovable, try it first then fallback to OpenAI
      try {
        content = await generateWithLovable(prompt);
        console.log(`Successfully generated with Lovable AI for key: ${key}`);
      } catch (lovableError) {
        console.error("Lovable AI failed, falling back to OpenAI:", lovableError);
        try {
          content = await generateWithOpenAI(prompt);
          usedProvider = "openai";
          console.log(`Fallback to OpenAI successful for key: ${key}`);
        } catch (openaiError) {
          throw new Error(`Both Lovable AI and OpenAI failed. Lovable: ${lovableError}. OpenAI: ${openaiError}`);
        }
      }
    } else {
      // Other providers - no fallback
      content = await generateWithProvider(provider, prompt);
    }

    if (!content) {
      throw new Error("AI returned empty content");
    }

    // Store in cache
    const { error: upsertError } = await supabase
      .from("ai_content")
      .upsert(
        { key, content, how_created: `AI-assisted (${usedProvider})` },
        { onConflict: "key" }
      );

    if (upsertError) {
      console.error("Failed to cache content:", upsertError);
    }

    return new Response(
      JSON.stringify({ content, cached: false, provider: usedProvider }),
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

// Helper for other providers (no fallback)
async function generateWithProvider(provider: AIProvider, prompt: string): Promise<string> {
  switch (provider) {
    case "claude": {
      const anthropicKey = Deno.env.get("ANTHROPIC_API_KEY");
      if (!anthropicKey) throw new Error("ANTHROPIC_API_KEY is not configured");

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
      return data.content?.[0]?.text || "";
    }

    case "gemini": {
      const geminiKey = Deno.env.get("GEMINI_API_KEY");
      if (!geminiKey) throw new Error("GEMINI_API_KEY is not configured");

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
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    }

    case "mistral": {
      const mistralKey = Deno.env.get("MISTRAL_API_KEY");
      if (!mistralKey) throw new Error("MISTRAL_API_KEY is not configured");

      const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${mistralKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "mistral-small-latest",
          messages: [
            { role: "system", content: "You are a professional copywriter specialising in UK trade services." },
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
      return data.choices?.[0]?.message?.content || "";
    }

    case "groq": {
      const groqKey = Deno.env.get("GROQ_API_KEY");
      if (!groqKey) throw new Error("GROQ_API_KEY is not configured");

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${groqKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.1-70b-versatile",
          messages: [
            { role: "system", content: "You are a professional copywriter specialising in UK trade services." },
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
      return data.choices?.[0]?.message?.content || "";
    }

    default:
      throw new Error(`Unsupported AI provider: ${provider}`);
  }
}