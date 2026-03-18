import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";

export async function POST(req, { params }) {
  await dbConnect();
  const { serial } = await params;
  const { rating } = await req.json();

  if (typeof rating !== 'number' || rating < 1 || rating > 5) {
    return Response.json({ message: "Invalid rating" }, { status: 400 });
  }

  try {
    const product = await Product.findOne({ serial });
    if (!product) {
      return Response.json({ message: "Product not found" }, { status: 404 });
    }

    // Calculate new average rating
    const currentTotalScore = (product.rating || 0) * (product.numReviews || 0);
    const newNumReviews = (product.numReviews || 0) + 1;
    const newRating = (currentTotalScore + rating) / newNumReviews;

    product.rating = newRating;
    product.numReviews = newNumReviews;
    await product.save();

    return Response.json({ 
      message: "Rating submitted", 
      rating: product.rating, 
      numReviews: product.numReviews 
    });
  } catch (error) {
    console.error("Rating submission error:", error);
    return Response.json({ message: "Submission failed", error: error.message }, { status: 500 });
  }
}
