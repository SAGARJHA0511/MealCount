import { useAuth } from "@/contexts/AuthContext";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { AccountCircle, Dashboard, People, Restaurant, Assessment, Settings, CancelCircle } from "@/components/ui/icons";

export default function Sidebar({ onClose }) {
  const { logout, user, role } = useAuth();
  const [location] = useLocation();

  const roleSpecificLinks = () => {
    if (role === "client-admin") {
      return [
        { href: "/client-admin/dashboard", label: "Dashboard", icon: <Dashboard className="mr-3 text-gray-400" /> },
        { href: "/client-admin/employees", label: "Employees", icon: <People className="mr-3 text-gray-400" /> },
        { href: "/client-admin/meal-counts", label: "Meal Counts", icon: <Restaurant className="mr-3 text-gray-400" /> },
        { href: "/client-admin/reports", label: "Reports", icon: <Assessment className="mr-3 text-gray-400" /> },
        { href: "/client-admin/settings", label: "Settings", icon: <Settings className="mr-3 text-gray-400" /> }
      ];
    } else if (role === "vendor") {
      return [
        { href: "/vendor/dashboard", label: "Dashboard", icon: <Dashboard className="mr-3 text-gray-400" /> },
        { href: "/vendor/menu", label: "Manage Menu", icon: <Restaurant className="mr-3 text-gray-400" /> },
        { href: "/vendor/feedback", label: "Feedback", icon: <CancelCircle className="mr-3 text-gray-400" /> },
        { href: "/vendor/analytics", label: "Analytics", icon: <Assessment className="mr-3 text-gray-400" /> },
        { href: "/vendor/settings", label: "Settings", icon: <Settings className="mr-3 text-gray-400" /> }
      ];
    }
    return [];
  };

  return (
    <div className="flex flex-col w-64">
      <div className="flex flex-col h-0 flex-1 bg-white border-r">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <h1 className="text-xl font-bold text-primary-600">MealMate</h1>
          </div>
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {roleSpecificLinks().map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={cn(
                  location === link.href
                    ? "bg-primary-50 text-primary-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                  "group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                )}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex-shrink-0 flex border-t p-4">
          <button onClick={logout} className="flex-shrink-0 group block">
            <div className="flex items-center">
              <div>
                <AccountCircle className="text-gray-500 h-8 w-8" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
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
