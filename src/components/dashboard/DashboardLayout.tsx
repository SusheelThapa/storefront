import { SidebarProvider, SidebarTrigger, SidebarRail } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./DashboardSidebar";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <DashboardSidebar />
        <main className="flex-1 p-8">
          <div className="flex items-center justify-between mb-8">
            <SidebarTrigger className="lg:hidden" />
          </div>
          {children}
        </main>
        <SidebarRail />
      </div>
    </SidebarProvider>
  );
}