import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import dbConnect from "../../../lib/mongodb";
import SiteConfig from "../../../models/SiteConfig";

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
    console.error("Failed to fetch site config:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

// PUT to update global site settings
export async function PUT(req) {
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

    const config = await SiteConfig.findOneAndUpdate(
      { configId: "main" },
      { $set: data },
      { new: true, upsert: true }
    );

    if (!config) throw new Error("findOneAndUpdate returned null");

    console.log("Config saved successfully! Final Hero:", config.heroImage);

    // Force revalidate the homepage for all users
    revalidatePath("/", "page");
    revalidatePath("/collections", "page");
    revalidatePath("/(root)", "layout"); 
    revalidatePath("/", "layout"); // Ensure global elements refresh

    return NextResponse.json({ message: "Settings updated successfully", config }, { status: 200 });
  } catch (error) {
    console.error("Failed to update site config:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
