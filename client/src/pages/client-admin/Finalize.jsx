import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Sidebar from "@/components/layout/Sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CancelCircle, Menu as MenuIcon, Restaurant, CheckCircle, Clock } from "@/components/ui/icons";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export default function ClientAdminFinalize() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [mealCounts, setMealCounts] = useState(() => {
    const savedCounts = localStorage.getItem("adminMealCounts");
    if (savedCounts) {
      return JSON.parse(savedCounts);
    }
    return {
      departments: [],
      totals: {
        total: 0,
        vegetarian: 0,
        nonVegetarian: 0,
        responded: 0,
        pending: 0
      },
      isFinalized: false,
      submittedToVendor: false
    };
  });
  
  const { toast } = useToast();
  const { user, vendorId } = useAuth();

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);

  // Check if it's after 8 PM (20:00)
  const isAfterCutoff = currentTime.getHours() >= 20;
  const timeUntilCutoff = isAfterCutoff ? 0 : (20 - currentTime.getHours()) * 60 - currentTime.getMinutes();
  
  const handleSubmitToVendor = () => {
    // Save finalized state
    const finalizedData = {
      ...mealCounts,
      submittedToVendor: true,
      submissionTime: new Date().toLocaleString()
    };
    
    setMealCounts(finalizedData);
    localStorage.setItem("adminMealCounts", JSON.stringify(finalizedData));
    
    toast({
      title: "Success!",
      description: "Meal counts have been submitted to the vendor.",
      variant: "success"
    });
    
    setConfirmDialogOpen(false);
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
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">Finalize Meal Counts</h1>
                  <p className="text-gray-500 mt-1">
                    After 8:00 PM, review and submit final meal counts to your vendor.
                  </p>
                </div>
                {!isAfterCutoff && (
                  <div className="mt-4 md:mt-0 bg-yellow-50 px-4 py-2 rounded-md border border-yellow-200 flex items-center">
                    <Clock className="text-yellow-500 h-5 w-5 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800">
                        Cutoff Time: <span className="font-bold">8:00 PM</span>
                      </p>
                      <p className="text-xs text-yellow-700">
                        {timeUntilCutoff > 0 
                          ? `${Math.floor(timeUntilCutoff / 60)}h ${timeUntilCutoff % 60}m remaining`
                          : "Cutoff time reached"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <Card className="mb-6">
                <CardContent className="p-6">
                  {mealCounts.submittedToVendor ? (
                    <div className="text-center py-10">
                      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      </div>
                      <h3 className="mt-4 text-lg font-medium text-gray-900">Meal Counts Submitted!</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        You have successfully submitted the meal counts to your vendor on {mealCounts.submissionTime}.
                      </p>
                      <div className="mt-6">
                        <Button 
                          variant="outline"
                          onClick={() => {
                            // Reset submission status for demo purposes
                            const resetData = {
                              ...mealCounts,
                              submittedToVendor: false
                            };
                            setMealCounts(resetData);
                            localStorage.setItem("adminMealCounts", JSON.stringify(resetData));
                          }}
                        >
                          Reset (Demo Only)
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {!isAfterCutoff ? (
                        <div className="text-center py-10">
                          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
                            <Clock className="h-6 w-6 text-yellow-600" />
                          </div>
                          <h3 className="mt-4 text-lg font-medium text-gray-900">Waiting for Cutoff Time</h3>
                          <p className="mt-1 text-sm text-gray-500">
                            You can finalize and submit meal counts after 8:00 PM when all employee responses have been collected.
                          </p>
                          <div className="mt-6">
                            <Button 
                              variant="outline"
                              onClick={() => {
                                // For demo purposes, we'll allow submission regardless of time
                                setConfirmDialogOpen(true);
                              }}
                            >
                              Override Time (Demo Only)
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="mb-6 bg-blue-50 rounded-lg p-4">
                            <div className="flex items-center mb-2">
                              <Restaurant className="h-5 w-5 text-blue-500 mr-2" />
                              <h3 className="text-lg font-medium text-blue-700">Meal Count Summary</h3>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                              <div className="bg-white rounded-lg p-4 shadow-sm">
                                <p className="text-sm text-gray-500">Total</p>
                                <p className="text-2xl font-bold text-gray-900">{mealCounts.totals.total}</p>
                              </div>
                              <div className="bg-white rounded-lg p-4 shadow-sm">
                                <p className="text-sm text-gray-500">Vegetarian</p>
                                <p className="text-2xl font-bold text-green-600">{mealCounts.totals.vegetarian}</p>
                              </div>
                              <div className="bg-white rounded-lg p-4 shadow-sm">
                                <p className="text-sm text-gray-500">Non-Vegetarian</p>
                                <p className="text-2xl font-bold text-red-600">{mealCounts.totals.nonVegetarian}</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mb-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Meal Counts by Department</h3>
                            <div className="overflow-x-auto">
                              <Table>
                                <TableHeader className="bg-gray-50">
                                  <TableRow>
                                    <TableHead className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</TableHead>
                                    <TableHead className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</TableHead>
                                    <TableHead className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vegetarian</TableHead>
                                    <TableHead className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Non-Vegetarian</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {mealCounts.departments.map(dept => (
                                    <TableRow key={dept.id} className="border-b border-gray-200">
                                      <TableCell className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{dept.name}</TableCell>
                                      <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{dept.total}</TableCell>
                                      <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{dept.vegetarian}</TableCell>
                                      <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{dept.nonVegetarian}</TableCell>
                                    </TableRow>
                                  ))}
                                  <TableRow className="bg-gray-50">
                                    <TableCell className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Total</TableCell>
                                    <TableCell className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{mealCounts.totals.total}</TableCell>
                                    <TableCell className="px-4 py-4 whitespace-nowrap text-sm font-medium text-green-700">{mealCounts.totals.vegetarian}</TableCell>
                                    <TableCell className="px-4 py-4 whitespace-nowrap text-sm font-medium text-red-700">{mealCounts.totals.nonVegetarian}</TableCell>
                                  </TableRow>
                                </TableBody>
                              </Table>
                            </div>
                          </div>
                          
                          <div className="mt-6 mb-4">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Vendor Information</h3>
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                              <p className="text-sm text-gray-700 mb-1">
                                <span className="font-medium">Vendor ID:</span> {vendorId || "Not connected to a vendor"}
                              </p>
                              <p className="text-sm text-gray-700 mb-1">
                                <span className="font-medium">Vendor Name:</span> {user?.vendorName || "Fresh Eats Catering"}
                              </p>
                              <p className="text-sm text-gray-700">
                                <span className="font-medium">Contact:</span> {user?.vendorContact || "vendor@example.com"}
                              </p>
                            </div>
                          </div>
                          
                          <div className="mt-6 flex justify-end">
                            <Button 
                              variant="default"
                              className="flex items-center"
                              onClick={() => setConfirmDialogOpen(true)}
                            >
                              <CheckCircle className="h-4 w-4 mr-1.5" />
                              Submit to Vendor
                            </Button>
                          </div>
                        </>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
      
      {/* Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Submission</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-500 mb-4">
              Are you sure you want to submit these meal counts to your vendor? 
              This action cannot be undone.
            </p>
            
            <div className="bg-blue-50 p-3 rounded-md mb-4">
              <div className="flex items-center justify-between text-sm text-blue-700 mb-1">
                <span>Total Meals:</span>
                <span className="font-bold">{mealCounts.totals.total}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-green-700 mb-1">
                <span>Vegetarian:</span>
                <span className="font-bold">{mealCounts.totals.vegetarian}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-red-700">
                <span>Non-Vegetarian:</span>
                <span className="font-bold">{mealCounts.totals.nonVegetarian}</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitToVendor}>
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}