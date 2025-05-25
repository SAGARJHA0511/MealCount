import { useAuth } from "@/contexts/AuthContext";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { AccountCircle, Dashboard, People, Restaurant, Assessment, Settings, CancelCircle, Star, FileDownload, CheckCircle } from "@/components/ui/icons";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";

export default function Sidebar({ onClose }) {
  const { logout, user, role, vendorId } = useAuth();
  const [location] = useLocation();
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    // Set active section based on current path
    if (location) {
      const path = location.split('/');
      if (path.length > 2) {
        setActiveSection(path[2]);
      }
    }
  }, [location]);

  // Handle close for mobile
  const handleLinkClick = () => {
    if (onClose) {
      onClose();
    }
  };

  const roleSpecificLinks = () => {
    if (role === "client-admin") {
      return [
        { href: "/client-admin/dashboard", label: "Dashboard", icon: <Dashboard className="mr-3 text-gray-400" /> },
        { href: "/client-admin/employees", label: "Employees", icon: <People className="mr-3 text-gray-400" /> },
        { href: "/client-admin/meal-counts", label: "Meal Counts", icon: <Restaurant className="mr-3 text-gray-400" />, badge: "New" },
        { href: "/client-admin/finalize", label: "Finalize Counts", icon: <CheckCircle className="mr-3 text-gray-400" />, badge: "New" },
        { href: "/client-admin/reports", label: "Reports", icon: <Assessment className="mr-3 text-gray-400" /> },
        { href: "/client-admin/settings", label: "Settings", icon: <Settings className="mr-3 text-gray-400" /> }
      ];
    } else if (role === "vendor") {
      return [
        { href: "/vendor/dashboard", label: "Dashboard", icon: <Dashboard className="mr-3 text-gray-400" /> },
        { href: "/vendor/menu", label: "Regular Menu", icon: <Restaurant className="mr-3 text-gray-400" /> },
        { href: "/vendor/special-menu", label: "Special Menu", icon: <Star className="mr-3 text-gray-400" />, badge: "New" },
        { href: "/vendor/verify-coupons", label: "Verify Coupons", icon: <CheckCircle className="mr-3 text-gray-400" />, badge: "New" },
        { href: "/vendor/print-report", label: "Print Reports", icon: <FileDownload className="mr-3 text-gray-400" />, badge: "New" },
        { href: "/vendor/feedback", label: "Feedback", icon: <CancelCircle className="mr-3 text-gray-400" /> },
        { href: "/vendor/analytics", label: "Analytics", icon: <Assessment className="mr-3 text-gray-400" /> },
        { href: "/vendor/settings", label: "Settings", icon: <Settings className="mr-3 text-gray-400" /> }
      ];
    } else if (role === "employee") {
      return [
        { href: "/employee/dashboard", label: "Dashboard", icon: <Dashboard className="mr-3 text-gray-400" /> },
        { href: "/employee/menu", label: "View Menu", icon: <Restaurant className="mr-3 text-gray-400" /> },
        { href: "/employee/specials", label: "Special Menu", icon: <Star className="mr-3 text-gray-400" /> },
        { href: "/employee/history", label: "Order History", icon: <Assessment className="mr-3 text-gray-400" /> },
      ];
    }
    return [];
  };

  return (
    <div className="flex flex-col w-64 h-full">
      <div className="flex flex-col h-full bg-white border-r">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center justify-between flex-shrink-0 px-4 mb-2">
            <h1 className="text-xl font-bold text-primary-600">MealMate</h1>
            {onClose && (
              <button 
                onClick={onClose}
                className="md:hidden p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <span className="sr-only">Close sidebar</span>
                <CancelCircle className="h-6 w-6" />
              </button>
            )}
          </div>
          
          {role === "vendor" && vendorId && (
            <div className="mx-4 mb-4 p-3 bg-blue-50 rounded-md border border-blue-100">
              <p className="text-xs text-blue-500 font-medium mb-1">Your Vendor ID</p>
              <p className="text-sm font-bold text-blue-700">{vendorId}</p>
              <p className="text-xs text-blue-500 mt-1">Share with clients to connect</p>
            </div>
          )}
          
          <nav className="mt-2 flex-1 px-2 space-y-1">
            {roleSpecificLinks().map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                onClick={handleLinkClick}
                className={cn(
                  location === link.href
                    ? "bg-primary-50 text-primary-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                  "group flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md"
                )}
              >
                <div className="flex items-center">
                  {link.icon}
                  {link.label}
                </div>
                {link.badge && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                    {link.badge}
                  </Badge>
                )}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex-shrink-0 flex border-t p-4">
          <button onClick={logout} className="flex-shrink-0 group block w-full">
            <div className="flex items-center">
              <div>
                <AccountCircle className="text-gray-500 h-8 w-8" />
              </div>
              <div className="ml-3 overflow-hidden">
                <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900 truncate">
                  {user?.name || (role === "vendor" ? "Fresh Eats Catering" : "Sarah Johnson")}
                </p>
                <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">
                  Sign out
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
