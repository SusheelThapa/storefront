import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Category } from "@/types";

interface CategoryFormProps {
  initialData?: Category;
  onSubmit: (data: Partial<Category>) => void;
  onCancel: () => void;
}

export function CategoryForm({ initialData, onSubmit, onCancel }: CategoryFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    defaultValues: {
      name: initialData?.name || "",
      image: initialData?.image || "",
    },
  });

  const handleSubmit = async (data: Partial<Category>) => {
    try {
      setIsLoading(true);
      await onSubmit(data);
      toast.success(initialData ? "Category updated" : "Category created");
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {initialData ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </Form>
  );
}