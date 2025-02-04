import { useEffect, useState } from "react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent } from "@/components/ui/sidebar";
import { supabase } from "@/integrations/supabase/client";
import { SidebarHeader } from "./sidebar/SidebarHeader";
import { SidebarNavigation } from "./sidebar/SidebarNavigation";
import { SidebarLogout } from "./sidebar/SidebarLogout";

export function DashboardSidebar() {
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const getUserEmail = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email);
      }
    };
    getUserEmail();
  }, []);

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarHeader userEmail={userEmail} />
          <SidebarGroupContent>
            <SidebarNavigation />
            <SidebarLogout />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}