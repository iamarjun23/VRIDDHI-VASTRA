import cloudinary from "@/lib/cloudinary";
import { logActivity } from "@/lib/activity";
import { requireAdmin } from "@/lib/auth";
import { fileTypeFromBuffer } from "file-type";

import { log, logError } from "@/lib/logger";

const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export async function POST(req) {
  // Content-Length guard check before reading the body stream (DoS mitigation)
  const contentLength = req.headers.get("content-length");
  if (contentLength && parseInt(contentLength, 10) > MAX_FILE_SIZE_BYTES) {
    return Response.json(
      { error: "File too large. Maximum size is 5 MB." },
      { status: 413 }
    );
  }

  const session = await requireAdmin();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file     = formData.get("file");

    if (!file || typeof file === "string") {
      return Response.json({ error: "No file provided." }, { status: 400 });
    }

    // MIME type validation
    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return Response.json(
        { error: "Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed." },
        { status: 415 }
      );
    }

    // File size validation
    const bytes = await file.arrayBuffer();
    if (bytes.byteLength > MAX_FILE_SIZE_BYTES) {
      return Response.json(
        { error: "File too large. Maximum size is 5 MB." },
        { status: 413 }
      );
    }

    const buffer = Buffer.from(bytes);
    
    // Deep content validation
    const typeInfo = await fileTypeFromBuffer(buffer);
    if (!typeInfo || !ALLOWED_MIME_TYPES.has(typeInfo.mime)) {
      return Response.json(
        { error: "Invalid file content. Only JPEG, PNG, WebP, and GIF are allowed." },
        { status: 415 }
      );
    }

    const ip     = req.headers.get("x-forwarded-for") || req.ip || "127.0.0.1";

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: "products", resource_type: "image" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    logActivity("IMAGE_UPLOADED", result.public_id, `Uploaded ${file.name || "image"}`, ip);

    return Response.json({ url: result.secure_url });
  } catch (error) {
    logError("Upload error:", error.message);
    return Response.json({ error: "Upload failed. Please try again." }, { status: 500 });
  }
}