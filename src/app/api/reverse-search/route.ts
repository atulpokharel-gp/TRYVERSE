import { NextRequest, NextResponse } from "next/server";
import { mockProducts } from "@/data/products";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const query: string = body.query ?? body.imageUrl ?? "";

    /**
     * TODO: Integrate a real reverse-image-search API here.
     * Options:
     *   - Google Cloud Vision API (label/object detection + search)
     *   - AWS Rekognition
     *   - Custom ML embedding similarity search (CLIP, FAISS)
     */

    // Mock: return a shuffled subset of products
    const shuffled = [...mockProducts].sort(() => Math.random() - 0.5);
    const results = shuffled.slice(0, 8).map((p) => ({
      ...p,
      similarity: Math.floor(Math.random() * 20 + 80), // 80-100%
      searchQuery: query,
    }));

    return NextResponse.json({ results, query });
  } catch {
    return NextResponse.json(
      { error: "Reverse search failed" },
      { status: 500 }
    );
  }
}
