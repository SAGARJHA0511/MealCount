import mongoose from "mongoose";

const mealOptSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  date: String,
  optIn: Boolean,
  couponCode: String
});

export default mongoose.model("MealOpt", mealOptSchema);
