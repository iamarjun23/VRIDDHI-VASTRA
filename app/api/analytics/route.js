import { NextResponse } from "next/server";
import dbConnect from "../../../lib/mongodb";
import ProductClick from "../../../models/ProductClick";
import Inquiry from "../../../models/Inquiry";
import Product from "../../../models/Product";

export const dynamic    = "force-dynamic";
export const fetchCache = "force-no-store";

export async function GET() {
  try {
    await dbConnect();

    const [totalProducts, totalClicks, recentInquiries, topProductsAgg] = await Promise.all([
      Product.countDocuments(),
      ProductClick.countDocuments(),
      Inquiry.find().sort({ createdAt: -1 }).limit(5).lean(),
      ProductClick.aggregate([
        { $group: { _id: "$productSerial", clicks: { $sum: 1 } } },
        { $sort:  { clicks: -1 } },
        { $limit: 5 }
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

    return NextResponse.json({ totalProducts, totalClicks, recentInquiries, trendingProducts });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
