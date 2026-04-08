import { NextResponse } from "next/server";
import dbConnect from "../../../lib/mongodb";
import ContactSubmission from "../../../models/ContactSubmission";

export async function POST(req) {
  try {
    await dbConnect();
    const { name, phoneNumber, message } = await req.json();

    if (!name || typeof name !== 'string' || name.length > 100) {
      return NextResponse.json({ error: "Invalid name format or length" }, { status: 400 });
    }
    if (!phoneNumber || typeof phoneNumber !== 'string' || phoneNumber.length > 20) {
      return NextResponse.json({ error: "Invalid phone number format" }, { status: 400 });
    }
    if (!message || typeof message !== 'string' || message.length > 5000) {
      return NextResponse.json({ error: "Invalid message format or length" }, { status: 400 });
    }

    const submission = await ContactSubmission.create({
      name,
      phoneNumber,
      message,
    });

    return NextResponse.json({ message: "Submission successful", id: submission._id });
  } catch (error) {
    console.error("Contact Submission Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
