export type AIProvider =
  | "openai"
  | "gemini"
  | "claude"
  | "mistral"
  | "groq"
  | "lovable";

// Default provider - OpenAI is primary, Lovable AI is fallback
export const AI_PROVIDER: AIProvider = "openai";
export const AI_FALLBACK_PROVIDER: AIProvider = "lovable";

// Model configuration per provider
export const AI_MODELS = {
  openai: "gpt-4o-mini",
  gemini: "gemini-pro",
  claude: "claude-3-haiku-20240307",
  mistral: "mistral-small-latest",
  groq: "llama-3.1-70b-versatile",
  lovable: "google/gemini-2.5-flash", // Default Lovable AI model
} as const;

// Environment variable names for external APIs (used in edge functions)
export const AI_KEY_ENV_VARS = {
  openai: "OPENAI_API_KEY",
  gemini: "GEMINI_API_KEY",
  claude: "ANTHROPIC_API_KEY",
  mistral: "MISTRAL_API_KEY",
  groq: "GROQ_API_KEY",
  lovable: "LOVABLE_API_KEY", // Auto-provisioned
} as const;
