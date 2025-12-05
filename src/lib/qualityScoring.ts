import { LOCATIONS } from "@/config/locations";

export type QualityStatus = "green" | "amber" | "red";

export type PageType =
  | "service-in-location"
  | "location"
  | "service"
  | "sub-service"
  | "blog";

export interface QualitySignal {
  id: string;
  name: string;
  passed: boolean;
  severity: "error" | "warning" | "info";
  message: string;
}

export interface QualityScore {
  status: QualityStatus;
  score: number;
  signals: QualitySignal[];
  summary: string;
}

// Word count thresholds per page type
const WORD_COUNT_THRESHOLDS: Record<
  PageType,
  { target: number; warn: number; hardWarn: number }
> = {
  "service-in-location": { target: 700, warn: 500, hardWarn: 300 },
  location: { target: 500, warn: 350, hardWarn: 200 },
  service: { target: 600, warn: 400, hardWarn: 250 },
  "sub-service": { target: 400, warn: 250, hardWarn: 150 },
  blog: { target: 900, warn: 600, hardWarn: 400 },
};

// Get word count from content
export function getWordCount(content: string): number {
  return content
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter((word) => word.length > 0).length;
}

// Check text depth signal
function checkTextDepth(
  content: string,
  pageType: PageType
): QualitySignal {
  const wordCount = getWordCount(content);
  const thresholds = WORD_COUNT_THRESHOLDS[pageType];

  if (wordCount >= thresholds.target) {
    return {
      id: "text-depth",
      name: "Text Depth",
      passed: true,
      severity: "info",
      message: `Word count (${wordCount}) meets target of ${thresholds.target}+`,
    };
  } else if (wordCount >= thresholds.warn) {
    return {
      id: "text-depth",
      name: "Text Depth",
      passed: false,
      severity: "warning",
      message: `Word count (${wordCount}) is below target of ${thresholds.target}. Consider expanding content.`,
    };
  } else {
    return {
      id: "text-depth",
      name: "Text Depth",
      passed: false,
      severity: "error",
      message: `Word count (${wordCount}) is critically low. Minimum ${thresholds.warn} recommended for this page type.`,
    };
  }
}

// Check local specificity signal
function checkLocalSpecificity(
  content: string,
  locationName?: string,
  pageType?: PageType
): QualitySignal {
  if (!locationName || !["service-in-location", "location", "sub-service"].includes(pageType || "")) {
    return {
      id: "local-specificity",
      name: "Local Specificity",
      passed: true,
      severity: "info",
      message: "Not applicable for this page type",
    };
  }

  const contentLower = content.toLowerCase();
  const locationLower = locationName.toLowerCase();

  // Check for primary location mention
  const hasPrimaryLocation = contentLower.includes(locationLower);

  // Check for nearby areas from config
  const nearbyAreas = LOCATIONS.filter(
    (loc) => loc.name.toLowerCase() !== locationLower
  ).map((loc) => loc.name.toLowerCase());

  const hasNearbyMention = nearbyAreas.some((area) =>
    contentLower.includes(area)
  );

  // Check for local detail keywords
  const localKeywords = [
    "property",
    "properties",
    "homes",
    "houses",
    "estate",
    "area",
    "neighbourhood",
    "local",
    "residents",
    "community",
  ];
  const hasLocalDetail = localKeywords.some((kw) => contentLower.includes(kw));

  const score = [hasPrimaryLocation, hasNearbyMention, hasLocalDetail].filter(
    Boolean
  ).length;

  if (score >= 2) {
    return {
      id: "local-specificity",
      name: "Local Specificity",
      passed: true,
      severity: "info",
      message: "Good local references found",
    };
  } else if (score === 1) {
    return {
      id: "local-specificity",
      name: "Local Specificity",
      passed: false,
      severity: "warning",
      message: `Weak local references for ${locationName}. Consider adding nearby areas or local details.`,
    };
  } else {
    return {
      id: "local-specificity",
      name: "Local Specificity",
      passed: false,
      severity: "error",
      message: `Missing local references for ${locationName}. Add town name, nearby areas, and local context.`,
    };
  }
}

// Check internal linking signal
function checkInternalLinking(
  content: string,
  pageType: PageType
): QualitySignal {
  const contentLower = content.toLowerCase();

  // Look for common internal link patterns
  const hasServiceLink =
    contentLower.includes("/services") ||
    contentLower.includes("our services") ||
    contentLower.includes("learn more about");
  const hasLocationLink =
    contentLower.includes("/locations") ||
    contentLower.includes("service area") ||
    contentLower.includes("areas we cover");
  const hasContactLink =
    contentLower.includes("/contact") ||
    contentLower.includes("get in touch") ||
    contentLower.includes("request a quote") ||
    contentLower.includes("call us") ||
    contentLower.includes("contact us");
  const hasBlogLink =
    contentLower.includes("/blog") || contentLower.includes("read more");

  let requiredLinks: string[] = [];
  let foundLinks: string[] = [];

  if (pageType === "service-in-location") {
    requiredLinks = ["service page", "location page", "contact page"];
    if (hasServiceLink) foundLinks.push("service page");
    if (hasLocationLink) foundLinks.push("location page");
    if (hasContactLink) foundLinks.push("contact page");
  } else if (pageType === "blog") {
    requiredLinks = ["service/location page", "blog index"];
    if (hasServiceLink || hasLocationLink) foundLinks.push("service/location page");
    if (hasBlogLink) foundLinks.push("blog index");
  } else {
    requiredLinks = ["contact page"];
    if (hasContactLink) foundLinks.push("contact page");
  }

  const linkScore = foundLinks.length / requiredLinks.length;

  if (linkScore >= 0.75) {
    return {
      id: "internal-linking",
      name: "Internal Linking",
      passed: true,
      severity: "info",
      message: "Good internal linking structure",
    };
  } else if (linkScore >= 0.5) {
    return {
      id: "internal-linking",
      name: "Internal Linking",
      passed: false,
      severity: "warning",
      message: `Missing links to: ${requiredLinks
        .filter((l) => !foundLinks.includes(l))
        .join(", ")}`,
    };
  } else {
    return {
      id: "internal-linking",
      name: "Internal Linking",
      passed: false,
      severity: "error",
      message: `Weak internal linking. Add links to: ${requiredLinks.join(", ")}`,
    };
  }
}

// Check uniqueness signal (simple heuristic)
function checkUniqueness(
  content: string,
  allContents?: string[]
): QualitySignal {
  if (!allContents || allContents.length < 2) {
    return {
      id: "uniqueness",
      name: "Uniqueness",
      passed: true,
      severity: "info",
      message: "Unable to check (not enough content for comparison)",
    };
  }

  // Extract first 100 words for intro comparison
  const getIntro = (text: string) =>
    text
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .split(" ")
      .slice(0, 100)
      .join(" ")
      .toLowerCase();

  // Extract last 100 words for conclusion comparison
  const getConclusion = (text: string) => {
    const words = text
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .split(" ");
    return words.slice(-100).join(" ").toLowerCase();
  };

  const currentIntro = getIntro(content);
  const currentConclusion = getConclusion(content);

  let duplicateIntros = 0;
  let duplicateConclusions = 0;

  for (const other of allContents) {
    if (other === content) continue;

    const otherIntro = getIntro(other);
    const otherConclusion = getConclusion(other);

    // Simple similarity check - count matching words
    const introWords = new Set(currentIntro.split(" "));
    const otherIntroWords = new Set(otherIntro.split(" "));
    const introOverlap =
      [...introWords].filter((w) => otherIntroWords.has(w)).length /
      Math.max(introWords.size, 1);

    const concWords = new Set(currentConclusion.split(" "));
    const otherConcWords = new Set(otherConclusion.split(" "));
    const concOverlap =
      [...concWords].filter((w) => otherConcWords.has(w)).length /
      Math.max(concWords.size, 1);

    if (introOverlap > 0.7) duplicateIntros++;
    if (concOverlap > 0.7) duplicateConclusions++;
  }

  if (duplicateIntros === 0 && duplicateConclusions === 0) {
    return {
      id: "uniqueness",
      name: "Uniqueness",
      passed: true,
      severity: "info",
      message: "Content appears unique",
    };
  } else if (duplicateIntros > 0 && duplicateConclusions > 0) {
    return {
      id: "uniqueness",
      name: "Uniqueness",
      passed: false,
      severity: "error",
      message: `Introduction and conclusion are very similar to ${duplicateIntros} other page(s). Consider editing for uniqueness.`,
    };
  } else {
    return {
      id: "uniqueness",
      name: "Uniqueness",
      passed: false,
      severity: "warning",
      message: `Some sections appear similar to other pages. Review and differentiate.`,
    };
  }
}

// Check review status signal
function checkReviewStatus(humanReviewed: boolean | null): QualitySignal {
  if (humanReviewed) {
    return {
      id: "review-status",
      name: "Review Status",
      passed: true,
      severity: "info",
      message: "Content has been human reviewed",
    };
  }
  return {
    id: "review-status",
    name: "Review Status",
    passed: false,
    severity: "warning",
    message: "Content has not been human reviewed",
  };
}

// Main scoring function
export function calculateQualityScore(
  content: string,
  pageType: PageType,
  options: {
    humanReviewed?: boolean | null;
    locationName?: string;
    allContents?: string[];
  } = {}
): QualityScore {
  const signals: QualitySignal[] = [];

  // Check all signals
  signals.push(checkTextDepth(content, pageType));
  signals.push(
    checkLocalSpecificity(content, options.locationName, pageType)
  );
  signals.push(checkInternalLinking(content, pageType));
  signals.push(checkUniqueness(content, options.allContents));
  signals.push(checkReviewStatus(options.humanReviewed ?? null));

  // Calculate overall score
  const errors = signals.filter(
    (s) => !s.passed && s.severity === "error"
  ).length;
  const warnings = signals.filter(
    (s) => !s.passed && s.severity === "warning"
  ).length;

  let status: QualityStatus;
  let score: number;
  let summary: string;

  if (errors >= 2 || (errors >= 1 && !options.humanReviewed)) {
    status = "red";
    score = Math.max(0, 30 - errors * 10 - warnings * 5);
    summary = "Not ready for indexing. Address critical issues first.";
  } else if (errors >= 1 || warnings >= 2) {
    status = "amber";
    score = Math.max(40, 70 - errors * 15 - warnings * 10);
    summary = "Needs improvement before indexing.";
  } else if (warnings >= 1 || !options.humanReviewed) {
    status = "amber";
    score = Math.max(50, 85 - warnings * 10);
    summary = "Review and improve minor issues.";
  } else {
    status = "green";
    score = 90 + signals.filter((s) => s.passed).length;
    summary = "Ready for indexing.";
  }

  return { status, score: Math.min(100, score), signals, summary };
}

// Determine page type from content key
export function getPageTypeFromKey(key: string): PageType | null {
  if (key.startsWith("serviceInLocation:")) return "service-in-location";
  if (key.startsWith("location:")) return "location";
  if (key.startsWith("service:")) return "service";
  if (key.startsWith("subService:")) return "sub-service";
  if (key.startsWith("blog:")) return "blog";
  return null;
}

// Extract location name from content key
export function getLocationFromKey(key: string): string | undefined {
  const parts = key.split(":");
  if (parts.length >= 2) {
    const locationSlug = parts[1];
    const location = LOCATIONS.find((l) => l.slug === locationSlug);
    return location?.name;
  }
  return undefined;
}

// Get indexing recommendation based on status
export function getIndexingRecommendation(
  status: QualityStatus,
  currentlyIndexable: boolean
): {
  recommended: boolean;
  warning: string | null;
} {
  if (status === "green") {
    return { recommended: true, warning: null };
  } else if (status === "amber") {
    return {
      recommended: false,
      warning: currentlyIndexable
        ? "This page has quality issues. Review before keeping it indexable."
        : "Review and improve before enabling indexing.",
    };
  } else {
    return {
      recommended: false,
      warning: currentlyIndexable
        ? "⚠️ WARNING: This page has critical quality issues and should NOT be indexed."
        : "Do not index until critical issues are resolved.",
    };
  }
}
