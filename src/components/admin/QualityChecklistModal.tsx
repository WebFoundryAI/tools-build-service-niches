import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertTriangle } from "lucide-react";

interface QualityChecklistModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  itemCount: number;
  actionType: "blog" | "content";
}

const CHECKLIST_ITEMS = [
  {
    id: "review",
    label: "I will review and edit this content before publishing or linking it heavily.",
  },
  {
    id: "local-proof",
    label: "Each page will include local proof, specific details, or genuinely useful information beyond boilerplate.",
  },
  {
    id: "spam-warning",
    label: "I understand that generating many near-duplicate pages just to rank can be treated as spam.",
  },
];

export const QualityChecklistModal = ({
  open,
  onOpenChange,
  onConfirm,
  itemCount,
  actionType,
}: QualityChecklistModalProps) => {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const allChecked = CHECKLIST_ITEMS.every((item) => checkedItems[item.id]);

  const handleConfirm = () => {
    if (allChecked) {
      onConfirm();
      setCheckedItems({});
      onOpenChange(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setCheckedItems({});
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Quality & Originality Checklist
          </DialogTitle>
          <DialogDescription>
            You are about to generate {itemCount} {actionType === "blog" ? "blog post(s)" : "content item(s)"}. 
            Please confirm you understand the following before proceeding.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {CHECKLIST_ITEMS.map((item) => (
            <div key={item.id} className="flex items-start space-x-3">
              <Checkbox
                id={item.id}
                checked={checkedItems[item.id] || false}
                onCheckedChange={(checked) =>
                  setCheckedItems((prev) => ({ ...prev, [item.id]: checked === true }))
                }
                className="mt-1"
              />
              <label
                htmlFor={item.id}
                className="text-sm leading-relaxed cursor-pointer"
              >
                {item.label}
              </label>
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!allChecked}>
            I Understand, Proceed
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
