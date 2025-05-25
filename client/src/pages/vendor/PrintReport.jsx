import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Sidebar from "@/components/layout/Sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileDownload, CancelCircle, Menu as MenuIcon, Restaurant } from "@/components/ui/icons";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function VendorPrintReport() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [reportType, setReportType] = useState("today");
  const [mealCounts, setMealCounts] = useState({
    today: {
      date: new Date().toLocaleDateString(),
      vegetarian: 45,
      nonVegetarian: 87,
      total: 132,
      pending: 8
    },
    tomorrow: {
      date: new Date(Date.now() + 86400000).toLocaleDateString(),
      vegetarian: 38,
      nonVegetarian: 79,
      total: 117,
      pending: 15
    },
    weekly: {
      dates: `${new Date().toLocaleDateString()} - ${new Date(Date.now() + 6 * 86400000).toLocaleDateString()}`,
      vegetarian: 240,
      nonVegetarian: 415,
      total: 655,
      pending: 0
    }
  });
  
  const { toast } = useToast();

  const handlePrint = () => {
    toast({
      title: "Printing Report",
      description: "Preparing to print the meal counts report...",
      variant: "success"
    });
    
    setTimeout(() => {
      window.print();
    }, 500);
  };

  const handleExport = () => {
    toast({
      title: "Export Successful",
      description: "Meal counts report has been exported as CSV.",
      variant: "success"
    });
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
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">Meal Count Reports</h1>
                  <p className="text-gray-500 mt-1">
                    View and print meal counts for efficient meal planning and preparation.
                  </p>
                </div>
                <div className="mt-4 md:mt-0 flex space-x-3">
                  <Button 
                    variant="outline" 
                    onClick={handleExport}
                    className="flex items-center"
                  >
                    <FileDownload className="mr-1.5 h-4 w-4" />
                    Export CSV
                  </Button>
                  <Button 
                    onClick={handlePrint}
                    className="flex items-center"
                  >
                    <svg className="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    Print Report
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <Card className="mb-6">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-6">
                    <div>
                      <label htmlFor="report-type" className="block text-sm font-medium text-gray-700 mb-1">
                        Report Time Period
                      </label>
                      <Select value={reportType} onValueChange={setReportType}>
                        <SelectTrigger id="report-type" className="w-full md:w-48">
                          <SelectValue placeholder="Select report type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="today">Today's Meals</SelectItem>
                          <SelectItem value="tomorrow">Tomorrow's Meals</SelectItem>
                          <SelectItem value="weekly">Weekly Summary</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="mt-4 md:mt-0">
                      <h3 className="text-sm font-medium text-gray-500">
                        Report for: <span className="text-gray-900">{mealCounts[reportType].date || mealCounts[reportType].dates}</span>
                      </h3>
                    </div>
                  </div>
                
                  <div className="print:mt-8">
                    <div className="print:mb-6 print:flex print:justify-between print:items-center hidden">
                      <div>
                        <h1 className="text-xl font-bold">MealMate - Meal Count Report</h1>
                        <p>{reportType === "today" ? "Today's" : reportType === "tomorrow" ? "Tomorrow's" : "Weekly"} Meal Counts</p>
                        <p className="text-sm text-gray-500">{mealCounts[reportType].date || mealCounts[reportType].dates}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Generated: {new Date().toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <div className="mb-6 bg-white rounded-lg border p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Meal Count Summary</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-blue-50 rounded-lg p-4">
                          <p className="text-sm text-blue-500">Total Meals</p>
                          <p className="text-2xl font-bold text-blue-700">{mealCounts[reportType].total}</p>
                        </div>
                        <div className="bg-green-50 rounded-lg p-4">
                          <p className="text-sm text-green-500">Vegetarian</p>
                          <p className="text-2xl font-bold text-green-700">{mealCounts[reportType].vegetarian}</p>
                        </div>
                        <div className="bg-red-50 rounded-lg p-4">
                          <p className="text-sm text-red-500">Non-Vegetarian</p>
                          <p className="text-2xl font-bold text-red-700">{mealCounts[reportType].nonVegetarian}</p>
                        </div>
                        {mealCounts[reportType].pending > 0 && (
                          <div className="bg-yellow-50 rounded-lg p-4">
                            <p className="text-sm text-yellow-500">Pending Responses</p>
                            <p className="text-2xl font-bold text-yellow-700">{mealCounts[reportType].pending}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Detailed Breakdown</h3>
                    
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader className="bg-gray-50">
                          <TableRow>
                            <TableHead className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</TableHead>
                            <TableHead className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vegetarian</TableHead>
                            <TableHead className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Non-Vegetarian</TableHead>
                            <TableHead className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow className="border-b border-gray-200">
                            <TableCell className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Engineering</TableCell>
                            <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">18</TableCell>
                            <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">32</TableCell>
                            <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">50</TableCell>
                          </TableRow>
                          <TableRow className="border-b border-gray-200">
                            <TableCell className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Marketing</TableCell>
                            <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">12</TableCell>
                            <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">15</TableCell>
                            <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">27</TableCell>
                          </TableRow>
                          <TableRow className="border-b border-gray-200">
                            <TableCell className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Sales</TableCell>
                            <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">8</TableCell>
                            <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">25</TableCell>
                            <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">33</TableCell>
                          </TableRow>
                          <TableRow className="border-b border-gray-200">
                            <TableCell className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Finance</TableCell>
                            <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">7</TableCell>
                            <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">15</TableCell>
                            <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">22</TableCell>
                          </TableRow>
                          <TableRow className="bg-gray-50">
                            <TableCell className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Total</TableCell>
                            <TableCell className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{mealCounts[reportType].vegetarian}</TableCell>
                            <TableCell className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{mealCounts[reportType].nonVegetarian}</TableCell>
                            <TableCell className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{mealCounts[reportType].total}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                    
                    <div className="mt-8 print:mt-10">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Special Meal Requests</h3>
                      <Table>
                        <TableHeader className="bg-gray-50">
                          <TableRow>
                            <TableHead className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Special Item</TableHead>
                            <TableHead className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</TableHead>
                            <TableHead className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow className="border-b border-gray-200">
                            <TableCell className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Keto Bowl</TableCell>
                            <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">5</TableCell>
                            <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                              <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
                                Non-Vegetarian
                              </Badge>
                            </TableCell>
                          </TableRow>
                          <TableRow className="border-b border-gray-200">
                            <TableCell className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Vegan Buddha Bowl</TableCell>
                            <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">7</TableCell>
                            <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                                Vegetarian
                              </Badge>
                            </TableCell>
                          </TableRow>
                          <TableRow className="border-b border-gray-200">
                            <TableCell className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Protein Power Plate</TableCell>
                            <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">3</TableCell>
                            <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                              <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
                                Non-Vegetarian
                              </Badge>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
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