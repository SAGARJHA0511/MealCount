import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/layout/Navbar";
import MobileNav from "@/components/layout/MobileNav";
import { weeklyMenu } from "@/data/mockData";

export default function WeeklyMenu() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20 sm:pb-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Weekly Menu</h1>
        
        <Card>
          <CardContent className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">This Week's Menu</h2>
            
            <div className="overflow-x-auto hide-scroll -mx-4 sm:-mx-6">
              <div className="inline-block min-w-full py-2 align-middle px-4 sm:px-6">
                <div className="flex space-x-4 pb-2">
                  {weeklyMenu.map((day) => (
                    <div key={day.date} className="flex-shrink-0 w-64 bg-white border rounded-lg overflow-hidden">
                      <div className="bg-primary-50 px-4 py-2 border-b">
                        <h3 className="text-sm font-medium text-primary-900">{day.day}, {day.date}</h3>
                      </div>
                      <div className="p-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-1">Main Course:</h4>
                        <p className="text-sm text-gray-600 mb-3">{day.mainCourse}</p>
                        
                        <h4 className="text-sm font-medium text-gray-900 mb-1">Side Dishes:</h4>
                        <p className="text-sm text-gray-600 mb-3">{day.sideDishes}</p>
                        
                        <h4 className="text-sm font-medium text-gray-900 mb-1">Dessert:</h4>
                        <p className="text-sm text-gray-600">{day.dessert}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-4">
              <p className="text-sm text-gray-500">
                Menu is subject to change based on ingredient availability. 
                If you have dietary restrictions or allergies, please contact the cafeteria staff.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
      
      <MobileNav />
    </div>
  );
}
