import { pgTable, text, serial, integer, boolean, date, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("employee"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  role: true,
});

// Meals (Weekly Menu) table
export const meals = pgTable("meals", {
  id: serial("id").primaryKey(),
  day: text("day").notNull(),
  date: text("date").notNull(),
  mainCourse: text("main_course").notNull(),
  sideDishes: text("side_dishes").notNull(),
  dessert: text("dessert").notNull(),
  status: text("status").notNull().default("draft"),
});

export const insertMealSchema = createInsertSchema(meals).pick({
  day: true,
  date: true,
  mainCourse: true,
  sideDishes: true,
  dessert: true,
  status: true,
});

// Feedback table
export const feedback = pgTable("feedback", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  date: text("date").notNull(),
  rating: integer("rating").notNull(),
  comments: text("comments"),
  meal: text("meal"),
});

export const insertFeedbackSchema = createInsertSchema(feedback).pick({
  userId: true,
  date: true,
  rating: true,
  comments: true,
  meal: true,
});

// Meal Options (opt-in/opt-out) table
export const mealOpts = pgTable("meal_opts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  date: text("date").notNull(),
  optIn: boolean("opt_in").notNull(),
  couponCode: text("coupon_code"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertMealOptSchema = createInsertSchema(mealOpts).pick({
  userId: true,
  date: true,
  optIn: true,
  couponCode: true,
});

// // Export types
// export type User = typeof users.$inferSelect;
// export type InsertUser = z.infer<typeof insertUserSchema>;

// export type Meal = typeof meals.$inferSelect;
// export type InsertMeal = z.infer<typeof insertMealSchema>;

// export type Feedback = typeof feedback.$inferSelect;
// export type InsertFeedback = z.infer<typeof insertFeedbackSchema>;

// export type MealOpt = typeof mealOpts.$inferSelect;
// export type InsertMealOpt = z.infer<typeof insertMealOptSchema>;
