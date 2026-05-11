import mongoose from "mongoose";

const ProductClickSchema = new mongoose.Schema(
  {
    productSerial: { type: String, required: true },
    productName:   { type: String, required: true },
    source:        { type: String, default: "buy_now_button" },
  },
  { timestamps: true }
);

ProductClickSchema.index({ productSerial: 1 });
ProductClickSchema.index({ createdAt: -1 });

// Collection explicitly pinned to "product_clicks"
export default mongoose.models.ProductClick || mongoose.model("ProductClick", ProductClickSchema, "product_clicks");
