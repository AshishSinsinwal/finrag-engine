import { useState } from "react";
import {
  Plus,
  Clock,
  Pin,
  Settings,
  Layers,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { user, logout } = useAuth();

  const navItems = [
    {
      path: "/",
      label: "New Query",
      icon: Plus
    },
    {
      path: "/history",
      label: "History",
      icon: Clock
    },
    {
      path: "/pinned",
      label: "Pinned Insights",
      icon: Pin
    }
  ];

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.name) return "?";
    return user.name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <aside 
      className={`h-full relative bg-app-surface-secondary border-r border-app-border flex flex-col transition-all duration-300 ${
        isExpanded ? "w-64" : "w-20"
      }`}
    >
      {/* ====================================== */}
      {/* TOGGLE BUTTON */}
      {/* ====================================== */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute -right-3 top-6 bg-white border border-app-border rounded-full p-1 shadow-sm text-app-text-secondary hover:text-app-text transition-colors z-10"
      >
        {isExpanded ? (
          <ChevronLeft className="w-4 h-4" />
        ) : (
          <ChevronRight className="w-4 h-4" />
        )}
      </button>

      {/* ====================================== */}
      {/* BRAND */}
      {/* ====================================== */}
      <div className={`h-16 flex items-center border-b border-transparent overflow-hidden ${
        isExpanded ? "px-6 justify-start" : "justify-center"
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex-shrink-0 rounded-lg bg-app-text flex items-center justify-center shadow-premium">
            <Layers
              className="w-5 h-5 text-app-surface"
              strokeWidth={2}
            />
          </div>
          
          {isExpanded && (
            <span className="font-semibold tracking-tight text-app-text text-sm whitespace-nowrap">
              FinRAG Engine
            </span>
          )}
        </div>
      </div>

      {/* ====================================== */}
      {/* NAVIGATION */}
      {/* ====================================== */}
      <nav className="flex-1 px-3 py-6 space-y-2 overflow-hidden">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              title={!isExpanded ? item.label : undefined} 
              className={({ isActive }) =>
                `w-full flex items-center rounded-lg text-sm font-medium transition-all duration-200 ${
                  isExpanded ? "px-3 py-2 justify-start gap-3" : "py-3 justify-center"
                } ${
                  isActive
                    ? "bg-white text-app-text shadow-sm border border-app-border/50"
                    : "text-app-text-secondary hover:bg-black/5 hover:text-app-text"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className="w-4 h-4 flex-shrink-0"
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  {isExpanded && (
                    <span className="whitespace-nowrap">{item.label}</span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* ====================================== */}
      {/* USER PROFILE & LOGOUT */}
      {/* ====================================== */}
      <div className="border-t border-app-border/50 p-3 overflow-hidden">
        {user ? (
          <div className="space-y-2">
            {/* User Info */}
            <div 
              className={`flex items-center rounded-lg transition-all duration-200 ${
                isExpanded ? "px-2 py-2 gap-3" : "justify-center py-2"
              }`}
            >
              {/* Avatar - always visible */}
              <div 
                className="w-9 h-9 flex-shrink-0 rounded-full bg-app-text text-app-surface flex items-center justify-center font-medium text-sm shadow-sm"
                title={!isExpanded ? user.name || user.email : undefined}
              >
                {getUserInitials()}
              </div>

              {/* User details - only when expanded */}
              {isExpanded && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-app-text truncate">
                    {user.name || "User"}
                  </p>
                  <p className="text-xs text-app-text-secondary truncate">
                    {user.email || ""}
                  </p>
                </div>
              )}
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              title={!isExpanded ? "Logout" : undefined}
              className={`w-full flex items-center rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200 ${
                isExpanded ? "px-3 py-2 justify-start gap-3" : "py-2 justify-center"
              }`}
            >
              <LogOut className="w-4 h-4 flex-shrink-0" strokeWidth={2} />
              {isExpanded && (
                <span className="whitespace-nowrap">Logout</span>
              )}
            </button>
          </div>
        ) : (
          /* Fallback when user is not logged in */
          <div 
            className={`flex items-center rounded-lg transition-all duration-200 ${
              isExpanded ? "px-2 py-2 gap-3" : "justify-center py-2"
            }`}
          >
            <div className="w-9 h-9 flex-shrink-0 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-medium text-sm">
              <User className="w-4 h-4" />
            </div>
            {isExpanded && (
              <div className="flex-1 min-w-0">
                <p className="text-sm text-app-text-secondary">Not logged in</p>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}