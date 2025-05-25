import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Sidebar from "@/components/layout/Sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Menu, FileDownload } from "@/components/ui/icons";
import { mealCounts } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

export default function MealCounts() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { toast } = useToast();
  
  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Your data export has started and will be available shortly.",
      variant: "success"
    });
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
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
            <Menu className="h-6 w-6" />
          </button>
          <div className="pr-4">
            <h1 className="text-lg font-bold text-primary-600">MealMate</h1>
          </div>
        </div>
        
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <h1 className="text-2xl font-semibold text-gray-900">Meal Counts</h1>
              <p className="mt-2 text-sm text-gray-600">
                Track daily meal counts and utilization rates
              </p>
            </div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-8">
              <Card>
                <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                  <h2 className="text-lg font-medium text-gray-900">Daily Meal Counts</h2>
                  <div>
                    <Button 
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200"
                      onClick={handleExport}
                    >
                      <FileDownload className="h-4 w-4 mr-1" />
                      Export
                    </Button>
                  </div>
                </div>
                <CardContent className="px-4 py-0 sm:px-6">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-gray-50">
                        <TableRow>
                          <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</TableHead>
                          <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Opt-ins</TableHead>
                          <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actual Count</TableHead>
                          <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilization</TableHead>
                          <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Average Rating</TableHead>
                          <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody className="bg-white divide-y divide-gray-200">
                        {mealCounts.map((count) => (
                          <TableRow key={count.date}>
                            <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{count.date}</TableCell>
                            <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{count.optIns}</TableCell>
                            <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{count.actualCount}</TableCell>
                            <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{count.utilization}</TableCell>
                            <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{count.averageRating}</TableCell>
                            <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-primary-600 hover:text-primary-700"
                              >
                                View Details
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
              
              <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardContent className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Average Utilization</h3>
                    <p className="text-3xl font-semibold text-gray-900">97.6%</p>
                    <p className="mt-2 text-sm text-gray-600">
                      Average meal utilization rate for the past 30 days
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Total Meals Served</h3>
                    <p className="text-3xl font-semibold text-gray-900">2,843</p>
                    <p className="mt-2 text-sm text-gray-600">
                      Total meals served in the current month
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Highest Rated Day</h3>
                    <p className="text-3xl font-semibold text-gray-900">Wednesday</p>
                    <p className="mt-2 text-sm text-gray-600">
                      Day with highest average rating (4.5/5)
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
