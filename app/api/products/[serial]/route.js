import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import { requireAdmin } from "@/lib/auth";

export async function GET(req, { params }) {
  const session = await requireAdmin();
  if (!session) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  const { serial } = await params;
  const product = await Product.findOne({ serial }).lean();
  
  if (!product) {
    return Response.json({ error: "Product not found" }, { status: 404 });
  }
  return Response.json(product);
}
