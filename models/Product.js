import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  serial: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  category: { type: String, default: "KANCHIPURAM LUXURY" },
  tags: { type: [String], default: [] },
  image1: { 
    type: String, 
    default: "" 
  },
  image2: { 
    type: String, 
    default: "" 
  },
  rating: {
    type: Number,
    default: 0
  },
  numReviews: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
