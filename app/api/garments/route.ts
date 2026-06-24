import { NextResponse } from "next/server";

// The garment list is now managed entirely in the browser localStorage.
// This endpoint simply returns an empty array so the hook can bootstrap.
// All add/delete operations happen on the client side.
export async function GET() {
  return NextResponse.json([]);
}
