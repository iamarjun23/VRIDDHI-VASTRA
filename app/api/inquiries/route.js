import { NextResponse } from "next/server";
import dbConnect from "../../../lib/mongodb";
import Inquiry from "../../../models/Inquiry";
import { cookies } from "next/headers";
import { logActivity } from "../../../lib/activity";
import { verifyToken } from "../../../lib/session";

import { log, logError } from "@/lib/logger";

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
    
    // Pagination parameters
    const page  = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(1, parseInt(searchParams.get("limit") || "50", 10));
    const skip  = (page - 1) * limit;

    let query = {};
    if (search) {
      const safeSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query = {
        $or: [
          { name:        { $regex: safeSearch, $options: "i" } },
          { phoneNumber: { $regex: safeSearch, $options: "i" } },
          { message:     { $regex: safeSearch, $options: "i" } }
        ]
      };
    }

    const sortOption = sort === "oldest" ? { createdAt: 1 } : { createdAt: -1 };
    
    const [total, inquiries] = await Promise.all([
      Inquiry.countDocuments(query),
      Inquiry.find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(limit)
        .lean()
    ]);

    return NextResponse.json({
      inquiries,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logError("Failed to fetch inquiries:", error);
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
    logError("Inquiry delete error:", error);
    return NextResponse.json({ error: "Failed to delete inquiry" }, { status: 500 });
  }
}
