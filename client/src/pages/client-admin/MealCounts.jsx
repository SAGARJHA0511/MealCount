import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Sidebar from "@/components/layout/Sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CancelCircle, Menu as MenuIcon, Restaurant } from "@/components/ui/icons";
import { useToast } from "@/hooks/use-toast";

export default function ClientAdminMealCounts() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mealCounts, setMealCounts] = useState(() => {
    const savedCounts = localStorage.getItem("adminMealCounts");
    if (savedCounts) {
      return JSON.parse(savedCounts);
    }
    return {
      departments: [
        {
          id: 1,
          name: "Engineering",
          total: 50,
          vegetarian: 18,
          nonVegetarian: 32,
          responded: 48,
          pending: 2
        },
        {
          id: 2,
          name: "Marketing",
          total: 27,
          vegetarian: 12,
          nonVegetarian: 15,
          responded: 25,
          pending: 2
        },
        {
          id: 3,
          name: "Sales",
          total: 33,
          vegetarian: 8,
          nonVegetarian: 25,
          responded: 32,
          pending: 1
        },
        {
          id: 4,
          name: "Finance",
          total: 22,
          vegetarian: 7,
          nonVegetarian: 15,
          responded: 20,
          pending: 2
        }
      ],
      totals: {
        total: 132,
        vegetarian: 45,
        nonVegetarian: 87,
        responded: 125,
        pending: 7
      },
      isFinalized: false
    };
  });
  
  const { toast } = useToast();

  const handleIncrement = (departmentId, type) => {
    const updatedDepartments = mealCounts.departments.map(dept => {
      if (dept.id === departmentId) {
        const updatedDept = { ...dept };
        
        if (type === 'vegetarian') {
          updatedDept.vegetarian += 1;
          updatedDept.total += 1;
        } else if (type === 'nonVegetarian') {
          updatedDept.nonVegetarian += 1;
          updatedDept.total += 1;
        }
        
        return updatedDept;
      }
      return dept;
    });
    
    // Recalculate totals
    const totals = calculateTotals(updatedDepartments);
    
    const updatedMealCounts = {
      ...mealCounts,
      departments: updatedDepartments,
      totals
    };
    
    setMealCounts(updatedMealCounts);
    localStorage.setItem("adminMealCounts", JSON.stringify(updatedMealCounts));
    
    toast({
      title: "Count Updated",
      description: `Increased ${type} count for ${updatedDepartments.find(d => d.id === departmentId).name}`,
      variant: "success"
    });
  };

  const handleDecrement = (departmentId, type) => {
    const updatedDepartments = mealCounts.departments.map(dept => {
      if (dept.id === departmentId) {
        const updatedDept = { ...dept };
        
        if (type === 'vegetarian' && updatedDept.vegetarian > 0) {
          updatedDept.vegetarian -= 1;
          updatedDept.total -= 1;
        } else if (type === 'nonVegetarian' && updatedDept.nonVegetarian > 0) {
          updatedDept.nonVegetarian -= 1;
          updatedDept.total -= 1;
        }
        
        return updatedDept;
      }
      return dept;
    });
    
    // Recalculate totals
    const totals = calculateTotals(updatedDepartments);
    
    const updatedMealCounts = {
      ...mealCounts,
      departments: updatedDepartments,
      totals
    };
    
    setMealCounts(updatedMealCounts);
    localStorage.setItem("adminMealCounts", JSON.stringify(updatedMealCounts));
    
    toast({
      title: "Count Updated",
      description: `Decreased ${type} count for ${updatedDepartments.find(d => d.id === departmentId).name}`,
      variant: "success"
    });
  };

  const calculateTotals = (departments) => {
    return departments.reduce((acc, dept) => {
      return {
        total: acc.total + dept.total,
        vegetarian: acc.vegetarian + dept.vegetarian,
        nonVegetarian: acc.nonVegetarian + dept.nonVegetarian,
        responded: acc.responded + dept.responded,
        pending: acc.pending + dept.pending
      };
    }, { total: 0, vegetarian: 0, nonVegetarian: 0, responded: 0, pending: 0 });
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
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">Meal Counts Management</h1>
                  <p className="text-gray-500 mt-1">
                    View and adjust meal counts by department before finalizing.
                  </p>
                </div>
                <div>
                  <Button 
                    variant="default"
                    onClick={() => toast({
                      title: "Counts Updated",
                      description: "Employee responses have been refreshed.",
                      variant: "success"
                    })}
                  >
                    Refresh Counts
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <Card className="mb-6">
                <CardContent className="p-6">
                  <div className="mb-6 bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <Restaurant className="h-5 w-5 text-blue-500 mr-2" />
                      <h3 className="text-lg font-medium text-blue-700">Today's Meal Count Summary</h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <p className="text-sm text-gray-500">Total Employees</p>
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
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <p className="text-sm text-gray-500">Pending Responses</p>
                        <p className="text-2xl font-bold text-amber-600">{mealCounts.totals.pending}</p>
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Meal Counts by Department</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Use the + and - buttons to adjust counts as needed.
                  </p>
                  
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-gray-50">
                        <TableRow>
                          <TableHead className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</TableHead>
                          <TableHead className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</TableHead>
                          <TableHead className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <div className="flex items-center">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                              Vegetarian
                            </div>
                          </TableHead>
                          <TableHead className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <div className="flex items-center">
                              <div className="w-2 h-2 bg-red-500 rounded-full mr-1"></div>
                              Non-Vegetarian
                            </div>
                          </TableHead>
                          <TableHead className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pending</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mealCounts.departments.map(dept => (
                          <TableRow key={dept.id} className="border-b border-gray-200">
                            <TableCell className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{dept.name}</TableCell>
                            <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{dept.total}</TableCell>
                            <TableCell className="px-4 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <span className="text-sm text-gray-900 w-8">{dept.vegetarian}</span>
                                <div className="flex space-x-1 ml-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="h-7 w-7 p-0" 
                                    onClick={() => handleDecrement(dept.id, 'vegetarian')}
                                  >
                                    -
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="h-7 w-7 p-0" 
                                    onClick={() => handleIncrement(dept.id, 'vegetarian')}
                                  >
                                    +
                                  </Button>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="px-4 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <span className="text-sm text-gray-900 w-8">{dept.nonVegetarian}</span>
                                <div className="flex space-x-1 ml-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="h-7 w-7 p-0" 
                                    onClick={() => handleDecrement(dept.id, 'nonVegetarian')}
                                  >
                                    -
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="h-7 w-7 p-0" 
                                    onClick={() => handleIncrement(dept.id, 'nonVegetarian')}
                                  >
                                    +
                                  </Button>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-amber-600">{dept.pending}</TableCell>
                          </TableRow>
                        ))}
                        <TableRow className="bg-gray-50">
                          <TableCell className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Total</TableCell>
                          <TableCell className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{mealCounts.totals.total}</TableCell>
                          <TableCell className="px-4 py-4 whitespace-nowrap text-sm font-medium text-green-700">{mealCounts.totals.vegetarian}</TableCell>
                          <TableCell className="px-4 py-4 whitespace-nowrap text-sm font-medium text-red-700">{mealCounts.totals.nonVegetarian}</TableCell>
                          <TableCell className="px-4 py-4 whitespace-nowrap text-sm font-medium text-amber-600">{mealCounts.totals.pending}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                  
                  <div className="mt-6 flex justify-end">
                    <Button 
                      variant="default"
                      onClick={() => {
                        // Set counts as finalized in localStorage
                        const finalizedCounts = {
                          ...mealCounts,
                          isFinalized: true
                        };
                        localStorage.setItem("adminMealCounts", JSON.stringify(finalizedCounts));
                        
                        toast({
                          title: "Ready to Finalize",
                          description: "Please go to the Finalize Counts page to submit to vendor.",
                          variant: "success"
                        });
                      }}
                    >
                      Review & Finalize
                    </Button>
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