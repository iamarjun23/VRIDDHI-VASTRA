import { NextResponse } from "next/server";
import dbConnect from "../../../lib/mongodb";
import Inquiry from "../../../models/Inquiry";
import rateLimit from "../../../lib/rate-limit";

const limiter = rateLimit({
  interval: 60 * 1000,
  uniqueTokenPerInterval: 500,
});

export async function POST(req) {
  try {
    const ip = req.headers.get("x-forwarded-for") || req.ip || "127.0.0.1";
    await limiter.check(5, ip);
  } catch {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  try {
    await dbConnect();
    const { name, phoneNumber, message, productName, productSerial } = await req.json();

    if (!name || typeof name !== 'string' || name.length > 100) {
      return NextResponse.json({ error: "Invalid name" }, { status: 400 });
    }
    if (!phoneNumber || typeof phoneNumber !== 'string' || phoneNumber.length > 20) {
      return NextResponse.json({ error: "Invalid phone number" }, { status: 400 });
    }
    if (!message || typeof message !== 'string' || message.length > 5000) {
      return NextResponse.json({ error: "Invalid message" }, { status: 400 });
    }

    const inquiry = await Inquiry.create({
      name,
      phoneNumber,
      message,
      productName:   productName  || "",
      productSerial: productSerial || "",
    });

    return NextResponse.json({ success: true, id: inquiry._id });
  } catch (error) {
    console.error("Contact submission error:", error.message);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
