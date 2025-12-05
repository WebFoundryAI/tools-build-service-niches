import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface BatchSizeWarningModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  onReduceBatch: () => void;
  requestedCount: number;
  maxRecommended: number;
}

export const BatchSizeWarningModal = ({
  open,
  onOpenChange,
  onConfirm,
  onReduceBatch,
  requestedCount,
  maxRecommended,
}: BatchSizeWarningModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-amber-600">
            <AlertTriangle className="h-5 w-5" />
            Large Batch Warning
          </DialogTitle>
          <DialogDescription className="space-y-2">
            <p>
              You're requesting to generate <strong>{requestedCount}</strong> items at once. 
              We recommend batches of <strong>{maxRecommended} or fewer</strong> to ensure quality review.
            </p>
            <p className="text-amber-600 dark:text-amber-400">
              Generating many pages without review can lead to low-value content that may 
              be flagged as scaled content abuse by search engines.
            </p>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onReduceBatch}>
            Reduce to {maxRecommended}
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Generate {requestedCount} Anyway
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
