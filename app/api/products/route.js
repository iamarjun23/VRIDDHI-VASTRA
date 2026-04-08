import dbConnect from "../../../lib/mongodb";
import Product from "../../../models/Product";
import fs from "fs";
import path from "path";

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

// Migration flag
let jsonMigrated = false;

export async function GET() {
  await dbConnect();
  
  let products = await Product.find({}).sort({ createdAt: -1 });

  // Auto-migrate from JSON if db is empty on the first pull
  if (products.length === 0 && !jsonMigrated) {
    try {
      const dataFilePath = path.join(process.cwd(), "app/data/products.json");
      if (fs.existsSync(dataFilePath)) {
         const data = fs.readFileSync(dataFilePath, "utf-8");
         const jsonProducts = JSON.parse(data);
         if(jsonProducts.length > 0) {
             // Create documents
             for(let pData of jsonProducts) {
               await Product.updateOne({ serial: pData.serial }, pData, { upsert: true });
             }
             jsonMigrated = true;
             products = await Product.find({}).sort({ createdAt: -1 });
         }
      }
    } catch(e) {
       console.error("Migration failed", e);
    }
  }

  return Response.json(products);
}

export async function POST(req) {
  await dbConnect();
  const body = await req.json();

  try {
    // Guard rail: Basic sanitization to block MongoDB operators at the top level
    const safeBody = { ...body };
    Object.keys(safeBody).forEach(key => {
      if (key.startsWith('$')) delete safeBody[key];
    });

    const newProduct = await Product.create(safeBody);
    return Response.json({ message: "Product Added", product: newProduct });
  } catch (error) {
    console.error("Product Creation Error:", error);
    return Response.json({ message: "Failed to create", error: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  await dbConnect();
  const body = await req.json();

  try {
    if (!body || typeof body.serial !== 'string') {
      return Response.json({ message: "Invalid payload or missing string serial" }, { status: 400 });
    }

    // Guard rail: basic sanitization
    const safeBody = { ...body };
    Object.keys(safeBody).forEach(key => {
      if (key.startsWith('$')) delete safeBody[key];
    });

    const updated = await Product.findOneAndUpdate(
      { serial: String(safeBody.serial) }, 
      safeBody, 
      { new: true }
    );
    if(updated) {
       return Response.json({ message: "Product Updated", product: updated });
    }
    return Response.json({ message: "Product Not Found" }, { status: 404 });
  } catch(error) {
    return Response.json({ message: "Update failed", error: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  await dbConnect();
  const { serial } = await req.json();
  
  try {
    if (!serial || typeof serial !== 'string') {
       return Response.json({ message: "Valid string serial required" }, { status: 400 });
    }

    const deleted = await Product.findOneAndDelete({ serial: String(serial) });
    if(deleted) {
       return Response.json({ message: "Product Deleted" });
    }
    return Response.json({ message: "Product Not Found" }, { status: 404 });
  } catch(error) {
    return Response.json({ message: "Delete failed", error: error.message }, { status: 500 });
  }
}