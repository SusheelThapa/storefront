import { X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Product } from "@/types";

interface ProductDetailsProps {
  product: Product | null;
  onClose: () => void;
}

export function ProductDetails({ product, onClose }: ProductDetailsProps) {
  if (!product) return null;

  return (
    <Sheet open={!!product} onOpenChange={() => onClose()}>
      <SheetContent>
        <SheetHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <SheetTitle>{product.name}</SheetTitle>
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <div className="aspect-square overflow-hidden rounded-lg">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="space-y-2">
            <h3 className="font-medium text-gray-500">Description</h3>
            <p className="text-sm">{product.description}</p>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium text-gray-500">Category</h3>
            <p className="text-sm">{product.categoryName}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-medium text-gray-500">Initial Stock</h3>
              <p className="text-sm">{product.price}</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-gray-500">Available Stock</h3>
              <p className="text-sm">{product.availableStock}</p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}