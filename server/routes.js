import { Router } from "express";
// import { storage } from "./storage.js";
import { insertUserSchema, insertMealSchema, insertFeedbackSchema } from "../shared/schema.js";
import { generateCouponCode } from "../client/src/lib/utils.js";

export const registerRoutes = async (app) => {
  const router = Router();
  
  // Auth routes
  router.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // In a real app, we would check credentials against the database
      // For this demo, we'll simulate successful login
      
      return res.json({
        success: true,
        user: { email, name: email.split('@')[0] }
      });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });

  router.post("/api/auth/register", async (req, res) => {
    try {
      const data = insertUserSchema.parse(req.body);
      const user = await storage.createUser(data);
      
      return res.json({
        success: true,
        user: { id: user.id, username: user.username }
      });
    } catch (error) {
      console.error("Registration error:", error);
      return res.status(400).json({ message: error.message });
    }
  });

  router.get("/api/auth/logout", (req, res) => {
    return res.json({ success: true });
  });

  // Employee routes
  router.post("/api/employee/meal-opt", async (req, res) => {
    try {
      const { userId, optIn, date } = req.body;
      
      // Check if it's after cutoff time (8 PM)
      const now = new Date();
      if (now.getHours() >= 20) {
        return res.status(400).json({ 
          message: "Cutoff time has passed. You can no longer change your meal preference for tomorrow."
        });
      }
      
      // Save meal preference
      const mealOpt = await storage.saveMealOpt({
        userId,
        optIn,
        date,
        couponCode: optIn ? generateCouponCode() : null
      });
      
      return res.json({
        success: true,
        mealOpt
      });
    } catch (error) {
      console.error("Meal opt error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });

  router.post("/api/employee/feedback", async (req, res) => {
    try {
      const data = insertFeedbackSchema.parse(req.body);
      const feedback = await storage.saveFeedback(data);
      
      return res.json({
        success: true,
        feedback
      });
    } catch (error) {
      console.error("Feedback submission error:", error);
      return res.status(400).json({ message: error.message });
    }
  });

  router.get("/api/employee/menu", async (req, res) => {
    try {
      const weeklyMenu = await storage.getWeeklyMenu();
      return res.json(weeklyMenu);
    } catch (error) {
      console.error("Get menu error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });

  // Client Admin routes
  router.get("/api/client-admin/meal-counts", async (req, res) => {
    try {
      const mealCounts = await storage.getMealCounts();
      return res.json(mealCounts);
    } catch (error) {
      console.error("Get meal counts error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });

  router.get("/api/client-admin/feedback", async (req, res) => {
    try {
      const feedback = await storage.getAllFeedback();
      return res.json(feedback);
    } catch (error) {
      console.error("Get feedback error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });

  // Vendor routes
  router.post("/api/vendor/menu", async (req, res) => {
    try {
      const data = insertMealSchema.parse(req.body);
      const meal = await storage.saveMeal(data);
      
      return res.json({
        success: true,
        meal
      });
    } catch (error) {
      console.error("Save meal error:", error);
      return res.status(400).json({ message: error.message });
    }
  });

  router.put("/api/vendor/menu/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const updatedMeal = await storage.updateMeal(parseInt(id), data);
      
      return res.json({
        success: true,
        meal: updatedMeal
      });
    } catch (error) {
      console.error("Update meal error:", error);
      return res.status(400).json({ message: error.message });
    }
  });

  router.get("/api/vendor/feedback", async (req, res) => {
    try {
      const feedback = await storage.getAllFeedback();
      return res.json(feedback);
    } catch (error) {
      console.error("Get feedback error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });

  // Apply all routes with /api prefix
  app.use(router);

  return app;
};
