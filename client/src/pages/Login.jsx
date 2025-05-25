import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormItem, FormControl, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    rememberMe: false
  });
  const { login } = useAuth();
  const { toast } = useToast();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

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

    // Registration specific validation
    if (!isLogin) {
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
    }
    
    // Demo login/register logic - in a real app this would call the API
    login({
      email: formData.email,
      name: isLogin ? formData.email.split('@')[0] : formData.name
    });
    
    toast({
      title: "Success",
      description: isLogin ? "You are now logged in" : "Registration successful",
      variant: "success"
    });
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
