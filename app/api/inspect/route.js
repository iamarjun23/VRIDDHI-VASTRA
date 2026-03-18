import { NextResponse } from "next/server";
import dbConnect from "../../../lib/mongodb";
import SiteConfig from "../../../models/SiteConfig";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    await dbConnect();
    const config = await SiteConfig.findOne({ configId: "main" });
    return NextResponse.json({ success: true, config });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message });
  }
}
