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
import { AuthProvider } from "./contexts/AuthContext";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Login} />
      <Route path="/employee/dashboard" component={EmployeeDashboard} />
      <Route path="/client-admin/dashboard" component={ClientAdminDashboard} />
      <Route path="/vendor/dashboard" component={VendorDashboard} />
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
