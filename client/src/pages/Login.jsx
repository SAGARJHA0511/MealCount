import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormItem, FormControl, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { Info, Restaurant, People, AccountCircle } from "@/components/ui/icons";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Login() {
  // Start with login mode for returning users
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    role: "",
    vendorId: "",
    rememberMe: false
  });
  
  const { login, register, generateVendorId } = useAuth();
  const { toast } = useToast();
  
  // Show a welcome message for first-time visitors
  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisitedBefore");
    if (!hasVisited) {
      toast({
        title: "Welcome to MealMate!",
        description: "Sign in if you have an account, or register to get started.",
        duration: 5000
      });
      localStorage.setItem("hasVisitedBefore", "true");
    }
  }, [toast]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };
  
  const handleSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Mock user database for demo purposes
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    const savedUsers = localStorage.getItem("registeredUsers");
    return savedUsers ? JSON.parse(savedUsers) : [
      { email: "vendor@example.com", password: "password", name: "Vendor Demo", role: "vendor", vendorId: "VEN-ABC123" },
      { email: "admin@example.com", password: "password", name: "Admin Demo", role: "client-admin", vendorId: "VEN-ABC123" },
      { email: "employee@example.com", password: "password", name: "Employee Demo", role: "employee", vendorId: "VEN-ABC123" }
    ];
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.email || !formData.password) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Handle login
    if (isLogin) {
      // Find user by email
      const user = registeredUsers.find(u => u.email === formData.email);
      
      if (!user) {
        toast({
          title: "Error",
          description: "No account found with this email. Please register first.",
          variant: "destructive"
        });
        return;
      }
      
      // Check password (in a real app, this would be properly hashed)
      if (user.password !== formData.password) {
        toast({
          title: "Error",
          description: "Invalid password. Please try again.",
          variant: "destructive"
        });
        return;
      }
      
      // Successfully authenticated - log the user in
      login({
        email: user.email,
        name: user.name,
        role: user.role,
        vendorId: user.vendorId
      });
      
      toast({
        title: "Success",
        description: "You are now logged in",
        variant: "success"
      });
      
      return;
    }
    
    // Handle registration
    if (!isLogin) {
      // Registration specific validation
      if (formData.password !== formData.confirmPassword) {
        toast({
          title: "Error",
          description: "Passwords do not match",
          variant: "destructive"
        });
        return;
      }
      
      if (!formData.name) {
        toast({
          title: "Error",
          description: "Please enter your name",
          variant: "destructive"
        });
        return;
      }
      
      if (!formData.role) {
        toast({
          title: "Error",
          description: "Please select your role",
          variant: "destructive"
        });
        return;
      }
      
      // Check if employee or admin needs vendor ID
      if ((formData.role === "client-admin" || formData.role === "employee") && !formData.vendorId) {
        toast({
          title: "Error",
          description: "Please enter the Vendor ID provided by your vendor",
          variant: "destructive"
        });
        return;
      }
      
      // Check if email is already registered
      if (registeredUsers.some(u => u.email === formData.email)) {
        toast({
          title: "Error",
          description: "This email is already registered. Please log in instead.",
          variant: "destructive"
        });
        return;
      }
      
      // Generate vendor ID for new vendors
      let vendorId = formData.vendorId;
      if (formData.role === "vendor") {
        vendorId = generateVendorId();
      }
      
      // Register new user
      const newUser = {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        role: formData.role,
        vendorId: vendorId
      };
      
      const updatedUsers = [...registeredUsers, newUser];
      setRegisteredUsers(updatedUsers);
      localStorage.setItem("registeredUsers", JSON.stringify(updatedUsers));
      
      // Register in AuthContext (handles redirects to login)
      register(newUser, formData.role);
      
      // Show different success messages based on role
      if (formData.role === "vendor") {
        toast({
          title: "Registration Successful",
          description: `Your Vendor ID is ${vendorId}. Share this with your clients for them to connect to your service.`,
          variant: "success",
          duration: 8000
        });
      } else {
        toast({
          title: "Registration Successful",
          description: "Your account has been created. You can now log in.",
          variant: "success"
        });
      }
      
      // Switch to login mode after successful registration
      setIsLogin(true);
      
      // Clear form except for email to make login easier
      setFormData({
        ...formData,
        password: "",
        confirmPassword: "",
        name: "",
        role: "",
        vendorId: ""
      });
    }
  };

  // Generate role icon based on selection
  const getRoleIcon = (role) => {
    switch(role) {
      case "vendor":
        return <Restaurant className="h-5 w-5 text-primary-600 mr-2" />;
      case "client-admin":
        return <People className="h-5 w-5 text-primary-600 mr-2" />;
      case "employee":
        return <AccountCircle className="h-5 w-5 text-primary-600 mr-2" />;
      default:
        return null;
    }
  };

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
          <CardContent className="pt-6">
            <div className="mb-6 flex justify-center">
              <div className="inline-flex rounded-md shadow-sm" role="group">
                <Button
                  type="button"
                  variant={isLogin ? "default" : "outline"}
                  className="rounded-l-lg"
                  onClick={() => setIsLogin(true)}
                >
                  Login
                </Button>
                <Button
                  type="button"
                  variant={!isLogin ? "default" : "outline"}
                  className="rounded-r-lg"
                  onClick={() => setIsLogin(false)}
                >
                  Register
                </Button>
              </div>
            </div>
            
            <Form onSubmit={handleSubmit}>
              {!isLogin && (
                <FormItem className="mb-4">
                  <FormLabel htmlFor="name">Full Name</FormLabel>
                  <FormControl>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required={!isLogin}
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </FormControl>
                </FormItem>
              )}
              
              <FormItem className="mb-4">
                <FormLabel htmlFor="email">Email Address</FormLabel>
                <FormControl>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </FormControl>
              </FormItem>

              <FormItem className="mb-4">
                <FormLabel htmlFor="password">Password</FormLabel>
                <FormControl>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete={isLogin ? "current-password" : "new-password"}
                    required
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </FormControl>
              </FormItem>

              {!isLogin && (
                <FormItem className="mb-4">
                  <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      required={!isLogin}
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                  </FormControl>
                </FormItem>
              )}
              
              {!isLogin && (
                <FormItem className="mb-4">
                  <FormLabel htmlFor="role">Select Your Role</FormLabel>
                  <Select 
                    value={formData.role} 
                    onValueChange={(value) => handleSelectChange("role", value)}
                  >
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vendor">
                        <div className="flex items-center">
                          <Restaurant className="h-4 w-4 mr-2" />
                          <span>Vendor</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="client-admin">
                        <div className="flex items-center">
                          <People className="h-4 w-4 mr-2" />
                          <span>Client Admin</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="employee">
                        <div className="flex items-center">
                          <AccountCircle className="h-4 w-4 mr-2" />
                          <span>Employee</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {formData.role && (
                    <div className="mt-2 text-sm text-gray-600">
                      {formData.role === "vendor" ? (
                        <div className="flex items-center p-2 bg-green-50 rounded-md">
                          <Info className="h-4 w-4 text-green-500 mr-2" />
                          <span>You'll receive a Vendor ID after registration to share with your clients.</span>
                        </div>
                      ) : (
                        <div className="flex items-center p-2 bg-blue-50 rounded-md">
                          <Info className="h-4 w-4 text-blue-500 mr-2" />
                          <span>You'll need a Vendor ID to complete registration.</span>
                        </div>
                      )}
                    </div>
                  )}
                </FormItem>
              )}
              
              {!isLogin && (formData.role === "client-admin" || formData.role === "employee") && (
                <FormItem className="mb-4">
                  <FormLabel htmlFor="vendorId">Vendor ID</FormLabel>
                  <FormControl>
                    <Input
                      id="vendorId"
                      name="vendorId"
                      type="text"
                      required={!isLogin && (formData.role === "client-admin" || formData.role === "employee")}
                      placeholder="Enter the ID provided by your vendor"
                      value={formData.vendorId}
                      onChange={handleChange}
                    />
                  </FormControl>
                  <p className="text-sm text-gray-500 mt-1">
                    This ID connects you to your vendor's meal service.
                  </p>
                </FormItem>
              )}

              {isLogin && (
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Checkbox
                      id="remember-me"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onCheckedChange={(checked) => 
                        setFormData({ ...formData, rememberMe: checked })
                      }
                    />
                    <Label htmlFor="remember-me" className="ml-2 text-sm text-gray-900">
                      Remember me
                    </Label>
                  </div>

                  <div className="text-sm">
                    <Link href="#" className="font-medium text-blue-600 hover:text-blue-500">
                      Forgot your password?
                    </Link>
                  </div>
                </div>
              )}

              <div className="mt-6">
                <Button type="submit" className="w-full" variant="default">
                  {isLogin ? "Sign in" : "Create Account"}
                </Button>
              </div>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
