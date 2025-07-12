import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  date: String,
  rating: Number,
  comments: String,
  meal: String
});

export default mongoose.model("Feedback", feedbackSchema);
