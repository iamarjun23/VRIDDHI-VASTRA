import { NextResponse } from "next/server";
import dbConnect from "../../../lib/mongodb";
import ContactSubmission from "../../../models/ContactSubmission";

export async function POST(req) {
  try {
    await dbConnect();
    const { name, phoneNumber, message } = await req.json();

    if (!name || !phoneNumber || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
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
