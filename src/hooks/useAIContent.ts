import { useState, useEffect } from "react";
import { getOrGenerateContent, buildContentKey } from "@/lib/contentGenerator";
import { AITemplateName } from "@/config/aiPrompts";

interface UseAIContentResult {
  content: string;
  isLoading: boolean;
  error: string | null;
  isCached: boolean;
}

export function useAIContent(
  type: string,
  templateName: AITemplateName,
  variables: Record<string, string>,
  keyParts: string[] = []
): UseAIContentResult {
  const [content, setContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isCached, setIsCached] = useState<boolean>(false);

  const key = buildContentKey(type, ...keyParts);

  useEffect(() => {
    let isMounted = true;

    async function fetchContent() {
      setIsLoading(true);
      setError(null);

      try {
        const result = await getOrGenerateContent(key, templateName, variables);

        if (!isMounted) return;

        if (result.error) {
          setError(result.error);
          setContent("");
        } else {
          setContent(result.content);
          setIsCached(result.cached);
        }
      } catch (err) {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : "Failed to load content");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchContent();

    return () => {
      isMounted = false;
    };
  }, [key, templateName, JSON.stringify(variables)]);

  return { content, isLoading, error, isCached };
}
