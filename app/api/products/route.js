import dbConnect from "../../../lib/mongodb";
import Product from "../../../models/Product";
import ProductClick from "../../../models/ProductClick";
import Inquiry from "../../../models/Inquiry";
import { cookies } from "next/headers";
import { v2 as cloudinary } from "cloudinary";
import { logActivity } from "../../../lib/activity";
import { verifyToken } from "../../../lib/session";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const dynamic    = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

// Extracts Cloudinary public_id from a hosted URL
function extractPublicId(url) {
  if (!url || !url.includes("cloudinary.com")) return null;
  try {
    const parts       = url.split("/");
    const uploadIndex = parts.indexOf("upload");
    if (uploadIndex === -1) return null;
    let idParts = parts.slice(uploadIndex + 1);
    if (idParts.length > 0 && /^v\d+$/.test(idParts[0])) idParts.shift();
    const full = idParts.join("/");
    return full.substring(0, full.lastIndexOf('.')) || full;
  } catch {
    return null;
  }
}

export async function GET() {
  await dbConnect();
  const products = await Product.find({}).sort({ createdAt: -1 });
  return Response.json(products);
}

export async function POST(req) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_access")?.value;
  const session = token ? await verifyToken(token) : null;
  if (!session || session.role !== 'admin') {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  const body = await req.json();

  // Sanitize: block MongoDB operator injection
  const safeBody = Object.fromEntries(
    Object.entries(body).filter(([key]) => !key.startsWith('$'))
  );

  // Normalize serial
  if (typeof safeBody.serial === 'string') {
    safeBody.serial = safeBody.serial.trim();
  }

  if (!safeBody.serial) {
    return Response.json({ success: false, field: "serial", error: "Serial number is required." }, { status: 400 });
  }

  // Duplicate serial check
  const exists = await Product.findOne({ serial: safeBody.serial });
  if (exists) {
    return Response.json(
      { success: false, field: "serial", error: "A product with this serial already exists." },
      { status: 409 }
    );
  }

  try {
    const newProduct = await Product.create(safeBody);
    const ip = req.headers.get('x-forwarded-for') || req.ip || '127.0.0.1';
    logActivity('PRODUCT_CREATED', newProduct.serial, `Created: ${newProduct.name}`, ip);
    return Response.json({ success: true, message: "Product created", product: newProduct });
  } catch (error) {
    console.error("Product creation error:", error.message);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_access")?.value;
  const session = token ? await verifyToken(token) : null;
  if (!session || session.role !== 'admin') {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  const body = await req.json();

  if (!body || typeof body.serial !== 'string') {
    return Response.json({ success: false, error: "Invalid payload: serial is required" }, { status: 400 });
  }

  const safeBody = Object.fromEntries(
    Object.entries(body).filter(([key]) => !key.startsWith('$'))
  );
  const serial = String(safeBody.serial).trim();

  try {
    const updated = await Product.findOneAndUpdate({ serial }, safeBody, { new: true });
    if (!updated) {
      return Response.json({ success: false, error: "Product not found" }, { status: 404 });
    }
    return Response.json({ success: true, message: "Product updated", product: updated });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_access")?.value;
  const session = token ? await verifyToken(token) : null;
  if (!session || session.role !== 'admin') {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  const { serial } = await req.json();

  if (!serial || typeof serial !== 'string') {
    return Response.json({ success: false, error: "Valid serial is required" }, { status: 400 });
  }

  try {
    const product = await Product.findOne({ serial: String(serial) });
    if (!product) {
      return Response.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    // Parallel cleanup: Cloudinary assets + analytics + inquiries
    const cleanupTasks = [];

    for (const imageUrl of [product.image1, product.image2].filter(Boolean)) {
      const publicId = extractPublicId(imageUrl);
      if (publicId) {
        cleanupTasks.push(
          cloudinary.uploader.destroy(publicId).catch(err =>
            console.error(`Cloudinary cleanup failed for ${publicId}:`, err)
          )
        );
      }
    }

    cleanupTasks.push(
      ProductClick.deleteMany({ productSerial: serial }).catch(err =>
        console.error(`Click history cleanup failed for ${serial}:`, err)
      )
    );

    cleanupTasks.push(
      Inquiry.deleteMany({ productSerial: serial }).catch(err =>
        console.error(`Inquiry cleanup failed for ${serial}:`, err)
      )
    );

    await Promise.all(cleanupTasks);
    await Product.findOneAndDelete({ serial: String(serial) });

    const ip = req.headers.get('x-forwarded-for') || req.ip || '127.0.0.1';
    logActivity('PRODUCT_DELETED', serial, `Deleted product ${serial}`, ip);

    return Response.json({ success: true, message: "Product and all associated data deleted" });
  } catch (error) {
    console.error("Product deletion error:", error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}