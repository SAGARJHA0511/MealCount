import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AccountCircle, Restaurant, People } from "@/components/ui/icons";

export default function RoleSelection() {
  const { selectRole } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">MealMate</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Streamlined meal management for organizations
          </p>
        </div>

        <Card>
          <CardContent className="py-8">
            <h3 className="text-lg font-medium text-gray-900 mb-6 text-center">Select your role</h3>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Button
                variant="outline"
                className="relative bg-white border rounded-lg px-6 py-5 flex flex-col items-center space-y-3 hover:bg-gray-50 h-auto"
                onClick={() => selectRole("employee")}
              >
                <AccountCircle className="h-6 w-6 text-primary-600" />
                <span className="text-sm font-medium text-gray-900">Employee</span>
              </Button>
              
              <Button
                variant="outline"
                className="relative bg-white border rounded-lg px-6 py-5 flex flex-col items-center space-y-3 hover:bg-gray-50 h-auto"
                onClick={() => selectRole("client-admin")}
              >
                <People className="h-6 w-6 text-primary-600" />
                <span className="text-sm font-medium text-gray-900">Client Admin</span>
              </Button>
              
              <Button
                variant="outline"
                className="relative bg-white border rounded-lg px-6 py-5 flex flex-col items-center space-y-3 hover:bg-gray-50 h-auto"
                onClick={() => selectRole("vendor")}
              >
                <Restaurant className="h-6 w-6 text-primary-600" />
                <span className="text-sm font-medium text-gray-900">Vendor</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
