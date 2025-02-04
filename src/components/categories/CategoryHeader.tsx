import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface CategoryHeaderProps {
  onAdd: () => void;
}

export function CategoryHeader({ onAdd }: CategoryHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
      <Button
        className="bg-primary hover:bg-primary/90"
        onClick={onAdd}
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Category
      </Button>
    </div>
  );
}