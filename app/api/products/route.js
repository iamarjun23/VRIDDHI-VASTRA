import dbConnect from "../../../lib/mongodb";
import Product from "../../../models/Product";
import ProductClick from "../../../models/ProductClick";
import Inquiry from "../../../models/Inquiry";
import { revalidatePath } from "next/cache";
import cloudinary from "@/lib/cloudinary";
import { logActivity } from "../../../lib/activity";
import { requireAdmin } from "@/lib/auth";

import { log, logError } from "@/lib/logger";

export const dynamic    = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

function whitelistProductData(data) {
  const allowedKeys = [
    'serial',
    'name',
    'description',
    'price',
    'originalPrice',
    'category',
    'tags',
    'image1',
    'image2',
    'rating',
    'numReviews'
  ];
  const cleaned = {};
  for (const key of allowedKeys) {
    if (data[key] !== undefined) {
      cleaned[key] = data[key];
    }
  }
  return cleaned;
}

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

export async function GET(req) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const page  = searchParams.get("page");
  const limit = searchParams.get("limit");

  if (page || limit) {
    const parsedLimit = Math.min(100, Math.max(1, parseInt(limit || "50", 10)));
    const parsedPage  = Math.max(1, parseInt(page || "1", 10));
    const skip = (parsedPage - 1) * parsedLimit;

    const [total, products] = await Promise.all([
      Product.countDocuments(),
      Product.find({}).sort({ createdAt: -1 }).skip(skip).limit(parsedLimit)
    ]);

    return Response.json({
      products,
      pagination: { total, page: parsedPage, limit: parsedLimit, totalPages: Math.ceil(total / parsedLimit) }
    });
  }

  const products = await Product.find({}).sort({ createdAt: -1 });
  return Response.json(products);
}

export async function POST(req) {
  const session = await requireAdmin();
  if (!session) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  const body = await req.json();

  // Sanitize: block MongoDB operator injection
  const safeBody = Object.fromEntries(
    Object.entries(body).filter(([key]) => !key.startsWith('$'))
  );

  const sanitized = whitelistProductData(safeBody);

  // Normalize serial
  if (typeof sanitized.serial === 'string') {
    sanitized.serial = sanitized.serial.trim();
  }

  if (!sanitized.serial) {
    return Response.json({ success: false, field: "serial", error: "Serial number is required." }, { status: 400 });
  }

  // Duplicate serial check
  const exists = await Product.findOne({ serial: sanitized.serial });
  if (exists) {
    return Response.json(
      { success: false, field: "serial", error: "A product with this serial already exists." },
      { status: 409 }
    );
  }

  try {
    const newProduct = await Product.create(sanitized);
    const ip = req.headers.get('x-forwarded-for') || req.ip || '127.0.0.1';
    logActivity('PRODUCT_CREATED', newProduct.serial, `Created: ${newProduct.name}`, ip);
    revalidatePath('/', 'layout');
    return Response.json({ success: true, message: "Product created", product: newProduct });
  } catch (error) {
    logError("Product creation error:", error.message);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  const session = await requireAdmin();
  if (!session) {
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
  
  const sanitized = whitelistProductData(safeBody);
  const serial = String(sanitized.serial || body.serial).trim();

  try {
    const updated = await Product.findOneAndUpdate({ serial }, sanitized, { new: true });
    if (!updated) {
      return Response.json({ success: false, error: "Product not found" }, { status: 404 });
    }
    revalidatePath('/', 'layout');
    return Response.json({ success: true, message: "Product updated", product: updated });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  const session = await requireAdmin();
  if (!session) {
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

    // Parallel cleanup: Cloudinary assets
    const cleanupTasks = [];
    for (const imageUrl of [product.image1, product.image2].filter(Boolean)) {
      const publicId = extractPublicId(imageUrl);
      if (publicId) {
        cleanupTasks.push(
          cloudinary.uploader.destroy(publicId).catch(err =>
            logError(`Cloudinary cleanup failed for ${publicId}:`, err)
          )
        );
      }
    }
    await Promise.all(cleanupTasks);

    // Attempt transactional delete; fall back to serial deletes if replica set unavailable
    let usedTransaction = false;
    try {
      const mongoose = (await import('mongoose')).default;
      const dbSession = await mongoose.startSession();
      dbSession.startTransaction();
      try {
        await ProductClick.deleteMany({ productSerial: serial }).session(dbSession);
        await Inquiry.deleteMany({ productSerial: serial }).session(dbSession);
        await Product.findOneAndDelete({ serial: String(serial) }).session(dbSession);
        await dbSession.commitTransaction();
        usedTransaction = true;
      } catch (txError) {
        await dbSession.abortTransaction();
        throw txError;
      } finally {
        dbSession.endSession();
      }
    } catch (txError) {
      if (txError.codeName === 'IllegalOperation' || txError.message?.includes('transaction')) {
        await ProductClick.deleteMany({ productSerial: serial });
        await Inquiry.deleteMany({ productSerial: serial });
        await Product.findOneAndDelete({ serial: String(serial) });
      } else {
        throw txError;
      }
    }

    const ip = req.headers.get('x-forwarded-for') || req.ip || '127.0.0.1';
    logActivity('PRODUCT_DELETED', serial, `Deleted product ${serial}`, ip);
    revalidatePath('/', 'layout');

    return Response.json({ success: true, message: "Product and all associated data deleted" });
  } catch (error) {
    logError("Product deletion error:", error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}