import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Sidebar from "@/components/layout/Sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Menu, Edit } from "@/components/ui/icons";
import { weeklyMenu } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Form, FormItem, FormLabel, FormControl } from "@/components/ui/form";

export default function ManageMenu() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingDay, setEditingDay] = useState(null);
  const [editedMenu, setEditedMenu] = useState({});
  const { toast } = useToast();
  
  const handleEditDay = (day) => {
    setEditingDay(day);
    setEditedMenu({
      mainCourse: day.mainCourse,
      sideDishes: day.sideDishes,
      dessert: day.dessert
    });
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedMenu({
      ...editedMenu,
      [name]: value
    });
  };
  
  const handleSave = () => {
    // Here we would make an API call to update the menu
    toast({
      title: "Menu Updated",
      description: `The menu for ${editingDay.day} has been updated successfully.`,
      variant: "success"
    });
    
    setEditingDay(null);
  };
  
  const handleCancel = () => {
    setEditingDay(null);
  };
  
  const handlePublishAll = () => {
    toast({
      title: "All Menus Published",
      description: "All menu items have been published successfully.",
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
              <h1 className="text-2xl font-semibold text-gray-900">Manage Weekly Menu</h1>
              <p className="mt-2 text-sm text-gray-600">
                Create and publish meal plans for the upcoming week
              </p>
            </div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-8">
              <Card>
                <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                  <h2 className="text-lg font-medium text-gray-900">Weekly Menu</h2>
                  <div>
                    <Button 
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
                      onClick={handlePublishAll}
                    >
                      Publish All
                    </Button>
                  </div>
                </div>
                <CardContent className="px-4 py-0 sm:px-6">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-gray-50">
                        <TableRow>
                          <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Day</TableHead>
                          <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Main Course</TableHead>
                          <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Side Dishes</TableHead>
                          <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dessert</TableHead>
                          <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</TableHead>
                          <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody className="bg-white divide-y divide-gray-200">
                        {weeklyMenu.map((day) => (
                          <TableRow key={day.date}>
                            <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {day.day}, {day.date}
                            </TableCell>
                            
                            {editingDay && editingDay.day === day.day ? (
                              <>
                                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  <Input
                                    name="mainCourse"
                                    value={editedMenu.mainCourse}
                                    onChange={handleInputChange}
                                  />
                                </TableCell>
                                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  <Input
                                    name="sideDishes"
                                    value={editedMenu.sideDishes}
                                    onChange={handleInputChange}
                                  />
                                </TableCell>
                                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  <Input
                                    name="dessert"
                                    value={editedMenu.dessert}
                                    onChange={handleInputChange}
                                  />
                                </TableCell>
                                <TableCell className="px-6 py-4 whitespace-nowrap">
                                  <Badge variant="secondary" className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                                    Editing
                                  </Badge>
                                </TableCell>
                                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  <div className="flex space-x-2">
                                    <Button 
                                      variant="success" 
                                      size="sm" 
                                      onClick={handleSave}
                                    >
                                      Save
                                    </Button>
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      onClick={handleCancel}
                                    >
                                      Cancel
                                    </Button>
                                  </div>
                                </TableCell>
                              </>
                            ) : (
                              <>
                                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{day.mainCourse}</TableCell>
                                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{day.sideDishes}</TableCell>
                                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{day.dessert}</TableCell>
                                <TableCell className="px-6 py-4 whitespace-nowrap">
                                  <Badge variant="success" className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                                    Published
                                  </Badge>
                                </TableCell>
                                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="inline-flex items-center"
                                    onClick={() => handleEditDay(day)}
                                  >
                                    <Edit className="h-4 w-4 mr-1" />
                                    Edit
                                  </Button>
                                </TableCell>
                              </>
                            )}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="mt-8">
                <CardContent className="px-4 py-5 sm:p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Menu Guidelines</h2>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600">
                    <li>Menus should be finalized at least 3 days before the start of the week</li>
                    <li>Ensure each meal includes a vegetarian option</li>
                    <li>Provide detailed ingredients list for potential allergens</li>
                    <li>Maintain balanced nutritional content across the week</li>
                    <li>Consider seasonal availability of ingredients</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
