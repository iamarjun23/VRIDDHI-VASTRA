import mongoose from "mongoose";

const siteConfigSchema = new mongoose.Schema({
  configId: {
    type: String,
    required: true,
    unique: true,
    default: "main"
  },
  logo: {
    type: String,
    default: ""
  },
  heroImage: {
    type: String,
    required: false,
    default: ""
  },
  featuredCategories: {
    type: [String],
    default: ["KANCHIPURAM LUXURY", "BANARASI SILK", "MYSORE SILK", "BRIDAL COLLECTION"]
  },
  collectionsCategories: {
    type: [String],
    default: ["NEW ARRIVALS", "TRENDING", "HOT OFFERS", "BEST SELLER", "EXHIBITION CATEGORIES", "BRIDAL COLLECTION", "MYSORE SILK", "BANARASI SILK", "KANCHIPURAM LUXURY", "FESTIVE VIBE", "VALUE FOR MONEY", "CEREMONY VIBE"]
  },
  featuredBlocks: {
    type: [{ title: String, image: String, lotusImage: String }],
    default: [
      { title: "KANCHIPURAM LUXURY", image: "", lotusImage: "" },
      { title: "BANARASI SILK", image: "", lotusImage: "" },
      { title: "MYSORE SILK", image: "", lotusImage: "" },
      { title: "BRIDAL COLLECTION", image: "", lotusImage: "" }
    ]
  },
  lookbookBlocks: {
    type: [{ title: String, image: String }],
    default: [
      { title: "BRIDAL COLLECTION", image: "" },
      { title: "CEREMONY VIBE", image: "" },
      { title: "VALUE FOR MONEY", image: "" },
      { title: "FRESH FROM LOOMS", image: "" },
      { title: "FESTIVE VIBE", image: "" }
    ]
  },
  promoBanner: {
    image: { type: String, default: "" },
    heading: { type: String, default: "Unwrap and Unlock Timeless Elegance\\nwith upto 50% Off" },
    subtext: { type: String, default: "Celebrate timeless beauty with handcrafted silk sarees at a price that feels good and looks stunning" }
  },
  whatsappNumber: {
    type: String,
    default: "919000000000"
  },
  footerImage: {
    type: String,
    default: ""
  },
  contactHeroImage: {
    type: String,
    default: ""
  }
}, { timestamps: true });

export default mongoose.models.SiteConfig || mongoose.model("SiteConfig", siteConfigSchema);
