import { Route, Switch } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import NotFound from "./pages/not-found";
import Login from "./pages/Login";
import EmployeeDashboard from "./pages/employee/Dashboard";
import ClientAdminDashboard from "./pages/client-admin/Dashboard";
import VendorDashboard from "./pages/vendor/Dashboard";
import VendorSpecialMenu from "./pages/vendor/SpecialMenu";
import VendorVerifyCoupons from "./pages/vendor/VerifyCoupons";
import VendorPrintReport from "./pages/vendor/PrintReport";
import ClientAdminMealCounts from "./pages/client-admin/MealCounts";
import ClientAdminFinalize from "./pages/client-admin/Finalize";
import { AuthProvider } from "./contexts/AuthContext";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Login} />
      <Route path="/employee/dashboard" component={EmployeeDashboard} />
      <Route path="/client-admin/dashboard" component={ClientAdminDashboard} />
      <Route path="/client-admin/meal-counts" component={ClientAdminMealCounts} />
      <Route path="/client-admin/finalize" component={ClientAdminFinalize} />
      <Route path="/vendor/dashboard" component={VendorDashboard} />
      <Route path="/vendor/special-menu" component={VendorSpecialMenu} />
      <Route path="/vendor/verify-coupons" component={VendorVerifyCoupons} />
      <Route path="/vendor/print-report" component={VendorPrintReport} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Router />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
