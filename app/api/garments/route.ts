import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "garments.json");
const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

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
  const dir = path.dirname(DATA_FILE);
  if (!existsSync(dir)) await mkdir(dir, { recursive: true });
  await writeFile(DATA_FILE, JSON.stringify(garments, null, 2), "utf-8");
}

// GET /api/garments?category=men
export async function GET(request: NextRequest) {
  const category = request.nextUrl.searchParams.get("category");
  const garments = await readGarments();
  const result = category ? garments.filter((g) => g.category === category) : garments;
  return NextResponse.json(result);
}

// POST /api/garments  (multipart: file + title + category + look + mt)
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const file = formData.get("file") as File | null;
    const title = (formData.get("title") as string | null)?.trim();
    const category = (formData.get("category") as string | null)?.trim();
    const look = (formData.get("look") as string | null)?.trim();
    const mt = (formData.get("mt") as string | null)?.trim() || "";

    if (!title || !category) {
      return NextResponse.json({ error: "Title and category are required." }, { status: 400 });
    }

    let imgUrl = formData.get("imgUrl") as string | null;

    // If a file was uploaded, save it
    if (file && file.size > 0) {
      const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
      if (!allowed.includes(file.type)) {
        return NextResponse.json({ error: "Invalid file type." }, { status: 400 });
      }
      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json({ error: "File too large (max 10MB)." }, { status: 400 });
      }

      if (!existsSync(UPLOADS_DIR)) await mkdir(UPLOADS_DIR, { recursive: true });

      const ext = path.extname(file.name).toLowerCase() || ".jpg";
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").replace(/\.[^.]+$/, "");
      const uniqueName = `${safeName}_${Date.now()}${ext}`;
      const buffer = Buffer.from(await file.arrayBuffer());
      await writeFile(path.join(UPLOADS_DIR, uniqueName), buffer);
      imgUrl = `/uploads/${uniqueName}`;
    }

    if (!imgUrl) {
      return NextResponse.json({ error: "An image file or image URL is required." }, { status: 400 });
    }

    const garments = await readGarments();
    const newGarment: Garment = {
      id: `garment-${Date.now()}`,
      title,
      img: imgUrl,
      category,
      look: look || `Look ${garments.filter((g) => g.category === category).length + 1}`,
      mt,
      createdAt: new Date().toISOString(),
    };

    garments.unshift(newGarment); // newest first
    await writeGarments(garments);

    return NextResponse.json(newGarment, { status: 201 });
  } catch (err) {
    console.error("POST /api/garments error:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
