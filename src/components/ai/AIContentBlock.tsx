import { useAIContent } from "@/hooks/useAIContent";
import { AITemplateName } from "@/config/aiPrompts";
import { Skeleton } from "@/components/ui/skeleton";

interface AIContentBlockProps {
  type: string;
  templateName: AITemplateName;
  variables: Record<string, string>;
  keyParts?: string[];
  fallback?: React.ReactNode;
  className?: string;
}

export function AIContentBlock({
  type,
  templateName,
  variables,
  keyParts = [],
  fallback,
  className = "",
}: AIContentBlockProps) {
  const { content, isLoading, error, isCached } = useAIContent(
    type,
    templateName,
    variables,
    keyParts
  );

  if (isLoading) {
    return (
      <div className={`space-y-3 ${className}`}>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[90%]" />
        <Skeleton className="h-4 w-[95%]" />
        <Skeleton className="h-4 w-[85%]" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[80%]" />
      </div>
    );
  }

  if (error) {
    console.error("AI content error:", error);
    if (fallback) return <>{fallback}</>;
    return (
      <p className={`text-muted-foreground ${className}`}>
        Content temporarily unavailable. Please try again later.
      </p>
    );
  }

  if (!content) {
    if (fallback) return <>{fallback}</>;
    return null;
  }

  // Split content into paragraphs and render
  const paragraphs = content
    .split(/\n\n+/)
    .filter((p) => p.trim())
    .map((p) => p.trim());

  return (
    <div className={`space-y-4 ${className}`}>
      {paragraphs.map((paragraph, index) => (
        <p key={index} className="text-muted-foreground leading-relaxed">
          {paragraph}
        </p>
      ))}
      {process.env.NODE_ENV === "development" && isCached && (
        <span className="text-xs text-muted-foreground/50">(cached)</span>
      )}
    </div>
  );
}
