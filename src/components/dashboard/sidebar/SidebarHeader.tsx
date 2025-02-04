import { User } from "lucide-react";

interface SidebarHeaderProps {
  userEmail: string | null;
}

export function SidebarHeader({ userEmail }: SidebarHeaderProps) {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold text-primary">Storefront</h1>
      {userEmail && (
        <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
          <User className="h-4 w-4" />
          <span className="truncate">{userEmail}</span>
        </div>
      )}
    </div>
  );
}