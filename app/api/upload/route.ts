import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type (allow both images and videos)
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");
    if (!isImage && !isVideo) {
      return NextResponse.json({ error: "Invalid file type. Only images and videos are allowed." }, { status: 400 });
    }

    // Limit file size to 50MB (since videos can be larger)
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large. Max 50MB." }, { status: 400 });
    }

    // Ensure the upload directory exists
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadsDir, { recursive: true });

    // Generate a clean and unique filename
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const uniqueFilename = `${Date.now()}-${cleanFileName}`;
    const filePath = path.join(uploadsDir, uniqueFilename);

    // Read the file as buffer and write to local disk
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await fs.writeFile(filePath, buffer);

    // Return the relative web URL
    const fileUrl = `/uploads/${uniqueFilename}`;
    return NextResponse.json({ url: fileUrl }, { status: 200 });
  } catch (error) {
    console.error("Local upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const fileUrl = body?.url;

    if (!fileUrl || typeof fileUrl !== "string") {
      return NextResponse.json({ error: "No URL provided" }, { status: 400 });
    }

    // Extract filename from URL (e.g. /uploads/171234-image.png or uploads/171234-image.png)
    const filename = fileUrl.replace(/^\/?uploads\//, "");

    // Path traversal protection
    if (filename.includes("..") || filename.includes("/") || filename.includes("\\")) {
      return NextResponse.json({ error: "Invalid path" }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), "public", "uploads", filename);

    try {
      await fs.access(filePath);
      await fs.unlink(filePath);
      return NextResponse.json({ success: true });
    } catch {
      // File not found or already deleted - still return success to keep UI aligned
      return NextResponse.json({ success: true, message: "File already deleted or not found" });
    }
  } catch (error) {
    console.error("Local delete error:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}

