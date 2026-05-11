import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/mongodb";
import Product from "../../../../models/Product";

export const dynamic = "force-dynamic";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const serial = (searchParams.get("serial") || "").trim();

  if (!serial) {
    return NextResponse.json({ available: false, error: "Serial is required" }, { status: 400 });
  }

  await dbConnect();
  const exists = await Product.findOne({ serial }).select("serial").lean();
  return NextResponse.json({ available: !exists });
}
