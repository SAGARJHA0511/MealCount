import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/layout/Navbar";
import MobileNav from "@/components/layout/MobileNav";
import { weeklyMenu } from "@/data/mockData";

export default function Feedback() {
  const [feedback, setFeedback] = useState({
    date: "2023-05-08",
    rating: 0,
    comments: ""
  });
  const { toast } = useToast();
  
  const handleDateChange = (e) => {
    setFeedback({
      ...feedback,
      date: e.target.value
    });
  };
  
  const handleRatingChange = (rating) => {
    setFeedback({
      ...feedback,
      rating
    });
  };
  
  const handleCommentsChange = (e) => {
    setFeedback({
      ...feedback,
      comments: e.target.value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (feedback.rating === 0) {
      toast({
        title: "Error",
        description: "Please select a rating before submitting feedback.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Success",
      description: "Your feedback has been submitted. Thank you!",
      variant: "success"
    });
    
    // Reset form
    setFeedback({
      ...feedback,
      rating: 0,
      comments: ""
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20 sm:pb-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Meal Feedback</h1>
        
        <Card>
          <CardContent className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Provide Feedback on Meals</h2>
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="meal-date" className="block text-sm font-medium text-gray-700">Select Date</label>
                <select 
                  id="meal-date" 
                  name="meal-date" 
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                  value={feedback.date}
                  onChange={handleDateChange}
                >
                  {weeklyMenu.map((day) => (
                    <option key={day.date} value={`2023-${day.date.replace(', ', '-')}`}>
                      {day.day}, {day.date}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="rating" className="block text-sm font-medium text-gray-700">Rating</label>
                <div className="mt-1 flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button 
                      key={star}
                      type="button" 
                      className={`${
                        feedback.rating >= star ? 'text-amber-500' : 'text-gray-300'
                      } hover:text-amber-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`}
                      onClick={() => handleRatingChange(star)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label htmlFor="comments" className="block text-sm font-medium text-gray-700">Comments</label>
                <div className="mt-1">
                  <textarea 
                    id="comments" 
                    name="comments" 
                    rows="3" 
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md" 
                    placeholder="Share your thoughts about the meal"
                    value={feedback.comments}
                    onChange={handleCommentsChange}
                  ></textarea>
                </div>
              </div>
              
              <div>
                <Button 
                  type="submit" 
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                >
                  Submit Feedback
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
        
        <Card className="mt-6">
          <CardContent className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Why Your Feedback Matters</h2>
            <p className="text-sm text-gray-600">
              Your feedback helps us improve the meal options and quality. 
              We review all comments and ratings to ensure we're providing the best dining experience possible.
            </p>
          </CardContent>
        </Card>
      </main>
      
      <MobileNav />
    </div>
  );
}
