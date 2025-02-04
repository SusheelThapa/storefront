import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CategoryForm } from "@/components/categories/CategoryForm";
import { CategoryDetails } from "@/components/categories/CategoryDetails";
import { CategoryTable } from "@/components/categories/CategoryTable";
import { CategoryHeader } from "@/components/categories/CategoryHeader";
import { Category } from "@/types";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/**
 * Categories component that displays a list of categories with functionality to add, update, and delete categories.
 *
 * This component fetches categories from the database using Supabase and displays them in a table.
 * It allows users to create, update, and delete categories, and provides a form for adding and editing categories.
 *
 * @returns {JSX.Element} The rendered categories component.
 */
export default function Categories() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | undefined>();
  const [selectedCategoryForDetails, setSelectedCategoryForDetails] = useState<Category | null>(null);
  const queryClient = useQueryClient();

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('category_id', { ascending: true });
      
      if (error) throw error;
      
      return data.map(category => ({
        id: category.category_id.toString(),
        name: category.name,
        image: category.image_url
      }));
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: Partial<Category>) => {
      const { data: result, error } = await supabase
        .from('categories')
        .insert([
          {
            name: data.name,
            image_url: data.image
          }
        ])
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setIsDialogOpen(false);
      toast.success("Category created");
    },
    onError: () => {
      toast.error("Something went wrong");
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (data: Partial<Category>) => {
      const { error } = await supabase
        .from('categories')
        .update({
          name: data.name,
          image_url: data.image
        })
        .eq('category_id', parseInt(selectedCategory?.id || '0'));
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setIsDialogOpen(false);
      setSelectedCategory(undefined);
      toast.success("Category updated");
    },
    onError: () => {
      toast.error("Something went wrong");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('category_id', parseInt(id));
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success("Category deleted");
    },
    onError: () => {
      toast.error("Something went wrong");
    }
  });

  const handleCreate = (data: Partial<Category>) => {
    createMutation.mutate(data);
  };

  const handleUpdate = (data: Partial<Category>) => {
    updateMutation.mutate(data);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <DashboardLayout>
      <CategoryHeader onAdd={() => {
        setSelectedCategory(undefined);
        setIsDialogOpen(true);
      }} />
      
      <Card className="p-6 overflow-x-auto">
        <CategoryTable 
          categories={categories}
          isLoading={isLoading}
          onEdit={(category) => {
            setSelectedCategory(category);
            setIsDialogOpen(true);
          }}
          onDelete={handleDelete}
          onSelect={setSelectedCategoryForDetails}
        />
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedCategory ? "Edit Category" : "Add Category"}
            </DialogTitle>
          </DialogHeader>
          <CategoryForm
            initialData={selectedCategory}
            onSubmit={selectedCategory ? handleUpdate : handleCreate}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <CategoryDetails 
        category={selectedCategoryForDetails}
        onClose={() => setSelectedCategoryForDetails(null)}
      />
    </DashboardLayout>
  );
}