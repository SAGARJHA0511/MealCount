import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Sidebar from "@/components/layout/Sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Menu, Edit, Star, Restaurant, CancelCircle, CheckCircle } from "@/components/ui/icons";
import { weeklyMenu, recentFeedback } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function VendorDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [menuEditorOpen, setMenuEditorOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [menuType, setMenuType] = useState("non-veg"); // "veg" or "non-veg"
  const [weeklyMenus, setWeeklyMenus] = useState(() => {
    // Initialize with both veg and non-veg menus
    const savedMenus = localStorage.getItem("weeklyMenus");
    if (savedMenus) {
      return JSON.parse(savedMenus);
    }
    
    // Initialize with duplicate menus but mark one as vegetarian
    return {
      veg: weeklyMenu.map(day => ({
        ...day,
        mainCourse: `Vegetarian ${day.mainCourse.replace("Chicken", "Tofu").replace("Beef", "Mushroom").replace("Fish", "Eggplant")}`,
        isVegetarian: true
      })),
      "non-veg": weeklyMenu
    };
  });
  
  const { user } = useAuth();
  const { toast } = useToast();

  const handleOpenMenuEditor = (type = "non-veg") => {
    setMenuType(type);
    setMenuEditorOpen(true);
  };

  const handleDaySelect = (day, type = "non-veg") => {
    setSelectedDay({...day, menuType: type});
    setMenuType(type);
  };

  const handleCloseMenuEditor = () => {
    setMenuEditorOpen(false);
    setSelectedDay(null);
    
    // Save menus to localStorage
    localStorage.setItem("weeklyMenus", JSON.stringify(weeklyMenus));
    
    toast({
      title: "Menu Updated",
      description: `Your ${menuType === "veg" ? "vegetarian" : "non-vegetarian"} menu has been updated successfully.`,
      variant: "success"
    });
  };
  
  const updateMenuDay = (day, type, updatedValues) => {
    const updatedMenus = {
      ...weeklyMenus,
      [type]: weeklyMenus[type].map(d => 
        d.day === day.day ? {...d, ...updatedValues} : d
      )
    };
    setWeeklyMenus(updatedMenus);
    localStorage.setItem("weeklyMenus", JSON.stringify(updatedMenus));
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
            <Menu className="h-6 w-6" />
          </button>
          <div className="pr-4">
            <h1 className="text-lg font-bold text-primary-600">MealMate</h1>
          </div>
        </div>
        
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <h1 className="text-2xl font-semibold text-gray-900">Vendor Dashboard</h1>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {/* Stats overview */}
              <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <StatsCard 
                  title="Today's Orders"
                  value="138"
                  link="/vendor/orders"
                  linkText="View details"
                />
                
                <StatsCard 
                  title="Tomorrow's Orders"
                  value="118"
                  link="/vendor/orders"
                  linkText="View details"
                />
                
                <StatsCard 
                  title="Average Rating (Last 7 Days)"
                  value="4.3"
                  link="/vendor/feedback"
                  linkText="View all feedback"
                />
              </div>
              
              {/* Weekly menu management - Non-Vegetarian */}
              <div className="mt-8">
                <Card>
                  <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                    <div className="flex items-center">
                      <Restaurant className="h-5 w-5 text-red-500 mr-2" />
                      <h2 className="text-lg font-medium text-gray-900">Non-Vegetarian Weekly Menu</h2>
                    </div>
                    <div>
                      <Button 
                        className="inline-flex items-center"
                        variant="default"
                        onClick={() => handleOpenMenuEditor("non-veg")}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit Non-Veg Menu
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
                            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody className="bg-white divide-y divide-gray-200">
                          {weeklyMenus["non-veg"].map((day) => (
                            <TableRow key={`nonveg-${day.date}`}>
                              <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{day.day}</TableCell>
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
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleDaySelect(day, "non-veg")}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Weekly menu management - Vegetarian */}
              <div className="mt-8">
                <Card>
                  <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                    <div className="flex items-center">
                      <Restaurant className="h-5 w-5 text-green-500 mr-2" />
                      <h2 className="text-lg font-medium text-gray-900">Vegetarian Weekly Menu</h2>
                    </div>
                    <div>
                      <Button 
                        className="inline-flex items-center"
                        variant="default"
                        onClick={() => handleOpenMenuEditor("veg")}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit Veg Menu
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
                            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody className="bg-white divide-y divide-gray-200">
                          {weeklyMenus["veg"].map((day) => (
                            <TableRow key={`veg-${day.date}`}>
                              <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{day.day}</TableCell>
                              <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{day.mainCourse}</TableCell>
                              <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{day.sideDishes}</TableCell>
                              <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{day.dessert}</TableCell>
                              <TableCell className="px-6 py-4 whitespace-nowrap">
                                <Badge variant="success" className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                  Published
                                </Badge>
                              </TableCell>
                              <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleDaySelect(day, "veg")}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Feedback summary */}
              <div className="mt-8">
                <Card>
                  <div className="px-4 py-5 sm:px-6 flex items-center">
                    <Star className="h-5 w-5 text-amber-500 mr-2" filled />
                    <h2 className="text-lg font-medium text-gray-900">Recent Feedback</h2>
                  </div>
                  <CardContent className="px-4 py-0 sm:px-6">
                    <div className="space-y-4">
                      {recentFeedback.map((feedback) => (
                        <div key={feedback.id} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-start">
                            <div className="flex-shrink-0">
                              <Star className="h-5 w-5 text-amber-500" filled />
                            </div>
                            <div className="ml-3 flex-1">
                              <p className="text-sm font-medium text-gray-900">
                                <span>{feedback.rating}</span> / 5 - <span className="text-gray-500">{feedback.date} ({feedback.meal})</span>
                              </p>
                              <p className="mt-1 text-sm text-gray-600">{feedback.comment}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Menu Editor Dialog */}
      <Dialog open={menuEditorOpen} onOpenChange={setMenuEditorOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              Edit {menuType === "veg" ? "Vegetarian" : "Non-Vegetarian"} Weekly Menu
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              <div className="flex items-center mb-2 -mt-2 space-x-2">
                <span className={`w-3 h-3 rounded-full ${menuType === "veg" ? "bg-green-500" : "bg-red-500"}`}></span>
                <span className="text-sm font-medium">
                  {menuType === "veg" ? "Vegetarian Menu" : "Non-Vegetarian Menu"}
                </span>
              </div>
              
              <div>
                <Label htmlFor="menu-day">Day</Label>
                <Select defaultValue="Monday">
                  <SelectTrigger id="menu-day">
                    <SelectValue placeholder="Select day" />
                  </SelectTrigger>
                  <SelectContent>
                    {weeklyMenus[menuType].map(day => (
                      <SelectItem key={day.day} value={day.day}>{day.day}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="main-course">Main Course</Label>
                <Input 
                  id="main-course" 
                  placeholder={menuType === "veg" ? "Vegetarian Lasagna" : "Grilled Chicken Breast"}
                  defaultValue={menuType === "veg" ? "Vegetarian Pasta" : "Grilled Chicken Breast"} 
                />
              </div>
              
              <div>
                <Label htmlFor="sides">Side Dishes</Label>
                <Input id="sides" defaultValue="Roasted Vegetables, Brown Rice" />
              </div>
              
              <div>
                <Label htmlFor="dessert">Dessert</Label>
                <Input id="dessert" defaultValue="Fresh Fruit Cup" />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Describe the meal..."
                  defaultValue={menuType === "veg" 
                    ? "A nutritious vegetarian meal with plant-based protein and fresh vegetables." 
                    : "A healthy meal featuring lean protein and nutritious sides."
                  }
                />
              </div>
              
              {menuType === "non-veg" && (
                <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                  <p className="text-sm text-gray-600">
                    Remember to update your vegetarian menu separately with plant-based alternatives.
                  </p>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setMenuEditorOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleCloseMenuEditor}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Specific Day Dialog */}
      <Dialog open={!!selectedDay} onOpenChange={() => setSelectedDay(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Menu for {selectedDay?.day}</DialogTitle>
          </DialogHeader>
          {selectedDay && (
            <div className="py-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-main-course">Main Course</Label>
                  <Input id="edit-main-course" defaultValue={selectedDay.mainCourse} />
                </div>
                
                <div>
                  <Label htmlFor="edit-sides">Side Dishes</Label>
                  <Input id="edit-sides" defaultValue={selectedDay.sideDishes} />
                </div>
                
                <div>
                  <Label htmlFor="edit-dessert">Dessert</Label>
                  <Input id="edit-dessert" defaultValue={selectedDay.dessert} />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setSelectedDay(null)}>
              Cancel
            </Button>
            <Button type="button" onClick={() => {
              setSelectedDay(null);
              toast({
                title: "Menu Updated",
                description: "Your changes have been saved successfully.",
                variant: "success"
              });
            }}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StatsCard({ title, value, link, linkText }) {
  return (
    <Card>
      <div className="px-4 py-5 sm:p-6">
        <dl>
          <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
          <dd className="mt-1 text-3xl font-semibold text-gray-900">{value}</dd>
        </dl>
      </div>
      <div className="bg-gray-50 px-4 py-4 sm:px-6">
        <div className="text-sm">
          <a href={link} className="font-medium text-primary-600 hover:text-primary-500">
            {linkText}<span className="sr-only"> for {title.toLowerCase()}</span>
          </a>
        </div>
      </div>
    </Card>
  );
}
