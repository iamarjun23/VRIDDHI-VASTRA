import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "../../../../lib/mongodb";
import Product from "../../../../models/Product";
import { verifyToken } from "../../../../lib/session";

export const dynamic = "force-dynamic";

export async function GET(req) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_access")?.value;
  const session = token ? await verifyToken(token) : null;
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const serial = (searchParams.get("serial") || "").trim();

  if (!serial) {
    return NextResponse.json({ available: false, error: "Serial is required" }, { status: 400 });
  }

  await dbConnect();
  const exists = await Product.findOne({ serial }).select("serial").lean();
  return NextResponse.json({ available: !exists });
}
