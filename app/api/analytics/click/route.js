import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/mongodb";
import ProductClick from "../../../../models/ProductClick";

export async function POST(req) {
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
    console.error("Failed to track product click:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
