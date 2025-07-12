import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["employee", "vendor", "client-admin"], default: "employee" }
});

export default mongoose.model("User", userSchema);
