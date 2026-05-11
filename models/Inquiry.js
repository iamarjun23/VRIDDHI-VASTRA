import mongoose from "mongoose";

const InquirySchema = new mongoose.Schema(
  {
    name:          { type: String, required: true },
    phoneNumber:   { type: String, required: true },
    message:       { type: String, required: true },
    productName:   { type: String, default: "" },
    productSerial: { type: String, default: "" },
  },
  { timestamps: true }
);

InquirySchema.index({ createdAt: -1 });

// Collection explicitly pinned to "inquiries"
// Model registered as "Inquiry" (replaces old "ContactSubmission")
export default mongoose.models.Inquiry || mongoose.model("Inquiry", InquirySchema, "inquiries");
