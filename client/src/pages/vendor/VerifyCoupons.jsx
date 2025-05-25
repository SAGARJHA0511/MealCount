import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Sidebar from "@/components/layout/Sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, CancelCircle, Menu as MenuIcon } from "@/components/ui/icons";
import { useToast } from "@/hooks/use-toast";

export default function VendorVerifyCoupons() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [verifiedCoupons, setVerifiedCoupons] = useState(() => {
    const savedCoupons = localStorage.getItem("verifiedCoupons");
    return savedCoupons ? JSON.parse(savedCoupons) : [];
  });
  const { toast } = useToast();

  const handleVerifyCoupon = () => {
    if (!couponCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter a coupon code to verify",
        variant: "destructive"
      });
      return;
    }

    // For demo purposes, we'll just check if it's a 4-digit number
    if (!/^\d{4}$/.test(couponCode)) {
      toast({
        title: "Invalid Coupon",
        description: "The coupon code should be a 4-digit number",
        variant: "destructive"
      });
      return;
    }

    // Check if already verified
    if (verifiedCoupons.some(coupon => coupon.code === couponCode)) {
      toast({
        title: "Already Used",
        description: "This coupon has already been used",
        variant: "destructive"
      });
      return;
    }

    // Verify the coupon
    const newVerifiedCoupon = {
      id: Date.now(),
      code: couponCode,
      verified: true,
      timestamp: new Date().toLocaleString(),
      type: Math.random() > 0.5 ? "veg" : "non-veg" // For demo purposes
    };

    const updatedCoupons = [newVerifiedCoupon, ...verifiedCoupons];
    setVerifiedCoupons(updatedCoupons);
    localStorage.setItem("verifiedCoupons", JSON.stringify(updatedCoupons));

    toast({
      title: "Coupon Verified",
      description: `Coupon ${couponCode} has been successfully verified`,
      variant: "success"
    });

    setCouponCode("");
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 flex z-40 md:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <span className="sr-only">Close sidebar</span>
                <CancelCircle className="h-6 w-6 text-white" />
              </button>
            </div>
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}
      
      {/* Sidebar for desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <Sidebar />
      </div>
      
      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Top navigation for mobile */}
        <div className="md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 flex items-center justify-between bg-white shadow-sm z-10">
          <button 
            type="button" 
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <MenuIcon className="h-6 w-6" />
          </button>
          <div className="pr-4">
            <h1 className="text-lg font-bold text-primary-600">MealMate</h1>
          </div>
        </div>
        
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <h1 className="text-2xl font-semibold text-gray-900 mb-4">Verify Meal Coupons</h1>
              <p className="text-gray-500 mb-6">
                Scan or enter employee coupon codes to validate and distribute meals.
              </p>
            </div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <Card className="mb-6">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex-1">
                      <label htmlFor="coupon-code" className="block text-sm font-medium text-gray-700 mb-1">
                        Enter Coupon Code
                      </label>
                      <Input
                        id="coupon-code"
                        type="text"
                        placeholder="Enter 4-digit code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="text-xl tracking-wider font-mono"
                      />
                    </div>
                    <div className="md:self-end mb-1">
                      <Button 
                        onClick={handleVerifyCoupon} 
                        className="w-full md:w-auto"
                        size="lg"
                      >
                        <CheckCircle className="h-5 w-5 mr-2" />
                        Verify Coupon
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Recently Verified Coupons</h2>
                  
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-gray-50">
                        <TableRow>
                          <TableHead className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coupon Code</TableHead>
                          <TableHead className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Verified</TableHead>
                          <TableHead className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Meal Type</TableHead>
                          <TableHead className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {verifiedCoupons.map(coupon => (
                          <TableRow key={coupon.id} className="border-b border-gray-200">
                            <TableCell className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              <span className="font-mono">{coupon.code}</span>
                            </TableCell>
                            <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                              {coupon.timestamp}
                            </TableCell>
                            <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                              <Badge
                                variant="outline"
                                className={`${
                                  coupon.type === "veg" ? "bg-green-100 text-green-800 border-green-200" : "bg-red-100 text-red-800 border-red-200"
                                }`}
                              >
                                {coupon.type === "veg" ? "Vegetarian" : "Non-Vegetarian"}
                              </Badge>
                            </TableCell>
                            <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex items-center">
                                <CheckCircle className="h-5 w-5 text-green-500 mr-1.5" />
                                <span>Verified</span>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    
                    {verifiedCoupons.length === 0 && (
                      <div className="text-center py-8">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                          <CheckCircle className="h-6 w-6 text-green-600" />
                        </div>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No coupons verified yet</h3>
                        <p className="mt-1 text-sm text-gray-500">Verify a coupon to see it appear here.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}