// // import { users, meals, feedback, mealOpts } from "../shared/schema.js";

// // export class MemStorage {
// //   constructor() {
// //     this.users = new Map();
// //     this.meals = new Map();
// //     this.feedback = new Map();
// //     this.mealOpts = new Map();
// //     this.userIdCounter = 1;
// //     this.mealIdCounter = 1;
// //     this.feedbackIdCounter = 1;
// //     this.mealOptIdCounter = 1;
    
// //     // Initialize with mock data
// //     this.initMockData();
// //   }

// //   async getUser(id) {
// //     return this.users.get(id);
// //   }

// //   async getUserByUsername(username) {
// //     return Array.from(this.users.values()).find(
// //       (user) => user.username === username
// //     );
// //   }

// //   async createUser(insertUser) {
// //     const id = this.userIdCounter++;
// //     const user = { ...insertUser, id };
// //     this.users.set(id, user);
// //     return user;
// //   }
  
// //   async getWeeklyMenu() {
// //     // Return all meals sorted by date
// //     return Array.from(this.meals.values())
// //       .sort((a, b) => new Date(a.date) - new Date(b.date));
// //   }
  
// //   async saveMeal(insertMeal) {
// //     const id = this.mealIdCounter++;
// //     const meal = { ...insertMeal, id };
// //     this.meals.set(id, meal);
// //     return meal;
// //   }
  
// //   async updateMeal(id, updateData) {
// //     const meal = this.meals.get(id);
// //     if (!meal) {
// //       throw new Error("Meal not found");
// //     }
    
// //     const updatedMeal = { ...meal, ...updateData };
// //     this.meals.set(id, updatedMeal);
// //     return updatedMeal;
// //   }
  
// //   async saveFeedback(insertFeedback) {
// //     const id = this.feedbackIdCounter++;
// //     const feedback = { ...insertFeedback, id };
// //     this.feedback.set(id, feedback);
// //     return feedback;
// //   }
  
// //   async getAllFeedback() {
// //     return Array.from(this.feedback.values())
// //       .sort((a, b) => new Date(b.date) - new Date(a.date));
// //   }
  
// //   async saveMealOpt(insertMealOpt) {
// //     const id = this.mealOptIdCounter++;
// //     const mealOpt = { ...insertMealOpt, id };
// //     this.mealOpts.set(id, mealOpt);
// //     return mealOpt;
// //   }
  
// //   async getMealCounts() {
// //     // Group meal opts by date and count opt-ins
// //     const counts = {};
    
// //     for (const opt of this.mealOpts.values()) {
// //       if (!counts[opt.date]) {
// //         counts[opt.date] = {
// //           date: opt.date,
// //           optIns: 0,
// //           actualCount: 0,
// //         };
// //       }
      
// //       if (opt.optIn) {
// //         counts[opt.date].optIns++;
        
// //         // For simplicity, we'll assume 97% of opt-ins actually showed up
// //         counts[opt.date].actualCount = Math.floor(counts[opt.date].optIns * 0.97);
// //       }
// //     }
    
// //     // Calculate average ratings for each date
// //     const ratings = {};
// //     for (const fb of this.feedback.values()) {
// //       if (!ratings[fb.date]) {
// //         ratings[fb.date] = {
// //           total: 0,
// //           count: 0
// //         };
// //       }
      
// //       ratings[fb.date].total += fb.rating;
// //       ratings[fb.date].count++;
// //     }
    
// //     // Combine the data
// //     const result = Object.values(counts).map(count => {
// //       const avgRating = ratings[count.date] 
// //         ? (ratings[count.date].total / ratings[count.date].count).toFixed(1) 
// //         : "N/A";
      
// //       return {
// //         ...count,
// //         utilization: `${Math.round((count.actualCount / count.optIns) * 100)}%`,
// //         averageRating: avgRating
// //       };
// //     });
    
// //     return result.sort((a, b) => new Date(b.date) - new Date(a.date));
// //   }
  
// //   initMockData() {
// //     // Create some users
// //     this.createUser({ username: "employee@example.com", password: "password", role: "employee" });
// //     this.createUser({ username: "admin@example.com", password: "password", role: "client-admin" });
// //     this.createUser({ username: "vendor@example.com", password: "password", role: "vendor" });
    
// //     // Create weekly menu
// //     const weeklyMenu = [
// //       {
// //         day: "Monday",
// //         date: "2023-05-08",
// //         mainCourse: "Grilled Chicken with Roasted Vegetables",
// //         sideDishes: "Quinoa Salad, Garlic Bread",
// //         dessert: "Fruit Parfait",
// //         status: "published"
// //       },
// //       {
// //         day: "Tuesday",
// //         date: "2023-05-09",
// //         mainCourse: "Pasta Primavera with Garlic Cream Sauce",
// //         sideDishes: "Caesar Salad, Breadsticks",
// //         dessert: "Tiramisu Cup",
// //         status: "published"
// //       },
// //       {
// //         day: "Wednesday",
// //         date: "2023-05-10",
// //         mainCourse: "Teriyaki Salmon with Steamed Rice",
// //         sideDishes: "Asian Slaw, Miso Soup",
// //         dessert: "Green Tea Mochi",
// //         status: "published"
// //       },
// //       {
// //         day: "Thursday",
// //         date: "2023-05-11",
// //         mainCourse: "Mediterranean Lamb Bowl",
// //         sideDishes: "Greek Salad, Pita Bread",
// //         dessert: "Baklava",
// //         status: "published"
// //       },
// //       {
// //         day: "Friday",
// //         date: "2023-05-12",
// //         mainCourse: "Vegetable Curry with Basmati Rice",
// //         sideDishes: "Cucumber Raita, Naan Bread",
// //         dessert: "Mango Lassi",
// //         status: "published"
// //       }
// //     ];
    
// //     weeklyMenu.forEach(meal => this.saveMeal(meal));
    
// //     // Create some feedback
// //     const feedbackData = [
// //       {
// //         userId: 1,
// //         date: "2023-05-12",
// //         rating: 4,
// //         comments: "The vegetable curry was delicious, but I would appreciate more variety in the side dishes.",
// //         meal: "Vegetable Curry"
// //       },
// //       {
// //         userId: 1,
// //         date: "2023-05-11",
// //         rating: 5,
// //         comments: "The Mediterranean lamb bowl was fantastic! One of the best meals so far.",
// //         meal: "Mediterranean Lamb Bowl"
// //       },
// //       {
// //         userId: 1,
// //         date: "2023-05-10",
// //         rating: 3,
// //         comments: "The salmon was slightly overcooked today. The miso soup was excellent though!",
// //         meal: "Teriyaki Salmon"
// //       },
// //       {
// //         userId: 1,
// //         date: "2023-05-09",
// //         rating: 4,
// //         comments: "The pasta was great, but could use a bit more seasoning. Loved the garlic bread!",
// //         meal: "Pasta Primavera"
// //       },
// //       {
// //         userId: 1,
// //         date: "2023-05-08",
// //         rating: 5,
// //         comments: "Excellent meal! The chicken was perfectly cooked and the quinoa salad was fresh and flavorful.",
// //         meal: "Grilled Chicken"
// //       }
// //     ];
    
// //     feedbackData.forEach(feedback => this.saveFeedback(feedback));
    
// //     // Create some meal opts
// //     const mealOptData = [
// //       { userId: 1, date: "2023-05-15", optIn: true, couponCode: "1234" },
// //       { userId: 2, date: "2023-05-15", optIn: true, couponCode: "5678" },
// //       { userId: 3, date: "2023-05-15", optIn: true, couponCode: "9012" }
// //     ];
    
// //     mealOptData.forEach(opt => this.saveMealOpt(opt));
    
// //     // Add more data for the meal counts to make the stats more realistic
// //     for (let i = 0; i < 139; i++) {
// //       this.saveMealOpt({ 
// //         userId: (i % 50) + 4, 
// //         date: "2023-05-15", 
// //         optIn: true, 
// //         couponCode: `${1000 + i}` 
// //       });
// //     }
    
// //     for (let i = 0; i < 132; i++) {
// //       this.saveMealOpt({ 
// //         userId: (i % 50) + 4, 
// //         date: "2023-05-12", 
// //         optIn: true, 
// //         couponCode: `${2000 + i}` 
// //       });
// //     }
    
// //     for (let i = 0; i < 137; i++) {
// //       this.saveMealOpt({ 
// //         userId: (i % 50) + 4, 
// //         date: "2023-05-11", 
// //         optIn: true, 
// //         couponCode: `${3000 + i}` 
// //       });
// //     }
    
// //     for (let i = 0; i < 134; i++) {
// //       this.saveMealOpt({ 
// //         userId: (i % 50) + 4, 
// //         date: "2023-05-10", 
// //         optIn: true, 
// //         couponCode: `${4000 + i}` 
// //       });
// //     }
    
// //     for (let i = 0; i < 129; i++) {
// //       this.saveMealOpt({ 
// //         userId: (i % 50) + 4, 
// //         date: "2023-05-09", 
// //         optIn: true, 
// //         couponCode: `${5000 + i}` 
// //       });
// //     }
// //   }
// // }

// // export const storage = new storage.createUser()
// // storage.saveMealOpt()
// // storage.getMealCounts();

// import bcrypt from "bcryptjs";
// import User from "./models/User.js";
// import Meal from "./models/Meal.js";
// import MealOpt from "./models/MealOpt.js";
// import Feedback from "./models/Feedback.js";

// export const storage = {
//   // USERS
//   async getUser(id) {
//     return await User.findById(id);
//   },

//   async getUserByUsername(username) {
//     return await User.findOne({ username });
//   },

//   async createUser({ username, password, role }) {
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = new User({ username, password: hashedPassword, role });
//     await user.save();
//     return user;
//   },

//   // MEALS (Weekly Menu)
//   async getWeeklyMenu() {
//     return await Meal.find().sort({ date: 1 });
//   },

//   async saveMeal(mealData) {
//     const meal = new Meal(mealData);
//     await meal.save();
//     return meal;
//   },

//   async updateMeal(id, updateData) {
//     return await Meal.findByIdAndUpdate(id, updateData, { new: true });
//   },

//   // MEAL OPTS
//   async saveMealOpt(mealOptData) {
//     const mealOpt = new MealOpt(mealOptData);
//     await mealOpt.save();
//     return mealOpt;
//   },

//   async getMealCounts() {
//     // Count opt-ins grouped by date
//     const counts = await MealOpt.aggregate([
//       { $match: { optIn: true } },
//       { $group: { _id: "$date", optIns: { $sum: 1 } } },
//       { $sort: { _id: -1 } }
//     ]);

//     // Map to desired format
//     return counts.map(c => ({
//       date: c._id,
//       optIns: c.optIns,
//       actualCount: Math.floor(c.optIns * 0.97), // your original rule
//       utilization: `${Math.round((Math.floor(c.optIns * 0.97) / c.optIns) * 100)}%`,
//       averageRating: "N/A"  // We could compute this if needed below
//     }));
//   },

//   // FEEDBACK
//   async saveFeedback(feedbackData) {
//     const feedback = new Feedback(feedbackData);
//     await feedback.save();
//     return feedback;
//   },

//   async getAllFeedback() {
//     return await Feedback.find().sort({ date: -1 });
//   }
// };
