import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import dbConnect from "../../../lib/mongodb";
import SiteConfig from "../../../models/SiteConfig";
import { cookies } from "next/headers";
import { logActivity } from "../../../lib/activity";
import { verifyToken } from "../../../lib/session";
import { log, logError } from "@/lib/logger";

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

// GET global site settings
export async function GET() {
  await dbConnect();
  try {
    let config = await SiteConfig.findOne({ configId: "main" });
    
    // Create default if it doesn't exist
    if (!config) {
      config = await SiteConfig.create({ configId: "main" });
    }

    return NextResponse.json(config);
  } catch (error) {
    logError("Failed to fetch site config:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

// PUT to update global site settings
export async function PUT(req) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_access")?.value;
  const session = token ? await verifyToken(token) : null;
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  try {
    const data = await req.json();

    // Strip _id from subdocuments to prevent Mongoose cast errors or silent failures during $set
    if (data.featuredBlocks && Array.isArray(data.featuredBlocks)) {
      data.featuredBlocks = data.featuredBlocks.map(block => {
        const { _id, ...rest } = block;
        return rest;
      });
    }
    
    if (data.lookbookBlocks && Array.isArray(data.lookbookBlocks)) {
      data.lookbookBlocks = data.lookbookBlocks.map(block => {
        const { _id, ...rest } = block;
        return rest;
      });
    }

    const ALLOWED_KEYS = [
      'logo', 'heroImage', 'featuredCategories', 'collectionsCategories', 
      'featuredBlocks', 'lookbookBlocks', 'promoBanner', 
      'whatsappNumber', 'footerImage', 'contactHeroImage'
    ];

    const safeData = {};
    for (const key of ALLOWED_KEYS) {
      if (key in data) {
        safeData[key] = data[key];
      }
    }

    const config = await SiteConfig.findOneAndUpdate(
      { configId: "main" },
      { $set: safeData },
      { new: true, upsert: true }
    );

    if (!config) throw new Error("findOneAndUpdate returned null");

    // Force revalidate the homepage for all users
    revalidatePath("/", "page");
    revalidatePath("/collections", "page");
    revalidatePath("/", "layout");

    const ip = req.headers.get('x-forwarded-for') || req.ip || '127.0.0.1';
    logActivity('SETTINGS_UPDATED', 'global', 'Site configuration updated', ip);

    return NextResponse.json({ success: true, message: "Settings updated successfully", config }, { status: 200 });
  } catch (error) {
    logError("Failed to update site config:", error.message);
    return NextResponse.json({ success: false, error: "Failed to update settings" }, { status: 500 });
  }
}
