import { NextResponse } from "next/server";
import dbConnect from "../../../lib/mongodb";
import Inquiry from "../../../models/Inquiry";
import { cookies } from "next/headers";
import { logActivity } from "../../../lib/activity";
import { verifyToken } from "../../../lib/session";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_access")?.value;
    const session = token ? await verifyToken(token) : null;
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const sort   = searchParams.get("sort") || "newest";

    let query = {};
    if (search) {
      query = {
        $or: [
          { name:        { $regex: search, $options: "i" } },
          { phoneNumber: { $regex: search, $options: "i" } },
          { message:     { $regex: search, $options: "i" } }
        ]
      };
    }

    const sortOption = sort === "oldest" ? { createdAt: 1 } : { createdAt: -1 };
    const inquiries  = await Inquiry.find(query).sort(sortOption).lean();
    return NextResponse.json({ inquiries });
  } catch (error) {
    console.error("Failed to fetch inquiries:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_access")?.value;
    const session = token ? await verifyToken(token) : null;
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id      = searchParams.get("id");
    const bulkIds = searchParams.get("bulkIds");

    if (bulkIds) {
      const idsArray = bulkIds.split(",");
      await Inquiry.deleteMany({ _id: { $in: idsArray } });
      const ip = req.headers.get('x-forwarded-for') || req.ip || '127.0.0.1';
      logActivity('INQUIRY_DELETED', 'bulk', `Bulk deleted ${idsArray.length} inquiries`, ip);
      return NextResponse.json({ success: true, message: "Bulk delete successful" });
    }

    if (id) {
      await Inquiry.findByIdAndDelete(id);
      const ip = req.headers.get('x-forwarded-for') || req.ip || '127.0.0.1';
      logActivity('INQUIRY_DELETED', id, 'Deleted single inquiry', ip);
      return NextResponse.json({ success: true, message: "Inquiry deleted" });
    }

    return NextResponse.json({ error: "No ID provided" }, { status: 400 });
  } catch (error) {
    console.error("Inquiry delete error:", error);
    return NextResponse.json({ error: "Failed to delete inquiry" }, { status: 500 });
  }
}
