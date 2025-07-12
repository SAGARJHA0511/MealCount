import mongoose from "mongoose";

const mealSchema = new mongoose.Schema({
  day: String,
  date: String,
  mainCourse: String,
  sideDishes: String,
  dessert: String,
  status: { type: String, default: "draft" }
});

export default mongoose.model("Meal", mealSchema);
