import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package2, LayoutGrid } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Dashboard component that displays an overview of products and categories.
 *
 * This component fetches the total count of products and categories from the database
 * using Supabase and displays them in a dashboard layout.
 *
 * @returns {JSX.Element} The rendered dashboard component.
 */
export default function Dashboard() {
  const { data: productsCount = 0 } = useQuery({
    queryKey: ["products-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true });

      if (error) throw error;
      return count || 0;
    },
  });

  const { data: categoriesCount = 0 } = useQuery({
    queryKey: ["categories-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("categories")
        .select("*", { count: "exact", head: true });

      if (error) throw error;
      return count || 0;
    },
  });

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Products
            </CardTitle>
            <Package2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productsCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Categories
            </CardTitle>
            <LayoutGrid className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categoriesCount}</div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
