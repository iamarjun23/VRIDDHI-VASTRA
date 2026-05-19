import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";

import { log, logError } from "@/lib/logger";

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const { items } = body || {};

    if (!Array.isArray(items)) {
      return NextResponse.json({ error: "Invalid items format" }, { status: 400 });
    }

    let priceMismatch = false;
    const validatedItems = [];
    let grandTotal = 0;

    // Fetch corresponding products from DB
    const serials = items.map(item => String(item.serial));
    const products = await Product.find({ serial: { $in: serials } }).lean();

    for (const clientItem of items) {
      const dbProduct = products.find(p => p.serial === String(clientItem.serial));
      if (!dbProduct) {
        // Product no longer exists in catalog
        priceMismatch = true;
        continue;
      }

      const correctPrice = dbProduct.price || 0;
      const quantity = Math.max(1, parseInt(clientItem.quantity, 10) || 1);

      if (Number(clientItem.price) !== correctPrice) {
        priceMismatch = true;
      }

      validatedItems.push({
        serial: dbProduct.serial,
        name: dbProduct.name,
        price: correctPrice,
        originalPrice: dbProduct.originalPrice,
        quantity: quantity,
        image1: dbProduct.image1
      });

      grandTotal += correctPrice * quantity;
    }

    return NextResponse.json({
      success: true,
      priceMismatch,
      items: validatedItems,
      grandTotal
    });
  } catch (error) {
    logError("Checkout validation error:", error.message);
    return NextResponse.json({ error: "Validation failed" }, { status: 500 });
  }
}
