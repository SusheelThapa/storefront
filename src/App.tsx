import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/providers/AuthProvider";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Products from "./pages/dashboard/Products";
import Categories from "./pages/dashboard/Categories";
import Dashboard from "./pages/dashboard/Dashboard";
import Auth from "./pages/auth/Auth";

const queryClient = new QueryClient();

/**
 * The main application component that sets up the context providers and routing.
 *
 * This component includes:
 * - QueryClientProvider: Provides React Query context for data fetching.
 * - BrowserRouter: Provides routing capabilities.
 * - AuthProvider: Provides authentication context.
 * - TooltipProvider: Provides tooltip context.
 * - Toaster and Sonner: Provides toast notifications.
 *
 * Routes:
 * - "/" redirects to "/auth".
 * - "/auth" renders the Auth component.
 * - "/dashboard" renders the Dashboard component within a ProtectedRoute.
 * - "/dashboard/products" renders the Products component within a ProtectedRoute.
 * - "/dashboard/categories" renders the Categories component within a ProtectedRoute.
 */
const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Navigate to="/auth" replace />} />
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/products"
              element={
                <ProtectedRoute>
                  <Products />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/categories"
              element={
                <ProtectedRoute>
                  <Categories />
                </ProtectedRoute>
              }
            />
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
