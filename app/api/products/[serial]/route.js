import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/session";

export async function GET(req, { params }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_access")?.value;
  const session = token ? await verifyToken(token) : null;
  if (!session || session.role !== 'admin') {
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
