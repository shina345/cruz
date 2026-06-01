import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile, unlink } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "garments.json");

interface Garment {
  id: string;
  title: string;
  img: string;
  category: string;
  look: string;
  mt?: string;
  createdAt: string;
}

async function readGarments(): Promise<Garment[]> {
  try {
    const raw = await readFile(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function writeGarments(garments: Garment[]): Promise<void> {
  await writeFile(DATA_FILE, JSON.stringify(garments, null, 2), "utf-8");
}

// DELETE /api/garments/[id]
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const garments = await readGarments();
    const target = garments.find((g) => g.id === id);

    if (!target) {
      return NextResponse.json({ error: "Garment not found." }, { status: 404 });
    }

    // Delete the uploaded image file if it's in /uploads/
    if (target.img?.startsWith("/uploads/")) {
      const filePath = path.join(process.cwd(), "public", target.img);
      if (existsSync(filePath)) {
        try { await unlink(filePath); } catch { /* ignore */ }
      }
    }

    const updated = garments.filter((g) => g.id !== id);
    await writeGarments(updated);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/garments/[id] error:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
