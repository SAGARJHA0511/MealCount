import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Sidebar from "@/components/layout/Sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Menu, Edit, Star } from "@/components/ui/icons";
import { weeklyMenu, recentFeedback } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

export default function VendorDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleOpenMenuEditor = () => {
    toast({
      title: "Menu Editor",
      description: "The menu editor would open here in a real application.",
      variant: "default"
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
              
              {/* Weekly menu management */}
              <div className="mt-8">
                <Card>
                  <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                    <h2 className="text-lg font-medium text-gray-900">Weekly Menu</h2>
                    <div>
                      <Button 
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
                        onClick={handleOpenMenuEditor}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit Menu
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
                          </TableRow>
                        </TableHeader>
                        <TableBody className="bg-white divide-y divide-gray-200">
                          {weeklyMenu.map((day) => (
                            <TableRow key={day.date}>
                              <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{day.day}</TableCell>
                              <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{day.mainCourse}</TableCell>
                              <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{day.sideDishes}</TableCell>
                              <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{day.dessert}</TableCell>
                              <TableCell className="px-6 py-4 whitespace-nowrap">
                                <Badge variant="success" className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                                  Published
                                </Badge>
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
                  <div className="px-4 py-5 sm:px-6">
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
