import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle2, XCircle, TrendingUp } from "lucide-react";
import {
  QualityStatus,
  PageType,
  calculateQualityScore,
  getPageTypeFromKey,
  getLocationFromKey,
} from "@/lib/qualityScoring";

interface ContentItem {
  key?: string;
  content: string;
  human_reviewed?: boolean | null;
  indexable?: boolean | null;
}

interface QualityDashboardProps {
  aiContent: ContentItem[];
  blogPosts: ContentItem[];
}

interface QualityCounts {
  green: number;
  amber: number;
  red: number;
  indexableAtRisk: number;
}

function calculateCounts(
  items: ContentItem[],
  pageType: PageType,
  allContents: string[]
): QualityCounts {
  const counts: QualityCounts = { green: 0, amber: 0, red: 0, indexableAtRisk: 0 };

  for (const item of items) {
    const locationName = item.key ? getLocationFromKey(item.key) : undefined;
    const score = calculateQualityScore(item.content, pageType, {
      humanReviewed: item.human_reviewed,
      locationName,
      allContents,
    });

    counts[score.status]++;

    if (item.indexable && score.status !== "green") {
      counts.indexableAtRisk++;
    }
  }

  return counts;
}

function CountCard({
  title,
  counts,
  showRisk = false,
}: {
  title: string;
  counts: QualityCounts;
  showRisk?: boolean;
}) {
  const total = counts.green + counts.amber + counts.red;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <CardDescription>{total} total</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 flex-wrap">
          {counts.green > 0 && (
            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-400">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              {counts.green}
            </Badge>
          )}
          {counts.amber > 0 && (
            <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/30 dark:text-amber-400">
              <AlertTriangle className="h-3 w-3 mr-1" />
              {counts.amber}
            </Badge>
          )}
          {counts.red > 0 && (
            <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-400">
              <XCircle className="h-3 w-3 mr-1" />
              {counts.red}
            </Badge>
          )}
        </div>
        {showRisk && counts.indexableAtRisk > 0 && (
          <p className="text-xs text-red-600 dark:text-red-400 mt-2 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            {counts.indexableAtRisk} indexable with issues
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export function QualityDashboard({ aiContent, blogPosts }: QualityDashboardProps) {
  // Group AI content by page type
  const serviceInLocation = aiContent.filter(
    (c) => c.key && getPageTypeFromKey(c.key) === "service-in-location"
  );
  const locations = aiContent.filter(
    (c) => c.key && getPageTypeFromKey(c.key) === "location"
  );
  const services = aiContent.filter(
    (c) => c.key && getPageTypeFromKey(c.key) === "service"
  );
  const subServices = aiContent.filter(
    (c) => c.key && getPageTypeFromKey(c.key) === "sub-service"
  );

  const allAIContents = aiContent.map((c) => c.content);
  const allBlogContents = blogPosts.map((c) => c.content);

  const silCounts = calculateCounts(serviceInLocation, "service-in-location", allAIContents);
  const locCounts = calculateCounts(locations, "location", allAIContents);
  const svcCounts = calculateCounts(services, "service", allAIContents);
  const subCounts = calculateCounts(subServices, "sub-service", allAIContents);
  const blogCounts = calculateCounts(
    blogPosts.map((p) => ({ ...p, key: `blog:${p.content.slice(0, 20)}` })),
    "blog",
    allBlogContents
  );

  const totalAtRisk =
    silCounts.indexableAtRisk +
    locCounts.indexableAtRisk +
    svcCounts.indexableAtRisk +
    subCounts.indexableAtRisk +
    blogCounts.indexableAtRisk;

  const totalRed =
    silCounts.red + locCounts.red + svcCounts.red + subCounts.red + blogCounts.red;

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <CardTitle>Quality Summary</CardTitle>
        </div>
        <CardDescription>
          Overview of content quality across your site
        </CardDescription>
      </CardHeader>
      <CardContent>
        {totalAtRisk > 0 && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-800 dark:text-red-200 text-sm flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              <strong>{totalAtRisk} pages</strong> are marked indexable but have quality issues.
              Review these to avoid potential scaled content penalties.
            </p>
          </div>
        )}

        {totalRed > 0 && (
          <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
            <p className="text-amber-800 dark:text-amber-200 text-sm">
              <strong>{totalRed} pages</strong> are not ready for indexing. 
              Google's systems reward helpful, reliable, people-first content. Scaled low-value 
              content falls under spam policies.
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          <CountCard
            title="Service + Location"
            counts={silCounts}
            showRisk
          />
          <CountCard title="Locations" counts={locCounts} />
          <CountCard title="Services" counts={svcCounts} />
          <CountCard title="Sub-services" counts={subCounts} />
          <CountCard
            title="Blog Posts"
            counts={blogCounts}
            showRisk
          />
        </div>

        <p className="text-xs text-muted-foreground mt-4">
          Quality is based on: word count, local specificity, internal linking, uniqueness, and review status.
          These are simple heuristics—final responsibility lies with the site operator.
        </p>
      </CardContent>
    </Card>
  );
}
