import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/layout/Navbar";
import MobileNav from "@/components/layout/MobileNav";
import { CheckCircle, CancelCircle, AccessTime } from "@/components/ui/icons";
import { generateCouponCode, getTimeRemaining, isCutoffTime } from "@/lib/utils";
import { weeklyMenu } from "@/data/mockData";

export default function EmployeeDashboard() {
  const [mealStatus, setMealStatus] = useState("pending"); // pending, opted-in, opted-out
  const [couponCode, setCouponCode] = useState("");
  const [timeRemaining, setTimeRemaining] = useState(getTimeRemaining());
  const [cutoffPassed, setCutoffPassed] = useState(isCutoffTime());
  const { toast } = useToast();

  // Update time remaining every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(getTimeRemaining());
      setCutoffPassed(isCutoffTime());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);

  const handleOptIn = () => {
    if (cutoffPassed) {
      toast({
        title: "Error",
        description: "The cutoff time has passed. You can't opt in for tomorrow's meal.",
        variant: "destructive"
      });
      return;
    }
    
    const code = generateCouponCode();
    setCouponCode(code);
    setMealStatus("opted-in");
    
    toast({
      title: "Success",
      description: "You've opted in for tomorrow's meal.",
      variant: "success"
    });
  };

  const handleOptOut = () => {
    if (cutoffPassed) {
      toast({
        title: "Error",
        description: "The cutoff time has passed. You can't opt out for tomorrow's meal.",
        variant: "destructive"
      });
      return;
    }
    
    setMealStatus("opted-out");
    
    toast({
      title: "Confirmed",
      description: "You've opted out of tomorrow's meal.",
      variant: "success"
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20 sm:pb-6">
        <Card className="mb-6">
          <CardContent className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Today's Meal Status</h2>
            
            {cutoffPassed && mealStatus === "pending" ? (
              <div className="rounded-md bg-yellow-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AccessTime className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">Cutoff time passed</h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>The 8:00 PM cutoff time has passed. You can't modify your meal preference for tomorrow.</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : mealStatus === "pending" ? (
              <div className="space-y-4">
                <p className="text-sm text-gray-500">Please submit your meal preference before 8:00 PM</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Time remaining:</span>
                  <span className="text-sm font-medium text-amber-600">{timeRemaining}</span>
                </div>
                
                <div className="mt-5 space-y-3">
                  <Button 
                    className="w-full bg-secondary-600 hover:bg-secondary-700 text-white flex items-center justify-center"
                    onClick={handleOptIn}
                  >
                    <CheckCircle className="mr-2 h-5 w-5" />
                    I'll have a meal tomorrow
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className="w-full border-gray-300 text-gray-700 bg-white hover:bg-gray-50 flex items-center justify-center"
                    onClick={handleOptOut}
                  >
                    <CancelCircle className="mr-2 h-5 w-5" />
                    I won't have a meal tomorrow
                  </Button>
                </div>
              </div>
            ) : mealStatus === "opted-in" ? (
              <div className="space-y-4">
                <div className="rounded-md bg-green-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <CheckCircle className="h-5 w-5 text-green-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800">Meal confirmed for tomorrow</h3>
                      <div className="mt-2 text-sm text-green-700">
                        <p>Your meal has been confirmed. Please use the coupon code below to claim your meal.</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500 mb-2">Your coupon code:</p>
                  <p className="text-2xl font-bold tracking-widest text-primary-600 bg-primary-50 py-3 rounded-lg">{couponCode}</p>
                  <p className="text-xs text-gray-500 mt-2">Valid for tomorrow only</p>
                </div>
              </div>
            ) : (
              <div className="rounded-md bg-blue-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <CancelCircle className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">Meal opt-out confirmed</h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>You have opted out of tomorrow's meal. You can change your mind before the 8:00 PM cutoff.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="mb-6">
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
          </CardContent>
        </Card>
        
        <FeedbackSection />
      </main>
      
      <MobileNav />
    </div>
  );
}

function FeedbackSection() {
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
    <Card>
      <CardContent className="px-4 py-5 sm:p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Meal Feedback</h2>
        
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
              <option value="2023-05-08">Monday, May 8</option>
              <option value="2023-05-09">Tuesday, May 9</option>
              <option value="2023-05-10">Wednesday, May 10</option>
              <option value="2023-05-11">Thursday, May 11</option>
              <option value="2023-05-12">Friday, May 12</option>
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
  );
}
