import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { QualityScore } from "@/lib/qualityScoring";
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";

interface QualityStatusBadgeProps {
  qualityScore: QualityScore;
  showDetails?: boolean;
}

export function QualityStatusBadge({
  qualityScore,
  showDetails = true,
}: QualityStatusBadgeProps) {
  const { status, signals, summary } = qualityScore;

  const statusConfig = {
    green: {
      icon: CheckCircle2,
      label: "Good",
      className: "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700",
    },
    amber: {
      icon: AlertTriangle,
      label: "Needs Work",
      className: "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-700",
    },
    red: {
      icon: XCircle,
      label: "Not Ready",
      className: "bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700",
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  const failedSignals = signals.filter((s) => !s.passed);

  if (!showDetails) {
    return (
      <Badge variant="outline" className={config.className}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="outline" className={`${config.className} cursor-help`}>
            <Icon className="h-3 w-3 mr-1" />
            {config.label}
          </Badge>
        </TooltipTrigger>
        <TooltipContent className="max-w-sm p-3" side="bottom">
          <p className="font-medium mb-2">{summary}</p>
          {failedSignals.length > 0 && (
            <ul className="text-xs space-y-1">
              {failedSignals.map((signal) => (
                <li
                  key={signal.id}
                  className={
                    signal.severity === "error"
                      ? "text-red-600 dark:text-red-400"
                      : "text-amber-600 dark:text-amber-400"
                  }
                >
                  • {signal.message}
                </li>
              ))}
            </ul>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
