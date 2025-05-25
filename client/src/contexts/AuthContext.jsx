import { createContext, useContext, useState, useEffect } from "react";
import { useLocation } from "wouter";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [vendorId, setVendorId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Check if user is already logged in from localStorage
    const storedUser = localStorage.getItem("user");
    const storedRole = localStorage.getItem("role");
    const storedVendorId = localStorage.getItem("vendorId");
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      if (storedRole) {
        setRole(storedRole);
      }
      if (storedVendorId) {
        setVendorId(storedVendorId);
      }
    }
    
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    
    // If role is provided during login/registration, set it directly
    if (userData.role) {
      setRole(userData.role);
      localStorage.setItem("role", userData.role);
      
      // Store vendor ID if available
      if (userData.vendorId) {
        setVendorId(userData.vendorId);
        localStorage.setItem("vendorId", userData.vendorId);
      }
      
      // Redirect based on role
      redirectBasedOnRole(userData.role);
    } else {
      // Fallback for backward compatibility
      setLocation("/");
    }
  };

  const redirectBasedOnRole = (roleValue) => {
    if (roleValue === "employee") {
      setLocation("/employee/dashboard");
    } else if (roleValue === "client-admin") {
      setLocation("/client-admin/dashboard");
    } else if (roleValue === "vendor") {
      setLocation("/vendor/dashboard");
    }
  };

  // Keep selectRole for backward compatibility
  const selectRole = (selectedRole) => {
    setRole(selectedRole);
    localStorage.setItem("role", selectedRole);
    redirectBasedOnRole(selectedRole);
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    setVendorId(null);
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    localStorage.removeItem("vendorId");
    setLocation("/");
  };

  const isAuthenticated = !!user;

  const value = {
    user,
    role,
    vendorId,
    loading,
    login,
    logout,
    selectRole,
    isAuthenticated
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
