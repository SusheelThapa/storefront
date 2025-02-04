import { X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Category } from "@/types";
import { Button } from "@/components/ui/button";

interface CategoryDetailsProps {
  category: Category | null;
  onClose: () => void;
}

export function CategoryDetails({ category, onClose }: CategoryDetailsProps) {
  if (!category) return null;

  return (
    <Sheet open={!!category} onOpenChange={() => onClose()}>
      <SheetContent>
        <SheetHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <SheetTitle>{category.name}</SheetTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <div className="aspect-square overflow-hidden rounded-lg">
            <img
              src={category.image}
              alt={category.name}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="space-y-2">
            <h3 className="font-medium text-gray-500">Name</h3>
            <p className="text-sm">{category.name}</p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}