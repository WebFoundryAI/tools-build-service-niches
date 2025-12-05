import { AlertTriangle, BookOpen, CheckCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const AIContentPolicyPanel = () => {
  return (
    <Alert className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800 mb-6">
      <AlertTriangle className="h-5 w-5 text-amber-600" />
      <AlertTitle className="text-amber-800 dark:text-amber-200 font-semibold">
        AI Content Policy & Best Practices
      </AlertTitle>
      <AlertDescription className="text-amber-700 dark:text-amber-300 mt-2 space-y-3">
        <p>
          <strong>Google allows AI-generated content</strong> as long as it is helpful, original, 
          and created primarily for users—not to manipulate search rankings.
        </p>
        
        <div className="bg-white/50 dark:bg-black/20 rounded-lg p-3 space-y-2">
          <p className="font-medium flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Key Guidelines:
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>
              Using automation to generate many pages with little value can violate 
              <strong> scaled content abuse</strong> policies
            </li>
            <li>
              Always <strong>review and improve</strong> generated content before publishing
            </li>
            <li>
              Add <strong>local proof</strong>: real photos, case studies, verified testimonials
            </li>
            <li>
              Keep <strong>E-E-A-T</strong> (Experience, Expertise, Authoritativeness, Trustworthiness) in mind
            </li>
          </ul>
        </div>

        <div className="flex items-start gap-2 text-sm bg-green-100/50 dark:bg-green-900/20 p-2 rounded">
          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
          <p>
            <strong>Recommended workflow:</strong> Generate in small batches → Review each page → 
            Add unique local details → Mark as reviewed → Only then enable indexing.
          </p>
        </div>
      </AlertDescription>
    </Alert>
  );
};
