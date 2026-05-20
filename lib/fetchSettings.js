import dbConnect from "./mongodb";
import SiteConfig from "../models/SiteConfig";
import { sanitizeMongoose } from "./utils";

const DEFAULT_CONFIG = {
  heroImage: "",
  footerImage: "",
  collectionsCategories: [],
  featuredCategories: ["KANCHIPURAM LUXURY", "BANARASI SILK", "MYSORE SILK", "BRIDAL COLLECTION"],
  featuredBlocks: [],
  lookbookBlocks: [],
  promoBanner: {},
  logo: "",
  whatsappNumber: "",
  contactHeroImage: "",
};

export async function getSiteConfig() {
  await dbConnect();
  const config = await SiteConfig.findOne({ configId: "main" }).lean();
  return sanitizeMongoose(config || DEFAULT_CONFIG);
}
