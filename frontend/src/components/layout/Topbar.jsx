import { Bell } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Topbar() {

  const { user , logout } = useAuth();

  const initials = user?.name
    ?.split(" ")
    .map(word => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="h-16 w-full flex items-center justify-between px-8 sticky top-0 z-10 bg-app-bg/80 backdrop-blur-md border-b border-app-border">

      {/* Left */}
      <div className="flex items-center">
        <span className="text-sm font-medium text-app-text-secondary tracking-tight">
          Apple Finance /
          <span className="text-app-text">
            {" "}Workspace
          </span>
        </span>
      </div>

      
     

    </header>
  );
}