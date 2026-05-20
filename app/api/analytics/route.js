import { NextResponse } from "next/server";
import dbConnect from "../../../lib/mongodb";
import ProductClick from "../../../models/ProductClick";
import Inquiry from "../../../models/Inquiry";
import Product from "../../../models/Product";
import { requireAdmin } from "@/lib/auth";

import { log, logError } from "@/lib/logger";

export const dynamic    = "force-dynamic";
export const fetchCache = "force-no-store";

export async function GET(req) {
  try {
    const session = await requireAdmin();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Pagination parameters
    const { searchParams } = new URL(req.url);
    const page  = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(1, parseInt(searchParams.get("limit") || "50", 10));
    const skip  = (page - 1) * limit;

    const [totalProducts, totalClicks, recentInquiries, topProductsAgg] = await Promise.all([
      Product.countDocuments(),
      ProductClick.countDocuments(),
      Inquiry.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      ProductClick.aggregate([
        { $group: { _id: "$productSerial", clicks: { $sum: 1 } } },
        { $sort:  { clicks: -1 } },
        { $skip:  skip },
        { $limit: limit }
      ])
    ]);

    let trendingProducts = [];

    if (topProductsAgg.length > 0) {
      const serials  = topProductsAgg.map(p => p._id);
      const products = await Product.find({ serial: { $in: serials } }).lean();

      trendingProducts = topProductsAgg
        .map(agg => {
          const product = products.find(p => p.serial === agg._id);
          if (!product) return null;
          return {
            serial: product.serial,
            name:   product.name,
            image:  product.image1 || "",
            clicks: agg.clicks,
          };
        })
        .filter(Boolean);
    }

    return NextResponse.json({
      totalProducts,
      totalClicks,
      recentInquiries,
      trendingProducts,
      pagination: {
        page,
        limit
      }
    });
  } catch (error) {
    logError("Analytics error:", error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
