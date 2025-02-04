import { useLocation, useNavigate } from "react-router-dom";
import { Package2, LayoutGrid, LayoutDashboard } from "lucide-react";
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";

export function SidebarNavigation() {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      title: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Products",
      path: "/dashboard/products",
      icon: Package2,
    },
    {
      title: "Categories",
      path: "/dashboard/categories",
      icon: LayoutGrid,
    },
  ];

  return (
    <SidebarMenu>
      {menuItems.map((item) => (
        <SidebarMenuItem key={item.path}>
          <SidebarMenuButton
            className={location.pathname === item.path ? "bg-accent/10" : ""}
            onClick={() => navigate(item.path)}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.title}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}