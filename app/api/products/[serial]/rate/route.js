import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import rateLimit from "@/lib/rate-limit";

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
    const product = await Product.findOne({ serial });
    if (!product) {
      return Response.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    // Calculate new average rating
    const currentTotalScore = (product.rating || 0) * (product.numReviews || 0);
    const newNumReviews = (product.numReviews || 0) + 1;
    const newRating = (currentTotalScore + rating) / newNumReviews;

    product.rating = newRating;
    product.numReviews = newNumReviews;
    await product.save();

    return Response.json({ 
      success: true,
      message: "Rating submitted", 
      rating: product.rating, 
      numReviews: product.numReviews 
    });
  } catch (error) {
    console.error("Rating submission error:", error.message);
    return Response.json({ success: false, error: "Submission failed" }, { status: 500 });
  }
}
