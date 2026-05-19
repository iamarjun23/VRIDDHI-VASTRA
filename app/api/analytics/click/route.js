import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/mongodb";
import ProductClick from "../../../../models/ProductClick";
import rateLimit from "../../../../lib/rate-limit";

import { log, logError } from "@/lib/logger";

const clickLimiter = rateLimit({
  interval: 60 * 1000,
  uniqueTokenPerInterval: 500,
});

export async function POST(req) {
  try {
    const ip = req.headers.get("x-forwarded-for") || req.ip || "127.0.0.1";
    await clickLimiter.check(30, ip);
  } catch {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  try {
    await dbConnect();
    const { productSerial, productName, source } = await req.json();

    if (!productSerial || !productName) {
      return NextResponse.json({ error: "Missing product identifiers" }, { status: 400 });
    }

    const click = new ProductClick({
      productSerial,
      productName,
      source: source || "buy_now_button"
    });

    await click.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    logError("Failed to track product click:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
