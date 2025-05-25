import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Restaurant, CalendarToday, Feedback } from "@/components/ui/icons";

export default function MobileNav() {
  const [location] = useLocation();

  return (
    <div className="sm:hidden bg-white border-t fixed bottom-0 left-0 right-0 z-10">
      <div className="flex justify-around">
        <Link 
          href="/employee/dashboard" 
          className={cn(
            "inline-flex flex-col items-center px-3 py-2 text-sm font-medium",
            location === "/employee/dashboard" ? "text-primary-600" : "text-gray-500 hover:text-gray-700"
          )}
        >
          <Restaurant className="h-6 w-6" />
          <span>Meals</span>
        </Link>
        <Link 
          href="/employee/menu" 
          className={cn(
            "inline-flex flex-col items-center px-3 py-2 text-sm font-medium",
            location === "/employee/menu" ? "text-primary-600" : "text-gray-500 hover:text-gray-700"
          )}
        >
          <CalendarToday className="h-6 w-6" />
          <span>Menu</span>
        </Link>
        <Link 
          href="/employee/feedback" 
          className={cn(
            "inline-flex flex-col items-center px-3 py-2 text-sm font-medium",
            location === "/employee/feedback" ? "text-primary-600" : "text-gray-500 hover:text-gray-700"
          )}
        >
          <Feedback className="h-6 w-6" />
          <span>Feedback</span>
        </Link>
      </div>
    </div>
  );
}
