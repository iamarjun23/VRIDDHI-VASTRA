import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    default: null,
  },
  otpExpiry: {
    type: Date,
    default: null,
  }
}, { timestamps: true });

// Collection explicitly pinned to "admins"
export default mongoose.models.Admin || mongoose.model("Admin", adminSchema, "admins");
