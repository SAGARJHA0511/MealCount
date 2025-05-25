import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormItem, FormControl, FormLabel } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }
    
    // Demo login logic - in a real app this would call the API
    login({
      email: formData.email,
      name: formData.email.split('@')[0]
    });
    
    toast({
      title: "Success",
      description: "You are now logged in",
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
              <div className="inline-flex rounded-md" role="group">
                <Button
                  type="button"
                  className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                    isLogin 
                      ? "text-white bg-primary-600" 
                      : "text-gray-700 bg-white border border-gray-200 hover:bg-gray-100"
                  }`}
                  onClick={() => setIsLogin(true)}
                >
                  Login
                </Button>
                <Button
                  type="button"
                  className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                    !isLogin 
                      ? "text-white bg-primary-600" 
                      : "text-gray-700 bg-white border border-gray-200 hover:bg-gray-100"
                  }`}
                  onClick={() => setIsLogin(false)}
                >
                  Register
                </Button>
              </div>
            </div>
            
            <Form onSubmit={handleSubmit}>
              <FormItem>
                <FormLabel htmlFor="email">Email address</FormLabel>
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

              <FormItem className="mt-4">
                <FormLabel htmlFor="password">Password</FormLabel>
                <FormControl>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </FormControl>
              </FormItem>

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center">
                  <Checkbox
                    id="remember-me"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onCheckedChange={(checked) => 
                      setFormData({ ...formData, rememberMe: checked })
                    }
                  />
                  <Label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    Remember me
                  </Label>
                </div>

                <div className="text-sm">
                  <Link href="#" className="font-medium text-primary-600 hover:text-primary-500">
                    Forgot your password?
                  </Link>
                </div>
              </div>

              <div className="mt-6">
                <Button type="submit" className="w-full bg-primary-600 hover:bg-primary-700">
                  {isLogin ? "Sign in" : "Sign up"}
                </Button>
              </div>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
