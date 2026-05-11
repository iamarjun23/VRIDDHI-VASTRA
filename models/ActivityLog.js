import mongoose from "mongoose";

const ActivityLogSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true,
    enum: [
      "ADMIN_LOGIN",
      "PRODUCT_CREATED",
      "PRODUCT_UPDATED",
      "PRODUCT_DELETED",
      "SETTINGS_UPDATED",
      "INQUIRY_DELETED",
      "IMAGE_UPLOADED",
    ],
  },
  entity:    { type: String, default: "" },  // e.g. product serial, "global"
  detail:    { type: String, default: "" },  // human-readable summary
  ip:        { type: String, default: "" },
  performedAt: { type: Date, default: Date.now },
}, { timestamps: false });

ActivityLogSchema.index({ performedAt: -1 });

// Collection explicitly pinned to "activity_logs"
export default mongoose.models.ActivityLog || mongoose.model("ActivityLog", ActivityLogSchema, "activity_logs");
