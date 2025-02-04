import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Category } from "@/types";

interface CategoryTableProps {
  categories: Category[];
  isLoading: boolean;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
  onSelect: (category: Category) => void;
}

export function CategoryTable({ 
  categories, 
  isLoading, 
  onEdit, 
  onDelete, 
  onSelect 
}: CategoryTableProps) {
  if (isLoading) {
    return <div className="text-sm text-gray-500">Loading...</div>;
  }

  if (categories.length === 0) {
    return <div className="text-sm text-gray-500">No categories found</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Image</TableHead>
          <TableHead className="w-[100px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {categories.map((category) => (
          <TableRow 
            key={category.id}
            className="cursor-pointer hover:bg-gray-50"
            onClick={() => onSelect(category)}
          >
            <TableCell>{category.name}</TableCell>
            <TableCell>
              <img
                src={category.image}
                alt={category.name}
                className="w-16 h-16 object-cover rounded"
              />
            </TableCell>
            <TableCell onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(category)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(category.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}