import { createContext, useContext, useState, useEffect } from "react";
import { useLocation } from "wouter";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Check if user is already logged in from localStorage
    const storedUser = localStorage.getItem("user");
    const storedRole = localStorage.getItem("role");
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      if (storedRole) {
        setRole(storedRole);
      }
    }
    
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    setLocation("/role-selection");
  };

  const selectRole = (selectedRole) => {
    setRole(selectedRole);
    localStorage.setItem("role", selectedRole);
    
    // Redirect based on role
    if (selectedRole === "employee") {
      setLocation("/employee/dashboard");
    } else if (selectedRole === "client-admin") {
      setLocation("/client-admin/dashboard");
    } else if (selectedRole === "vendor") {
      setLocation("/vendor/dashboard");
    }
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    setLocation("/");
  };

  const isAuthenticated = !!user;

  const value = {
    user,
    role,
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
