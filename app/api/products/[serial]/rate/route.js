import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import rateLimit from "@/lib/rate-limit";

import { log, logError } from "@/lib/logger";

const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500,
});

export async function POST(req, { params }) {
  try {
    const ip = req.headers.get("x-forwarded-for") || req.ip || "127.0.0.1";
    await limiter.check(5, ip); // 5 requests per minute
  } catch {
    return Response.json({ success: false, error: "Rate limit exceeded" }, { status: 429 });
  }

  await dbConnect();
  const { serial } = await params;
  const { rating } = await req.json();

  if (typeof rating !== 'number' || rating < 1 || rating > 5) {
    return Response.json({ success: false, error: "Invalid rating" }, { status: 400 });
  }

  try {
    const product = await Product.findOneAndUpdate(
      { serial },
      [
        {
          $set: {
            rating: {
              $cond: [
                { $eq: [{ $ifNull: ["$numReviews", 0] }, 0] },
                rating,
                {
                  $divide: [
                    { $add: [{ $multiply: [{ $ifNull: ["$rating", 0] }, { $ifNull: ["$numReviews", 0] }] }, rating] },
                    { $add: [{ $ifNull: ["$numReviews", 0] }, 1] }
                  ]
                }
              ]
            },
            numReviews: { $add: [{ $ifNull: ["$numReviews", 0] }, 1] }
          }
        }
      ],
      { new: true }
    );

    if (!product) {
      return Response.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    return Response.json({ 
      success: true,
      message: "Rating submitted", 
      rating: product.rating, 
      numReviews: product.numReviews 
    });
  } catch (error) {
    logError("Rating submission error:", error.message);
    return Response.json({ success: false, error: "Submission failed" }, { status: 500 });
  }
}
