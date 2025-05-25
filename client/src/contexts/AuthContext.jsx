import { createContext, useContext, useState, useEffect } from "react";
import { useLocation } from "wouter";
import { generateCouponCode } from "@/lib/utils";

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

  // Generate a new vendor ID
  const generateVendorId = () => {
    // Format: VEN-XXXX where X is an uppercase letter or number
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "VEN-";
    for (let i = 0; i < 4; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const register = (userData, selectedRole) => {
    let updatedUserData = { ...userData, role: selectedRole };
    
    // If registering as a vendor, generate a vendor ID
    if (selectedRole === "vendor") {
      const newVendorId = generateVendorId();
      updatedUserData = { ...updatedUserData, vendorId: newVendorId };
      setVendorId(newVendorId);
      localStorage.setItem("vendorId", newVendorId);
    }
    
    setUser(updatedUserData);
    setRole(selectedRole);
    localStorage.setItem("user", JSON.stringify(updatedUserData));
    localStorage.setItem("role", selectedRole);
    
    // After registration, redirect to login
    setLocation("/");
  };

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    
    // If role is provided during login, set it directly
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
    register,
    logout,
    selectRole,
    isAuthenticated,
    generateVendorId
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
