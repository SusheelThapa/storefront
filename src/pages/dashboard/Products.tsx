import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Search, ArrowUpDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ProductForm } from "@/components/products/ProductForm";
import { ProductDetails } from "@/components/products/ProductDetails";
import { Product } from "@/types";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";

const ITEMS_PER_PAGE = 5;

type SortConfig = {
  key: keyof Product | null;
  direction: "asc" | "desc";
};

/**
 * Products component that displays a list of products with pagination, sorting, and search functionality.
 *
 * This component fetches products and categories from the database using Supabase and displays them in a table.
 * It allows users to create, update, and delete products, and provides a form for adding and editing products.
 *
 * @returns {JSX.Element} The rendered products component.
 */
export default function Products() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();
  const [selectedProductForDetails, setSelectedProductForDetails] =
    useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: "asc",
  });
  const queryClient = useQueryClient();

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("category_id", { ascending: true });

      if (error) throw error;

      return data.map((category) => ({
        id: category.category_id.toString(),
        name: category.name,
        image: category.image_url,
      }));
    },
  });

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*, categories(*)")
        .order("product_id", { ascending: true });

      if (error) throw error;

      return data.map((product) => ({
        id: product.product_id.toString(),
        name: product.name,
        description: product.description,
        initialStock: product.initial_stock,
        availableStock: product.available_stock,
        categoryId: product.category_id.toString(),
        categoryName: product.categories.name,
        image: product.image_url,
      }));
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: Partial<Product>) => {
      const { data: result, error } = await supabase
        .from("products")
        .insert([
          {
            name: data.name,
            description: data.description,
            image_url: data.image,
            initial_stock: data.initialStock,
            available_stock: data.availableStock,
            category_id: parseInt(data.categoryId || "0"),
          },
        ])
        .select()
        .single();

      console.log(data);
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setIsDialogOpen(false);
      toast.success("Product created");
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: Partial<Product>) => {
      const { error } = await supabase
        .from("products")
        .update({
          name: data.name,
          description: data.description,
          image_url: data.image,
          initial_stock: data.initialStock,
          available_stock: data.availableStock,
          category_id: parseInt(data.categoryId || "0"),
        })
        .eq("product_id", parseInt(selectedProduct?.id || "0"));

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setIsDialogOpen(false);
      setSelectedProduct(undefined);
      toast.success("Product updated");
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("product_id", parseInt(id));

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product deleted");
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  const handleCreate = (data: Partial<Product>) => {
    createMutation.mutate(data);
  };

  const handleUpdate = (data: Partial<Product>) => {
    updateMutation.mutate(data);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteMutation.mutate(id);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      categories
        .find((c) => c.id === product.categoryId)
        ?.name.toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const handleSort = (key: keyof Product) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortConfig.direction === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
    }

    return 0;
  });

  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const SortableHeader = ({
    column,
    label,
  }: {
    column: keyof Product;
    label: string;
  }) => (
    <TableHead
      className="cursor-pointer hover:bg-gray-50"
      onClick={() => handleSort(column)}
    >
      <div className="flex items-center gap-2">
        {label}
        <ArrowUpDown className="h-4 w-4" />
      </div>
    </TableHead>
  );

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Products</h1>
        <Button
          className="bg-primary hover:bg-primary/90"
          onClick={() => {
            setSelectedProduct(undefined);
            setIsDialogOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10"
          />
        </div>
      </div>

      <Card className="p-6">
        {isLoading ? (
          <div className="text-sm text-gray-500">Loading...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-sm text-gray-500">No products found</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <SortableHeader column="name" label="Name" />
                    <TableHead>Description</TableHead>
                    <SortableHeader
                      column="initialStock"
                      label="Initial Stock"
                    />
                    <SortableHeader
                      column="availableStock"
                      label="Available Stock"
                    />
                    <TableHead>Category</TableHead>
                    <TableHead>Image</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedProducts.map((product) => (
                    <TableRow
                      key={product.id}
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => setSelectedProductForDetails(product)}
                    >
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.description}</TableCell>
                      <TableCell>{product.initialStock}</TableCell>
                      <TableCell>{product.availableStock}</TableCell>
                      <TableCell>
                        {
                          categories.find((c) => c.id === product.categoryId)
                            ?.name
                        }
                      </TableCell>
                      <TableCell>
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedProduct(product);
                              setIsDialogOpen(true);
                            }}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(product.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {totalPages > 1 && (
              <div className="mt-4">
                <Pagination>
                  <PaginationContent>
                    {currentPage > 1 && (
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => handlePageChange(currentPage - 1)}
                        />
                      </PaginationItem>
                    )}

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => handlePageChange(page)}
                            isActive={currentPage === page}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      )
                    )}

                    {currentPage < totalPages && (
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => handlePageChange(currentPage + 1)}
                        />
                      </PaginationItem>
                    )}
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedProduct ? "Edit Product" : "Add Product"}
            </DialogTitle>
          </DialogHeader>
          <ProductForm
            initialData={selectedProduct}
            categories={categories}
            onSubmit={selectedProduct ? handleUpdate : handleCreate}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <ProductDetails
        product={selectedProductForDetails}
        onClose={() => setSelectedProductForDetails(null)}
      />
    </DashboardLayout>
  );
}
